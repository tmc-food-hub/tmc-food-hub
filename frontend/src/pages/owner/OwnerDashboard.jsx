import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, UtensilsCrossed, Clock, Settings, LogOut,
    Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Save, X, Check,
    Package, DollarSign, ShoppingBag, Truck, Bell,
    AlertCircle, CheckCircle2, Timer, MapPin, FileText, Tag,
    Hash, Layers, ExternalLink, Search, TrendingUp, TrendingDown, Star,
    Receipt, Wallet, CreditCard,
    PanelLeftClose, PanelLeftOpen
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
import ReviewsSection from './dashboard-sections/ReviewsSection';
import { useOrders } from '../../context/OrderContext';
import api from '../../api/axios';
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
    const { currentOwner, ownerStore, logout, updateStore, refreshOwner, loading } = useOwnerAuth();
    const { orders } = useOrders();
    const navigate = useNavigate();
    const location = useLocation();
    const [active, setActive] = useState('overview');
    const [profileOpen, setProfileOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [payoutViewData, setPayoutViewData] = useState(null);
    const [welcomeBanner, setWelcomeBanner] = useState(location.state?.signupSuccess || false);
    const [inventoryItems, setInventoryItems] = useState([]);
    const [inventoryCategories, setInventoryCategories] = useState([]);
    const [inventoryLoading, setInventoryLoading] = useState(true);

    const refreshInventory = async () => {
        if (!currentOwner) return;

        setInventoryLoading(true);
        try {
            const [itemsRes, categoriesRes] = await Promise.all([
                api.get('/owner/inventory/items'),
                api.get('/owner/inventory/categories'),
            ]);
            setInventoryItems(itemsRes.data);
            setInventoryCategories(categoriesRes.data);
        } catch (error) {
            console.error('Failed to refresh owner inventory data:', error);
        } finally {
            setInventoryLoading(false);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 1024) {
                setSidebarCollapsed(false);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const isMissingOrPlaceholder = (img) => !img || img.includes('placeholder.svg');

        if (welcomeBanner && ownerStore && (isMissingOrPlaceholder(ownerStore.logo) || isMissingOrPlaceholder(ownerStore.cover))) {
            setActive('settings');
        }
        if (welcomeBanner) {
            const t = setTimeout(() => setWelcomeBanner(false), 5000);
            return () => clearTimeout(t);
        }
    }, [welcomeBanner, ownerStore]);

    useEffect(() => {
        if (currentOwner) {
            refreshInventory();
        } else {
            setInventoryItems([]);
            setInventoryCategories([]);
            setInventoryLoading(false);
        }
    }, [currentOwner]);

    // Prevent redirect until authentication check is complete
    if (loading) {
        return (
            <div className={styles.loadingScreen}>
                <div className={styles.spinner}></div>
                <p>Establishing secure connection...</p>
            </div>
        );
    }

    if (!currentOwner) { return <Navigate to="/owner-login" replace />; }
    if (!ownerStore) return <p>Store not found.</p>;

    const pendingCount = orders.filter(o => o.status === 'Pending').length;

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
    } else if (active === 'reviews') {
        activeLabel = 'Reviews';
        subTitle = 'Monitor customer ratings, feedback, and restaurant replies in one place.';
    } else if (active === 'analytics') {
        subTitle = 'Monitor your store\'s performance and sales metrics.';
    } else if (active === 'settings') {
        activeLabel = 'Settings';
        subTitle = 'Manage your account, notifications, payment details, and restaurant preferences.';
    }

    // Check if a parent item is "active" because one of its subItems is active
    const isItemExpanded = (item) => {
        if (active === item.key) return true;
        if (item.subItems && item.subItems.some(s => s.key === active)) return true;
        return false;
    };

    return (
        <div className={`${styles.shell} ${sidebarCollapsed ? styles.shellCollapsed : ''}`}>
            {/* Mobile Header (Hidden on Desktop) */}
            <header className={styles.mobileHeader}>
                <button className={styles.hamburgerBtn} onClick={() => setSidebarOpen(true)}>
                    <Layers size={22} />
                </button>
                <img src={tmcLogo} alt="TMC Food Hub" className={styles.mobileLogo} />
                <button className={styles.mobileNotificationBtn}>
                    <Bell size={20} />
                </button>
            </header>

            {/* Sidebar Overlay (Mobile only) */}
            {sidebarOpen && <div className={styles.mobileOverlay} onClick={() => setSidebarOpen(false)}></div>}

            {/* ── Sidebar ── */}
            <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''} ${sidebarCollapsed ? styles.sidebarCollapsed : ''}`}>
                {/* Mobile Close Button */}
                <button className={styles.closeSidebarBtn} onClick={() => setSidebarOpen(false)}>
                    <X size={24} />
                </button>

                {/* TMC Food Hub branding */}
                <div className={styles.sidebarTop}>
                    <Link to="/" className={styles.tmcLogoLink}>
                        <img src={tmcLogo} alt="TMC Food Hub" className={styles.tmcLogo} />
                    </Link>
                    {!sidebarCollapsed && <div className={styles.portalLabel}>Restaurant Portal</div>}
                    <button
                        className={styles.collapseBtn}
                        onClick={() => setSidebarCollapsed(c => !c)}
                        title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {sidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className={styles.nav}>
                    {NAV_GROUPS.map(group => (
                        <div key={group.label} className={styles.navGroup}>
                            {!sidebarCollapsed && <div className={styles.navLabel}>{group.label}</div>}
                            {group.items.map(n => {
                                const expanded = isItemExpanded(n);
                                return (
                                    <div key={n.key} className={styles.navItemWrapper}>
                                        <button
                                            className={`${styles.navBtn} ${expanded ? styles.navBtnActive : ''}`}
                                            onClick={() => {
                                                setActive(n.key);
                                                if (window.innerWidth < 1024) setSidebarOpen(false);
                                            }}
                                            title={sidebarCollapsed ? n.label : undefined}
                                        >
                                            <span className={styles.navIcon}>{n.icon}</span>
                                            {!sidebarCollapsed && <span>{n.label}</span>}
                                            {!sidebarCollapsed && n.key === 'orders' && pendingCount > 0 && <span className={styles.badge}>{pendingCount}</span>}
                                        </button>

                                        {/* Render Sub Items if expanded */}
                                        {!sidebarCollapsed && expanded && n.subItems && (
                                            <div className={styles.navSubItemsGroup}>
                                                {n.subItems.map(s => (
                                                    <button
                                                        key={s.key}
                                                        className={`${styles.navSubBtn} ${active === s.key ? styles.navSubBtnActive : ''}`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActive(s.key);
                                                            if (window.innerWidth < 1024) setSidebarOpen(false);
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
                    {!sidebarCollapsed && profileOpen && (
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
                    <button className={styles.storeProfileBtn} onClick={() => !sidebarCollapsed && setProfileOpen(!profileOpen)}>
                        {ownerStore.cover ? (
                            <img src={ownerStore.cover} alt={ownerStore.name} className={styles.storeAvatar} style={{ objectFit: 'contain', background: '#fff', border: '1px solid #E5E7EB' }} />
                        ) : (
                            <div className={styles.storeAvatar}>{ownerStore.name.charAt(0)}</div>
                        )}
                        {!sidebarCollapsed && (
                            <div className={styles.storeDetails}>
                                <div className={styles.storeName}>{ownerStore.branchName}</div>
                                <div className={styles.branchName}>Store Manager</div>
                            </div>
                        )}
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
                    {welcomeBanner && (
                        <div style={{
                            background: 'linear-gradient(135deg, #10B981, #059669)',
                            color: '#fff', borderRadius: '12px', padding: '1rem 1.5rem',
                            marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem'
                        }}>
                            <CheckCircle2 size={20} />
                            <div>
                                <strong>Welcome to your dashboard, {ownerStore.branchName}! 🎉</strong>
                                <div style={{ fontSize: '0.82rem', opacity: 0.9 }}>Your restaurant partner account is ready. Start by adding your menu items.</div>
                            </div>
                            <button onClick={() => setWelcomeBanner(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                                <X size={16} />
                            </button>
                        </div>
                    )}
                    {active === 'overview' && (
                        <OverviewSection
                            store={ownerStore}
                            orders={orders}
                            items={inventoryItems}
                            onNavigate={setActive}
                        />
                    )}

                    {active === 'orders' && <OrdersSection store={ownerStore} />}
                    {active === 'inventory' && (
                        <InventorySection
                            store={ownerStore}
                            onUpdate={updateStore}
                            items={inventoryItems}
                            setItems={setInventoryItems}
                            loading={inventoryLoading}
                            refreshInventory={refreshInventory}
                        />
                    )}
                    {active === 'menu' && (
                        <MenuSection
                            store={ownerStore}
                            onUpdate={updateStore}
                            items={inventoryItems}
                            setItems={setInventoryItems}
                            categories={inventoryCategories}
                            setCategories={setInventoryCategories}
                            loading={inventoryLoading}
                            refreshInventory={refreshInventory}
                        />
                    )}
                    {active === 'categories' && <CategoriesSection />}
                    {active === 'promotions' && <PromotionsSection />}
                    {active === 'reviews' && <ReviewsSection />}
                    {active === 'analytics' && <AnalyticsSection />}
                    {active === 'earnings' && <EarningsSection onViewPayoutDetails={(payout) => { setPayoutViewData(payout); setActive('payout'); }} />}
                    {active === 'transactions' && <EarningsSection onViewPayoutDetails={(payout) => { setPayoutViewData(payout); setActive('payout'); }} />}
                    {active === 'payout' && <PayoutSection initialViewData={payoutViewData} clearInitViewData={() => setPayoutViewData(null)} />}
                    {active === 'payment-settings' && <PaymentSettings />}
                    {active === 'hours' && <HoursSection store={ownerStore} onUpdate={updateStore} />}
                    {active === 'settings' && (
                        <SettingsSection
                            store={ownerStore}
                            onUpdate={updateStore}
                            currentOwner={currentOwner}
                            refreshOwner={refreshOwner}
                            items={inventoryItems}
                            refreshInventory={refreshInventory}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default OwnerDashboard;
