import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import axios from '../api/axios'; // Or wherever axios is located

export const OrderContext = createContext();

// Local storage and reducer removed as we are now using the backend API.

export function OrderProvider({ children }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = useCallback(async (isInitial = false) => {
        try {
            if (isInitial) setLoading(true);
            const response = await axios.get('/orders');
            const formattedOrders = response.data.map(o => {
                // Map legacy/old statuses to new simplified flow
                let currentStatus = o.status;
                if (currentStatus === 'Being Prepared') currentStatus = 'Order Confirmed';
                if (currentStatus === 'Picked Up') currentStatus = 'Out for Delivery';
                
                const createdAt = new Date(o.created_at);
                const updatedAt = new Date(o.updated_at);
                
                const statusList = [
                    'Order Placed',
                    'Order Confirmed',
                    'Out for Delivery',
                    'Delivered'
                ];
                
                const currentStatusIndex = statusList.indexOf(currentStatus);
                const timeline = statusList.map((label, index) => {
                    let state = 'pending';
                    if (currentStatusIndex === 0) {
                        if (index === 0) state = 'active';
                    } else if (currentStatusIndex < 3) {
                        if (index <= currentStatusIndex) state = 'completed';
                        else if (index === currentStatusIndex + 1) state = 'active';
                    } else {
                        // All steps completed when Delivered
                        state = 'completed';
                    }
                    
                    const getStatusDesc = (label, state) => {
                        if (state === 'pending') return 'Pending';
                        if (state === 'completed') {
                            if (label === 'Delivered') return 'Enjoy your meal!';
                            return 'Done';
                        }
                        // Active state descriptions (This is the NEXT step)
                        const activeDescs = {
                            'Order Confirmed': 'Waiting for restaurant confirmation',
                            'Out for Delivery': 'Kitchen is preparing your food',
                            'Delivered': 'Your rider is on the way'
                        };
                        return activeDescs[label] || 'In progress';
                    };

                    // Use updated_at for active/last step to show real-time progress
                    const stepTime = (state === 'active' || (state === 'completed' && index === currentStatusIndex)) ? updatedAt : createdAt;

                    return {
                        label,
                        time: (state === 'completed' || state === 'active') ? stepTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '',
                        description: getStatusDesc(label, state),
                        state
                    };
                });

                const getOrderPrefix = (name) => {
                    if (!name) return 'OD';
                    const initials = name.split(' ')
                        .map(word => word[0])
                        .join('')
                        .toUpperCase();
                    return initials.length === 1 ? (name.substring(0, 2).toUpperCase()) : initials;
                };

                const orderNumber = `${getOrderPrefix(o.store_name)}-${String(o.id).padStart(5, '0')}`;

                return {
                    id: o.id,
                    orderNumber: orderNumber, // New formatted ID
                    restaurant: o.store_name,
                    customer: o.customer ? `${o.customer.first_name} ${o.customer.last_name}` : `Customer ${o.customer_id}`,
                    customerName: o.customer ? `${o.customer.first_name} ${o.customer.last_name}` : `Customer ${o.customer_id}`,
                    customerPhone: o.customer?.phone || o.contact_number || 'N/A',
                    customerAddress: o.customer?.address || o.delivery_address || 'N/A',
                    address: o.delivery_address, // Keep original for reference
                    deliveryAddress: o.delivery_address, // Keep original for reference
                    items: o.items.map(i => ({ 
                        id: i.id,
                        name: i.item_name, 
                        quantity: i.quantity, 
                        qty: i.quantity, // Alias for compatibility
                        image: i.image, 
                        price: parseFloat(i.price), 
                        variations: i.variations 
                    })),
                    subtotal: parseFloat(o.subtotal),
                    deliveryFee: parseFloat(o.delivery_fee),
                    discount: parseFloat(o.discount),
                    total: parseFloat(o.total),
                    status: currentStatus,
                    placedAt: o.created_at, // ISO string for MyOrdersPage
                    time: createdAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                    note: o.special_instructions || o.customer?.delivery_instructions || '',
                    paymentMethod: o.payment_method,
                    contactNumber: o.contact_number || (o.customer ? o.customer.phone : 'N/A'),
                    timeline: timeline
                };
            });
            setOrders(formattedOrders);
        } catch (error) {
            console.error('Failed to fetch orders', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders(true);
        // Polling for realtime updates every 5 seconds
        const interval = setInterval(() => fetchOrders(false), 5000);
        return () => clearInterval(interval);
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

    const updateStatus = useCallback(async (id, status) => {
        try {
            await axios.put(`/orders/${id}/status`, { status });
            await fetchOrders();
        } catch (error) {
            console.error('Failed to update status', error);
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
        orders, activeOrders, completedOrders, cancelledOrders, placeOrder, cancelOrder, updateStatus, loading, fetchOrders
    }), [orders, activeOrders, completedOrders, cancelledOrders, placeOrder, cancelOrder, updateStatus, loading, fetchOrders]);

    return (
        <OrderContext.Provider value={value}>
            {children}
        </OrderContext.Provider>
    );
}

export function useOrders() {
    return useContext(OrderContext);
}
