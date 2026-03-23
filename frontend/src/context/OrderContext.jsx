import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import api from '../api/axios';

export const OrderContext = createContext();

export function OrderProvider({ children }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Determine endpoint based on URL
    function getOrdersEndpoint() {
        const isOwnerPortal = window.location.pathname.startsWith('/owner-dashboard') || window.location.pathname.startsWith('/owner');
        return isOwnerPortal ? '/owner/orders' : '/orders';
    }

    function getUpdateStatusEndpoint(id) {
        const isOwnerPortal = window.location.pathname.startsWith('/owner-dashboard') || window.location.pathname.startsWith('/owner');
        return isOwnerPortal ? `/owner/orders/${id}/status` : `/orders/${id}/status`;
    }

    const fetchOrders = useCallback(async (isInitial = false, signal = null) => {
        const isOwnerPortal = window.location.pathname.startsWith('/owner-dashboard') || window.location.pathname.startsWith('/owner');
        const token = isOwnerPortal ? localStorage.getItem('owner_auth_token') : localStorage.getItem('auth_token');
        
        if (!token || token === 'undefined' || token === 'null') {
            setLoading(false);
            return;
        }

        try {
            if (isInitial) setLoading(true);
            const endpoint = getOrdersEndpoint();
            const response = await api.get(endpoint, { signal });
            const formattedOrders = response.data.map(o => {
                // Normalize any legacy statuses from older DB records
                let currentStatus = o.status;
                if (currentStatus === 'Order Placed') currentStatus = 'Pending'; // legacy fallback
                if (currentStatus === 'Being Prepared') currentStatus = 'Order Confirmed';
                if (currentStatus === 'Picked Up') currentStatus = 'Out for Delivery';

                const createdAt = new Date(o.created_at);
                const updatedAt = new Date(o.updated_at);

                const statusList = [
                    'Pending',
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
                        state = 'completed';
                    }

                    const getStatusDesc = (label, state) => {
                        if (state === 'pending') return 'Pending';
                        if (state === 'completed') {
                            if (label === 'Delivered') return 'Enjoy your meal!';
                            return 'Done';
                        }
                        const activeDescs = {
                            'Pending': 'Your order has been placed',
                            'Order Confirmed': 'Restaurant is preparing your food',
                            'Out for Delivery': 'Your rider is on the way',
                            'Delivered': 'Enjoy your meal!'
                        };
                        return activeDescs[label] || 'In progress';
                    };

                    const stepTime = (state === 'active' || (state === 'completed' && index === currentStatusIndex)) ? updatedAt : createdAt;

                    return {
                        label,
                        time: (state === 'completed' || state === 'active') ? stepTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
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

                // Build full customer name from customer relation or fallback
                const customerName = o.customer
                    ? `${o.customer.first_name || ''} ${o.customer.last_name || ''}`.trim()
                    : `Customer #${o.customer_id}`;

                return {
                    id: o.id,
                    orderNumber: orderNumber,
                    restaurant: o.store_name,
                    restaurantId: o.restaurant_owner_id,
                    // Customer info — from the eagerly-loaded customer relation
                    customer: customerName,
                    customerName: customerName,
                    customerPhone: o.customer?.phone || o.contact_number || 'N/A',
                    customerAddress: o.customer?.address || o.delivery_address || 'N/A',
                    // Delivery info saved at order time
                    address: o.delivery_address,
                    deliveryAddress: o.delivery_address,
                    contactNumber: o.contact_number,
                    specialInstructions: o.special_instructions || '',
                    note: o.special_instructions || '',
                    // Items ordered
                    items: o.items.map(i => ({
                        id: i.id,
                        menuItemId: i.menu_item_id,
                        name: i.item_name,
                        quantity: i.quantity,
                        qty: i.quantity,
                        image: i.image,
                        price: parseFloat(i.price),
                        variations: i.variations
                    })),
                    // Pricing
                    subtotal: parseFloat(o.subtotal),
                    deliveryFee: parseFloat(o.delivery_fee),
                    discount: parseFloat(o.discount),
                    total: parseFloat(o.total),
                    paymentMethod: o.payment_method,
                    // Status & timing
                    status: currentStatus,
                    placedAt: o.created_at,
                    time: createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    // Delivery scheduling
                    deliveryType: o.delivery_type || 'asap',
                    scheduledDate: o.scheduled_date || null,
                    scheduledTime: o.scheduled_time || null,
                    // Timeline for tracking
                    timeline: timeline
                };
            });
            setOrders(formattedOrders);
        } catch (error) {
            if (axios.isCancel(error) ||
                error.name === 'CanceledError' ||
                error.name === 'AbortError' ||
                error.code === 'ERR_CANCELED' ||
                error.message === 'Request aborted') {
                return;
            }
            console.error('Failed to fetch orders', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        let timeoutId = null;

        const poll = async (isInitial = false) => {
            await fetchOrders(isInitial, controller.signal);

            // Re-schedule next poll ONLY IF not aborted
            if (!controller.signal.aborted) {
                timeoutId = setTimeout(() => poll(false), 5000);
            }
        };

        poll(true);

        return () => {
            controller.abort();
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [fetchOrders]);

    const placeOrder = useCallback(async (orderData) => {
        try {
            const response = await api.post('/orders', orderData);
            await fetchOrders();
            return response.data;
        } catch (error) {
            console.error('Failed to place order', error);
            throw error;
        }
    }, [fetchOrders]);

    const updateStatus = useCallback(async (id, status) => {
        try {
            const endpoint = getUpdateStatusEndpoint(id);
            await api.put(endpoint, { status });
            await fetchOrders();
        } catch (error) {
            console.error('Failed to update status', error);
            throw error;
        }
    }, [fetchOrders]);

    const cancelOrder = useCallback(async (id) => {
        return await updateStatus(id, 'Cancelled');
    }, [updateStatus]);

    const activeOrders = useMemo(() => orders.filter(o => !['Delivered', 'Cancelled'].includes(o.status)), [orders]);
    const completedOrders = useMemo(() => orders.filter(o => o.status === 'Delivered'), [orders]);
    const cancelledOrders = useMemo(() => orders.filter(o => o.status === 'Cancelled'), [orders]);

    const value = useMemo(() => ({
        orders, activeOrders, completedOrders, cancelledOrders,
        placeOrder, cancelOrder, updateStatus, loading, fetchOrders
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
