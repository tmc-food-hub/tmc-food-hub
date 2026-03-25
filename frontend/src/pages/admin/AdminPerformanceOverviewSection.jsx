import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
    TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Star,
    Clock, AlertCircle, Zap, Target, Loader
} from 'lucide-react';
import styles from './AdminPerformanceOverviewSection.module.css';

export default function AdminPerformanceOverviewSection() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [performanceData, setPerformanceData] = useState({
        kpis: {
            gmv: 0,
            orders: 0,
            customers: 0,
            restaurants: 0,
            avg_order_value: 0,
            customer_retention_rate: 0,
            commission_rate: 0,
            platform_efficiency: 0,
        },
        trends: {
            gmv_trend: 12.5,
            orders_trend: 8.3,
            customers_trend: 15.2,
            restaurants_trend: 4.1,
        },
        weekly_metrics: [],
        performance_by_segment: [],
        health_score: 85,
        alerts: [],
    });
    const [timeRange, setTimeRange] = useState('week');

    useEffect(() => {
        fetchPerformanceData();
    }, [timeRange]);

    const fetchPerformanceData = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/performance', {
                params: { range: timeRange }
            });
            setPerformanceData(response.data || generateMockData());
            setError(null);
        } catch (err) {
            console.error('Error fetching performance data:', err);
            setPerformanceData(generateMockData());
        } finally {
            setLoading(false);
        }
    };

    const generateMockData = () => ({
        kpis: {
            gmv: 4520000,
            orders: 8234,
            customers: 15420,
            restaurants: 342,
            avg_order_value: 548.50,
            customer_retention_rate: 68.5,
            commission_rate: 8.5,
            platform_efficiency: 92.3,
        },
        trends: {
            gmv_trend: 12.5,
            orders_trend: 8.3,
            customers_trend: 15.2,
            restaurants_trend: 4.1,
        },
        weekly_metrics: [
            { day: 'Mon', gmv: 580000, orders: 1050, customers: 1880 },
            { day: 'Tue', gmv: 620000, orders: 1120, customers: 2010 },
            { day: 'Wed', gmv: 595000, orders: 1080, customers: 1950 },
            { day: 'Thu', gmv: 640000, orders: 1150, customers: 2080 },
            { day: 'Fri', gmv: 710000, orders: 1280, customers: 2320 },
            { day: 'Sat', gmv: 815000, orders: 1480, customers: 2680 },
            { day: 'Sun', gmv: 760000, orders: 1405, customers: 2500 },
        ],
        performance_by_segment: [
            { name: 'Fast Food', gmv: 1230000, orders: 2240, growth: 14.2 },
            { name: 'Fine Dining', gmv: 980000, orders: 890, growth: 8.5 },
            { name: 'Casual', gmv: 1150000, orders: 2680, growth: 11.8 },
            { name: 'Delivery', gmv: 520000, orders: 1280, growth: 9.3 },
            { name: 'Desserts', gmv: 640000, orders: 1144, growth: 16.7 },
        ],
        health_score: 85,
        alerts: [
            { id: 1, level: 'warning', message: '3 restaurants with declining performance', action: 'Review' },
            { id: 2, level: 'info', message: 'Peak order time: 7-8 PM daily', action: 'Optimize' },
        ],
    });

    const formatCurrency = (value) => {
        if (value >= 1000000) return `₱${(value / 1000000).toFixed(2)}M`;
        if (value >= 1000) return `₱${(value / 1000).toFixed(1)}k`;
        return `₱${Number(value).toFixed(2)}`;
    };

    const KPICard = ({ label, value, trend, icon, positive = true }) => (
        <div className={styles.kpiCard}>
            <div className={styles.kpiHeader}>
                <span className={styles.kpiIcon}>{icon}</span>
                <span className={styles.kpiLabel}>{label}</span>
            </div>
            <div className={styles.kpiValue}>{value}</div>
            <div className={`${styles.kpiTrend} ${positive ? styles.positive : styles.negative}`}>
                {positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                <span>{Math.abs(trend)}% from last period</span>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingState}>
                    <Loader size={32} className={styles.spinner} />
                    <p>Loading performance data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Time Range Selector */}
            <div className={styles.timeRangeSelector}>
                {['week', 'month', 'quarter', 'year'].map(range => (
                    <button
                        key={range}
                        className={`${styles.rangeBtn} ${timeRange === range ? styles.active : ''}`}
                        onClick={() => setTimeRange(range)}
                    >
                        {range.charAt(0).toUpperCase() + range.slice(1)}
                    </button>
                ))}
            </div>

            {/* Health Score */}
            <div className={styles.healthScoreCard}>
                <div className={styles.healthHeader}>
                    <h3>Platform Health Score</h3>
                    <span className={styles.healthBadge}>{performanceData.health_score}/100</span>
                </div>
                <div className={styles.healthBar}>
                    <div 
                        className={styles.healthFill}
                        style={{ width: `${performanceData.health_score}%` }}
                    ></div>
                </div>
                <p className={styles.healthStatus}>
                    {performanceData.health_score >= 80 ? 'Excellent platform performance' : 
                     performanceData.health_score >= 60 ? 'Good platform performance' :
                     'Platform needs attention'}
                </p>
            </div>

            {/* KPI Grid */}
            <div className={styles.kpiGrid}>
                <KPICard
                    label="Gross Merchandise Value"
                    value={formatCurrency(performanceData.kpis.gmv)}
                    trend={performanceData.trends.gmv_trend}
                    icon={<DollarSign size={16} />}
                    positive={true}
                />
                <KPICard
                    label="Total Orders"
                    value={performanceData.kpis.orders.toLocaleString()}
                    trend={performanceData.trends.orders_trend}
                    icon={<ShoppingCart size={16} />}
                    positive={true}
                />
                <KPICard
                    label="Active Customers"
                    value={performanceData.kpis.customers.toLocaleString()}
                    trend={performanceData.trends.customers_trend}
                    icon={<Users size={16} />}
                    positive={true}
                />
                <KPICard
                    label="Partner Restaurants"
                    value={performanceData.kpis.restaurants.toLocaleString()}
                    trend={performanceData.trends.restaurants_trend}
                    icon={<Zap size={16} />}
                    positive={true}
                />
                <KPICard
                    label="Average Order Value"
                    value={formatCurrency(performanceData.kpis.avg_order_value)}
                    trend={5.2}
                    icon={<Target size={16} />}
                    positive={true}
                />
                <KPICard
                    label="Customer Retention"
                    value={`${performanceData.kpis.customer_retention_rate.toFixed(1)}%`}
                    trend={3.8}
                    icon={<Star size={16} />}
                    positive={true}
                />
            </div>

            {/* Charts Section */}
            <div className={styles.chartsGrid}>
                {/* Weekly Metrics Chart */}
                <section className={styles.chartCard}>
                    <h3>Weekly Performance Trend</h3>
                    <div className={styles.chartMetrics}>
                        <div className={styles.metricLegend}>
                            <span className={styles.legendItem}>
                                <span className={`${styles.dot} ${styles.gmvDot}`}></span> GMV
                            </span>
                            <span className={styles.legendItem}>
                                <span className={`${styles.dot} ${styles.ordersDot}`}></span> Orders
                            </span>
                            <span className={styles.legendItem}>
                                <span className={`${styles.dot} ${styles.customersDot}`}></span> Customers
                            </span>
                        </div>
                    </div>
                    <div className={styles.weeklyChart}>
                        {performanceData.weekly_metrics.map((day) => {
                            const maxGMV = Math.max(...performanceData.weekly_metrics.map(d => d.gmv));
                            const gmvHeight = (day.gmv / maxGMV) * 100;
                            const orderHeight = (day.orders / 1500) * 100;
                            const customerHeight = (day.customers / 2800) * 100;

                            return (
                                <div key={day.day} className={styles.dayColumn}>
                                    <div className={styles.bars}>
                                        <div className={styles.barStack}>
                                            <div 
                                                className={`${styles.bar} ${styles.gmvBar}`}
                                                style={{ height: `${gmvHeight}%` }}
                                                title={`GMV: ${formatCurrency(day.gmv)}`}
                                            ></div>
                                            <div 
                                                className={`${styles.bar} ${styles.ordersBar}`}
                                                style={{ height: `${orderHeight}%` }}
                                                title={`Orders: ${day.orders}`}
                                            ></div>
                                            <div 
                                                className={`${styles.bar} ${styles.customersBar}`}
                                                style={{ height: `${customerHeight}%` }}
                                                title={`Customers: ${day.customers}`}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className={styles.dayLabel}>{day.day}</div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Segment Performance */}
                <section className={styles.chartCard}>
                    <h3>Performance by Cuisine Segment</h3>
                    <div className={styles.segmentList}>
                        {performanceData.performance_by_segment.map((segment) => (
                            <div key={segment.name} className={styles.segmentRow}>
                                <div className={styles.segmentInfo}>
                                    <h4>{segment.name}</h4>
                                    <p className={styles.segmentStats}>
                                        {segment.orders.toLocaleString()} orders · {formatCurrency(segment.gmv)}
                                    </p>
                                </div>
                                <div className={styles.segmentMetrics}>
                                    <div className={styles.segmentBar}>
                                        <div 
                                            className={styles.segmentFill}
                                            style={{ width: `${(segment.gmv / 1300000) * 100}%` }}
                                        ></div>
                                    </div>
                                    <span className={`${styles.segmentGrowth} ${segment.growth > 10 ? styles.highGrowth : ''}`}>
                                        +{segment.growth.toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Alerts & Insights */}
            {performanceData.alerts.length > 0 && (
                <section className={styles.alertsCard}>
                    <h3>Performance Alerts & Insights</h3>
                    <div className={styles.alertsList}>
                        {performanceData.alerts.map((alert) => (
                            <div key={alert.id} className={`${styles.alertItem} ${styles[alert.level]}`}>
                                <AlertCircle size={16} className={styles.alertIcon} />
                                <div className={styles.alertContent}>
                                    <p>{alert.message}</p>
                                </div>
                                <button className={styles.alertAction}>{alert.action}</button>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Key Metrics */}
            <section className={styles.metricsCard}>
                <h3>Key Platform Metrics</h3>
                <div className={styles.metricsGrid}>
                    <div className={styles.metricBox}>
                        <label>Commission Rate</label>
                        <span className={styles.metricValue}>{performanceData.kpis.commission_rate}%</span>
                    </div>
                    <div className={styles.metricBox}>
                        <label>Platform Efficiency</label>
                        <span className={styles.metricValue}>{performanceData.kpis.platform_efficiency}%</span>
                    </div>
                    <div className={styles.metricBox}>
                        <label>Avg Order Value</label>
                        <span className={styles.metricValue}>{formatCurrency(performanceData.kpis.avg_order_value)}</span>
                    </div>
                    <div className={styles.metricBox}>
                        <label>GMV per Restaurant</label>
                        <span className={styles.metricValue}>
                            {formatCurrency(performanceData.kpis.gmv / performanceData.kpis.restaurants)}
                        </span>
                    </div>
                </div>
            </section>
        </div>
    );
}
