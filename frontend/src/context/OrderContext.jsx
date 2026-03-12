import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import axios from '../api/axios'; // Or wherever axios is located

export const OrderContext = createContext();

// Local storage and reducer removed as we are now using the backend API.

export function OrderProvider({ children }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get('/orders');
            // Assuming response.data is the array of orders
            const formattedOrders = response.data.map(o => ({
                id: o.id,
                storeName: o.store_name,
                customer: `Customer ${o.customer_id}`, // Needs actual customer name from relation later if needed
                address: o.delivery_address,
                items: o.items.map(i => ({ name: i.item_name, qty: i.quantity, image: i.image, price: i.price, variations: i.variations })),
                subtotal: parseFloat(o.subtotal),
                deliveryFee: parseFloat(o.delivery_fee),
                discount: parseFloat(o.discount),
                total: parseFloat(o.total),
                status: o.status,
                time: new Date(o.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                note: o.special_instructions,
                paymentMethod: o.payment_method,
                contactNumber: o.contact_number
            }));
            setOrders(formattedOrders);
        } catch (error) {
            console.error('Failed to fetch orders', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const placeOrder = useCallback(async (orderData) => {
        try {
            const response = await axios.post('/orders', orderData);
            await fetchOrders(); // Re-fetch to get the new order with ID
            return response.data;
        } catch (error) {
            console.error('Failed to place order', error);
            throw error;
        }
    }, [fetchOrders]);

    const cancelOrder = useCallback((id) => {
        // Future enhancement: Call an API endpoint to cancel the order
        // display({ type: 'CANCEL_ORDER', payload: id });
    }, []);

    const activeOrders = useMemo(() => orders.filter(o => !['Delivered', 'Cancelled'].includes(o.status)), [orders]);
    const completedOrders = useMemo(() => orders.filter(o => o.status === 'Delivered'), [orders]);
    const cancelledOrders = useMemo(() => orders.filter(o => o.status === 'Cancelled'), [orders]);

    const value = useMemo(() => ({
        orders, activeOrders, completedOrders, cancelledOrders, placeOrder, cancelOrder, loading, fetchOrders
    }), [orders, activeOrders, completedOrders, cancelledOrders, placeOrder, cancelOrder, loading, fetchOrders]);

    return (
        <OrderContext.Provider value={value}>
            {children}
        </OrderContext.Provider>
    );
}

export function useOrders() {
    return useContext(OrderContext);
}
