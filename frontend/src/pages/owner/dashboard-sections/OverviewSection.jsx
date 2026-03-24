import React, { useEffect, useMemo, useState } from 'react';
import { ShoppingBag, Package, DollarSign, AlertCircle, Star } from 'lucide-react';
import api from '../../../api/axios';
import { statusMeta } from './shared';
import styles from '../OwnerDashboard.module.css';

const peso = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
});

function startOfDay(dateLike) {
    const date = new Date(dateLike);
    date.setHours(0, 0, 0, 0);
    return date;
}

function sameDay(left, right) {
    return startOfDay(left).getTime() === startOfDay(right).getTime();
}

function recentDays(count) {
    const today = startOfDay(new Date());
    return Array.from({ length: count }, (_, index) => {
        const date = new Date(today);
        date.setDate(today.getDate() - (count - 1 - index));
        return date;
    });
}

function initials(name) {
    if (!name) return 'CU';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    const value = `${parts[0]?.[0] || ''}${parts[1]?.[0] || ''}`.toUpperCase();
    return value || name.slice(0, 2).toUpperCase();
}

function StarRow({ rating, size = 12 }) {
    return (
        <span className={styles.reviewStarsSmall}>
            {[1, 2, 3, 4, 5].map((value) => (
                <Star
                    key={value}
                    size={size}
                    fill={value <= Math.round(Number(rating) || 0) ? '#F5A623' : 'none'}
                    color={value <= Math.round(Number(rating) || 0) ? '#F5A623' : '#D1D5DB'}
                />
            ))}
        </span>
    );
}

export default function OverviewSection({ store, orders, items = [], onNavigate }) {
    const [hoveredBar, setHoveredBar] = useState(null);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [reviewSummary, setReviewSummary] = useState({
        average_rating: 0,
        total_reviews: 0,
        five_star_reviews: 0,
        awaiting_reply: 0,
        distribution: [],
    });
    const [recentReviews, setRecentReviews] = useState([]);

    useEffect(() => {
        let active = true;

        async function fetchOwnerReviews() {
            setReviewsLoading(true);
            try {
                const res = await api.get('/owner/reviews');
                if (!active) return;
                setReviewSummary(res.data.summary || {});
                setRecentReviews((res.data.reviews || []).slice(0, 3));
            } catch (error) {
                console.error('Failed to fetch overview review data:', error);
            } finally {
                if (active) setReviewsLoading(false);
            }
        }

        fetchOwnerReviews();
        return () => {
            active = false;
        };
    }, []);

    const today = startOfDay(new Date());
    const todaysOrders = useMemo(
        () => orders.filter((order) => sameDay(order.placedAt, today)),
        [orders, today]
    );
    const activeOrdersCount = useMemo(
        () => orders.filter((order) => !['Delivered', 'Cancelled'].includes(order.status)).length,
        [orders]
    );
    const todaysRevenue = useMemo(
        () => todaysOrders.reduce((sum, order) => sum + (Number(order.total) || 0), 0),
        [todaysOrders]
    );

    const stats = useMemo(() => ([
        {
            icon: <ShoppingBag size={18} color="#DC2626" />,
            label: "Today's Orders",
            value: String(todaysOrders.length),
            iconBg: '#FEF2F2',
        },
        {
            icon: <Package size={18} color="#DC2626" />,
            label: 'Active Orders',
            value: String(activeOrdersCount),
            iconBg: '#FEF2F2',
        },
        {
            icon: <DollarSign size={18} color="#DC2626" />,
            label: 'Revenue Today',
            value: peso.format(todaysRevenue),
            iconBg: '#FEF2F2',
        },
        {
            icon: <AlertCircle size={18} color="#DC2626" />,
            label: 'Awaiting Reply',
            value: String(reviewSummary.awaiting_reply || 0),
            iconBg: '#FEF2F2',
            badge: (reviewSummary.awaiting_reply || 0) > 0 ? 'Feedback' : null,
        },
    ]), [activeOrdersCount, reviewSummary.awaiting_reply, todaysOrders.length, todaysRevenue]);

    const chartData = useMemo(() => {
        const days = recentDays(7);
        const grouped = days.map((date) => {
            const dayOrders = orders.filter((order) => sameDay(order.placedAt, date));
            const revenue = dayOrders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
            return {
                key: date.toISOString(),
                date,
                day: date.toLocaleDateString('en-US', { weekday: 'short' }),
                orders: dayOrders.length,
                revenue,
            };
        });

        const maxRevenue = Math.max(...grouped.map((entry) => entry.revenue), 0);
        const previousRevenue = grouped.slice(0, -1).reduce((sum, entry) => sum + entry.revenue, 0);
        const currentRevenue = grouped.slice(1).reduce((sum, entry) => sum + entry.revenue, 0);

        return {
            bars: grouped.map((entry) => ({
                ...entry,
                height: maxRevenue > 0 ? Math.max((entry.revenue / maxRevenue) * 100, entry.revenue > 0 ? 10 : 0) : 0,
            })),
            maxRevenue,
            trend: previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : null,
        };
    }, [orders]);

    const popularItems = useMemo(() => {
        const counts = new Map();

        orders.forEach((order) => {
            order.items.forEach((item) => {
                const key = item.menuItemId || item.name;
                const current = counts.get(key) || {
                    id: key,
                    title: item.name,
                    image: item.image,
                    count: 0,
                    revenue: 0,
                    price: Number(item.price) || 0,
                };

                current.count += Number(item.quantity || item.qty || 0);
                current.revenue += (Number(item.price) || 0) * Number(item.quantity || item.qty || 0);
                if (!current.image && item.image) current.image = item.image;
                counts.set(key, current);
            });
        });

        const inventoryLookup = new Map(items.map((item) => [item.id, item]));

        return Array.from(counts.values())
            .map((item) => {
                const inventoryItem = inventoryLookup.get(item.id);
                return {
                    ...item,
                    title: inventoryItem?.title || item.title,
                    image: inventoryItem?.image || item.image || '/assets/images/service/placeholder.svg',
                    price: Number(inventoryItem?.price ?? item.price ?? 0),
                };
            })
            .sort((left, right) => right.count - left.count || right.revenue - left.revenue)
            .slice(0, 3);
    }, [items, orders]);

    return (
        <div className={styles.overviewContainer}>
            <div className={styles.statsGrid}>
                {stats.map((stat) => (
                    <div key={stat.label} className={styles.statCardNew}>
                        <div className={styles.statCardTopRow}>
                            <div className={styles.statIconWrapNew} style={{ background: stat.iconBg }}>
                                {stat.icon}
                            </div>
                            {stat.badge && (
                                <div className={styles.statBadgeCritical}>
                                    {stat.badge}
                                </div>
                            )}
                        </div>
                        <div className={styles.statBodyNew}>
                            <span className={styles.statLabelNew}>{stat.label}</span>
                            <span className={styles.statValueNew}>{stat.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.overviewMiddleRow}>
                <div className={styles.infoCardDesktop}>
                    <div className={styles.cardHeaderRow}>
                        <h3 className={styles.cardDesktopTitle}>Recent Orders</h3>
                        <button className={styles.btnViewAll} onClick={() => onNavigate?.('orders')}>View All</button>
                    </div>

                    <div className={styles.tableWrap}>
                        <table className={styles.recentOrdersTable}>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Items</th>
                                    <th>Status</th>
                                    <th>Time</th>
                                    <th className={styles.textRight}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.slice(0, 5).map((order) => {
                                    const meta = statusMeta(order.status);
                                    let statusPillClass = styles.pillNew;
                                    if (order.status === 'Order Confirmed') statusPillClass = styles.pillPreparing;
                                    if (order.status === 'Out for Delivery') statusPillClass = styles.pillReady;
                                    if (order.status === 'Delivered') statusPillClass = styles.pillDelivered;

                                    return (
                                        <tr key={order.id}>
                                            <td className={styles.orderIdCell}>{order.orderNumber || `#${order.id}`}</td>
                                            <td className={styles.itemsSummaryCell}>
                                                {order.items.map((item) => `${item.quantity || item.qty}x ${item.name}`).join(', ')}
                                            </td>
                                            <td>
                                                <span className={`${styles.statusPillSmall} ${statusPillClass}`}>{order.status}</span>
                                            </td>
                                            <td className={styles.timeCell}>{order.time}</td>
                                            <td className={styles.textRight}>
                                                <button className={styles.actionBtnOutline} onClick={() => onNavigate?.('orders')}>
                                                    {meta.nextLabel || 'View'}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {orders.length === 0 && (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', color: '#6B7280', padding: '1.5rem 0' }}>
                                            No orders yet. New customer orders will show here automatically.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className={styles.infoCardDesktop}>
                    <div className={styles.cardHeaderRow}>
                        <h3 className={styles.cardDesktopTitle}>Top Ordered Items</h3>
                        <button className={styles.btnViewAll} onClick={() => onNavigate?.('menu')}>View All</button>
                    </div>
                    <div className={styles.popularMenuList}>
                        {popularItems.length === 0 ? (
                            <div style={{ color: '#9CA3AF', fontSize: '0.85rem', textAlign: 'center', padding: '1.5rem 0' }}>
                                No ordered items yet. Once orders come in, your most popular dishes will appear here.
                            </div>
                        ) : (
                            popularItems.map((item) => (
                                <div key={item.id} className={styles.popularMenuItemRow}>
                                    <img src={item.image} alt={item.title} className={styles.popularMenuImg} />
                                    <div className={styles.popularMenuInfo}>
                                        <div className={styles.popularMenuTitle}>{item.title}</div>
                                        <div className={styles.popularMenuOrders}>{item.count} sold across customer orders</div>
                                    </div>
                                    <div className={styles.popularMenuPrice}>{peso.format(item.price)}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className={styles.overviewBottomRow}>
                <div className={styles.infoCardDesktop}>
                    <div className={styles.cardHeaderRow}>
                        <h3 className={styles.cardDesktopTitle}>Sales Revenue</h3>
                        <select className={styles.chartSelect} value="Last 7 days" readOnly>
                            <option>Last 7 days</option>
                        </select>
                    </div>
                    <div className={styles.chartWrapper}>
                        <div className={styles.chartYAxis}>
                            <span>{peso.format(chartData.maxRevenue)}</span>
                            <span>{peso.format(chartData.maxRevenue * 0.66)}</span>
                            <span>{peso.format(chartData.maxRevenue * 0.33)}</span>
                            <span>{peso.format(0)}</span>
                        </div>
                        <div className={styles.chartBars} style={{ gap: '6px' }}>
                            {chartData.bars.map((data, index) => (
                                <div key={data.key} className={styles.chartCol} style={{ flex: 1, position: 'relative' }}>
                                    <div
                                        className={styles.chartBar}
                                        style={{
                                            height: `${data.height}%`,
                                            background: hoveredBar === index
                                                ? 'linear-gradient(to bottom, #7F1D1D, #991B1B)'
                                                : 'linear-gradient(to bottom, #8B3A2A, #D4845A)',
                                            cursor: 'pointer',
                                            transition: 'background 0.2s ease',
                                            borderRadius: '4px 4px 0 0',
                                            position: 'relative',
                                        }}
                                        onMouseEnter={() => setHoveredBar(index)}
                                        onMouseLeave={() => setHoveredBar(null)}
                                    >
                                        {hoveredBar === index && (
                                            <div className={styles.chartTooltip}>
                                                <div className={styles.chartTooltipDate}>{data.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                                                <div className={styles.tooltipRow}>
                                                    <span className={styles.tooltipLabel}>Revenue</span>
                                                    <span className={styles.tooltipValue}>{peso.format(data.revenue)}</span>
                                                </div>
                                                <div className={styles.tooltipRow} style={{ marginBottom: '0.625rem' }}>
                                                    <span className={styles.tooltipLabel}>Orders</span>
                                                    <span className={styles.tooltipValue}>{data.orders}</span>
                                                </div>
                                                <div className={styles.trendBadgePositive} style={{ display: 'inline-block' }}>
                                                    {chartData.trend === null ? 'New activity' : `${chartData.trend >= 0 ? '↗' : '↘'} ${Math.abs(chartData.trend).toFixed(1)}% vs previous window`}
                                                </div>
                                                <div className={styles.tooltipArrow}></div>
                                            </div>
                                        )}
                                    </div>
                                    <span className={styles.chartDay}>{data.day}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.infoCardDesktop}>
                    <div className={styles.cardHeaderRow}>
                        <h3 className={styles.cardDesktopTitle}>Recent Reviews</h3>
                        <button className={styles.btnViewAll} onClick={() => onNavigate?.('reviews')}>View All</button>
                    </div>
                    <div className={styles.recentReviewsList}>
                        {reviewsLoading ? (
                            <div style={{ color: '#6B7280', fontSize: '0.85rem' }}>Loading recent feedback...</div>
                        ) : recentReviews.length === 0 ? (
                            <div style={{ color: '#9CA3AF', fontSize: '0.85rem', textAlign: 'center', padding: '1.5rem 0' }}>
                                No customer reviews yet for {store.branchName}.
                            </div>
                        ) : (
                            recentReviews.map((review) => (
                                <div key={review.id} className={styles.recentReviewCard}>
                                    <div className={styles.reviewCardHeaderRow}>
                                        <div className={styles.reviewAuthor}>
                                            <div
                                                className={styles.reviewAvatarSmall}
                                                style={{
                                                    display: 'grid',
                                                    placeItems: 'center',
                                                    background: '#F3F4F6',
                                                    color: '#6B7280',
                                                    fontWeight: 700,
                                                }}
                                            >
                                                {initials(review.customer_name)}
                                            </div>
                                            <div>
                                                <div className={styles.reviewAuthorName}>{review.customer_name}</div>
                                                <div style={{ fontSize: '.73rem', color: '#9CA3AF', marginTop: '2px' }}>
                                                    {review.created_at_label || review.created_at_human}
                                                </div>
                                            </div>
                                        </div>
                                        <StarRow rating={review.rating} />
                                    </div>
                                    <div className={styles.reviewTextSmall}>{review.review}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
