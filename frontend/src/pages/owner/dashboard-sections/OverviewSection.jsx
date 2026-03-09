import React from 'react';
import { ShoppingBag, Package, DollarSign, AlertCircle, TrendingUp, TrendingDown, Star } from 'lucide-react';
import { statusMeta } from './shared';
import styles from '../OwnerDashboard.module.css';

export default function OverviewSection({ store, orders }) {
    const pending = orders.filter(o => o.status === 'Pending').length;
    const todayRev = orders.filter(o => o.status === 'Delivered').reduce((s, o) => s + o.total, 0);

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
                        <div className={styles.chartBars}>
                            {/* Mon - Sun */}
                            <div className={styles.chartCol}><div className={styles.chartBar} style={{ height: '20%' }}></div><span className={styles.chartDay}>Mon</span></div>
                            <div className={styles.chartCol}><div className={styles.chartBar} style={{ height: '65%' }}></div><span className={styles.chartDay}>Tue</span></div>
                            <div className={styles.chartCol}><div className={styles.chartBar} style={{ height: '35%' }}></div><span className={styles.chartDay}>Wed</span></div>
                            <div className={styles.chartCol}><div className={styles.chartBar} style={{ height: '55%' }}></div><span className={styles.chartDay}>Thu</span></div>
                            <div className={styles.chartCol}><div className={styles.chartBar} style={{ height: '40%' }}></div><span className={styles.chartDay}>Fri</span></div>
                            <div className={styles.chartCol}><div className={styles.chartBar} style={{ height: '75%' }}></div><span className={styles.chartDay}>Sat</span></div>
                            <div className={styles.chartCol}><div className={styles.chartBar} style={{ height: '90%' }}></div><span className={styles.chartDay}>Sun</span></div>
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
