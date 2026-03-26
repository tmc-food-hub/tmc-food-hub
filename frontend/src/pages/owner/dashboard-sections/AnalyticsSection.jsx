import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Download, Search, Check, ChevronDown } from 'lucide-react';
import api from '../../../api/axios';
import { resolveMediaUrl } from '../../../utils/media';
import styles from '../OwnerDashboard.module.css';

const peso = (v) => `₱${Number(v || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function AnalyticsSection() {
    const [hoveredBar, setHoveredBar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [days, setDays] = useState(7);

    const fetchAnalytics = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get(`/owner/analytics?days=${days}`);
            setData(res.data);
        } catch (err) {
            console.error('Failed to fetch analytics:', err);
        } finally {
            setLoading(false);
        }
    }, [days]);

    useEffect(() => { fetchAnalytics(); }, [fetchAnalytics]);

    const metrics = data?.metrics || {};
    const dailyRevenue = data?.daily_revenue || [];
    const topItems = data?.top_items || [];
    const heatmap = data?.heatmap || [];
    const highValueOrders = data?.high_value_orders || [];

    // Bar chart
    const maxRevenue = Math.max(...dailyRevenue.map(d => d.revenue), 1);
    const yMax = maxRevenue;
    const yLabels = [peso(yMax), peso(yMax * 0.75), peso(yMax * 0.5), peso(yMax * 0.25), peso(0)];

    const topItemsMax = Math.max(...topItems.map(i => i.orders), 1);

    // Status class mapping
    const statusClassMap = {
        'Pending': 'statusPending',
        'Order Confirmed': 'statusInProgress',
        'Out for Delivery': 'statusInProgress',
        'Delivered': 'statusDelivered',
        'Cancelled': 'statusCancelled',
    };

    return (
        <div className={styles.sectionContainer}>
            {/* Header Actions */}
            <div className={styles.sectionHeader} style={{ justifyContent: 'flex-end' }}>
                <div className={styles.headerActions}>
                    <button
                        className={`${styles.analyticsFilterBtn} ${days === 7 ? styles.active : ''}`}
                        onClick={() => setDays(7)}
                        style={{ marginRight: '0.5rem' }}
                    >
                        <span>Last 7 days</span>
                    </button>
                    <button
                        className={`${styles.analyticsFilterBtn} ${days === 30 ? styles.active : ''}`}
                        onClick={() => setDays(30)}
                    >
                        <span>Last 30 days</span>
                    </button>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>Loading analytics...</div>
            ) : (
                <>
                    {/* Metrics Grid */}
                    <div className={styles.analyticsMetricsGrid}>
                        <div className={styles.analyticsMetricCard}>
                            <div className={styles.metricHeaderRow}>
                                <span className={styles.metricLabel}>Total Revenue</span>
                                <span className={metrics.revenue_trend >= 0 ? styles.trendBadgePositive : styles.trendBadgeNegative}>
                                    {metrics.revenue_trend >= 0 ? '↗' : '↘'} {metrics.revenue_trend > 0 ? '+' : ''}{metrics.revenue_trend}%
                                </span>
                            </div>
                            <div className={styles.metricBigValue}>{peso(metrics.total_revenue)}</div>
                            <div className={styles.metricSubtext}>vs. {peso(metrics.prev_revenue)} last period</div>
                        </div>
                        <div className={styles.analyticsMetricCard}>
                            <div className={styles.metricHeaderRow}>
                                <span className={styles.metricLabel}>Avg. Order Value</span>
                                <span className={metrics.avg_trend >= 0 ? styles.trendBadgePositive : styles.trendBadgeNegative}>
                                    {metrics.avg_trend >= 0 ? '↗' : '↘'} {metrics.avg_trend > 0 ? '+' : ''}{metrics.avg_trend}%
                                </span>
                            </div>
                            <div className={styles.metricBigValue}>{peso(metrics.avg_order_value)}</div>
                            <div className={styles.metricSubtext}>from {metrics.total_orders} orders</div>
                        </div>
                        <div className={styles.analyticsMetricCard}>
                            <div className={styles.metricHeaderRow}>
                                <span className={styles.metricLabel}>Total Orders</span>
                                <span className={metrics.orders_trend >= 0 ? styles.trendBadgePositive : styles.trendBadgeNegative}>
                                    {metrics.orders_trend >= 0 ? '↗' : '↘'} {metrics.orders_trend > 0 ? '+' : ''}{metrics.orders_trend}%
                                </span>
                            </div>
                            <div className={styles.metricBigValue}>{metrics.total_orders.toLocaleString()}</div>
                            <div className={styles.metricSubtext}>vs. {metrics.prev_orders} last period</div>
                        </div>
                        <div className={styles.analyticsMetricCard}>
                            <div className={styles.metricHeaderRow}>
                                <span className={styles.metricLabel}>Unique Customers</span>
                                <span className={metrics.customers_trend >= 0 ? styles.trendBadgePositive : styles.trendBadgeNegative}>
                                    {metrics.customers_trend >= 0 ? '↗' : '↘'} {metrics.customers_trend > 0 ? '+' : ''}{metrics.customers_trend}%
                                </span>
                            </div>
                            <div className={styles.metricBigValue}>{metrics.new_customers}</div>
                            <div className={styles.metricSubtext}>vs. {metrics.prev_customers} last period</div>
                        </div>
                    </div>

                    <div className={styles.analyticsGridMain}>
                        {/* Sales Revenue Chart */}
                        <div className={styles.cardSection}>
                            <div className={styles.chartHeader}>
                                <h3 className={styles.chartTitle}>Sales Revenue</h3>
                                <div className={styles.chartLegendWrap}>
                                    <div className={styles.legendItem}>
                                        <span className={styles.legendDot} style={{ background: '#991B1B' }}></span> Revenue
                                    </div>
                                </div>
                            </div>

                            <div className={styles.chartBigValue}>{peso(metrics.total_revenue)}</div>

                            <div className={styles.barChartContainer}>
                                <div className={styles.yAxisLabels}>
                                    {yLabels.map((l, i) => <span key={i}>{l}</span>)}
                                </div>

                                <div className={styles.chartBarsArea}>
                                    <div className={styles.chartGridLines}>
                                        {yLabels.map((_, i) => <div key={i} className={styles.gridLine}></div>)}
                                    </div>

                                    <div className={styles.barColumnsContainer}>
                                        {dailyRevenue.map((bar, idx) => {
                                            const barHeight = Math.max((bar.revenue / maxRevenue) * 100, bar.revenue > 0 ? 8 : 0);
                                            return (
                                                <div key={idx} className={styles.barColumnWrapper}>
                                                    <div className={styles.barTrack}>
                                                        <div
                                                            className={styles.barCurrent}
                                                            style={{
                                                                height: `${barHeight}%`,
                                                                background: hoveredBar === idx
                                                                    ? 'linear-gradient(to bottom, #7F1D1D, #991B1B)'
                                                                    : 'linear-gradient(to bottom, #8B3A2A, #D4845A)',
                                                                cursor: 'pointer',
                                                                transition: 'background 0.2s ease',
                                                                borderTopLeftRadius: '4px',
                                                                borderTopRightRadius: '4px',
                                                            }}
                                                            onMouseEnter={() => setHoveredBar(idx)}
                                                            onMouseLeave={() => setHoveredBar(null)}
                                                        >
                                                            {hoveredBar === idx && (
                                                                <div className={styles.chartTooltip}>
                                                                    <div className={styles.chartTooltipDate}>{bar.date}</div>
                                                                    <div className={styles.tooltipRow}>
                                                                        <span className={styles.tooltipLabel}>Revenue</span>
                                                                        <span className={styles.tooltipValue}>{peso(bar.revenue)}</span>
                                                                    </div>
                                                                    <div className={styles.tooltipRow} style={{ marginBottom: '0.625rem' }}>
                                                                        <span className={styles.tooltipLabel}>Orders</span>
                                                                        <span className={styles.tooltipValue}>{bar.orders}</span>
                                                                    </div>
                                                                    <div className={styles.tooltipArrow}></div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className={styles.barXLabel}>{bar.day}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Top Selling Items */}
                        <div className={styles.cardSection}>
                            <div className={styles.chartHeader} style={{ marginBottom: '1.5rem' }}>
                                <h3 className={styles.chartTitle}>Top Selling Items</h3>
                            </div>

                            <div className={styles.topSellingList}>
                                {topItems.length === 0 ? (
                                    <div style={{ textAlign: 'center', color: '#9ca3af', padding: '2rem', fontSize: '0.9rem' }}>No sales data yet</div>
                                ) : topItems.map((item, i) => (
                                    <div key={i} className={styles.topSellingItem}>
                                        {item.image ? (
                                            <img src={resolveMediaUrl(item.image)} alt={item.name} className={styles.topSellingImg} />
                                        ) : (
                                            <div className={styles.topSellingImg} style={{ background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#9ca3af', borderRadius: '8px' }}>
                                                {item.name?.charAt(0)}
                                            </div>
                                        )}
                                        <div className={styles.topSellingDetails}>
                                            <div className={styles.topSellingRow}>
                                                <span className={styles.topSellingName}>{item.name}</span>
                                                <span className={styles.topSellingCount}>{item.orders} sold</span>
                                            </div>
                                            <div className={styles.progressBarBg}>
                                                <div
                                                    className={styles.progressBarFill}
                                                    style={{ width: `${(item.orders / topItemsMax) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className={styles.analyticsGridBottom}>
                        {/* Order Patterns Heatmap */}
                        <div className={styles.cardSection}>
                            <div className={styles.chartHeader} style={{ marginBottom: '0.25rem' }}>
                                <h3 className={styles.chartTitle}>Order Patterns</h3>
                            </div>
                            <p className={styles.sectionSubtitle} style={{ marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                                Peak hours vs. day of week
                            </p>

                            <div className={styles.heatmapContainer}>
                                <div className={styles.heatmapRow}>
                                    <div className={styles.heatmapLabel}>Hour</div>
                                    <div className={styles.heatmapHour}>10AM</div>
                                    <div className={styles.heatmapHour}>12PM</div>
                                    <div className={styles.heatmapHour}>2PM</div>
                                    <div className={styles.heatmapHour}>4PM</div>
                                    <div className={styles.heatmapHour}>6PM</div>
                                    <div className={styles.heatmapHour}>8PM</div>
                                    <div className={styles.heatmapHour}>10PM</div>
                                </div>

                                {heatmap.map(row => (
                                    <div key={row.day} className={styles.heatmapRow}>
                                        <div className={styles.heatmapLabel}>{row.day}</div>
                                        {row.data.map((val, idx) => (
                                            <div key={idx} className={`${styles.heatmapCell} ${styles[`heatLevel${val}`]}`}></div>
                                        ))}
                                    </div>
                                ))}

                                <div className={styles.heatmapLegend}>
                                    <span>Low Volume</span>
                                    <div className={`${styles.heatmapCellSmall} ${styles.heatLevel1}`}></div>
                                    <div className={`${styles.heatmapCellSmall} ${styles.heatLevel2}`}></div>
                                    <div className={`${styles.heatmapCellSmall} ${styles.heatLevel3}`}></div>
                                    <div className={`${styles.heatmapCellSmall} ${styles.heatLevel4}`}></div>
                                    <span>High Volume</span>
                                </div>
                            </div>
                        </div>

                        {/* Recent High Value Orders */}
                        <div className={styles.cardSection}>
                            <div className={styles.chartHeader} style={{ marginBottom: '1.5rem' }}>
                                <h3 className={styles.chartTitle}>Recent High Value Orders</h3>
                            </div>

                            <div className={styles.highValueTableWrap}>
                                <table className={styles.highValueTable}>
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Customer</th>
                                            <th>Total</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {highValueOrders.length === 0 ? (
                                            <tr><td colSpan="4" style={{ textAlign: 'center', color: '#9ca3af', padding: '2rem' }}>No orders yet</td></tr>
                                        ) : highValueOrders.map(order => (
                                            <tr key={order.id}>
                                                <td className={styles.highValueId}>{order.id}</td>
                                                <td>
                                                    <div className={styles.customerCell}>
                                                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: '#6b7280', flexShrink: 0 }}>
                                                            {(order.customer || 'G').charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className={styles.customerName}>{order.customer}</span>
                                                    </div>
                                                </td>
                                                <td className={styles.highValueTotal}>{peso(order.total)}</td>
                                                <td>
                                                    <span className={`${styles.statusBadge} ${styles[statusClassMap[order.status] || 'statusPending']}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default AnalyticsSection;
