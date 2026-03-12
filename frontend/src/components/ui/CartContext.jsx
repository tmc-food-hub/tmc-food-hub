import { createContext, useReducer, useCallback, useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, X } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';

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
    default:
      return state;
  }
};

const initCart = () => {
  try {
    const localData = localStorage.getItem('tmc_cart');
    if (!localData) return [];
    const parsed = JSON.parse(localData);

    // Invalidate cart if it contains old deprecated image paths that have been removed
    const hasOldImages = parsed.some(item => item.image && (item.image.includes('.webp') || item.image.includes('fries.png') || item.image.includes('burger.png')));
    if (hasOldImages) {
      localStorage.removeItem('tmc_cart');
      return [];
    }

    return parsed;
  } catch (e) {
    return [];
  }
};

export function CartProvider({ children }) {
  const [cartItems, dispatch] = useReducer(cartReducer, [], initCart);

  useEffect(() => {
    localStorage.setItem('tmc_cart', JSON.stringify(cartItems));
  }, [cartItems]);
  const { showNotification } = useNotification();
  const { isAuthenticated } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const navigate = useNavigate();

  const addToCart = useCallback((item) => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: item.id,
        title: item.title,
        image: item.image,
        price: item.price,
        originalPrice: item.originalPrice,
        storeName: item.storeName,
        variation: item.variation,
        addOns: item.addOns,
        quantity: item.quantity
      }
    });
    showNotification(`${item.title} added to cart!`, 'success');
  }, [showNotification, isAuthenticated]);

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

  const reorder = useCallback((items, restaurantName) => {
    clearCart();
    items.forEach(item => {
      dispatch({
        type: 'ADD_ITEM',
        payload: {
          id: item.id || item.productId,
          title: item.name || item.title,
          image: item.image,
          price: item.price,
          originalPrice: item.originalPrice || item.price,
          storeName: restaurantName,
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
    reorder
  }), [cartItems, cartCount, cartSubtotal, addToCart, removeFromCart, increment, decrement, clearCart, reorder]);

  return (
    <CartContext.Provider value={value}>
      {children}

      {/* Login Required Modal (Modern Design) */}
      {showLoginPrompt && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1060, backdropFilter: 'blur(4px)' }} tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document" style={{ maxWidth: '400px' }}>
            <div className="modal-content text-center p-4" style={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>

              <button
                type="button"
                onClick={() => setShowLoginPrompt(false)}
                style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: '#6B7280', padding: '8px', cursor: 'pointer', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <X size={20} />
              </button>

              <div style={{ width: '64px', height: '64px', backgroundColor: '#FEE2E2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', color: '#DC2626' }}>
                <UserPlus size={32} />
              </div>

              <h4 className="fw-bold mb-2" style={{ color: '#111827', fontSize: '1.25rem' }}>Login to Order</h4>
              <p style={{ color: '#6B7280', fontSize: '0.95rem', marginBottom: '1.75rem', padding: '0 10px' }}>
                Create an account or log in to add this delicious meal to your cart and track your orders.
              </p>

              <div className="d-flex flex-column gap-2">
                <button
                  className="btn w-100 fw-bold d-flex align-items-center justify-content-center border-0"
                  onClick={() => { setShowLoginPrompt(false); navigate('/login'); }}
                  style={{ backgroundColor: '#991B1B', color: 'white', padding: '0.8rem', borderRadius: '12px', fontSize: '1rem', transition: 'transform 0.1s' }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  Log In
                </button>
                <button
                  className="btn w-100 fw-bold d-flex align-items-center justify-content-center"
                  onClick={() => { setShowLoginPrompt(false); navigate('/signup'); }}
                  style={{ backgroundColor: 'transparent', color: '#111827', padding: '0.8rem', borderRadius: '12px', fontSize: '1rem', border: '1px solid #D1D5DB', transition: 'background-color 0.2s' }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Create Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}
