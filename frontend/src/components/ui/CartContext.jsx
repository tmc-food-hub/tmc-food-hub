import { createContext, useReducer, useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { resolveMediaUrl } from '../../utils/media';
import api from '../../api/axios';

export const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      // Create a unique compound ID based on the base ID, selected variation, and add-ons
      const varId = action.payload.variation ? action.payload.variation.id : 'default';
      const addOnsId = action.payload.addOns && action.payload.addOns.length
        ? action.payload.addOns.map(a => a.id).sort().join('-')
        : 'none';

      const cartItemId = `${action.payload.id}_${varId}_${addOnsId}`;

      const existing = state.find(item => item.cartItemId === cartItemId);
      if (existing) {
        return state.map(item =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
            : item
        );
      }
      return [...state, { ...action.payload, cartItemId, quantity: action.payload.quantity || 1 }];
    }
    case 'REMOVE_ITEM':
      return state.filter(item => item.cartItemId !== action.payload);
    case 'INCREMENT':
      return state.map(item =>
        item.cartItemId === action.payload
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    case 'DECREMENT':
      return state.map(item =>
        item.cartItemId === action.payload
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      );
    case 'CLEAR_CART':
      return [];
    case 'REPLACE_CART':
      return action.payload;
    default:
      return state;
  }
};

const LEGACY_CART_KEY = 'tmc_cart';

const buildCartItemId = (item) => {
  const varId = item.variation ? item.variation.id ?? item.variation.name ?? 'default' : 'default';
  const addOnsId = item.addOns && item.addOns.length
    ? item.addOns.map(a => a.id ?? a.name).sort().join('-')
    : 'none';

  return `${item.id}_${varId}_${addOnsId}`;
};

const normalizeCartItems = (items = []) => {
  if (!Array.isArray(items)) return [];

  return items
    .filter(item => item && item.id && item.restaurantId)
    .map(item => ({
      ...item,
      image: resolveMediaUrl(item.image),
      quantity: Math.max(1, Number(item.quantity) || 1),
      cartItemId: item.cartItemId || buildCartItemId(item),
    }));
};

const loadLocalCart = (storageKey) => {
  try {
    const localData = localStorage.getItem(storageKey);
    if (!localData) return [];

    const parsed = JSON.parse(localData);
    const hasOldImages = parsed.some(item => item.image && (item.image.includes('.webp') || item.image.includes('fries.png') || item.image.includes('burger.png')));

    if (hasOldImages) {
      localStorage.removeItem(storageKey);
      return [];
    }

    return normalizeCartItems(parsed);
  } catch (e) {
    return [];
  }
};

export function CartProvider({ children }) {
  const [cartItems, dispatch] = useReducer(cartReducer, []);
  const { showNotification } = useNotification();
  const { isAuthenticated, setShowLoginPrompt, user } = useAuth();
  const [showRestaurantMismatch, setShowRestaurantMismatch] = useState(false);
  const [pendingItem, setPendingItem] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const syncTimeoutRef = useRef(null);
  const userStorageKey = useMemo(() => user?.id ? `tmc_cart_${user.id}` : null, [user?.id]);

  useEffect(() => {
    let isActive = true;

    async function hydrateCart() {
      if (!isAuthenticated || !user?.id) {
        dispatch({ type: 'REPLACE_CART', payload: [] });
        setIsHydrated(true);
        return;
      }

      setIsHydrated(false);

      try {
        const response = await api.get('/cart');
        let nextItems = normalizeCartItems(response.data?.items || []);

        if (nextItems.length === 0 && userStorageKey) {
          nextItems = loadLocalCart(userStorageKey);

          if (nextItems.length === 0) {
            nextItems = loadLocalCart(LEGACY_CART_KEY);
            if (nextItems.length > 0) {
              localStorage.setItem(userStorageKey, JSON.stringify(nextItems));
              localStorage.removeItem(LEGACY_CART_KEY);
            }
          }
        }

        if (isActive) {
          dispatch({ type: 'REPLACE_CART', payload: nextItems });
        }
      } catch (error) {
        if (isActive) {
          const fallbackItems = userStorageKey ? loadLocalCart(userStorageKey) : [];
          dispatch({ type: 'REPLACE_CART', payload: fallbackItems });
        }
      } finally {
        if (isActive) {
          setIsHydrated(true);
        }
      }
    }

    hydrateCart();

    return () => {
      isActive = false;
    };
  }, [isAuthenticated, user?.id, userStorageKey]);

  useEffect(() => {
    if (!isAuthenticated || !user?.id || !userStorageKey || !isHydrated) return;

    localStorage.setItem(userStorageKey, JSON.stringify(cartItems));

    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    syncTimeoutRef.current = setTimeout(async () => {
      try {
        if (cartItems.length === 0) {
          await api.delete('/cart');
        } else {
          await api.put('/cart', { items: cartItems });
        }
      } catch (error) {
        console.error('Failed to sync cart', error);
      }
    }, 250);

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [cartItems, isAuthenticated, isHydrated, user?.id, userStorageKey]);

  const addToCart = useCallback((item) => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    // Enforce single restaurant rule
    if (cartItems.length > 0) {
        const currentRestId = cartItems[0].restaurantId;
        if (Number(currentRestId) !== Number(item.restaurantId)) {
            setPendingItem(item);
            setShowRestaurantMismatch(true);
            return;
        }
    }

    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: item.id,
        title: item.title,
        image: resolveMediaUrl(item.image),
        price: item.price,
        originalPrice: item.originalPrice,
        storeName: item.storeName,
        restaurantId: item.restaurantId,  // FK to restaurant_owners.id
        variation: item.variation,
        addOns: item.addOns,
        quantity: item.quantity
      }
    });
    showNotification(`${item.title} added to cart!`, 'success');
  }, [showNotification, isAuthenticated, cartItems]);

  const handleClearAndReplace = () => {
      clearCart();
      if (pendingItem) {
          dispatch({
              type: 'ADD_ITEM',
              payload: { ...pendingItem }
          });
          showNotification(`${pendingItem.title} added to cart!`, 'success');
      }
      setShowRestaurantMismatch(false);
      setPendingItem(null);
  };

  const removeFromCart = useCallback((id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  }, []);

  const increment = useCallback((id) => {
    dispatch({ type: 'INCREMENT', payload: id });
  }, []);

  const decrement = useCallback((id) => {
    dispatch({ type: 'DECREMENT', payload: id });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const reorder = useCallback((items, restaurantName, restaurantId = null) => {
    clearCart();
    items.forEach(item => {
      dispatch({
        type: 'ADD_ITEM',
        payload: {
          id: item.id || item.productId,
          title: item.name || item.title,
          image: resolveMediaUrl(item.image),
          price: item.price,
          originalPrice: item.originalPrice || item.price,
          storeName: restaurantName,
          restaurantId: restaurantId,  // FK to restaurant_owners.id
          variation: item.variation || null,
          addOns: item.addOns || [],
          quantity: item.quantity || 1
        }
      });
    });
    showNotification(`Added ${items.length} items from previous order to cart!`, 'success');
  }, [clearCart, showNotification]);

  const cartCount = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems]);
  const cartSubtotal = useMemo(() => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0), [cartItems]);

  const value = useMemo(() => ({
    cartItems,
    cartCount,
    cartSubtotal,
    addToCart,
    removeFromCart,
    increment,
    decrement,
    clearCart,
    reorder,
    setShowLoginPrompt,
    setShowRestaurantMismatch
  }), [cartItems, cartCount, cartSubtotal, addToCart, removeFromCart, increment, decrement, clearCart, reorder]);

  return (
    <CartContext.Provider value={value}>
      {children}

      {/* Restaurant Mismatch Modal */}
      {showRestaurantMismatch && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1060, backdropFilter: 'blur(4px)' }} tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document" style={{ maxWidth: '400px' }}>
            <div className="modal-content text-center p-4" style={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
              <div style={{ width: '64px', height: '64px', backgroundColor: '#FEF3C7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', color: '#D97706' }}>
                <X size={32} />
              </div>
              <h4 className="fw-bold mb-2">Start a new cart?</h4>
              <p style={{ color: '#6B7280', fontSize: '0.95rem', marginBottom: '1.75rem' }}>
                Your cart contains items from another restaurant. Start a new cart with items from <strong>{pendingItem?.storeName}</strong>?
              </p>
              <div className="d-flex flex-column gap-2">
                <button
                  className="btn w-100 fw-bold"
                  onClick={handleClearAndReplace}
                  style={{ backgroundColor: '#991B1B', color: 'white', padding: '0.8rem', borderRadius: '12px' }}
                >
                  Clear Cart and Add
                </button>
                <button
                  className="btn w-100 fw-bold"
                  onClick={() => setShowRestaurantMismatch(false)}
                  style={{ backgroundColor: 'transparent', color: '#111827', padding: '0.8rem', borderRadius: '12px', border: '1px solid #D1D5DB' }}
                >
                  Keep Existing Items
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}
