import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Download, Search, Wallet, Clock, DollarSign, TrendingUp, TrendingDown, ChevronDown } from 'lucide-react';
import api from '../../../api/axios';
import { resolveMediaUrl } from '../../../utils/media';
import styles from '../OwnerDashboard.module.css';

const peso = (v) => `₱${Number(v || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function EarningsSection({ onViewPayoutDetails }) {
    const [dateRange, setDateRange] = useState('30 days');
    const [hoveredBar, setHoveredBar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    const daysMap = { 'Today': 1, '7 days': 7, '30 days': 30, 'Custom': 30 };

    const fetchAnalytics = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get(`/owner/analytics?days=${daysMap[dateRange] || 30}`);
            setData(res.data);
        } catch (err) {
            console.error('Failed to fetch analytics:', err);
        } finally {
            setLoading(false);
        }
    }, [dateRange]);

    useEffect(() => { fetchAnalytics(); }, [fetchAnalytics]);

    const metrics = data?.metrics || {};
    const breakdown = data?.revenue_breakdown || {};
    const dailyRevenue = data?.daily_revenue || [];
    const topItems = data?.top_items || [];

    // Compute bar heights relative to max
    const maxRevenue = Math.max(...dailyRevenue.map(d => d.revenue), 1);

    // Only show every Nth label so it doesn't get cluttered
    const labelInterval = dailyRevenue.length > 14 ? 5 : dailyRevenue.length > 7 ? 3 : 1;
    const barsToShow = dailyRevenue.map((d, i) => ({
        ...d,
        showLabel: i % labelInterval === 0 || i === dailyRevenue.length - 1,
        height: Math.max((d.revenue / maxRevenue) * 100, d.revenue > 0 ? 8 : 0),
    }));

    // Y-axis labels
    const yMax = maxRevenue;
    const yLabels = [
        peso(yMax),
        peso(yMax * 0.66),
        peso(yMax * 0.33),
        peso(0),
    ];

    // Top items max for progress bar
    const topItemsMax = Math.max(...topItems.map(i => i.revenue), 1);

    const renderTrend = (value, trendStr) => {
        const isPositive = value >= 0;
        return (
            <div className={styles.earningTrendSubtext}>
                <span className={isPositive ? styles.earningTrendPos : styles.earningTrendNeg}>
                    {isPositive ? '↗' : '↘'} {trendStr}
                </span>
                <span className={styles.earningTrendLabel}>from last period</span>
            </div>
        );
    };

    return (
        <div className={styles.sectionContainer}>
            {/* Date Range Toggle Group */}
            <div className={styles.dateToggleGroup}>
                {['Today', '7 days', '30 days'].map(range => (
                    <React.Fragment key={range}>
                        <button
                            className={`${styles.dateToggleBtn} ${dateRange === range ? styles.active : ''}`}
                            onClick={() => setDateRange(range)}
                        >
                            {range}
                        </button>
                        {range !== '30 days' && <div className={styles.dateToggleDivider}></div>}
                    </React.Fragment>
                ))}
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>Loading analytics...</div>
            ) : (
                <>
                    {/* Top Metrics Cards */}
                    <div className={styles.earningsMetricsGrid}>
                        <div className={styles.earningsMetricCard}>
                            <div className={styles.earningIconWrap} style={{ background: '#FEF2F2', color: '#991B1B' }}>
                                <Wallet size={20} />
                            </div>
                            <div className={styles.earningMetricContent}>
                                <div className={styles.earningMetricLabel}>Period Revenue</div>
                                <div className={styles.earningMetricValue}>{peso(metrics.total_revenue)}</div>
                                {renderTrend(metrics.revenue_trend, `${metrics.revenue_trend > 0 ? '+' : ''}${metrics.revenue_trend}%`)}
                            </div>
                        </div>

                        <div className={styles.earningsMetricCard}>
                            <div className={styles.earningIconWrap} style={{ background: '#FEF2F2', color: '#991B1B' }}>
                                <Clock size={20} />
                            </div>
                            <div className={styles.earningMetricContent}>
                                <div className={styles.earningMetricLabel}>Pending Balance</div>
                                <div className={styles.earningMetricValue}>{peso(metrics.pending_revenue)}</div>
                                <div className={styles.earningTrendSubtext}>
                                    <span className={styles.earningTrendLabel}>{metrics.total_orders - (data?.high_value_orders?.length || 0)} orders in progress</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.earningsMetricCard}>
                            <div className={styles.earningIconWrap} style={{ background: '#FEF2F2', color: '#991B1B' }}>
                                <DollarSign size={20} />
                            </div>
                            <div className={styles.earningMetricContent}>
                                <div className={styles.earningMetricLabel}>All-Time Earnings</div>
                                <div className={styles.earningMetricValue}>{peso(metrics.all_time_revenue)}</div>
                                <div className={styles.earningTrendSubtext}>
                                    <span className={styles.earningTrendPos}>↗ +{metrics.revenue_trend > 0 ? metrics.revenue_trend : 0}%</span>
                                    <span className={styles.earningTrendLabel}>vs previous period</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h3 className={styles.revenueBreakdownTitle}>Revenue Breakdown</h3>
                    <div className={styles.revenueBreakdownGrid}>
                        <div className={styles.analyticsMetricCard}>
                            <div className={styles.metricLabel}>Total Food Sales</div>
                            <div className={styles.metricBigValue}>{peso(breakdown.food_sales)}</div>
                        </div>
                        <div className={styles.analyticsMetricCard}>
                            <div className={styles.metricLabel}>Platform Fees (15%)</div>
                            <div className={styles.metricBigValue} style={{ color: '#DC2626' }}>-{peso(breakdown.platform_fees)}</div>
                        </div>
                        <div className={styles.analyticsMetricCard}>
                            <div className={styles.metricLabel}>Taxes (5%)</div>
                            <div className={styles.metricBigValue} style={{ color: '#DC2626' }}>-{peso(breakdown.taxes)}</div>
                        </div>
                        <div className={styles.analyticsMetricCard}>
                            <div className={styles.metricLabel}>Net Revenue</div>
                            <div className={styles.metricBigValue}>{peso(breakdown.net_revenue)}</div>
                        </div>
                    </div>

                    <div className={styles.analyticsGridMain}>
                        {/* Daily Revenue Trends Chart */}
                        <div className={styles.cardSection}>
                            <div className={styles.chartHeader}>
                                <h3 className={styles.chartTitle}>Daily Revenue Trends</h3>
                                <div className={styles.chartLegendWrap}>
                                    <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>Last {daysMap[dateRange]} days</span>
                                </div>
                            </div>

                            <div className={styles.barChartContainer} style={{ marginTop: '1.5rem', height: '220px' }}>
                                <div className={styles.yAxisLabels}>
                                    {yLabels.map((l, i) => <span key={i}>{l}</span>)}
                                </div>

                                <div className={styles.chartBarsArea}>
                                    <div className={styles.chartGridLines}>
                                        {yLabels.map((_, i) => <div key={i} className={styles.gridLine}></div>)}
                                    </div>

                                    <div className={styles.barColumnsContainer}>
                                        {barsToShow.map((bar, idx) => (
                                            <div key={idx} className={styles.barColumnWrapper} style={{ width: 'auto', flex: 1 }}>
                                                <div className={styles.barTrack} style={{ width: '100%', margin: '0 2px', marginBottom: '8px' }}>
                                                    <div
                                                        className={styles.barCurrent}
                                                        style={{
                                                            height: `${bar.height}%`,
                                                            background: hoveredBar === idx
                                                                ? 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)'
                                                                : 'linear-gradient(135deg, #F87171 0%, #DC2626 100%)',
                                                            boxShadow: hoveredBar === idx ? '0 -4px 12px rgba(220, 38, 38, 0.4)' : 'none',
                                                            borderTopLeftRadius: '6px',
                                                            borderTopRightRadius: '6px',
                                                            borderBottomLeftRadius: '2px',
                                                            borderBottomRightRadius: '2px',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
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
                                                <div className={styles.barXLabel} style={{ minHeight: '16px', fontSize: '0.65rem', fontWeight: 600, color: hoveredBar === idx ? '#111827' : '#6B7280', transition: 'color 0.2s' }}>
                                                    {bar.showLabel ? bar.day : ''}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Top Selling Items by Revenue */}
                        <div className={styles.cardSection} style={{ background: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
                            <div className={styles.chartHeader} style={{ marginBottom: '1.5rem', padding: '1.5rem 1.5rem 0' }}>
                                <h3 className={styles.chartTitle}>Top Selling Items by Revenue</h3>
                            </div>

                            <div className={styles.topSellingList} style={{ padding: '0 1.5rem 1.5rem' }}>
                                {topItems.length === 0 ? (
                                    <div style={{ textAlign: 'center', color: '#9ca3af', padding: '2rem', fontSize: '0.9rem' }}>No sales data yet</div>
                                ) : topItems.map((item, i) => (
                                    <div key={i} className={styles.topSellingItem} style={{ padding: '0.75rem 0', borderBottom: i === topItems.length - 1 ? 'none' : '1px solid #F3F4F6' }}>
                                        {item.image ? (
                                            <img src={resolveMediaUrl(item.image)} alt={item.name} className={styles.topSellingImg} style={{ borderRadius: '10px', width: '50px', height: '50px', objectFit: 'cover' }} />
                                        ) : (
                                            <div className={styles.topSellingImg} style={{ background: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 'bold', color: '#9CA3AF', borderRadius: '10px', width: '50px', height: '50px' }}>
                                                {item.name?.charAt(0)}
                                            </div>
                                        )}
                                        <div className={styles.topSellingDetails} style={{ flex: 1, marginLeft: '1rem' }}>
                                            <div className={styles.topSellingRow} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                <span className={styles.topSellingName} style={{ fontWeight: 600, fontSize: '0.95rem', color: '#111827' }}>{item.name}</span>
                                                <span className={styles.topSellingCount} style={{ fontWeight: 700, fontSize: '0.95rem', color: '#DC2626' }}>{peso(item.revenue)}</span>
                                            </div>
                                            <div className={styles.progressBarBg} style={{ height: '6px', background: '#FEE2E2', borderRadius: '4px', overflow: 'hidden' }}>
                                                <div
                                                    className={styles.progressBarFill}
                                                    style={{ width: `${(item.revenue / topItemsMax) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #F87171 0%, #DC2626 100%)', borderRadius: '4px', transition: 'width 1s ease-out' }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Recent Payouts (still placeholder — no payout system yet) */}
                    <div className={styles.cardSection} style={{ marginTop: '1.25rem' }}>
                        <div className={styles.chartHeader} style={{ marginBottom: '1.5rem' }}>
                            <h3 className={styles.chartTitle}>Recent Payouts</h3>
                            <button className={styles.textBtn}>View All</button>
                        </div>

                        <div style={{ textAlign: 'center', color: '#9ca3af', padding: '2rem', fontSize: '0.9rem' }}>
                            Payout history will appear here once the payout system is configured.
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default EarningsSection;
