import React, { useState } from 'react';
import { ShoppingBag, Package, DollarSign, AlertCircle, TrendingUp, TrendingDown, Star } from 'lucide-react';
import { statusMeta } from './shared';
import styles from '../OwnerDashboard.module.css';

export default function OverviewSection({ store, orders }) {
    const [hoveredBar, setHoveredBar] = useState(null);

    const salesBarData = [
        { day: 'Mon', revenue: '$3,000', orders: 24, current: 20, trend: '+5%' },
        { day: 'Tue', revenue: '$9,750', orders: 68, current: 65, trend: '+18%' },
        { day: 'Wed', revenue: '$5,250', orders: 42, current: 35, trend: '+8%' },
        { day: 'Thu', revenue: '$8,250', orders: 58, current: 55, trend: '+12%' },
        { day: 'Fri', revenue: '$6,000', orders: 48, current: 40, trend: '+9%' },
        { day: 'Sat', revenue: '$11,250', orders: 86, current: 75, trend: '+22%' },
        { day: 'Sun', revenue: '$13,500', orders: 102, current: 90, trend: '+28%' },
    ];

    // Example metrics mapping to the design shown
    const stats = [
        {
            icon: <ShoppingBag size={18} color="#DC2626" />,
            label: "Today's Orders",
            value: '142',
            trend: '+12%',
            trendUp: true,
            iconBg: '#FEF2F2'
        },
        {
            icon: <Package size={18} color="#DC2626" />,
            label: 'Active Orders',
            value: '12',
            trend: '+8%',
            trendUp: true,
            iconBg: '#FEF2F2'
        },
        {
            icon: <DollarSign size={18} color="#DC2626" />,
            label: "Revenue Today",
            value: `$2,450.00`,
            trend: '-12%',
            trendUp: false,
            iconBg: '#FEF2F2'
        },
        {
            icon: <AlertCircle size={18} color="#DC2626" />,
            label: 'Inventory Alerts',
            value: '5',
            badge: 'Critical',
            iconBg: '#FEF2F2'
        },
    ];

    return (
        <div className={styles.overviewContainer}>
            {/* Stat Cards */}
            <div className={styles.statsGrid}>
                {stats.map(s => (
                    <div key={s.label} className={styles.statCardNew}>
                        <div className={styles.statCardTopRow}>
                            <div className={styles.statIconWrapNew} style={{ background: s.iconBg }}>
                                {s.icon}
                            </div>
                            {s.trend && (
                                <div className={`${styles.statTrend} ${s.trendUp ? styles.trendUp : styles.trendDown}`}>
                                    {s.trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />} {s.trend}
                                </div>
                            )}
                            {s.badge && (
                                <div className={styles.statBadgeCritical}>
                                    {s.badge}
                                </div>
                            )}
                        </div>
                        <div className={styles.statBodyNew}>
                            <span className={styles.statLabelNew}>{s.label}</span>
                            <span className={styles.statValueNew}>{s.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Middle Row: Recent Orders and Popular Menu */}
            <div className={styles.overviewMiddleRow}>
                {/* Recent Orders List */}
                <div className={styles.infoCardDesktop}>
                    <div className={styles.cardHeaderRow}>
                        <h3 className={styles.cardDesktopTitle}>Recent Orders</h3>
                        <button className={styles.btnViewAll}>View All</button>
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
                                {orders.slice(0, 3).map(o => {
                                    const m = statusMeta(o.status);
                                    let statusPillClass = styles.pillPending;
                                    if (o.status === 'Preparing') statusPillClass = styles.pillPreparing;
                                    if (o.status === 'Delivering') statusPillClass = styles.pillDelivering;
                                    if (o.status === 'Delivered') statusPillClass = styles.pillDelivered;

                                    return (
                                        <tr key={o.id}>
                                            <td className={styles.orderIdCell}>{o.id}</td>
                                            <td className={styles.itemsSummaryCell}>
                                                {o.items.map(it => `${it.qty}x ${it.name}`).join(', ')}
                                            </td>
                                            <td>
                                                <span className={`${styles.statusPillSmall} ${statusPillClass}`}>{o.status}</span>
                                            </td>
                                            <td className={styles.timeCell}>{o.time}</td>
                                            <td className={styles.textRight}>
                                                <button className={styles.actionBtnOutline}>{m.nextLabel || 'View'}</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Popular Menu List */}
                <div className={styles.infoCardDesktop}>
                    <div className={styles.cardHeaderRow}>
                        <h3 className={styles.cardDesktopTitle}>Popular Menu</h3>
                        <button className={styles.btnViewAll}>View All</button>
                    </div>
                    <div className={styles.popularMenuList}>
                        {store.menuItems.slice(0, 3).map(item => (
                            <div key={item.id} className={styles.popularMenuItemRow}>
                                <img src={item.image} alt={item.title} className={styles.popularMenuImg} />
                                <div className={styles.popularMenuInfo}>
                                    <div className={styles.popularMenuTitle}>{item.title}</div>
                                    <div className={styles.popularMenuOrders}>
                                        {Math.floor(Math.random() * 300) + 50} orders this week
                                    </div>
                                </div>
                                <div className={styles.popularMenuPrice}>${item.price.toFixed(2)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Row: Sales Revenue & Recent Reviews */}
            <div className={styles.overviewBottomRow}>
                {/* Sales Revenue Chart (Mock) */}
                <div className={styles.infoCardDesktop}>
                    <div className={styles.cardHeaderRow}>
                        <h3 className={styles.cardDesktopTitle}>Sales Revenue</h3>
                        <select className={styles.chartSelect}>
                            <option>Last 7 days</option>
                            <option>This Month</option>
                        </select>
                    </div>
                    <div className={styles.chartWrapper}>
                        <div className={styles.chartYAxis}>
                            <span>$15k</span>
                            <span>$10k</span>
                            <span>$5k</span>
                            <span>0</span>
                        </div>
                        <div className={styles.chartBars} style={{ gap: '6px' }}>
                            {salesBarData.map((data, idx) => (
                                <div key={idx} className={styles.chartCol} style={{ flex: 1, position: 'relative' }}>
                                    <div
                                        className={styles.chartBar}
                                        style={{
                                            height: `${data.current}%`,
                                            background: hoveredBar === idx
                                                ? 'linear-gradient(to bottom, #7F1D1D, #991B1B)'
                                                : 'linear-gradient(to bottom, #8B3A2A, #D4845A)',
                                            cursor: 'pointer',
                                            transition: 'background 0.2s ease',
                                            borderRadius: '4px 4px 0 0',
                                            position: 'relative',
                                        }}
                                        onMouseEnter={() => setHoveredBar(idx)}
                                        onMouseLeave={() => setHoveredBar(null)}
                                    >
                                        {hoveredBar === idx && (
                                            <div className={styles.chartTooltip}>
                                                <div className={styles.chartTooltipDate}>{data.day}</div>
                                                <div className={styles.tooltipRow}>
                                                    <span className={styles.tooltipLabel}>Revenue</span>
                                                    <span className={styles.tooltipValue}>{data.revenue}</span>
                                                </div>
                                                <div className={styles.tooltipRow} style={{ marginBottom: '0.625rem' }}>
                                                    <span className={styles.tooltipLabel}>Orders</span>
                                                    <span className={styles.tooltipValue}>{data.orders}</span>
                                                </div>
                                                <div className={styles.trendBadgePositive} style={{ display: 'inline-block' }}>
                                                    ↗ {data.trend} vs last week
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

                {/* Recent Reviews */}
                <div className={styles.infoCardDesktop}>
                    <div className={styles.cardHeaderRow}>
                        <h3 className={styles.cardDesktopTitle}>Recent Reviews</h3>
                        <button className={styles.btnViewAll}>View All</button>
                    </div>
                    <div className={styles.recentReviewsList}>
                        {[
                            { id: 1, name: 'Maria L.', rating: 5, text: 'The Lumpiang Shanghai is so crispy and still hot when it arrived! SM Baguio branch never fails to deliver quality food.', img: 'https://i.pravatar.cc/100?u=1' },
                            { id: 2, name: 'James T.', rating: 4, text: 'Great food as always. Delivery was a bit slow today due to the rain, but the rider was very polite.', img: 'https://i.pravatar.cc/100?u=2' },
                        ].map(rev => (
                            <div key={rev.id} className={styles.recentReviewCard}>
                                <div className={styles.reviewCardHeaderRow}>
                                    <div className={styles.reviewAuthor}>
                                        <img src={rev.img} alt={rev.name} className={styles.reviewAvatarSmall} />
                                        <span className={styles.reviewAuthorName}>{rev.name}</span>
                                    </div>
                                    <div className={styles.reviewStarsSmall}>
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} fill={'none'} color="#F5A623" />)}
                                    </div>
                                </div>
                                <div className={styles.reviewTextSmall}>{rev.text}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

