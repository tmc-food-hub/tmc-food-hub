import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Package, Clock, CheckCircle2, XCircle, MapPin,
    ShoppingBag, ChevronRight, Truck, Star, CalendarDays, X
} from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useNotification } from '../../context/NotificationContext';
import api from '../../api/axios';
import Navbar from '../../components/sections/Navbar';
import Footer from '../../components/sections/Footer';
import BackToTop from '../../components/ui/BackToTop';
import { useAuth } from '../../context/AuthContext';
import { CartContext } from '../../components/ui/CartContext';
import { ThemeContext } from '../../components/ui/ThemeContext';
import { useContext } from 'react';
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
        'Out for Delivery': { color: '#0891B2', bg: '#CFFAFE', icon: <Truck size={12} /> },
        'Delivered': { color: '#059669', bg: '#D1FAE5', icon: <CheckCircle2 size={12} /> },
        'Cancelled': { color: '#DC2626', bg: '#FEE2E2', icon: <XCircle size={12} /> },
    };
    return map[s] || { color: '#6B7280', bg: '#F3F4F6', icon: <Clock size={12} /> };
}

function OrderCard({ order, navigate, isDarkMode, onReview }) {
    const meta = statusMeta(order.status);
    const isActive = !['Delivered', 'Cancelled'].includes(order.status);
    const date = new Date(order.placedAt);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    return (
        <div className={styles.orderCard}>
            <div className={styles.orderCardTop}>
                <div className={styles.orderIdRow}>
                    <span className={styles.orderId}>{order.orderNumber}</span>
                    <span className={styles.orderDate}>{dateStr} at {timeStr}</span>
                </div>
                <span className={styles.statusPill} style={isDarkMode ? { background: `${meta.color}20`, color: meta.color, border: `1px solid ${meta.color}40` } : { background: meta.bg, color: meta.color }}>
                    {meta.icon} {order.status}
                </span>
            </div>

            <div className={styles.orderRestaurant}>
                <ShoppingBag size={14} /> {order.restaurant}
            </div>

            {order.deliveryType === 'scheduled' && order.scheduledDate && (
                <div className={styles.scheduledBadge}>
                    <CalendarDays size={13} />
                    <span>
                        Scheduled for{' '}
                        {new Date(order.scheduledDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        {order.scheduledTime && (
                            <> at {new Date('1970-01-01T' + order.scheduledTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</>
                        )}
                    </span>
                </div>
            )}

            <div className={styles.orderItemsRow}>
                {order.items.slice(0, 4).map((item, idx) => (
                    <div key={idx} className={styles.orderItemChip}>
                        <img
                            src={item.image}
                            alt={item.name}
                            className={styles.orderItemImg}
                            onError={e => {
                                e.target.onerror = null;
                                e.target.style.background = '#F3F4F6';
                                e.target.style.objectFit = 'contain';
                                e.target.style.padding = '6px';
                                e.target.src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%239CA3AF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>');
                            }}
                        />
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
                    <span className={styles.orderTotal}>${Number(order.total).toFixed(2)}</span>
                    <span className={styles.orderPayment}>{order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod === 'gcash' ? 'GCash' : order.paymentMethod === 'maya' ? 'Maya' : 'Card'}</span>
                </div>
                <div className={styles.orderActions}>
                    {isActive || order.status === 'Delivered' ? (
                        <button className={styles.trackBtn} onClick={() => navigate(`/order-tracking?id=${order.id}`)}>
                            <MapPin size={14} /> {order.status === 'Delivered' ? 'View Details' : 'Track Order'} <ChevronRight size={14} />
                        </button>
                    ) : (
                        <div className={styles.cancelledBadge}>
                            <XCircle size={14} /> Cancelled
                        </div>
                    )}
                    
                    {order.status === 'Delivered' && !order.hasReview && (
                        <button
                            className={styles.reviewBtn}
                            onClick={() => onReview(order)}
                        >
                            <Star size={14} /> Leave Review
                        </button>
                    )}

                    {order.status === 'Delivered' && (
                        <button 
                            className={styles.reorderBtn}
                            onClick={() => {
                                order.handleReorder(order);
                            }}
                        >
                            <ShoppingBag size={14} /> Reorder
                        </button>
                    )}
                </div>
            </div>

            {isActive && order.estimatedArrival && (
                <div className={styles.etaBar}>
                    <Truck size={13} /> Estimated arrival in ~{order.estimatedArrival} min
                </div>
            )}
        </div>
    );
}

/* ── Review Modal ──────────────────────────────── */
function ReviewModal({ order, onClose, onSubmitted }) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const { showNotification } = useNotification();

    const handleSubmit = async () => {
        if (rating === 0) {
            setError('Please select a star rating.');
            return;
        }
        if (reviewText.trim().length < 10) {
            setError('Please write at least 10 characters.');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            await api.post(`/restaurants/${order.restaurantId}/reviews`, {
                order_id: order.id,
                rating,
                review: reviewText.trim(),
            });
            showNotification('Review submitted! Thank you for your feedback.', 'success');
            onSubmitted(order.id);
            onClose();
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data?.errors?.order_id?.[0] || 'Failed to submit review.';
            setError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            zIndex: 1060, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem',
        }} onClick={onClose}>
            <div
                style={{
                    background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '460px',
                    overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
                    animation: 'fadeInUp 0.3s ease',
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #991B1B, #7F1D1D)',
                    padding: '1.5rem', color: '#fff', position: 'relative',
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute', top: '1rem', right: '1rem',
                            background: 'rgba(255,255,255,0.15)', border: 'none',
                            borderRadius: '50%', width: '32px', height: '32px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', cursor: 'pointer',
                        }}
                    >
                        <X size={16} />
                    </button>
                    <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>How was your order?</h3>
                    <p style={{ margin: '0.4rem 0 0', fontSize: '0.85rem', opacity: 0.8 }}>
                        {order.restaurant} • {order.orderNumber}
                    </p>
                </div>

                {/* Body */}
                <div style={{ padding: '1.5rem' }}>
                    {/* Star Rating */}
                    <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                        <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#374151', marginBottom: '0.75rem' }}>
                            Tap a star to rate
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => { setRating(star); setError(''); }}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    style={{
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        padding: '4px', transition: 'transform 0.15s',
                                        transform: (hoverRating || rating) >= star ? 'scale(1.15)' : 'scale(1)',
                                    }}
                                >
                                    <Star
                                        size={36}
                                        fill={(hoverRating || rating) >= star ? '#F59E0B' : 'none'}
                                        color={(hoverRating || rating) >= star ? '#F59E0B' : '#D1D5DB'}
                                        strokeWidth={1.5}
                                    />
                                </button>
                            ))}
                        </div>
                        {rating > 0 && (
                            <p style={{ fontSize: '0.82rem', color: '#F59E0B', fontWeight: 700, marginTop: '0.35rem' }}>
                                {['', 'Terrible', 'Poor', 'Okay', 'Good', 'Excellent'][rating]}
                            </p>
                        )}
                    </div>

                    {/* Review Text */}
                    <textarea
                        placeholder="Tell us about your experience (what you loved, the food quality, delivery speed...)"
                        value={reviewText}
                        onChange={e => { setReviewText(e.target.value); setError(''); }}
                        maxLength={1500}
                        style={{
                            width: '100%', padding: '0.85rem 1rem',
                            border: '1px solid #E5E7EB', borderRadius: '12px',
                            fontSize: '0.88rem', resize: 'vertical',
                            minHeight: '100px', fontFamily: 'Inter, sans-serif',
                            outline: 'none', transition: 'border-color 0.2s',
                            color: '#111827', boxSizing: 'border-box',
                        }}
                        onFocus={e => e.target.style.borderColor = '#991B1B'}
                        onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.35rem' }}>
                        <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                            Min 10 characters
                        </span>
                        <span style={{ fontSize: '0.75rem', color: reviewText.length >= 10 ? '#059669' : '#9CA3AF' }}>
                            {reviewText.length}/1500
                        </span>
                    </div>

                    {error && (
                        <div style={{
                            background: '#FEF2F2', color: '#991B1B', fontSize: '0.82rem',
                            padding: '0.6rem 0.85rem', borderRadius: '8px', marginTop: '0.75rem',
                            fontWeight: 500,
                        }}>
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        style={{
                            width: '100%', marginTop: '1rem',
                            padding: '0.8rem', border: 'none',
                            borderRadius: '12px', fontSize: '0.92rem',
                            fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer',
                            background: submitting ? '#D1D5DB' : '#991B1B',
                            color: '#fff', transition: 'background 0.2s',
                            fontFamily: 'Inter, sans-serif',
                        }}
                    >
                        {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </div>
            </div>
        </div>
    );
}

function MyOrdersPage() {
    const { isAuthenticated, loading, setShowLoginPrompt } = useAuth();
    const { activeOrders, completedOrders, cancelledOrders } = useOrders();
    const { showNotification } = useNotification();
    const { reorder } = useContext(CartContext);
    const { isDarkMode } = useContext(ThemeContext);
    const [tab, setTab] = useState('active');
    const navigate = useNavigate();
    const [reviewOrder, setReviewOrder] = useState(null);
    const [reviewedOrderIds, setReviewedOrderIds] = useState([]);

    const handleReorder = (order) => {
        reorder(order.items, order.restaurant, order.restaurantId);
        navigate(`/checkout?restaurant=${encodeURIComponent(order.restaurant)}&restaurantId=${order.restaurantId}`);
    };

    const handleReviewSubmitted = (orderId) => {
        setReviewedOrderIds(prev => [...prev, orderId]);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!loading && !isAuthenticated) {
            navigate('/');
            setShowLoginPrompt(true);
        }
    }, [isAuthenticated, loading, navigate, setShowLoginPrompt]);

    if (loading || !isAuthenticated) return null;

    const displayed = tab === 'active' ? activeOrders : tab === 'completed' ? completedOrders : cancelledOrders;
    const counts = { active: activeOrders.length, completed: completedOrders.length, cancelled: cancelledOrders.length };

    return (
        <>
            <div className={`site-wrap ${isDarkMode ? 'dark-mode-global' : ''}`}>
                <Navbar />
                <main className={`${styles.myOrdersPage} ${isDarkMode ? styles.myOrdersPageDark : ''}`}>
                    <div className="container-lg">
                        {/* Header */}
                        <div className={styles.pageHeader}>
                            <div className={styles.breadcrumbs}>
                                <Link to="/">Home</Link>
                                <span className="mx-2">/</span>
                                <span className={styles.current}>My Orders</span>
                            </div>
                            <h1 className={styles.title}>My Orders</h1>
                            <p className={styles.subtitle}>Track and manage all your food orders in one place.</p>
                        </div>

                        {/* Tabs */}
                        <div className={styles.tabBar}>
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
                        <div className={styles.ordersList}>
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
                                    <OrderCard
                                        key={order.id}
                                        order={{
                                            ...order,
                                            handleReorder,
                                            hasReview: reviewedOrderIds.includes(order.id),
                                        }}
                                        navigate={navigate}
                                        isDarkMode={isDarkMode}
                                        onReview={(o) => setReviewOrder(o)}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
            <BackToTop />

            {/* Review Modal */}
            {reviewOrder && (
                <ReviewModal
                    order={reviewOrder}
                    onClose={() => setReviewOrder(null)}
                    onSubmitted={handleReviewSubmitted}
                />
            )}
        </>
    );
}

export default MyOrdersPage;
