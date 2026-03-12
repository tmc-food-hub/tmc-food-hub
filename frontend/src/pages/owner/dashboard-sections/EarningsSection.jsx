import React, { useState } from 'react';
import { Calendar, Download, Search, Wallet, Clock, DollarSign, TrendingUp, TrendingDown, ChevronDown } from 'lucide-react';
import styles from '../OwnerDashboard.module.css';

function EarningsSection({ onViewPayoutDetails }) {
    const [dateRange, setDateRange] = useState('Today');
    const [hoveredBar, setHoveredBar] = useState(null);

    const revenueBarData = [
        { day: '', current: 15, date: 'Feb 13, 2026', revenue: '$2,250', orders: 12, trend: '+5%' },
        { day: 'Feb 15', current: 22, date: 'Feb 15, 2026', revenue: '$3,300', orders: 18, trend: '+8%' },
        { day: '', current: 10, date: 'Feb 16, 2026', revenue: '$1,500', orders: 8, trend: '-3%' },
        { day: '', current: 35, date: 'Feb 17, 2026', revenue: '$5,250', orders: 26, trend: '+15%' },
        { day: 'Feb 20', current: 25, date: 'Feb 20, 2026', revenue: '$3,750', orders: 20, trend: '+4%' },
        { day: '', current: 48, date: 'Feb 21, 2026', revenue: '$7,200', orders: 35, trend: '+18%' },
        { day: '', current: 40, date: 'Feb 22, 2026', revenue: '$6,000', orders: 30, trend: '+10%' },
        { day: '', current: 55, date: 'Feb 23, 2026', revenue: '$8,250', orders: 38, trend: '+14%' },
        { day: 'Feb 25', current: 75, date: 'Feb 25, 2026', revenue: '$8,450', orders: 42, trend: '+12%' },
        { day: '', current: 60, date: 'Feb 27, 2026', revenue: '$9,000', orders: 40, trend: '+9%' },
        { day: '', current: 70, date: 'Mar 1, 2026', revenue: '$10,500', orders: 45, trend: '+20%' },
        { day: 'Mar 5', current: 55, date: 'Mar 5, 2026', revenue: '$8,250', orders: 36, trend: '+6%' },
        { day: '', current: 80, date: 'Mar 7, 2026', revenue: '$12,000', orders: 52, trend: '+22%' },
        { day: '', current: 48, date: 'Mar 8, 2026', revenue: '$7,200', orders: 34, trend: '+7%' }
    ];

    const renderTrend = (value, trendStr) => {
        const isPositive = value >= 0;
        return (
            <div className={styles.earningTrendSubtext}>
                <span className={isPositive ? styles.earningTrendPos : styles.earningTrendNeg}>
                    {isPositive ? '↗' : '↘'} {trendStr}
                </span>
                <span className={styles.earningTrendLabel}>from last week</span>
            </div>
        );
    };

    return (
        <div className={styles.sectionContainer}>
            {/* Date Range Toggle Group */}
            <div className={styles.dateToggleGroup}>
                <button
                    className={`${styles.dateToggleBtn} ${dateRange === 'Today' ? styles.active : ''}`}
                    onClick={() => setDateRange('Today')}
                >
                    Today
                </button>
                <div className={styles.dateToggleDivider}></div>
                <button
                    className={`${styles.dateToggleBtn} ${dateRange === '7 days' ? styles.active : ''}`}
                    onClick={() => setDateRange('7 days')}
                >
                    7 days
                </button>
                <div className={styles.dateToggleDivider}></div>
                <button
                    className={`${styles.dateToggleBtn} ${dateRange === '30 days' ? styles.active : ''}`}
                    onClick={() => setDateRange('30 days')}
                >
                    30 days
                </button>
                <div className={styles.dateToggleDivider}></div>
                <button
                    className={`${styles.dateToggleBtn} ${dateRange === 'Custom' ? styles.active : ''}`}
                    onClick={() => setDateRange('Custom')}
                >
                    Custom <Calendar size={14} style={{ marginLeft: '4px' }} />
                </button>
            </div>

            {/* Top Metrics Cards */}
            <div className={styles.earningsMetricsGrid}>
                {/* Available Balance */}
                <div className={styles.earningsMetricCard}>
                    <div className={styles.earningIconWrap} style={{ background: '#FEF2F2', color: '#991B1B' }}>
                        <Wallet size={20} />
                    </div>
                    <div className={styles.earningMetricContent}>
                        <div className={styles.earningMetricLabel}>Available Balance</div>
                        <div className={styles.earningMetricValue}>$12,450.00</div>
                        {renderTrend(2.4, '+2.4%')}
                    </div>
                </div>

                {/* Pending Balance */}
                <div className={styles.earningsMetricCard}>
                    <div className={styles.earningIconWrap} style={{ background: '#FEF2F2', color: '#991B1B' }}>
                        <Clock size={20} />
                    </div>
                    <div className={styles.earningMetricContent}>
                        <div className={styles.earningMetricLabel}>Pending Balance</div>
                        <div className={styles.earningMetricValue}>$4,120.00</div>
                        {renderTrend(1.2, '+1.2%')}
                    </div>
                </div>

                {/* Total Earnings */}
                <div className={styles.earningsMetricCard}>
                    <div className={styles.earningIconWrap} style={{ background: '#FEF2F2', color: '#991B1B' }}>
                        <DollarSign size={20} />
                    </div>
                    <div className={styles.earningMetricContent}>
                        <div className={styles.earningMetricLabel}>Total Earnings</div>
                        <div className={styles.earningMetricValue}>$156,780.00</div>
                        <div className={styles.earningTrendSubtext}>
                            <span className={styles.earningTrendPos}>↗ +12.5%</span>
                            <span className={styles.earningTrendLabel}>vs previous period</span>
                        </div>
                    </div>
                </div>
            </div>

            <h3 className={styles.revenueBreakdownTitle}>Revenue Breakdown</h3>
            <div className={styles.revenueBreakdownGrid}>
                <div className={styles.analyticsMetricCard}>
                    <div className={styles.metricLabel}>Total Food Sales</div>
                    <div className={styles.metricBigValue}>$184,200.00</div>
                </div>
                <div className={styles.analyticsMetricCard}>
                    <div className={styles.metricLabel}>Platform Fees</div>
                    <div className={styles.metricBigValue} style={{ color: '#DC2626' }}>-$27,630.00</div>
                </div>
                <div className={styles.analyticsMetricCard}>
                    <div className={styles.metricLabel}>Taxes</div>
                    <div className={styles.metricBigValue} style={{ color: '#DC2626' }}>-$9,210.00</div>
                </div>
                <div className={styles.analyticsMetricCard}>
                    <div className={styles.metricLabel}>Net Revenue</div>
                    <div className={styles.metricBigValue}>$147,360.00</div>
                </div>
            </div>

            <div className={styles.analyticsGridMain}>
                {/* Daily Revenue Trends Chart (Left) */}
                <div className={styles.cardSection}>
                    <div className={styles.chartHeader}>
                        <h3 className={styles.chartTitle}>Daily Revenue Trends</h3>
                        <div className={styles.chartLegendWrap}>
                            <button className={styles.analyticsFilterBtn} style={{ padding: '4px 8px', fontSize: '12px' }}>
                                <span>Last 30 days</span>
                                <ChevronDown size={14} />
                            </button>
                        </div>
                    </div>

                    <div className={styles.barChartContainer} style={{ marginTop: '1.5rem', height: '220px' }}>
                        {/* Y-Axis Labels */}
                        <div className={styles.yAxisLabels}>
                            <span>$15k</span>
                            <span>$10k</span>
                            <span>$5k</span>
                            <span>0</span>
                        </div>

                        {/* Chart Area */}
                        <div className={styles.chartBarsArea}>
                            {/* Horizontal grid lines */}
                            <div className={styles.chartGridLines}>
                                <div className={styles.gridLine}></div>
                                <div className={styles.gridLine}></div>
                                <div className={styles.gridLine}></div>
                                <div className={styles.gridLine}></div>
                            </div>

                            {/* Bar Columns */}
                            <div className={styles.barColumnsContainer}>
                                {revenueBarData.map((data, idx) => (
                                    <div key={idx} className={styles.barColumnWrapper} style={{ width: 'auto', flex: 1 }}>
                                        <div className={styles.barTrack} style={{ width: '100%', margin: '0 4px', marginBottom: '8px' }}>
                                            <div
                                                className={styles.barCurrent}
                                                style={{
                                                    height: `${data.current}%`,
                                                    background: hoveredBar === idx
                                                        ? 'linear-gradient(to bottom, #7F1D1D, #991B1B)'
                                                        : 'linear-gradient(to bottom, #8B3A2A, #D4845A)',
                                                    borderTopLeftRadius: '4px',
                                                    borderTopRightRadius: '4px',
                                                    cursor: 'pointer',
                                                    transition: 'background 0.2s ease'
                                                }}
                                                onMouseEnter={() => setHoveredBar(idx)}
                                                onMouseLeave={() => setHoveredBar(null)}
                                            >
                                                {/* Tooltip on hover */}
                                                {hoveredBar === idx && (
                                                    <div className={styles.chartTooltip}>
                                                        <div className={styles.chartTooltipDate}>{data.date}</div>
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
                                        </div>
                                        <div className={styles.barXLabel} style={{ minHeight: '16px' }}>{data.day}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Selling Items by Revenue (Right) */}
                <div className={styles.cardSection}>
                    <div className={styles.chartHeader} style={{ marginBottom: '1.5rem' }}>
                        <h3 className={styles.chartTitle}>Top Selling Items by Revenue</h3>
                        <div className={styles.chartLegendWrap}>
                            <button className={styles.analyticsFilterBtn} style={{ padding: '4px 8px', fontSize: '12px' }}>
                                <span>This Month</span>
                                <ChevronDown size={14} />
                            </button>
                        </div>
                    </div>

                    <div className={styles.topSellingList}>
                        {[
                            { id: 1, name: 'Double Cheese Burger', image: '/assets/images/service/burger.webp', revenue: '$42,500', max: 50000, current: 42500 },
                            { id: 2, name: 'Grilled Steak', image: '/assets/images/service/steak.webp', revenue: '$31,200', max: 50000, current: 31200 },
                            { id: 3, name: 'Black Iced Coffee', image: '/assets/images/service/juice.webp', revenue: '$28,900', max: 50000, current: 28900 }
                        ].map(item => (
                            <div key={item.id} className={styles.topSellingItem}>
                                <img src={item.image} alt={item.name} className={styles.topSellingImg} />
                                <div className={styles.topSellingDetails}>
                                    <div className={styles.topSellingRow}>
                                        <span className={styles.topSellingName}>{item.name}</span>
                                        <span className={styles.topSellingCount}>{item.revenue}</span>
                                    </div>
                                    <div className={styles.progressBarBg}>
                                        <div
                                            className={styles.progressBarFill}
                                            style={{ width: `${(item.current / item.max) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Payouts */}
            <div className={styles.cardSection} style={{ marginTop: '1.25rem' }}>
                <div className={styles.chartHeader} style={{ marginBottom: '1.5rem' }}>
                    <h3 className={styles.chartTitle}>Recent Payouts</h3>
                    <button className={styles.textBtn}>View All</button>
                </div>

                <div className={styles.highValueTableWrap}>
                    <table className={styles.highValueTable}>
                        <thead>
                            <tr>
                                <th>Referrence ID</th>
                                <th>Date Range</th>
                                <th>Payout Date</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { id: 'PAY-2026-9842', range: 'Feb 8 - Feb 28', date: 'Feb 28, 2026', amount: '$32,450.00', status: 'Completed', statusClass: 'statusDelivered' },
                                { id: 'PAY-2026-9104', range: 'Jan 4 - Feb 7', date: 'Feb 7, 2026', amount: '$28,910.00', status: 'Completed', statusClass: 'statusDelivered' }
                            ].map(payout => (
                                <tr
                                    key={payout.id}
                                    onClick={() => onViewPayoutDetails && onViewPayoutDetails({
                                        id: payout.id.replace('PAY-', ''),
                                        date: payout.date,
                                        amount: payout.amount,
                                        method: 'Bank Transfer',
                                        status: payout.status,
                                        numTx: 43
                                    })}
                                    style={{ cursor: onViewPayoutDetails ? 'pointer' : 'default' }}
                                >
                                    <td className={styles.highValueId} style={{ fontWeight: 700, color: '#111827' }}>#{payout.id}</td>
                                    <td style={{ fontSize: '.875rem', fontWeight: 600, color: '#4B5563' }}>{payout.range}</td>
                                    <td style={{ fontSize: '.875rem', fontWeight: 600, color: '#111827' }}>{payout.date}</td>
                                    <td className={styles.highValueTotal}>{payout.amount}</td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${styles[payout.statusClass]}`} style={{ padding: '4px 8px', fontSize: '.7rem' }}>
                                            {payout.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
}

export default EarningsSection;
