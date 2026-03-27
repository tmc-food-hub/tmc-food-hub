import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    X, ShoppingBag, DollarSign, AlertCircle, Star,
    BellOff
} from 'lucide-react';
import api from '../../../api/axios';
import { useOrders } from '../../../context/OrderContext';
import styles from './NotificationPanel.module.css';

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

const peso = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
});

function timeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const mins  = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMs / 3600000);
    const days  = Math.floor(diffMs / 86400000);

    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins} min${mins > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function initials(name) {
    if (!name) return '??';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    return `${parts[0]?.[0] || ''}${parts[1]?.[0] || ''}`.toUpperCase() || name.slice(0, 2).toUpperCase();
}

/* ─── Build notifications from real data ──────────────────────────────────── */

function buildNotifications(orders, reviews, inventoryItems) {
    const notifications = [];

    // 1. ORDER notifications — each recent order becomes a notification
    orders.forEach(order => {
        notifications.push({
            id: `order-${order.id}`,
            type: 'order',
            title: `Order ${order.orderNumber} from ${order.customer || 'Customer'}`,
            subtitle: order.status === 'Pending' ? 'New Order Received' :
                order.status === 'Order Confirmed' ? 'Order Confirmed' :
                order.status === 'Out for Delivery' ? 'Out for Delivery' :
                order.status === 'Delivered' ? 'Order Delivered' :
                order.status === 'Cancelled' ? 'Order Cancelled' : order.status,
            time: order.placedAt,
            unread: order.status === 'Pending',
            navigateTo: 'orders',
        });
    });

    // 2. PAYMENT notifications — today's earnings summary
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaysOrders = orders.filter(o => {
        const d = new Date(o.placedAt);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === today.getTime() && o.status !== 'Cancelled';
    });
    const todaysRevenue = todaysOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    if (todaysRevenue > 0) {
        notifications.push({
            id: 'payment-today-earnings',
            type: 'payment',
            title: `Today's earnings ${peso.format(todaysRevenue)} added`,
            subtitle: `${todaysOrders.length} order${todaysOrders.length > 1 ? 's' : ''} today`,
            time: new Date().toISOString(),
            unread: false,
            navigateTo: 'earnings',
        });
    }

    // 3. SYSTEM notifications — low stock / out of stock inventory alerts
    inventoryItems.forEach(item => {
        const stock = item.stock_level !== undefined ? item.stock_level : 0;
        const threshold = item.min_threshold !== undefined ? item.min_threshold : 10;

        if (stock === 0) {
            notifications.push({
                id: `system-oos-${item.id}`,
                type: 'system',
                title: `${item.title} is out of stock`,
                subtitle: 'Out of Stock Alert',
                time: item.updated_at || new Date().toISOString(),
                unread: true,
                navigateTo: 'inventory',
            });
        } else if (stock <= threshold) {
            notifications.push({
                id: `system-low-${item.id}`,
                type: 'system',
                title: `${item.title} stock is running low`,
                subtitle: `Low Inventory Alert — ${stock} ${item.unit || 'units'} left`,
                time: item.updated_at || new Date().toISOString(),
                unread: true,
                navigateTo: 'inventory',
            });
        }
    });

    // 4. REVIEW notifications — recent customer reviews
    reviews.forEach(review => {
        notifications.push({
            id: `review-${review.id}`,
            type: 'review',
            title: `${Number(review.rating).toFixed(1)} ★ review from ${review.customer_name}`,
            subtitle: review.review ? (review.review.length > 60 ? review.review.slice(0, 60) + '…' : review.review) : null,
            time: review.created_at,
            unread: !review.owner_reply,
            avatar: initials(review.customer_name),
            navigateTo: 'reviews',
        });
    });

    // Sort by time descending
    notifications.sort((a, b) => new Date(b.time) - new Date(a.time));

    return notifications;
}

/* ─── Tabs ────────────────────────────────────────────────────────────────── */

const TABS = ['All', 'Orders', 'Payments', 'System'];

const TAB_TYPE_MAP = {
    Orders: 'order',
    Payments: 'payment',
    System: 'system',
};

/* ─── Icon per notification type ──────────────────────────────────────────── */
function NotificationIcon({ type, avatar }) {
    if (type === 'review') {
        return (
            <div className={styles.avatarPlaceholder}>
                {avatar || '?'}
            </div>
        );
    }

    const iconMap = {
        order: { icon: <ShoppingBag size={18} />, className: styles.iconOrder },
        payment: { icon: <DollarSign size={18} />, className: styles.iconPayment },
        system: { icon: <AlertCircle size={18} />, className: styles.iconSystem },
    };

    const config = iconMap[type] || iconMap.system;

    return (
        <div className={`${styles.itemIcon} ${config.className}`}>
            {config.icon}
        </div>
    );
}

/* ─── Panel Content (shared between desktop & mobile) ─────────────────────── */
function PanelContent({ onClose, onNavigate, orders, inventoryItems }) {
    const [activeTab, setActiveTab] = useState('All');
    const [reviews, setReviews] = useState([]);
    const [readIds, setReadIds] = useState(new Set());

    // Fetch reviews from API
    useEffect(() => {
        let active = true;
        async function fetchReviews() {
            try {
                const res = await api.get('/owner/reviews');
                if (active) {
                    setReviews(res.data.reviews || []);
                }
            } catch (err) {
                console.error('Failed to fetch reviews for notifications:', err);
            }
        }
        fetchReviews();
        return () => { active = false; };
    }, []);

    const notifications = useMemo(
        () => buildNotifications(orders, reviews, inventoryItems),
        [orders, reviews, inventoryItems]
    );

    // Apply manual read state on top of computed unread
    const notificationsWithReadState = useMemo(
        () => notifications.map(n => ({
            ...n,
            unread: readIds.has(n.id) ? false : n.unread,
        })),
        [notifications, readIds]
    );

    const filtered = activeTab === 'All'
        ? notificationsWithReadState
        : activeTab === 'System'
            ? notificationsWithReadState.filter(n => n.type === 'system' || n.type === 'review')
            : notificationsWithReadState.filter(n => n.type === TAB_TYPE_MAP[activeTab]);

    const unreadCount = notificationsWithReadState.filter(n => n.unread).length;

    const handleMarkAllRead = () => {
        setReadIds(new Set(notifications.map(n => n.id)));
    };

    return (
        <>
            {/* Header */}
            <div className={styles.header}>
                <h3 className={styles.headerTitle}>Notifications</h3>
                <div className={styles.headerActions}>
                    {unreadCount > 0 && (
                        <button className={styles.markReadBtn} onClick={handleMarkAllRead}>
                            Mark all as read
                        </button>
                    )}
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>
            </div>

            {/* Category Tabs */}
            <div className={styles.tabs}>
                {TABS.map(tab => (
                    <button
                        key={tab}
                        className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Notification List */}
            <div className={styles.list}>
                {filtered.length === 0 ? (
                    <div className={styles.emptyState}>
                        <BellOff size={32} className={styles.emptyIcon} />
                        <span className={styles.emptyText}>No notifications</span>
                    </div>
                ) : (
                    filtered.map(notification => (
                        <div
                            key={notification.id}
                            className={styles.item}
                            onClick={() => {
                                if (notification.navigateTo && onNavigate) {
                                    onNavigate(notification.navigateTo);
                                    onClose();
                                }
                            }}
                        >
                            <NotificationIcon
                                type={notification.type}
                                avatar={notification.avatar}
                            />
                            <div className={styles.itemContent}>
                                <p className={styles.itemTitle}>{notification.title}</p>
                                {notification.subtitle && (
                                    <p className={styles.itemSubtitle}>{notification.subtitle}</p>
                                )}
                                <span className={styles.itemTime}>{timeAgo(notification.time)}</span>
                            </div>
                            {notification.unread ? (
                                <div className={styles.unreadDot} />
                            ) : (
                                <div className={styles.readDot} />
                            )}
                        </div>
                    ))
                )}
            </div>
        </>
    );
}

/* ─── Main NotificationPanel ──────────────────────────────────────────────── */
export default function NotificationPanel({ isOpen, onClose, onNavigate, inventoryItems = [] }) {
    const { orders } = useOrders();

    if (!isOpen) return null;

    return (
        <>
            {/* Desktop dropdown */}
            <div className={styles.desktopOnly}>
                <div className={styles.overlay} onClick={onClose} />
                <div className={styles.panel}>
                    <PanelContent
                        onClose={onClose}
                        onNavigate={onNavigate}
                        orders={orders}
                        inventoryItems={inventoryItems}
                    />
                </div>
            </div>

            {/* Mobile fullscreen */}
            <div className={styles.mobileOnly}>
                <div className={styles.mobilePanel}>
                    <PanelContent
                        onClose={onClose}
                        onNavigate={onNavigate}
                        orders={orders}
                        inventoryItems={inventoryItems}
                    />
                </div>
            </div>
        </>
    );
}
