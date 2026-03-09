import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Package, Clock, CheckCircle2, XCircle, MapPin,
    ShoppingBag, ChevronRight, Truck, Star
} from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import Navbar from '../../components/sections/Navbar';
import Footer from '../../components/sections/Footer';
import BackToTop from '../../components/ui/BackToTop';
import styles from './MyOrdersPage.module.css';

const TABS = [
    { key: 'active', label: 'Ongoing', icon: <Truck size={15} /> },
    { key: 'completed', label: 'Completed', icon: <CheckCircle2 size={15} /> },
    { key: 'cancelled', label: 'Cancelled', icon: <XCircle size={15} /> },
];

function statusMeta(s) {
    const map = {
        'Order Placed': { color: '#D97706', bg: '#FEF3C7', icon: <Clock size={12} /> },
        'Order Confirmed': { color: '#2563EB', bg: '#DBEAFE', icon: <Package size={12} /> },
        'Being Prepared': { color: '#7C3AED', bg: '#EDE9FE', icon: <Package size={12} /> },
        'Picked Up': { color: '#0891B2', bg: '#CFFAFE', icon: <Truck size={12} /> },
        'Delivered': { color: '#059669', bg: '#D1FAE5', icon: <CheckCircle2 size={12} /> },
        'Cancelled': { color: '#DC2626', bg: '#FEE2E2', icon: <XCircle size={12} /> },
    };
    return map[s] || { color: '#6B7280', bg: '#F3F4F6', icon: <Clock size={12} /> };
}

function OrderCard({ order, navigate }) {
    const meta = statusMeta(order.status);
    const isActive = !['Delivered', 'Cancelled'].includes(order.status);
    const date = new Date(order.placedAt);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    return (
        <div className={styles.orderCard}>
            <div className={styles.orderCardTop}>
                <div className={styles.orderIdRow}>
                    <span className={styles.orderId}>{order.id}</span>
                    <span className={styles.orderDate}>{dateStr} at {timeStr}</span>
                </div>
                <span className={styles.statusPill} style={{ background: meta.bg, color: meta.color }}>
                    {meta.icon} {order.status}
                </span>
            </div>

            <div className={styles.orderRestaurant}>
                <ShoppingBag size={14} /> {order.restaurant}
            </div>

            <div className={styles.orderItemsRow}>
                {order.items.slice(0, 4).map((item, idx) => (
                    <div key={idx} className={styles.orderItemChip}>
                        <img src={item.image} alt={item.name} className={styles.orderItemImg} />
                        <div className={styles.orderItemInfo}>
                            <span className={styles.orderItemName}>{item.name}</span>
                            <span className={styles.orderItemQty}>×{item.quantity}</span>
                        </div>
                    </div>
                ))}
                {order.items.length > 4 && (
                    <div className={styles.orderItemMore}>+{order.items.length - 4} more</div>
                )}
            </div>

            <div className={styles.orderCardBottom}>
                <div className={styles.orderMeta}>
                    <span className={styles.orderTotal}>${order.total.toFixed(2)}</span>
                    <span className={styles.orderPayment}>{order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod === 'gcash' ? 'GCash' : order.paymentMethod === 'maya' ? 'Maya' : 'Card'}</span>
                </div>
                {isActive ? (
                    <button className={styles.trackBtn} onClick={() => navigate(`/order-tracking?id=${order.id}`)}>
                        <MapPin size={14} /> Track Order <ChevronRight size={14} />
                    </button>
                ) : order.status === 'Delivered' ? (
                    <div className={styles.deliveredBadge}>
                        <CheckCircle2 size={14} /> Delivered
                    </div>
                ) : (
                    <div className={styles.cancelledBadge}>
                        <XCircle size={14} /> Cancelled
                    </div>
                )}
            </div>

            {isActive && order.estimatedArrival && (
                <div className={styles.etaBar}>
                    <Truck size={13} /> Estimated arrival in ~{order.estimatedArrival} min
                </div>
            )}
        </div>
    );
}

function MyOrdersPage() {
    const { activeOrders, completedOrders, cancelledOrders } = useOrders();
    const [tab, setTab] = useState('active');
    const navigate = useNavigate();

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const displayed = tab === 'active' ? activeOrders : tab === 'completed' ? completedOrders : cancelledOrders;
    const counts = { active: activeOrders.length, completed: completedOrders.length, cancelled: cancelledOrders.length };

    return (
        <>
            <div className="site-wrap">
                <Navbar />
                <main className={styles.myOrdersPage}>
                    <div className="container-lg">
                        {/* Header */}
                        <div className={styles.pageHeader} data-aos="fade-up">
                            <div className={styles.breadcrumbs}>
                                <Link to="/">Home</Link>
                                <span className="mx-2">/</span>
                                <span className={styles.current}>My Orders</span>
                            </div>
                            <h1 className={styles.title}>My Orders</h1>
                            <p className={styles.subtitle}>Track and manage all your food orders in one place.</p>
                        </div>

                        {/* Tabs */}
                        <div className={styles.tabBar} data-aos="fade-up" data-aos-delay="100">
                            {TABS.map(t => (
                                <button
                                    key={t.key}
                                    className={`${styles.tabBtn} ${tab === t.key ? styles.tabBtnActive : ''}`}
                                    onClick={() => setTab(t.key)}
                                >
                                    {t.icon} {t.label}
                                    <span className={styles.tabCount}>{counts[t.key]}</span>
                                </button>
                            ))}
                        </div>

                        {/* Orders list */}
                        <div className={styles.ordersList} data-aos="fade-up" data-aos-delay="200">
                            {displayed.length === 0 ? (
                                <div className={styles.emptyState}>
                                    <Package size={48} strokeWidth={1.5} color="#D1D5DB" />
                                    <h3>No {tab === 'active' ? 'ongoing' : tab} orders</h3>
                                    <p>{tab === 'active' ? 'Start ordering from your favorite restaurants!' : tab === 'completed' ? 'Your completed orders will appear here.' : 'No cancelled orders yet.'}</p>
                                    {tab === 'active' && (
                                        <Link to="/menu" className={styles.browseBtn}>Browse Restaurants</Link>
                                    )}
                                </div>
                            ) : (
                                displayed.map(order => (
                                    <OrderCard key={order.id} order={order} navigate={navigate} />
                                ))
                            )}
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
            <BackToTop />
        </>
    );
}

export default MyOrdersPage;
