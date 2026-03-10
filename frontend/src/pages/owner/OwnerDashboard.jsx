import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    LayoutDashboard, UtensilsCrossed, Clock, Settings, LogOut,
    Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Save, X, Check,
    Package, DollarSign, ShoppingBag, Truck, Bell,
    AlertCircle, CheckCircle2, Timer, MapPin, FileText, Tag,
    Hash, Layers, ExternalLink, Search, TrendingUp, TrendingDown, Star,
    Receipt, Wallet, CreditCard
} from 'lucide-react';
import { useOwnerAuth } from '../../context/OwnerAuthContext';
import tmcLogo from '../../assets/imgs/tmc-foodhub-logo.svg';
import styles from './OwnerDashboard.module.css';

import OverviewSection from './dashboard-sections/OverviewSection';
import OrdersSection from './dashboard-sections/OrdersSection';
import InventorySection from './dashboard-sections/InventorySection';
import MenuSection from './dashboard-sections/MenuSection';
import HoursSection from './dashboard-sections/HoursSection';
import SettingsSection from './dashboard-sections/SettingsSection';
import PromotionsSection from './dashboard-sections/PromotionsSection';
import CategoriesSection from './dashboard-sections/CategoriesSection';
import AnalyticsSection from './dashboard-sections/AnalyticsSection';
import EarningsSection from './dashboard-sections/EarningsSection';
import PaymentSettings from './dashboard-sections/PaymentSettings';
import PayoutSection from './dashboard-sections/PayoutSection';
import { buildOrders } from './dashboard-sections/shared';
/* ─── Dashboard Shell ────────────────────────────────────────────────────── */
const NAV_GROUPS = [
    {
        label: 'Operations',
        items: [
            { key: 'overview', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
            { key: 'orders', label: 'Orders', icon: <ShoppingBag size={18} /> },
            { key: 'inventory', label: 'Inventory', icon: <Package size={18} /> },
        ]
    },
    {
        label: 'Menu',
        items: [
            { key: 'menu', label: 'Menu', icon: <UtensilsCrossed size={18} /> },
            { key: 'categories', label: 'Categories', icon: <Layers size={18} /> },
            { key: 'promotions', label: 'Promotions', icon: <Tag size={18} /> },
        ]
    },
    {
        label: 'Engagement',
        items: [
            { key: 'reviews', label: 'Reviews', icon: <Star size={18} /> },
        ]
    },
    {
        label: 'Finance',
        items: [
            { key: 'analytics', label: 'Analytics', icon: <FileText size={18} /> },
            {
                key: 'earnings',
                label: 'Earnings',
                icon: <Wallet size={18} />,
                subItems: [
                    { key: 'transactions', label: 'Transactions', icon: <Receipt size={14} /> },
                    { key: 'payout', label: 'Payout', icon: <Wallet size={14} /> },
                    { key: 'payment-settings', label: 'Payment Settings', icon: <CreditCard size={14} /> }
                ]
            },
        ]
    },
    {
        label: 'System',
        items: [
            { key: 'settings', label: 'Settings', icon: <Settings size={18} /> },
        ]
    }
];

function OwnerDashboard() {
    const { currentOwner, ownerStore, logout, updateStore } = useOwnerAuth();
    const navigate = useNavigate();
    const [active, setActive] = useState('overview');
    const [profileOpen, setProfileOpen] = useState(false);
    const [payoutViewData, setPayoutViewData] = useState(null);

    if (!currentOwner) { navigate('/owner-login'); return null; }
    if (!ownerStore) return <p>Store not found.</p>;

    const mockOrders = buildOrders(ownerStore);
    const pendingCount = mockOrders.filter(o => o.status === 'Pending').length;

    let activeLabel = 'Dashboard';
    let subTitle = `Welcome back, ${ownerStore.branchName}!`;

    NAV_GROUPS.forEach(g => {
        g.items.forEach(i => {
            if (i.key === active) activeLabel = i.label;
            if (i.subItems) {
                const foundSub = i.subItems.find(s => s.key === active);
                if (foundSub) {
                    activeLabel = foundSub.label;
                }
            }
        });
    });

    if (active === 'earnings' || active === 'transactions' || active === 'payout' || active === 'payment-settings') {
        activeLabel = 'Earnings';
        subTitle = 'Track your revenue, payouts, and financial performance over time.';
    } else if (active === 'analytics') {
        subTitle = 'Monitor your store\'s performance and sales metrics.';
    }

    // Check if a parent item is "active" because one of its subItems is active
    const isItemExpanded = (item) => {
        if (active === item.key) return true;
        if (item.subItems && item.subItems.some(s => s.key === active)) return true;
        return false;
    };

    return (
        <div className={styles.shell}>
            {/* ── Sidebar ── */}
            <aside className={styles.sidebar}>
                {/* TMC Food Hub branding */}
                <div className={styles.sidebarTop}>
                    <Link to="/" className={styles.tmcLogoLink}>
                        <img src={tmcLogo} alt="TMC Food Hub" className={styles.tmcLogo} />
                    </Link>
                    <div className={styles.portalLabel}>Restaurant Portal</div>
                </div>

                {/* Navigation */}
                <nav className={styles.nav}>
                    {NAV_GROUPS.map(group => (
                        <div key={group.label} className={styles.navGroup}>
                            <div className={styles.navLabel}>{group.label}</div>
                            {group.items.map(n => {
                                const expanded = isItemExpanded(n);
                                return (
                                    <div key={n.key} className={styles.navItemWrapper}>
                                        <button
                                            className={`${styles.navBtn} ${expanded ? styles.navBtnActive : ''}`}
                                            onClick={() => setActive(n.key)}
                                        >
                                            <span className={styles.navIcon}>{n.icon}</span>
                                            <span>{n.label}</span>
                                            {n.key === 'orders' && pendingCount > 0 && <span className={styles.badge}>{pendingCount}</span>}
                                        </button>

                                        {/* Render Sub Items if expanded */}
                                        {expanded && n.subItems && (
                                            <div className={styles.navSubItemsGroup}>
                                                {n.subItems.map(s => (
                                                    <button
                                                        key={s.key}
                                                        className={`${styles.navSubBtn} ${active === s.key ? styles.navSubBtnActive : ''}`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActive(s.key);
                                                        }}
                                                    >
                                                        <span className={styles.navSubIcon}>{s.icon}</span>
                                                        <span>{s.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </nav>

                {/* Footer / Profile Menu */}
                <div className={styles.sidebarFooter}>
                    {profileOpen && (
                        <div className={styles.profileMenu}>
                            <button className={styles.profileMenuBtn}>View Profile</button>
                            <button className={styles.profileMenuBtn}>Account Settings</button>
                            <button className={styles.profileMenuBtn}>Dark Mode <ToggleLeft size={16} /></button>
                            <div className={styles.profileMenuDivider}></div>
                            <button className={`${styles.profileMenuBtn} ${styles.profileMenuLogout}`} onClick={() => { logout(); navigate('/owner-login'); }}>
                                <LogOut size={16} /> Logout
                            </button>
                        </div>
                    )}
                    <button className={styles.storeProfileBtn} onClick={() => setProfileOpen(!profileOpen)}>
                        <div className={styles.storeAvatar}>{ownerStore.name.charAt(0)}</div>
                        <div className={styles.storeDetails}>
                            <div className={styles.storeName}>{ownerStore.branchName}</div>
                            <div className={styles.branchName}>Store Manager</div>
                        </div>
                    </button>
                </div>
            </aside>

            {/* ── Main ── */}
            <div className={styles.main}>
                {active !== 'payout' && (
                    <div className={styles.topBar}>
                        <div>
                            <h1 className={styles.topTitle}>{active === 'overview' ? 'Dashboard' : activeLabel}</h1>
                            <p className={styles.topSub}>{subTitle}</p>
                        </div>
                        <div className={styles.topRight}>
                            <div className={styles.searchWrap}>
                                <Search className={styles.searchIcon} size={16} />
                                <input type="text" placeholder="Search items..." className={styles.searchInput} />
                            </div>
                            <button className={styles.notificationBtn}>
                                <Bell size={20} />
                                <span className={styles.notificationBadge}></span>
                            </button>
                        </div>
                    </div>
                )}
                <div className={styles.content} style={active === 'payout' ? { padding: '1.5rem', background: '#FAFAFA' } : {}}>
                    {active === 'overview' && <OverviewSection store={ownerStore} orders={mockOrders} />}
                    {active === 'orders' && <OrdersSection store={ownerStore} />}
                    {active === 'inventory' && <InventorySection store={ownerStore} onUpdate={updateStore} />}
                    {active === 'menu' && <MenuSection store={ownerStore} onUpdate={updateStore} />}
                    {active === 'categories' && <CategoriesSection />}
                    {active === 'promotions' && <PromotionsSection />}
                    {active === 'analytics' && <AnalyticsSection />}
                    {active === 'earnings' && <EarningsSection onViewPayoutDetails={(payout) => { setPayoutViewData(payout); setActive('payout'); }} />}
                    {active === 'transactions' && <EarningsSection onViewPayoutDetails={(payout) => { setPayoutViewData(payout); setActive('payout'); }} />}
                    {active === 'payout' && <PayoutSection initialViewData={payoutViewData} clearInitViewData={() => setPayoutViewData(null)} />}
                    {active === 'payment-settings' && <PaymentSettings />}
                    {active === 'hours' && <HoursSection store={ownerStore} onUpdate={updateStore} />}
                    {active === 'settings' && <SettingsSection store={ownerStore} onUpdate={updateStore} />}
                </div>
            </div>
        </div>
    );
}

export default OwnerDashboard;
