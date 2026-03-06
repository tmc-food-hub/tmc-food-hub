import { createContext, useContext, useReducer, useCallback, useMemo } from 'react';

export const OrderContext = createContext();

const STORAGE_KEY = 'tmcOrders';

function loadOrders() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch { return []; }
}

function persist(orders) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

const orderReducer = (state, action) => {
    let next;
    switch (action.type) {
        case 'PLACE_ORDER':
            next = [action.payload, ...state];
            persist(next);
            return next;
        case 'UPDATE_STATUS':
            next = state.map(o => o.id === action.payload.id ? { ...o, status: action.payload.status } : o);
            persist(next);
            return next;
        case 'CANCEL_ORDER':
            next = state.map(o => o.id === action.payload ? { ...o, status: 'Cancelled' } : o);
            persist(next);
            return next;
        default:
            return state;
    }
};

export function OrderProvider({ children }) {
    const [orders, dispatch] = useReducer(orderReducer, null, loadOrders);

    const placeOrder = useCallback((orderData) => {
        const order = {
            id: `TMC-${Date.now().toString().slice(-5)}`,
            ...orderData,
            status: 'Order Placed',
            placedAt: new Date().toISOString(),
            timeline: [
                { label: 'Order Placed', time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }), description: 'Waiting for restaurant confirmation', state: 'completed' },
                { label: 'Order Confirmed', time: '', description: 'Restaurant is preparing your food', state: 'pending' },
                { label: 'Being Prepared', time: '', description: 'Your meal is being cooked', state: 'pending' },
                { label: 'Picked Up', time: '', description: 'Your rider is on the way', state: 'pending' },
                { label: 'Delivered', time: '', description: 'Order delivered', state: 'pending' },
            ],
            rider: {
                name: 'Ricardo Gomez',
                vehicle: 'Honda PCX',
                plate: `NY-${Math.floor(1000 + Math.random() * 9000)}`,
                rating: 4.8,
            },
            estimatedArrival: Math.floor(15 + Math.random() * 20),
        };
        dispatch({ type: 'PLACE_ORDER', payload: order });
        return order;
    }, []);

    const cancelOrder = useCallback((id) => {
        dispatch({ type: 'CANCEL_ORDER', payload: id });
    }, []);

    const activeOrders = useMemo(() => orders.filter(o => !['Delivered', 'Cancelled'].includes(o.status)), [orders]);
    const completedOrders = useMemo(() => orders.filter(o => o.status === 'Delivered'), [orders]);
    const cancelledOrders = useMemo(() => orders.filter(o => o.status === 'Cancelled'), [orders]);

    const value = useMemo(() => ({
        orders, activeOrders, completedOrders, cancelledOrders, placeOrder, cancelOrder
    }), [orders, activeOrders, completedOrders, cancelledOrders, placeOrder, cancelOrder]);

    return (
        <OrderContext.Provider value={value}>
            {children}
        </OrderContext.Provider>
    );
}

export function useOrders() {
    return useContext(OrderContext);
}
