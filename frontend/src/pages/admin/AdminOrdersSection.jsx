import React, { useState, useMemo } from 'react';
import {
    ShoppingCart, Clock, CheckCircle2, AlertTriangle, Download,
    Search, Filter, MoreVertical, X, MapPin, Phone, ChevronRight,
    Package, Truck, CreditCard, ChevronDown
} from 'lucide-react';
import styles from './AdminOrdersSection.module.css';

/* ─── Mock Data ─────────────────────────────────────────────────────────────── */
const MOCK_ORDERS = [
    {
        id: 'TMC-882941', customer: { name: 'Jane Doe', avatar: null },
        restaurant: { name: 'Patty Shack', type: 'Fast Food', logo: null },
        items: '2x Classic Burger, 1x Large Fries', total: 24.50, payment: 'GCash',
        status: 'Pending', time: '2 mins ago',
        details: {
            date: 'Today, 12:44 PM',
            timeline: [
                { label: 'Order Placed', time: '12:30 PM', done: true },
                { label: 'Confirmed', time: null, done: false },
            ],
            customerInfo: { name: 'Jane Doe', phone: '+1 (555) 000-1234' },
            restaurantInfo: { name: 'Patty Shack', distance: '2.1 km from delivery' },
            orderItems: [
                { name: 'Grilled Steak', qty: 1, price: 12.00, img: null },
                { name: 'Black Iced Coffee', qty: 1, price: 3.00, img: null },
            ],
            specialInstructions: 'Please knock quietly, baby is sleeping. Leave at the front porch mat.',
            subtotal: 15.00, deliveryFee: 3.00,
            discount: { code: 'PROMO5', amount: -5.00 },
            totalAmount: 13.00,
        }
    },
    {
        id: 'TMC-882942', customer: { name: 'Michael Smith', avatar: null },
        restaurant: { name: 'Jollibee', type: 'Fast Food', logo: null },
        items: '1x Pizza Margherita (Large)', total: 18.20, payment: 'COD',
        status: 'Preparing', time: '15 mins',
        details: {
            date: 'Today, 12:30 PM',
            timeline: [
                { label: 'Order Placed', time: '12:15 PM', done: true },
                { label: 'Confirmed', time: '12:18 PM', done: true },
                { label: 'Preparing', time: '12:20 PM', done: true },
            ],
            customerInfo: { name: 'Michael Smith', phone: '+1 (555) 111-2345' },
            restaurantInfo: { name: 'Jollibee', distance: '1.5 km from delivery' },
            orderItems: [
                { name: 'Pizza Margherita (Large)', qty: 1, price: 18.20, img: null },
            ],
            specialInstructions: '',
            subtotal: 18.20, deliveryFee: 0, discount: null, totalAmount: 18.20,
        }
    },
    {
        id: 'TMC-882943', customer: { name: 'Amy Lee', avatar: null },
        restaurant: { name: 'Mcdonalds', type: 'Fast Food', logo: null },
        items: '3x Street Tacos, 1x Coke Zero', total: 32.00, payment: 'Credit Card',
        status: 'Refund Requested', time: 'Just Now',
        details: {
            date: 'Today, 12:10 PM',
            timeline: [
                { label: 'Order Placed', time: '11:50 AM', done: true },
                { label: 'Confirmed', time: '11:52 AM', done: true },
                { label: 'Preparing', time: '11:55 AM', done: true },
                { label: 'Refund Requested', time: '12:10 PM', done: true },
            ],
            customerInfo: { name: 'Amy Lee', phone: '+1 (555) 222-3456' },
            restaurantInfo: { name: 'Mcdonalds', distance: '3.2 km from delivery' },
            orderItems: [
                { name: 'Street Tacos', qty: 3, price: 24.00, img: null },
                { name: 'Coke Zero', qty: 1, price: 3.00, img: null },
            ],
            specialInstructions: '',
            subtotal: 27.00, deliveryFee: 5.00, discount: null, totalAmount: 32.00,
        }
    },
    {
        id: 'TMC-882944', customer: { name: 'Robert Brown', avatar: null },
        restaurant: { name: 'Jollibee', type: 'Fast Food', logo: null },
        items: '1x Veggie Bowl Special', total: 12.50, payment: 'COD',
        status: 'Completed', time: '22 mins',
        details: {
            date: 'Today, 11:45 AM',
            timeline: [
                { label: 'Order Placed', time: '11:20 AM', done: true },
                { label: 'Confirmed', time: '11:22 AM', done: true },
                { label: 'Preparing', time: '11:25 AM', done: true },
                { label: 'Delivered', time: '11:45 AM', done: true },
            ],
            customerInfo: { name: 'Robert Brown', phone: '+1 (555) 333-4567' },
            restaurantInfo: { name: 'Jollibee', distance: '0.8 km from delivery' },
            orderItems: [
                { name: 'Veggie Bowl Special', qty: 1, price: 12.50, img: null },
            ],
            specialInstructions: '',
            subtotal: 12.50, deliveryFee: 0, discount: null, totalAmount: 12.50,
        }
    },
    {
        id: 'TMC-882945', customer: { name: 'Kevin White', avatar: null },
        restaurant: { name: 'Burger King', type: 'Fast Food', logo: null },
        items: '4x Tacos Al Pastor, 1x Horchata', total: 15.75, payment: 'Maya',
        status: 'Completed', time: '25 mins',
        details: {
            date: 'Today, 11:30 AM',
            timeline: [
                { label: 'Order Placed', time: '11:00 AM', done: true },
                { label: 'Confirmed', time: '11:02 AM', done: true },
                { label: 'Preparing', time: '11:08 AM', done: true },
                { label: 'Delivered', time: '11:30 AM', done: true },
            ],
            customerInfo: { name: 'Kevin White', phone: '+1 (555) 444-5678' },
            restaurantInfo: { name: 'Burger King', distance: '1.9 km from delivery' },
            orderItems: [
                { name: 'Tacos Al Pastor', qty: 4, price: 12.00, img: null },
                { name: 'Horchata', qty: 1, price: 3.75, img: null },
            ],
            specialInstructions: '',
            subtotal: 15.75, deliveryFee: 0, discount: null, totalAmount: 15.75,
        }
    },
];

const STATUS_TABS = ['All', 'Pending', 'Preparing', 'On the way', 'Delivered', 'Cancelled'];

const STATS = [
    { label: 'Total Orders', value: '1,284', trend: '+12%', icon: <ShoppingCart size={18} />, color: '#FEF2F2', iconColor: '#DC2626' },
    { label: 'In Progress', value: '42', badge: 'Active', icon: <Clock size={18} />, color: '#FFF7ED', iconColor: '#EA580C' },
    { label: 'Completed', value: '1,102', trend: '+12%', icon: <CheckCircle2 size={18} />, color: '#ECFDF5', iconColor: '#059669' },
    { label: 'Refund Requests', value: '14', trend: '+2%', icon: <AlertTriangle size={18} />, color: '#FEF2F2', iconColor: '#DC2626' },
];

function getStatusClass(status) {
    const s = status.toLowerCase().replace(/\s+/g, '');
    if (s === 'pending') return styles.statusPending;
    if (s === 'preparing') return styles.statusPreparing;
    if (s === 'ontheway') return styles.statusOnTheWay;
    if (s === 'delivered' || s === 'completed') return styles.statusCompleted;
    if (s === 'cancelled') return styles.statusCancelled;
    if (s === 'refundrequested') return styles.statusRefund;
    return '';
}

function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function getInitialColor(name) {
    const colors = ['#DC2626', '#EA580C', '#D97706', '#059669', '#2563EB', '#7C3AED', '#DB2777'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
}

/* ─── Component ─────────────────────────────────────────────────────────────── */
export default function AdminOrdersSection() {
    const [activeTab, setActiveTab] = useState('All');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [restaurantFilter, setRestaurantFilter] = useState('All Restaurants');
    const [paymentFilter, setPaymentFilter] = useState('All');
    const [dateFilter, setDateFilter] = useState('Today');
    const [valueFilter, setValueFilter] = useState('Any');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredOrders = useMemo(() => {
        let orders = MOCK_ORDERS;
        if (activeTab !== 'All') {
            orders = orders.filter(o => {
                if (activeTab === 'On the way') return o.status.toLowerCase() === 'on the way';
                return o.status.toLowerCase() === activeTab.toLowerCase();
            });
        }
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            orders = orders.filter(o =>
                o.id.toLowerCase().includes(q) ||
                o.customer.name.toLowerCase().includes(q) ||
                o.restaurant.name.toLowerCase().includes(q)
            );
        }
        return orders;
    }, [activeTab, searchQuery]);

    const clearFilters = () => {
        setRestaurantFilter('All Restaurants');
        setPaymentFilter('All');
        setDateFilter('Today');
        setValueFilter('Any');
        setSearchQuery('');
        setActiveTab('All');
    };

    return (
        <div className={styles.container}>
            {/* Stats Row */}
            <div className={styles.statsRow}>
                {STATS.map(stat => (
                    <div key={stat.label} className={styles.statCard}>
                        <div className={styles.statIcon} style={{ background: stat.color, color: stat.iconColor }}>
                            {stat.icon}
                        </div>
                        <div className={styles.statBody}>
                            <div className={styles.statLabel}>
                                {stat.label}
                                {stat.trend && <span className={styles.statTrend}>{stat.trend}</span>}
                                {stat.badge && <span className={styles.statBadge}>{stat.badge}</span>}
                            </div>
                            <div className={styles.statValue}>{stat.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tab Filters & Export */}
            <div className={styles.filtersBar}>
                <div className={styles.tabs}>
                    {STATUS_TABS.map(tab => (
                        <button
                            key={tab}
                            className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <button className={styles.exportBtn}>
                    <Download size={16} /> Export
                </button>
            </div>

            {/* Dropdown Filters */}
            <div className={styles.dropdownFilters}>
                <div className={styles.selectWrap}>
                    <select value={restaurantFilter} onChange={e => setRestaurantFilter(e.target.value)}>
                        <option>All Restaurants</option>
                        <option>Patty Shack</option>
                        <option>Jollibee</option>
                        <option>Mcdonalds</option>
                        <option>Burger King</option>
                    </select>
                    <ChevronDown size={14} className={styles.selectArrow} />
                </div>
                <div className={styles.selectWrap}>
                    <select value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)}>
                        <option value="All">Payment: All</option>
                        <option>GCash</option>
                        <option>COD</option>
                        <option>Credit Card</option>
                        <option>Maya</option>
                    </select>
                    <ChevronDown size={14} className={styles.selectArrow} />
                </div>
                <div className={styles.selectWrap}>
                    <select value={dateFilter} onChange={e => setDateFilter(e.target.value)}>
                        <option>Today</option>
                        <option>Yesterday</option>
                        <option>Last 7 days</option>
                        <option>Last 30 days</option>
                    </select>
                    <ChevronDown size={14} className={styles.selectArrow} />
                </div>
                <div className={styles.selectWrap}>
                    <select value={valueFilter} onChange={e => setValueFilter(e.target.value)}>
                        <option value="Any">Value: Any</option>
                        <option>Under $10</option>
                        <option>$10 - $25</option>
                        <option>$25 - $50</option>
                        <option>Over $50</option>
                    </select>
                    <ChevronDown size={14} className={styles.selectArrow} />
                </div>
                <button className={styles.clearBtn} onClick={clearFilters}>Clear all</button>
            </div>

            {/* Orders Table */}
            <div className={styles.tableCard}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Restaurant</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Payment</th>
                            <th>Status</th>
                            <th>Time</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map(order => (
                            <tr key={order.id} className={styles.tableRow} onClick={() => setSelectedOrder(order)}>
                                <td className={styles.orderId}>#{order.id}</td>
                                <td>
                                    <div className={styles.customerCell}>
                                        <div className={styles.avatarCircle} style={{ background: getInitialColor(order.customer.name) }}>
                                            {getInitials(order.customer.name)}
                                        </div>
                                        <span>{order.customer.name}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className={styles.restaurantCell}>
                                        <div className={styles.restaurantIcon} style={{ background: getInitialColor(order.restaurant.name) }}>
                                            {order.restaurant.name[0]}
                                        </div>
                                        <div>
                                            <div className={styles.restaurantName}>{order.restaurant.name}</div>
                                            <div className={styles.restaurantType}>{order.restaurant.type}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className={styles.itemsCell}>{order.items}</td>
                                <td className={styles.totalCell}>${order.total.toFixed(2)}</td>
                                <td>{order.payment}</td>
                                <td>
                                    <span className={`${styles.statusPill} ${getStatusClass(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className={styles.timeCell}>{order.time}</td>
                                <td>
                                    <button className={styles.actionDots} onClick={e => { e.stopPropagation(); setSelectedOrder(order); }}>
                                        <MoreVertical size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredOrders.length === 0 && (
                            <tr>
                                <td colSpan={9} className={styles.emptyRow}>No orders found for this filter.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Order Details Slide-out Panel */}
            {selectedOrder && (
                <>
                    <div className={styles.panelOverlay} onClick={() => setSelectedOrder(null)} />
                    <div className={styles.detailPanel}>
                        <div className={styles.panelHeader}>
                            <div>
                                <h2 className={styles.panelTitle}>Order Details</h2>
                                <div className={styles.panelOrderId}>
                                    #{selectedOrder.id} • {selectedOrder.details.date}
                                </div>
                            </div>
                            <button className={styles.panelClose} onClick={() => setSelectedOrder(null)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className={styles.panelBody}>
                            {/* Status Badge */}
                            <span className={`${styles.statusPill} ${getStatusClass(selectedOrder.status)}`}>
                                {selectedOrder.status}
                            </span>

                            {/* Timeline */}
                            <div className={styles.timelineSection}>
                                <h4 className={styles.sectionLabel}>Order Timeline</h4>
                                <div className={styles.timeline}>
                                    {selectedOrder.details.timeline.map((step, i) => (
                                        <div key={i} className={`${styles.timelineStep} ${step.done ? styles.timelineStepDone : ''}`}>
                                            <div className={styles.timelineDot}>
                                                {step.done ? <CheckCircle2 size={16} /> : <div className={styles.timelineDotEmpty} />}
                                            </div>
                                            <div className={styles.timelineContent}>
                                                <div className={styles.timelineLabel}>{step.label}</div>
                                                {step.time && <div className={styles.timelineTime}>{step.time}</div>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Customer & Restaurant */}
                            <div className={styles.infoRow}>
                                <div className={styles.infoCard}>
                                    <div className={styles.infoCardLabel}>Customer Info</div>
                                    <div className={styles.infoCardBody}>
                                        <div className={styles.avatarCircle} style={{ background: getInitialColor(selectedOrder.details.customerInfo.name), width: 36, height: 36, fontSize: '.75rem' }}>
                                            {getInitials(selectedOrder.details.customerInfo.name)}
                                        </div>
                                        <div>
                                            <div className={styles.infoName}>{selectedOrder.details.customerInfo.name}</div>
                                            <div className={styles.infoSub}>{selectedOrder.details.customerInfo.phone}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.infoCard}>
                                    <div className={styles.infoCardLabel}>Restaurant</div>
                                    <div className={styles.infoCardBody}>
                                        <div className={styles.restaurantIcon} style={{ background: getInitialColor(selectedOrder.details.restaurantInfo.name), width: 36, height: 36, fontSize: '.75rem' }}>
                                            {selectedOrder.details.restaurantInfo.name[0]}
                                        </div>
                                        <div>
                                            <div className={styles.infoName}>{selectedOrder.details.restaurantInfo.name}</div>
                                            <div className={styles.infoSub}>{selectedOrder.details.restaurantInfo.distance}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Items */}
                            <div className={styles.itemsSection}>
                                <h4 className={styles.sectionLabel}>Items ({selectedOrder.details.orderItems.length})</h4>
                                <div className={styles.itemsList}>
                                    {selectedOrder.details.orderItems.map((item, i) => (
                                        <div key={i} className={styles.itemRow}>
                                            <div className={styles.itemImg} style={{ background: getInitialColor(item.name) }}>
                                                {item.name[0]}
                                            </div>
                                            <div className={styles.itemInfo}>
                                                <div className={styles.itemName}>{item.name}</div>
                                                <div className={styles.itemQty}>Qty: x{item.qty}</div>
                                            </div>
                                            <div className={styles.itemPrice}>${item.price.toFixed(2)}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Special Instructions */}
                            {selectedOrder.details.specialInstructions && (
                                <div className={styles.instructionsSection}>
                                    <h4 className={styles.sectionLabel}>Special Instructions</h4>
                                    <div className={styles.instructionsBox}>
                                        "{selectedOrder.details.specialInstructions}"
                                    </div>
                                </div>
                            )}

                            {/* Price Breakdown */}
                            <div className={styles.priceBreakdown}>
                                <div className={styles.priceLine}>
                                    <span>Subtotal</span>
                                    <span>${selectedOrder.details.subtotal.toFixed(2)}</span>
                                </div>
                                {selectedOrder.details.deliveryFee > 0 && (
                                    <div className={styles.priceLine}>
                                        <span>Delivery Fee</span>
                                        <span>${selectedOrder.details.deliveryFee.toFixed(2)}</span>
                                    </div>
                                )}
                                {selectedOrder.details.discount && (
                                    <div className={`${styles.priceLine} ${styles.discountLine}`}>
                                        <span>Discount ({selectedOrder.details.discount.code})</span>
                                        <span>-${Math.abs(selectedOrder.details.discount.amount).toFixed(2)}</span>
                                    </div>
                                )}
                                <div className={styles.totalLine}>
                                    <span>Total Amount</span>
                                    <span className={styles.totalAmount}>${selectedOrder.details.totalAmount.toFixed(2)} <small>USD</small></span>
                                </div>
                            </div>
                        </div>

                        {/* Panel Actions */}
                        <div className={styles.panelActions}>
                            <button className={styles.cancelOrderBtn}>Cancel Order</button>
                            {selectedOrder.status === 'Refund Requested' || selectedOrder.status === 'Pending' ? (
                                <button className={styles.approveRefundBtn}>Approve Refund</button>
                            ) : null}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
