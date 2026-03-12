import React, { useState } from 'react';
import { Calendar, Download, Search, Check, ChevronDown } from 'lucide-react';
import styles from '../OwnerDashboard.module.css';

function AnalyticsSection() {
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState(['All Categories']);
    const [hoveredBar, setHoveredBar] = useState(null);

    const salesBarData = [
        { day: 'Feb 27', current: 35, previous: 45, revenue: '$14,820', orders: 98, trend: '+8%' },
        { day: 'Feb 28', current: 55, previous: 65, revenue: '$22,350', orders: 142, trend: '+12%' },
        { day: 'Mar 1', current: 25, previous: 55, revenue: '$10,500', orders: 74, trend: '-5%' },
        { day: 'Mar 2', current: 75, previous: 60, revenue: '$31,280', orders: 198, trend: '+18%' },
        { day: 'Mar 3', current: 65, previous: 80, revenue: '$27,950', orders: 176, trend: '+14%' },
        { day: 'Mar 4', current: 55, previous: 70, revenue: '$22,410', orders: 155, trend: '+10%' },
        { day: 'Mar 5', current: 90, previous: 85, revenue: '$42,910', orders: 241, trend: '+22%' },
    ];

    const ALL_CATEGORIES = [
        'Main Courses',
        'Burgers & Sandwiches',
        'Sides & Appetizers',
        'Desserts',
        'Beverages'
    ];

    const toggleCategory = (category) => {
        if (category === 'All Categories') {
            setSelectedCategories(['All Categories']);
            return;
        }

        let newSelected = [...selectedCategories];
        if (newSelected.includes('All Categories')) {
            newSelected = [category];
        } else if (newSelected.includes(category)) {
            newSelected = newSelected.filter(c => c !== category);
        } else {
            newSelected.push(category);
        }

        if (newSelected.length === 0) {
            newSelected = ['All Categories'];
        }

        setSelectedCategories(newSelected);
    };

    return (
        <div className={styles.sectionContainer}>
            {/* Header Actions */}
            <div className={styles.sectionHeader} style={{ justifyContent: 'flex-end' }}>
                <div className={styles.headerActions}>
                    <button className={styles.analyticsFilterBtn}>
                        <Calendar size={16} />
                        <span>Feb 01, 2026 - Mar 05, 2026</span>
                    </button>

                    <div className={styles.categoryDropdownWrapper}>
                        <button
                            className={styles.analyticsFilterBtn}
                            onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                        >
                            <span>
                                {selectedCategories.includes('All Categories')
                                    ? 'All Categories'
                                    : `${selectedCategories.length} Categories Selected`}
                            </span>
                            <ChevronDown size={16} />
                        </button>

                        {categoryDropdownOpen && (
                            <div className={styles.categoryDropdownMenu}>
                                <div className={styles.dropdownSearchWrap}>
                                    <Search size={14} className={styles.dropdownSearchIcon} />
                                    <input type="text" placeholder="Search items..." className={styles.dropdownSearchInput} />
                                </div>
                                <div className={styles.dropdownOptionsList}>
                                    <label className={styles.dropdownCheckboxLabel}>
                                        <div className={`${styles.customCheckbox} ${selectedCategories.includes('All Categories') ? styles.checked : ''}`}>
                                            {selectedCategories.includes('All Categories') && <Check size={12} strokeWidth={4} />}
                                        </div>
                                        <span className={styles.boldLabel}>All Categories</span>
                                        <input type="checkbox" hidden onChange={() => toggleCategory('All Categories')} />
                                    </label>

                                    {ALL_CATEGORIES.map(cat => (
                                        <label key={cat} className={styles.dropdownCheckboxLabel}>
                                            <div className={`${styles.customCheckbox} ${selectedCategories.includes(cat) ? styles.checked : ''}`}>
                                                {selectedCategories.includes(cat) && <Check size={12} strokeWidth={4} />}
                                            </div>
                                            <span>{cat}</span>
                                            <input type="checkbox" hidden onChange={() => toggleCategory(cat)} />
                                        </label>
                                    ))}
                                </div>
                                <div className={styles.dropdownFooter}>
                                    <button className={styles.btnStatusSecondary} onClick={() => setSelectedCategories(['All Categories'])}>Clear</button>
                                    <button className={styles.btnSave} onClick={() => setCategoryDropdownOpen(false)}>Apply</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.headerActionsRight}>
                    <button className={styles.btnSave}>
                        <Download size={16} style={{ marginRight: '6px' }} /> Export
                    </button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className={styles.analyticsMetricsGrid}>
                <div className={styles.analyticsMetricCard}>
                    <div className={styles.metricHeaderRow}>
                        <span className={styles.metricLabel}>Total Revenue</span>
                        <span className={styles.trendBadgePositive}>↗ +12.5%</span>
                    </div>
                    <div className={styles.metricBigValue}>$42,910.00</div>
                    <div className={styles.metricSubtext}>vs. $38,120 last month</div>
                </div>
                <div className={styles.analyticsMetricCard}>
                    <div className={styles.metricHeaderRow}>
                        <span className={styles.metricLabel}>Avg. Order Value</span>
                        <span className={styles.trendBadgePositive}>↗ +5.8%</span>
                    </div>
                    <div className={styles.metricBigValue}>$152.40</div>
                    <div className={styles.metricSubtext}>vs. $205.10 last month</div>
                </div>
                <div className={styles.analyticsMetricCard}>
                    <div className={styles.metricHeaderRow}>
                        <span className={styles.metricLabel}>Total Orders</span>
                        <span className={styles.trendBadgeNegative}>↘ -2.1%</span>
                    </div>
                    <div className={styles.metricBigValue}>1,324</div>
                    <div className={styles.metricSubtext}>vs. 1,352 last month</div>
                </div>
                <div className={styles.analyticsMetricCard}>
                    <div className={styles.metricHeaderRow}>
                        <span className={styles.metricLabel}>New Customers</span>
                        <span className={styles.trendBadgePositive}>↗ +22%</span>
                    </div>
                    <div className={styles.metricBigValue}>421</div>
                    <div className={styles.metricSubtext}>vs. 356 last month</div>
                </div>
            </div>

            <div className={styles.analyticsGridMain}>
                {/* Sales Revenue Chart (Left) */}
                <div className={styles.cardSection}>
                    <div className={styles.chartHeader}>
                        <h3 className={styles.chartTitle}>Sales Revenue</h3>
                        <div className={styles.chartLegendWrap}>
                            <div className={styles.legendItem}>
                                <span className={styles.legendDot} style={{ background: '#991B1B' }}></span> This Period
                            </div>
                            <div className={styles.legendItem}>
                                <span className={styles.legendDot} style={{ background: '#FDE8E8' }}></span> Last Period
                            </div>
                            <button className={styles.analyticsFilterBtn} style={{ padding: '4px 8px', fontSize: '12px' }}>
                                <span>Last 7 days</span>
                                <ChevronDown size={14} />
                            </button>
                        </div>
                    </div>

                    <div className={styles.chartBigValue}>$42,910.00</div>

                    <div className={styles.barChartContainer}>
                        {/* Y-Axis Labels */}
                        <div className={styles.yAxisLabels}>
                            <span>$50k</span>
                            <span>$25k</span>
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
                                <div className={styles.gridLine}></div>
                            </div>

                            {/* Bar Columns */}
                            <div className={styles.barColumnsContainer}>
                                {salesBarData.map((data, idx) => (
                                    <div key={idx} className={styles.barColumnWrapper}>
                                        <div className={styles.barTrack}>
                                            {/* Previous period bar */}
                                            <div
                                                className={styles.barPrevious}
                                                style={{
                                                    height: `${data.previous}%`,
                                                    background: 'linear-gradient(to bottom, #F9A8A8, #FDE8E8)',
                                                }}
                                            ></div>
                                            {/* Current period bar with hover */}
                                            <div
                                                className={styles.barCurrent}
                                                style={{
                                                    height: `${data.current}%`,
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
                                                        <div className={styles.chartTooltipDate}>{data.day}, 2026</div>
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
                                        <div className={styles.barXLabel}>{data.day}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Selling Items (Right) */}
                <div className={styles.cardSection}>
                    <div className={styles.chartHeader} style={{ marginBottom: '1.5rem' }}>
                        <h3 className={styles.chartTitle}>Top Selling Items</h3>
                        <button className={styles.textBtn}>View All</button>
                    </div>

                    <div className={styles.topSellingList}>
                        {[
                            { id: 1, name: 'Double Cheese Burger', image: '/assets/images/service/burger.webp', orders: 852, max: 1000 },
                            { id: 2, name: 'Grilled Steak', image: '/assets/images/service/steak.webp', orders: 242, max: 1000 },
                            { id: 3, name: 'Black Iced Coffee', image: '/assets/images/service/juice.webp', orders: 188, max: 1000 }
                        ].map(item => (
                            <div key={item.id} className={styles.topSellingItem}>
                                <img src={item.image} alt={item.name} className={styles.topSellingImg} />
                                <div className={styles.topSellingDetails}>
                                    <div className={styles.topSellingRow}>
                                        <span className={styles.topSellingName}>{item.name}</span>
                                        <span className={styles.topSellingCount}>{item.orders} orders</span>
                                    </div>
                                    <div className={styles.progressBarBg}>
                                        <div
                                            className={styles.progressBarFill}
                                            style={{ width: `${(item.orders / item.max) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className={styles.analyticsGridBottom}>
                {/* Order Patterns (Left) */}
                <div className={styles.cardSection}>
                    <div className={styles.chartHeader} style={{ marginBottom: '0.25rem' }}>
                        <h3 className={styles.chartTitle}>Order Patterns</h3>
                    </div>
                    <p className={styles.sectionSubtitle} style={{ marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                        Peak hours vs. day of week
                    </p>

                    <div className={styles.heatmapContainer}>
                        {/* Header Row (Hours) */}
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

                        {/* Data Rows (Days) */}
                        {[
                            { day: 'Mon', data: [1, 4, 1, 4, 3, 4, 2] },
                            { day: 'Tue', data: [3, 2, 4, 2, 0, 4, 3] },
                            { day: 'Wed', data: [0, 4, 3, 4, 3, 2, 4] },
                            { day: 'Thu', data: [2, 4, 0, 4, 4, 3, 2] },
                            { day: 'Fri', data: [4, 1, 3, 2, 4, 3, 1] },
                            { day: 'Sat', data: [3, 1, 4, 4, 3, 3, 2] },
                            { day: 'Sun', data: [2, 4, 2, 4, 1, 3, 4] }
                        ].map(row => (
                            <div key={row.day} className={styles.heatmapRow}>
                                <div className={styles.heatmapLabel}>{row.day}</div>
                                {row.data.map((val, idx) => (
                                    <div key={idx} className={`${styles.heatmapCell} ${styles[`heatLevel${val}`]}`}></div>
                                ))}
                            </div>
                        ))}

                        {/* Legend Footer */}
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

                {/* Recent High Value Orders (Right) */}
                <div className={styles.cardSection}>
                    <div className={styles.chartHeader} style={{ marginBottom: '1.5rem' }}>
                        <h3 className={styles.chartTitle}>Recent High Value Orders</h3>
                        <button className={styles.textBtn}>View All</button>
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
                                {[
                                    { id: '#8842', name: 'Jane Doe', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=32&h=32', total: '$583.20', status: 'In-progress', statusClass: 'statusInProgress' },
                                    { id: '#8841', name: 'Michael Smith', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=32&h=32', total: '$463.10', status: 'Pending', statusClass: 'statusPending' },
                                    { id: '#8840', name: 'Amy Lee', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=32&h=32', total: '$259.00', status: 'Delivered', statusClass: 'statusDelivered' },
                                    { id: '#8839', name: 'Robert Brown', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=32&h=32', total: '$195.50', status: 'Delivered', statusClass: 'statusDelivered' }
                                ].map(order => (
                                    <tr key={order.id}>
                                        <td className={styles.highValueId}>{order.id}</td>
                                        <td>
                                            <div className={styles.customerCell}>
                                                <img src={order.avatar} alt={order.name} className={styles.customerAvatar} />
                                                <span className={styles.customerName}>{order.name}</span>
                                            </div>
                                        </td>
                                        <td className={styles.highValueTotal}>{order.total}</td>
                                        <td>
                                            <span className={`${styles.statusBadge} ${styles[order.statusClass]}`}>
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
        </div>
    );
}

export default AnalyticsSection;
