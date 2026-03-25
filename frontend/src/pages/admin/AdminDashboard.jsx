import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, ShoppingCart, Users, Store, Star, AlertTriangle,
    CreditCard, BarChart3, Tag, Settings, Bell, Search, LogOut, Wallet,
    PanelLeftClose, PanelLeftOpen
} from 'lucide-react';
import api from '../../api/axios';
import { useAdminAuth } from '../../context/AdminAuthContext';
import tmcLogo from '../../assets/imgs/tmc-foodhub-logo.svg';
import styles from './AdminDashboard.module.css';
import AdminOrdersSection from './AdminOrdersSection';
import AdminCustomersSection from './AdminCustomersSection';
import AdminRestaurantsSection from './AdminRestaurantsSection';
import AdminReviewsSection from './AdminReviewsSection';
import AdminDisputesSection from './AdminDisputesSection';
import AdminPaymentsSection from './AdminPaymentsSection';
import AdminAnalyticsSection from './AdminAnalyticsSection';
import AdminPromotionsSection from './AdminPromotionsSection';
import AdminSettingsSection from './AdminSettingsSection';

const NAV = [
    { label: 'Overview', items: [{ key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> }, { key: 'orders', label: 'Orders', icon: <ShoppingCart size={16} />, badge: 5 }, { key: 'customers', label: 'Customers', icon: <Users size={16} /> }] },
    { label: 'Operations', items: [{ key: 'restaurants', label: 'Restaurants', icon: <Store size={16} /> }, { key: 'reviews', label: 'Reviews', icon: <Star size={16} /> }, { key: 'disputes', label: 'Disputes', icon: <AlertTriangle size={16} /> }] },
    { label: 'Finance', items: [{ key: 'payments', label: 'Payments', icon: <CreditCard size={16} /> }, { key: 'analytics', label: 'Analytics', icon: <BarChart3 size={16} /> }, { key: 'promotions', label: 'Promotions', icon: <Tag size={16} /> }] },
    { label: 'System', items: [{ key: 'settings', label: 'Settings', icon: <Settings size={16} /> }] },
];

function pesoCompact(value) {
    if (value >= 1000000) return `₱${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `₱${(value / 1000).toFixed(0)}k`;
    return `₱${Number(value || 0).toLocaleString()}`;
}

function pesoFull(value) {
    return `₱${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function AdminDashboard() {
    const { admin, loading, logout } = useAdminAuth();
    const navigate = useNavigate();
    const [active, setActive] = useState('dashboard');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [data, setData] = useState({
        stats: {
            total_partners: 0,
            platform_revenue: 0,
            active_restaurants: 0,
            total_customers: 0,
        },
        revenue_chart: [],
        applications: [],
        alerts: [],
    });
    const [dashboardLoading, setDashboardLoading] = useState(true);

    useEffect(() => {
        if (!admin) return;

        async function fetchDashboard() {
            setDashboardLoading(true);
            try {
                const res = await api.get('/admin/dashboard');
                setData(res.data);
            } catch (error) {
                console.error('Failed to fetch admin dashboard:', error);
            } finally {
                setDashboardLoading(false);
            }
        }

        fetchDashboard();
    }, [admin]);

    const stats = useMemo(() => ([
        { label: 'Total Partners', value: data.stats.total_partners.toLocaleString(), trend: '+12.4% from yesterday', icon: <ShoppingCart size={16} /> },
        { label: 'Platform Revenue', value: pesoCompact(data.stats.platform_revenue), trend: '+8% this week', icon: <Wallet size={16} /> },
        { label: 'Active Restaurants', value: data.stats.active_restaurants.toLocaleString(), trend: '+3% this month', icon: <Store size={16} /> },
        { label: 'Total Customers', value: data.stats.total_customers.toLocaleString(), trend: '+4.8% this month', icon: <Users size={16} /> },
    ]), [data.stats]);

    if (loading) {
        return <div className={styles.placeholder}>Loading admin portal...</div>;
    }

    if (!admin) {
        return <Navigate to="/admin-login" replace />;
    }

    return (
        <div className={`${styles.shell} ${sidebarCollapsed ? styles.shellCollapsed : ''}`}>
            <aside className={`${styles.sidebar} ${sidebarCollapsed ? styles.sidebarCollapsed : ''}`}>
                <div className={styles.logoWrap}>
                    <img src={tmcLogo} alt="TMC Food Hub" className={styles.logo} />
                    {!sidebarCollapsed && <div className={styles.portalTag}>Admin Portal</div>}
                    <button
                        className={styles.collapseBtn}
                        onClick={() => setSidebarCollapsed(c => !c)}
                        title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {sidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
                    </button>
                </div>

                {NAV.map((group) => (
                    <div key={group.label} className={styles.navGroup}>
                        {!sidebarCollapsed && <div className={styles.navLabel}>{group.label}</div>}
                        {group.items.map((item) => (
                            <button
                                key={item.key}
                                className={`${styles.navBtn} ${active === item.key ? styles.navBtnActive : ''}`}
                                onClick={() => setActive(item.key)}
                            >
                                {item.icon}
                                {!sidebarCollapsed && <span>{item.label}</span>}
                                {!sidebarCollapsed && item.badge ? <span className={styles.navBadge}>{item.badge}</span> : null}
                            </button>
                        ))}
                    </div>
                ))}

                <div className={styles.profileCard}>
                    <div className={styles.avatar}>{(admin.first_name?.[0] || admin.name?.[0] || 'A').toUpperCase()}</div>
                    {!sidebarCollapsed && (
                        <div>
                            <div className={styles.restaurantName}>{admin.name || 'Admin'}</div>
                            <div className={styles.restaurantMeta}>Platform Administrator</div>
                        </div>
                    )}
                    {!sidebarCollapsed && (
                        <button className={styles.viewAll} onClick={async () => { await logout(); navigate('/admin-login'); }}>
                            <LogOut size={16} />
                        </button>
                    )}
                </div>
            </aside>

            <main className={styles.main}>
                <div className={styles.topBar}>
                    <div>
                        <h1 className={styles.title}>
                            {active === 'dashboard' ? 'Dashboard' : active === 'orders' ? 'Order Management' : active === 'customers' ? 'Customers' : active === 'restaurants' ? 'Restaurant Partners' : active === 'reviews' ? 'Reviews Moderation' : active === 'disputes' ? 'Disputes' : active === 'payments' ? 'Payments & Payouts' : active === 'analytics' ? 'Analytics' : active === 'promotions' ? 'Promotions' : active === 'settings' ? 'Settings' : active.charAt(0).toUpperCase() + active.slice(1)}
                        </h1>
                        <p className={styles.subtitle}>
                            {active === 'orders'
                                ? 'Monitor and manage all TMC Foodhub transactions'
                                : active === 'customers'
                                ? 'Review and manage marketplace restaurant integrity.'
                                : active === 'restaurants'
                                ? 'Review and manage marketplace restaurant integrity.'
                                : active === 'reviews'
                                ? 'Review and manage marketplace restaurant integrity.'
                                : active === 'disputes'
                                ? 'Review and manage marketplace restaurant integrity.'
                                : active === 'payments'
                                ? 'Review and manage marketplace restaurant integrity.'
                                : active === 'analytics'
                                ? 'Real-time performance metrics for TMC Foodhub ecosystem.'
                                : active === 'promotions'
                                ? 'Create and manage promotional campaigns and discount codes.'
                                : active === 'settings'
                                ? 'Review and manage marketplace restaurant integrity.'
                                : `Welcome back, ${admin.first_name || 'Admin'}!`}
                        </p>
                    </div>
                    <div className={styles.topActions}>
                        <div className={styles.searchBox}>
                            <Search size={16} className={styles.searchIcon} />
                            <input placeholder="Search partners, orders, or ID..." />
                        </div>
                        <button className={styles.iconBtn}><Bell size={18} /></button>
                    </div>
                </div>

                {active === 'orders' ? (
                    <AdminOrdersSection />
                ) : active === 'customers' ? (
                    <AdminCustomersSection />
                ) : active === 'restaurants' ? (
                    <AdminRestaurantsSection />
                ) : active === 'reviews' ? (
                    <AdminReviewsSection />
                ) : active === 'disputes' ? (
                    <AdminDisputesSection />
                ) : active === 'payments' ? (
                    <AdminPaymentsSection />
                ) : active === 'analytics' ? (
                    <AdminAnalyticsSection />
                ) : active === 'promotions' ? (
                    <AdminPromotionsSection />
                ) : active === 'settings' ? (
                    <AdminSettingsSection />
                ) : active !== 'dashboard' ? (
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>{active.charAt(0).toUpperCase() + active.slice(1)}</h3>
                        <p className={styles.placeholder}>This admin section is ready for the next management workflow.</p>
                    </div>
                ) : dashboardLoading ? (
                    <div className={styles.card}>
                        <p className={styles.placeholder}>Loading dashboard data...</p>
                    </div>
                ) : (
                    <>
                        <div className={styles.statsGrid}>
                            {stats.map((stat) => (
                                <div key={stat.label} className={styles.statCard}>
                                    <div className={styles.statTop}>
                                        <div className={styles.statIcon}>{stat.icon}</div>
                                        <div className={styles.statLabel}>{stat.label}</div>
                                    </div>
                                    <div className={styles.statValue}>{stat.value}</div>
                                    <div className={styles.statTrend}>{stat.trend}</div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.grid}>
                            <section className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <div>
                                        <h3 className={styles.cardTitle}>Platform Revenue</h3>
                                        <p className={styles.cardSub}>Net earnings from commissions and fees (Last 7 days)</p>
                                    </div>
                                    <button className={styles.iconBtn}>Last 7 days</button>
                                </div>
                                <div className={styles.revenueValue}>{pesoFull(data.stats.platform_revenue)}</div>
                                <div className={styles.chart}>
                                    {data.revenue_chart.map((entry) => {
                                        const maxRevenue = Math.max(...data.revenue_chart.map((item) => item.revenue), 1);
                                        const height = Math.max((entry.revenue / maxRevenue) * 100, entry.revenue > 0 ? 12 : 6);
                                        return (
                                            <div key={entry.date} className={styles.barCol}>
                                                <div className={styles.bar} style={{ height: `${height}%` }}></div>
                                                <div className={styles.barDay}>{entry.day}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>

                            <section className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <div>
                                        <h3 className={styles.cardTitle}>Platform Alerts</h3>
                                        <p className={styles.cardSub}>Items requiring your attention</p>
                                    </div>
                                    <button className={styles.viewAll}>View All</button>
                                </div>
                                <div className={styles.alertList}>
                                    {data.alerts.map((alert) => (
                                        <div key={alert.id} className={styles.alertCard}>
                                            <div className={styles.alertHead}>
                                                <div className={styles.alertTitle}>{alert.title}</div>
                                                <div className={styles.alertTime}>{alert.time}</div>
                                            </div>
                                            <div className={styles.alertDesc}>{alert.description}</div>
                                            <span className={`${styles.severity} ${styles[alert.severity] || styles.info}`}>{alert.severity}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        <div className={styles.bottomGrid}>
                            <section className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <div>
                                        <h3 className={styles.cardTitle}>Recent Restaurant Applications</h3>
                                        <p className={styles.cardSub}>Partners awaiting onboarding review</p>
                                    </div>
                                    <button className={styles.viewAll}>View all restaurants</button>
                                </div>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Restaurant Name</th>
                                            <th>Location</th>
                                            <th>Category</th>
                                            <th>Applied</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.applications.map((app) => (
                                            <tr key={app.id}>
                                                <td>
                                                    <div className={styles.restaurantCell}>
                                                        <img src={app.logo || tmcLogo} alt={app.restaurant_name} className={styles.restaurantLogo} />
                                                        <div>
                                                            <div className={styles.restaurantName}>{app.restaurant_name}</div>
                                                            <div className={styles.restaurantMeta}>New application</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{app.location}</td>
                                                <td>{app.category}</td>
                                                <td>{app.applied}</td>
                                                <td><span className={`${styles.severity} ${styles.pending}`}>{app.status}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </section>

                            <section className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <div>
                                        <h3 className={styles.cardTitle}>Quick Actions</h3>
                                        <p className={styles.cardSub}>Common admin tasks</p>
                                    </div>
                                </div>
                                <div className={styles.quickGrid}>
                                    <div className={styles.quickCard}>
                                        <Store size={18} color="#B42318" />
                                        <div className={styles.quickTitle}>Review Restaurants</div>
                                        <div className={styles.quickSub}>{data.applications.length} pending approvals</div>
                                    </div>
                                    <div className={styles.quickCard}>
                                        <AlertTriangle size={18} color="#B42318" />
                                        <div className={styles.quickTitle}>View Disputes</div>
                                        <div className={styles.quickSub}>Monitor reported issues</div>
                                    </div>
                                    <div className={styles.quickCard}>
                                        <ShoppingCart size={18} color="#B42318" />
                                        <div className={styles.quickTitle}>Manage Orders</div>
                                        <div className={styles.quickSub}>Track platform order flow</div>
                                    </div>
                                    <div className={styles.quickCard}>
                                        <CreditCard size={18} color="#B42318" />
                                        <div className={styles.quickTitle}>View Payments</div>
                                        <div className={styles.quickSub}>Reconciliation logs</div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
