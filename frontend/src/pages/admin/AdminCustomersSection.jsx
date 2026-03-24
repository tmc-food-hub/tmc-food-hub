import React, { useState, useMemo, useEffect } from 'react';
import {
    Users, UserPlus, AlertTriangle, ShoppingCart, Eye, Flag, X, Mail, Phone,
    MapPin, Clock, Download, ChevronDown, Search, FileText, MoreVertical,
    CheckCircle2, ShieldAlert, Ban, ExternalLink, Info, Loader
} from 'lucide-react';
import api from '../../api/axios';
import styles from './AdminCustomersSection.module.css';

/* ─── Mock Data ─────────────────────────────────────────────────────────────── */
const MOCK_CUSTOMERS = [
    {
        id: 'TMC-00421', name: 'Jane Doe', email: 'janedoe@email.com', phone: '+63 917 *** 4567',
        location: 'Makati City', orders: 42, totalSpent: 12450.00, registered: 'Jan 29, 2026',
        status: 'Active', avatar: null,
        details: {
            accountAge: '1 year, 1 month',
            orderHistory: { total: 42, spent: 12450.00, average: 350.00 },
            recentOrders: [
                { id: 'ORD-9021', date: 'Jan 25, 2026', amount: 350.00, status: 'Delivered' },
                { id: 'ORD-8872', date: 'Jan 23, 2026', amount: 350.00, status: 'Delivered' },
            ],
            favoriteRestaurants: [
                { name: 'Patty Shack', orders: 12 },
                { name: 'Mcdonalds', orders: 3 },
                { name: 'Burger King', orders: 2 },
            ],
            activityLog: [
                { type: 'order_placed', label: 'Order Placed', detail: '#TMC-882941 • Patty Shack', amount: 420.00, time: '2m ago', icon: 'order' },
                { type: 'order_completed', label: 'Order Completed', detail: '#TMC-882938', time: '1h ago', icon: 'complete' },
                { type: 'login', label: 'Login activity', detail: 'iPhone 15 • Makati City', time: '3h ago', icon: 'login' },
                { type: 'contact_revealed', label: 'Contact info revealed', detail: "Revealed by Admin 'Jose D.'", time: '5h ago', icon: 'reveal' },
                { type: 'refund', label: 'Refund requested', detail: '#TMC-882910', amount: 420.00, time: 'Yesterday', icon: 'refund' },
            ],
        }
    },
    {
        id: 'TMC-08923', name: 'Michael Smith', email: 'michaelsmith@email.com', phone: '+63 920 *** 1122',
        location: 'Quezon City', orders: 3, totalSpent: 1200.00, registered: 'Jan 27, 2026',
        status: 'Flagged', avatar: null,
        details: {
            accountAge: '2 months',
            orderHistory: { total: 3, spent: 1200.00, average: 400.00 },
            recentOrders: [
                { id: 'ORD-8741', date: 'Jan 20, 2026', amount: 400.00, status: 'Delivered' },
            ],
            favoriteRestaurants: [
                { name: 'Jollibee', orders: 2 },
            ],
            activityLog: [
                { type: 'order_placed', label: 'Order Placed', detail: '#TMC-882935 • Jollibee', amount: 180.00, time: '1d ago', icon: 'order' },
            ],
        }
    },
    {
        id: 'TMC-00102', name: 'Amy Lee', email: 'amylee@email.com', phone: '+63 918 *** 9988',
        location: 'Pasig City', orders: 0, totalSpent: 0, registered: 'Jan 25, 2026',
        status: 'Banned', avatar: null,
        details: {
            accountAge: '1 month',
            orderHistory: { total: 0, spent: 0, average: 0 },
            recentOrders: [],
            favoriteRestaurants: [],
            activityLog: [],
        }
    },
    {
        id: 'TMC-04533', name: 'Robert Brown', email: 'robertbrown@email.com', phone: '+63 927 *** 3344',
        location: 'Cebu City', orders: 128, totalSpent: 65820.00, registered: 'Jan 22, 2026',
        status: 'Active', avatar: null,
        details: {
            accountAge: '1 year, 3 months',
            orderHistory: { total: 128, spent: 65820.00, average: 514.22 },
            recentOrders: [
                { id: 'ORD-9100', date: 'Jan 28, 2026', amount: 520.00, status: 'Delivered' },
                { id: 'ORD-9045', date: 'Jan 26, 2026', amount: 480.00, status: 'Delivered' },
            ],
            favoriteRestaurants: [
                { name: 'Jollibee', orders: 45 },
                { name: 'Mcdonalds', orders: 30 },
                { name: 'Patty Shack', orders: 20 },
            ],
            activityLog: [
                { type: 'order_placed', label: 'Order Placed', detail: '#TMC-882955 • Jollibee', amount: 520.00, time: '30m ago', icon: 'order' },
            ],
        }
    },
    {
        id: 'TMC-00421', name: 'Kevin White', email: 'kevinwhite@email.com', phone: '+63 917 *** 4567',
        location: 'Makati City', orders: 21, totalSpent: 12450.00, registered: 'Jan 16, 2026',
        status: 'Active', avatar: null,
        details: {
            accountAge: '1 year, 2 months',
            orderHistory: { total: 21, spent: 12450.00, average: 592.86 },
            recentOrders: [
                { id: 'ORD-8900', date: 'Jan 24, 2026', amount: 450.00, status: 'Delivered' },
            ],
            favoriteRestaurants: [
                { name: 'Burger King', orders: 8 },
            ],
            activityLog: [
                { type: 'login', label: 'Login activity', detail: 'Samsung S24 • Makati City', time: '1h ago', icon: 'login' },
            ],
        }
    },
];

const STATUS_TABS = ['All', 'Active', 'Inactive', 'Flagged', 'Banned', 'Pending Verification'];

const STATS = [
    { label: 'Total Customers', value: '12,850', sub: '+12% from last m...', icon: <Users size={18} />, color: '#FEF2F2', iconColor: '#DC2626' },
    { label: 'Active This Month', value: '8,432', sub: '65% of total', icon: <Users size={18} />, color: '#FFF7ED', iconColor: '#EA580C' },
    { label: 'New Registrations', value: '85', sub: 'Last 7 days', icon: <UserPlus size={18} />, color: '#FFF7ED', iconColor: '#EA580C' },
    { label: 'Flagged Accounts', value: '28', sub: 'Requires review', icon: <Flag size={18} />, color: '#FEF2F2', iconColor: '#DC2626' },
    { label: 'Avg Orders / Cust.', value: '12.4', sub: 'Per lifetime', icon: <ShoppingCart size={18} />, color: '#FEF2F2', iconColor: '#DC2626' },
];

const EXPORT_COLUMNS = [
    'Customer Name', 'Account ID', 'Email', 'Phone', 'Location', 'Total Orders',
    'Total Spent', 'Registered Date', 'Status'
];

const BAN_REASONS = [
    'Fraudulent activity', 'Abusive behavior', 'Multiple policy violations',
    'Spam / fake reviews', 'Suspicious payment activity', 'Other'
];

function getStatusClass(status) {
    const s = status.toLowerCase().replace(/\s+/g, '');
    if (s === 'active') return styles.statusActive;
    if (s === 'flagged') return styles.statusFlagged;
    if (s === 'banned') return styles.statusBanned;
    if (s === 'inactive') return styles.statusInactive;
    if (s === 'pendingverification') return styles.statusPending;
    return '';
}

function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function getInitialColor(name) {
    const colors = ['#DC2626', '#EA580C', '#D97706', '#059669', '#2563EB', '#7C3AED', '#DB2777'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
}

function peso(v) { return `₱${Number(v || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`; }

function getActivityIcon(type) {
    switch(type) {
        case 'order': return <ShoppingCart size={16} />;
        case 'complete': return <CheckCircle2 size={16} />;
        case 'login': return <FileText size={16} />;
        case 'reveal': return <Eye size={16} />;
        case 'refund': return <AlertTriangle size={16} />;
        default: return <Info size={16} />;
    }
}

function getActivityColor(type) {
    switch(type) {
        case 'order': return '#059669';
        case 'complete': return '#059669';
        case 'login': return '#6B7280';
        case 'reveal': return '#EA580C';
        case 'refund': return '#DC2626';
        default: return '#6B7280';
    }
}

/* ─── Main Component ────────────────────────────────────────────────────────── */
export default function AdminCustomersSection() {
    const [activeTab, setActiveTab] = useState('All');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showExport, setShowExport] = useState(false);
    const [showSuspend, setShowSuspend] = useState(null);
    const [showActivity, setShowActivity] = useState(null);
    const [exportFormat, setExportFormat] = useState('csv');
    const [exportColumns, setExportColumns] = useState(EXPORT_COLUMNS.reduce((acc, col) => ({ ...acc, [col]: true }), {}));
    const [suspendReason, setSuspendReason] = useState('');
    const [suspendNotes, setSuspendNotes] = useState('');
    const [suspendNotify, setSuspendNotify] = useState(true);
    const [suspendBlock, setSuspendBlock] = useState(true);
    const [toast, setToast] = useState(null);
    const [regionFilter, setRegionFilter] = useState('All Regions');
    const [paymentFilter, setPaymentFilter] = useState('All');
    const [orderCountFilter, setOrderCountFilter] = useState('Any count');
    
    // API state
    const [customers, setCustomers] = useState([]);
    const [stats, setStats] = useState({
        total_customers: 0,
        active_this_month: 0,
        active_percentage: 0,
        new_registrations: 0,
        flagged_accounts: 0,
        avg_orders_per_customer: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch customer stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/admin/customers/stats');
                setStats(response.data.stats);
            } catch (err) {
                console.error('Error fetching customer stats:', err);
            }
        };
        fetchStats();
    }, []);

    // Fetch customers list
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await api.get('/admin/customers?per_page=50');
                setCustomers(response.data.data || []);
            } catch (err) {
                console.error('Error fetching customers:', err);
                setError(err.message);
                setCustomers(MOCK_CUSTOMERS);
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, [activeTab]);

    const filteredCustomers = useMemo(() => {
        let custs = customers;
        if (activeTab !== 'All') {
            custs = custs.filter(c => {
                if (activeTab === 'Pending Verification') return c.status === 'Pending Verification';
                return c.status?.toLowerCase() === activeTab.toLowerCase();
            });
        }
        return custs;
    }, [activeTab, customers]);

    // Fetch customer details when customer is selected
    useEffect(() => {
        if (selectedCustomer && !selectedCustomer.details) {
            const fetchCustomerDetail = async () => {
                try {
                    const response = await api.get(`/admin/customers/${selectedCustomer.id}`);
                    setSelectedCustomer(response.data);
                } catch (err) {
                    console.error('Error fetching customer details:', err);
                }
            };
            fetchCustomerDetail();
        }
    }, [selectedCustomer?.id]);

    const clearFilters = () => {
        setRegionFilter('All Regions');
        setPaymentFilter('All');
        setOrderCountFilter('Any count');
        setActiveTab('All');
    };

    const toggleExportColumn = (col) => {
        setExportColumns(prev => ({ ...prev, [col]: !prev[col] }));
    };

    const handleExport = () => {
        setShowExport(false);
        setToast({ type: 'success', message: 'Export ready - downloading now', sub: 'TMC_Foodhub_Customers_Export.csv' });
        setTimeout(() => setToast(null), 4000);
    };

    const handleSuspend = () => {
        const name = showSuspend.name;
        setShowSuspend(null);
        setSuspendReason('');
        setSuspendNotes('');
        setToast({ type: 'success', message: 'Success', sub: `${name} has been suspended successfully` });
        setTimeout(() => setToast(null), 4000);
    };

    return (
        <div className={styles.container}>
            {/* Toast */}
            {toast && (
                <div className={styles.toast}>
                    <CheckCircle2 size={20} className={styles.toastIcon} />
                    <div>
                        <div className={styles.toastTitle}>{toast.message}</div>
                        <div className={styles.toastSub}>{toast.sub}</div>
                    </div>
                    <button className={styles.toastClose} onClick={() => setToast(null)}><X size={16} /></button>
                </div>
            )}

            {/* Stats */}
            <div className={styles.statsRow}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: '#FEF2F2', color: '#DC2626' }}>
                        <Users size={18} />
                    </div>
                    <div className={styles.statBody}>
                        <div className={styles.statLabel}>Total Customers</div>
                        <div className={styles.statValue}>{stats.total_customers?.toLocaleString()}</div>
                        <div className={styles.statSub}>+12% from last month</div>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: '#FFF7ED', color: '#EA580C' }}>
                        <Users size={18} />
                    </div>
                    <div className={styles.statBody}>
                        <div className={styles.statLabel}>Active This Month</div>
                        <div className={styles.statValue}>{stats.active_this_month?.toLocaleString()}</div>
                        <div className={styles.statSub}>{stats.active_percentage}% of total</div>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: '#FFF7ED', color: '#EA580C' }}>
                        <UserPlus size={18} />
                    </div>
                    <div className={styles.statBody}>
                        <div className={styles.statLabel}>New Registrations</div>
                        <div className={styles.statValue}>{stats.new_registrations}</div>
                        <div className={styles.statSub}>Last 7 days</div>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: '#FEF2F2', color: '#DC2626' }}>
                        <Flag size={18} />
                    </div>
                    <div className={styles.statBody}>
                        <div className={styles.statLabel}>Flagged Accounts</div>
                        <div className={styles.statValue}>{stats.flagged_accounts}</div>
                        <div className={styles.statSub}>Requires review</div>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: '#FEF2F2', color: '#DC2626' }}>
                        <ShoppingCart size={18} />
                    </div>
                    <div className={styles.statBody}>
                        <div className={styles.statLabel}>Avg Orders / Cust.</div>
                        <div className={styles.statValue}>{stats.avg_orders_per_customer?.toFixed(1)}</div>
                        <div className={styles.statSub}>Per lifetime</div>
                    </div>
                </div>
            </div>

            {/* Tabs & Export */}
            <div className={styles.filtersBar}>
                <div className={styles.tabs}>
                    {STATUS_TABS.map(tab => (
                        <button key={tab} className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`} onClick={() => setActiveTab(tab)}>
                            {tab}
                        </button>
                    ))}
                </div>
                <button className={styles.exportBtn} onClick={() => setShowExport(true)}>
                    <Download size={16} /> Export
                </button>
            </div>

            {/* Dropdown Filters */}
            <div className={styles.dropdownFilters}>
                <div className={styles.selectWrap}>
                    <select value={regionFilter} onChange={e => setRegionFilter(e.target.value)}>
                        <option>All Regions</option>
                        <option>Makati City</option>
                        <option>Quezon City</option>
                        <option>Pasig City</option>
                        <option>Cebu City</option>
                    </select>
                    <ChevronDown size={14} className={styles.selectArrow} />
                </div>
                <div className={styles.selectWrap}>
                    <select value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)}>
                        <option value="All">Payment Method: All</option>
                        <option>GCash</option>
                        <option>COD</option>
                        <option>Credit Card</option>
                        <option>Maya</option>
                    </select>
                    <ChevronDown size={14} className={styles.selectArrow} />
                </div>
                <div className={styles.selectWrap}>
                    <select value={orderCountFilter} onChange={e => setOrderCountFilter(e.target.value)}>
                        <option value="Any count">Order Count: Any count</option>
                        <option>0 orders</option>
                        <option>1-10 orders</option>
                        <option>11-50 orders</option>
                        <option>50+ orders</option>
                    </select>
                    <ChevronDown size={14} className={styles.selectArrow} />
                </div>
                <button className={styles.clearBtn} onClick={clearFilters}>Clear all</button>
            </div>

            {/* Table */}
            <div className={styles.tableCard}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Customer</th>
                            <th>Contact</th>
                            <th>Location</th>
                            <th>Orders</th>
                            <th>Total Spent</th>
                            <th>Registered</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCustomers.map(cust => (
                            <tr key={cust.id + cust.name} className={styles.tableRow}>
                                <td>
                                    <div className={styles.customerCell}>
                                        <div className={styles.avatarCircle} style={{ background: getInitialColor(cust.name) }}>
                                            {getInitials(cust.name)}
                                        </div>
                                        <div>
                                            <div className={styles.customerName}>{cust.name}</div>
                                            <div className={styles.customerId}>ID: {cust.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className={styles.contactCell}>
                                        <div className={styles.contactEmail}>{cust.email}</div>
                                        <div className={styles.contactPhone}>{cust.phone}</div>
                                    </div>
                                </td>
                                <td>{cust.location}</td>
                                <td className={styles.ordersCell}>{cust.orders}</td>
                                <td className={styles.spentCell}>{peso(cust.totalSpent)}</td>
                                <td className={styles.dateCell}>{cust.registered}</td>
                                <td>
                                    <span className={`${styles.statusPill} ${getStatusClass(cust.status)}`}>
                                        {cust.status}
                                    </span>
                                </td>
                                <td>
                                    <div className={styles.actionBtns}>
                                        <button className={styles.actionIcon} title="View details" onClick={() => setSelectedCustomer(cust)}>
                                            <Eye size={15} />
                                        </button>
                                        {cust.status === 'Flagged' && (
                                            <button className={styles.actionTextBtn} onClick={() => setSelectedCustomer(cust)}>Review</button>
                                        )}
                                        {cust.status === 'Banned' && (
                                            <button className={styles.actionTextBtn} onClick={() => setShowActivity(cust)}>View Logs</button>
                                        )}
                                        {cust.status === 'Active' && (
                                            <button className={styles.actionIcon} title="Flag account" onClick={() => setShowActivity(cust)}>
                                                <Flag size={15} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ── Customer Details Panel ── */}
            {selectedCustomer && (
                <>
                    <div className={styles.panelOverlay} onClick={() => setSelectedCustomer(null)} />
                    <div className={styles.detailPanel}>
                        <div className={styles.panelHeader}>
                            <h2 className={styles.panelTitle}>Customer Details</h2>
                            <button className={styles.panelClose} onClick={() => setSelectedCustomer(null)}><X size={20} /></button>
                        </div>
                        <div className={styles.panelBody}>
                            {/* Profile */}
                            <div className={styles.profileSection}>
                                <div className={styles.profileAvatar} style={{ background: getInitialColor(selectedCustomer.name) }}>
                                    {getInitials(selectedCustomer.name)}
                                </div>
                                <div>
                                    <div className={styles.profileName}>{selectedCustomer.name}</div>
                                    <div className={styles.profileId}>ID: {selectedCustomer.id}</div>
                                    <span className={`${styles.statusPill} ${getStatusClass(selectedCustomer.status)}`} style={{ marginTop: 4 }}>
                                        {selectedCustomer.status} Account
                                    </span>
                                </div>
                            </div>

                            {/* Personal Info */}
                            <div className={styles.infoSection}>
                                <h4 className={styles.sectionLabel}>Personal Information</h4>
                                <div className={styles.infoGrid}>
                                    <div className={styles.infoItem}><Mail size={14} className={styles.infoIcon} /> <span className={styles.infoKey}>Email</span> <span className={styles.infoVal}>{selectedCustomer.email}</span></div>
                                    <div className={styles.infoItem}><Phone size={14} className={styles.infoIcon} /> <span className={styles.infoKey}>Phone</span> <span className={styles.infoVal}>{selectedCustomer.phone} <Eye size={12} className={styles.revealIcon} /></span></div>
                                    <div className={styles.infoItem}><MapPin size={14} className={styles.infoIcon} /> <span className={styles.infoKey}>Location</span> <span className={styles.infoVal}>{selectedCustomer.location}</span></div>
                                    <div className={styles.infoItem}><Clock size={14} className={styles.infoIcon} /> <span className={styles.infoKey}>Account Age</span> <span className={styles.infoVal}>{selectedCustomer.details.accountAge}</span></div>
                                </div>
                            </div>

                            {/* Order History */}
                            <div className={styles.orderHistorySection}>
                                <h4 className={styles.sectionLabel}>Order History</h4>
                                <div className={styles.orderStatsRow}>
                                    <div className={styles.orderStat}>
                                        <div className={styles.orderStatLabel}>Total</div>
                                        <div className={styles.orderStatValue}>{selectedCustomer.details.orderHistory.total}</div>
                                    </div>
                                    <div className={styles.orderStat}>
                                        <div className={styles.orderStatLabel}>Spent</div>
                                        <div className={styles.orderStatValue}>{peso(selectedCustomer.details.orderHistory.spent)}</div>
                                    </div>
                                    <div className={styles.orderStat}>
                                        <div className={styles.orderStatLabel}>Average</div>
                                        <div className={styles.orderStatValue}>{peso(selectedCustomer.details.orderHistory.average)}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Orders */}
                            {selectedCustomer.details.recentOrders.length > 0 && (
                                <div>
                                    <div className={styles.sectionHeaderRow}>
                                        <h4 className={styles.sectionLabel} style={{ margin: 0 }}>Recent Orders</h4>
                                        <button className={styles.viewAllLink}>View All Orders</button>
                                    </div>
                                    <div className={styles.recentOrdersList}>
                                        {selectedCustomer.details.recentOrders.map(o => (
                                            <div key={o.id} className={styles.recentOrderItem}>
                                                <div>
                                                    <div className={styles.recentOrderId}>#{o.id}</div>
                                                    <div className={styles.recentOrderDate}>{o.date}</div>
                                                </div>
                                                <div className={styles.recentOrderRight}>
                                                    <div className={styles.recentOrderAmount}>{peso(o.amount)}</div>
                                                    <div className={styles.recentOrderStatus}>{o.status}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Favorite Restaurants */}
                            {selectedCustomer.details.favoriteRestaurants.length > 0 && (
                                <div>
                                    <h4 className={styles.sectionLabel}>Favorite Restaurants</h4>
                                    <div className={styles.favList}>
                                        {selectedCustomer.details.favoriteRestaurants.map(r => (
                                            <div key={r.name} className={styles.favItem}>
                                                <div className={styles.favIcon} style={{ background: getInitialColor(r.name) }}>
                                                    {r.name[0]}
                                                </div>
                                                <span className={styles.favName}>{r.name}</span>
                                                <span className={styles.favOrders}>{r.orders} orders</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className={styles.panelActions}>
                            <button className={styles.flagBtn} onClick={() => { setSelectedCustomer(null); }}>
                                <Flag size={14} /> Flag Account
                            </button>
                            <div className={styles.panelActionRow}>
                                <button className={styles.suspendBtn} onClick={() => { setShowSuspend(selectedCustomer); setSelectedCustomer(null); }}>
                                    Suspend Account
                                </button>
                                <button className={styles.banBtn} onClick={() => { setShowSuspend(selectedCustomer); setSelectedCustomer(null); }}>
                                    <Ban size={14} /> Ban Account
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* ── Export Modal ── */}
            {showExport && (
                <>
                    <div className={styles.modalOverlay} onClick={() => setShowExport(false)} />
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <div>
                                <h2 className={styles.modalTitle}>Export Customers Data</h2>
                                <p className={styles.modalSub}>Download a snapshot of your customer data based on your selected filters and date range.</p>
                            </div>
                            <button className={styles.panelClose} onClick={() => setShowExport(false)}><X size={20} /></button>
                        </div>

                        <div className={styles.modalBody}>
                            <label className={styles.fieldLabel}>Date Range</label>
                            <div className={styles.selectWrap} style={{ width: '100%' }}>
                                <select style={{ width: '100%' }}>
                                    <option>All Time</option>
                                    <option>Last 7 days</option>
                                    <option>Last 30 days</option>
                                    <option>Last 3 months</option>
                                </select>
                                <ChevronDown size={14} className={styles.selectArrow} />
                            </div>

                            <label className={styles.fieldLabel} style={{ marginTop: '1rem' }}>File Format</label>
                            <div className={styles.formatRow}>
                                <label className={`${styles.formatOption} ${exportFormat === 'csv' ? styles.formatActive : ''}`}>
                                    <input type="radio" name="format" checked={exportFormat === 'csv'} onChange={() => setExportFormat('csv')} />
                                    <div>
                                        <div className={styles.formatTitle}>CSV</div>
                                        <div className={styles.formatSub}>Spreadsheet data</div>
                                    </div>
                                </label>
                                <label className={`${styles.formatOption} ${exportFormat === 'pdf' ? styles.formatActive : ''}`}>
                                    <input type="radio" name="format" checked={exportFormat === 'pdf'} onChange={() => setExportFormat('pdf')} />
                                    <div>
                                        <div className={styles.formatTitle}>PDF</div>
                                        <div className={styles.formatSub}>Visual report</div>
                                    </div>
                                </label>
                            </div>

                            <label className={styles.fieldLabel} style={{ marginTop: '1rem' }}>Select columns to include</label>
                            <div className={styles.columnsGrid}>
                                {EXPORT_COLUMNS.map(col => (
                                    <label key={col} className={styles.columnCheck}>
                                        <input type="checkbox" checked={exportColumns[col]} onChange={() => toggleExportColumn(col)} />
                                        <span className={styles.customCheckbox}><CheckCircle2 size={14} /></span>
                                        {col}
                                    </label>
                                ))}
                            </div>

                            <div className={styles.exportNote}>
                                <Info size={14} /> Exports include only data visible to your admin role.
                            </div>
                        </div>

                        <div className={styles.modalFooter}>
                            <button className={styles.downloadBtn} onClick={handleExport}>Download Report</button>
                            <button className={styles.cancelLink} onClick={() => setShowExport(false)}>Cancel</button>
                        </div>
                    </div>
                </>
            )}

            {/* ── Suspend / Ban Modal ── */}
            {showSuspend && (
                <>
                    <div className={styles.modalOverlay} onClick={() => setShowSuspend(null)} />
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>Suspend Customer?</h2>
                            <button className={styles.panelClose} onClick={() => setShowSuspend(null)}><X size={20} /></button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.suspendProfile}>
                                <div className={styles.avatarCircle} style={{ background: getInitialColor(showSuspend.name), width: 40, height: 40 }}>
                                    {getInitials(showSuspend.name)}
                                </div>
                                <div>
                                    <div className={styles.customerName}>{showSuspend.name}</div>
                                    <div className={styles.customerId}>ID: {showSuspend.id}</div>
                                </div>
                            </div>

                            <div className={styles.cautionBox}>
                                <AlertTriangle size={16} />
                                <span><strong>CAUTION:</strong> This will permanently restrict this customer from placing orders, leaving reviews, and accessing the platform.</span>
                            </div>

                            <label className={styles.fieldLabel}>Ban Reason *</label>
                            <div className={styles.selectWrap} style={{ width: '100%' }}>
                                <select value={suspendReason} onChange={e => setSuspendReason(e.target.value)} style={{ width: '100%' }}>
                                    <option value="">Select a reason...</option>
                                    {BAN_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                                <ChevronDown size={14} className={styles.selectArrow} />
                            </div>

                            <label className={styles.fieldLabel} style={{ marginTop: '1rem' }}>Admin Notes (Optional)</label>
                            <textarea
                                className={styles.textarea}
                                placeholder="Detailed reason for banning this account..."
                                value={suspendNotes}
                                onChange={e => setSuspendNotes(e.target.value)}
                                rows={3}
                            />
                            <div className={styles.textareaHint}>Visible to other admins only.</div>

                            <label className={styles.fieldLabel} style={{ marginTop: '1rem' }}>Supporting Reference</label>
                            <div className={styles.selectWrap} style={{ width: '100%' }}>
                                <select style={{ width: '100%' }}>
                                    <option>e.g. Ticket ID, Incident Link</option>
                                </select>
                                <ChevronDown size={14} className={styles.selectArrow} />
                            </div>

                            <div className={styles.checkboxGroup}>
                                <label className={styles.checkboxLabel}>
                                    <input type="checkbox" checked={suspendNotify} onChange={() => setSuspendNotify(!suspendNotify)} />
                                    <span className={styles.customCheckbox}><CheckCircle2 size={14} /></span>
                                    Notify customer via email about this ban
                                </label>
                                <label className={styles.checkboxLabel}>
                                    <input type="checkbox" checked={suspendBlock} onChange={() => setSuspendBlock(!suspendBlock)} />
                                    <span className={styles.customCheckbox}><CheckCircle2 size={14} /></span>
                                    Block associated phone number & alternate emails
                                </label>
                            </div>
                        </div>

                        <div className={styles.modalFooterRow}>
                            <button className={styles.cancelModalBtn} onClick={() => setShowSuspend(null)}>Cancel</button>
                            <button className={styles.confirmSuspendBtn} onClick={handleSuspend}>Confirm Suspension</button>
                        </div>
                    </div>
                </>
            )}

            {/* ── Activity Log Panel ── */}
            {showActivity && (
                <>
                    <div className={styles.panelOverlay} onClick={() => setShowActivity(null)} />
                    <div className={styles.detailPanel}>
                        <div className={styles.panelHeader}>
                            <h2 className={styles.panelTitle}>Activity Log</h2>
                            <button className={styles.panelClose} onClick={() => setShowActivity(null)}><X size={20} /></button>
                        </div>
                        <div className={styles.panelBody}>
                            {/* Profile */}
                            <div className={styles.profileSection}>
                                <div className={styles.profileAvatar} style={{ background: getInitialColor(showActivity.name) }}>
                                    {getInitials(showActivity.name)}
                                </div>
                                <div>
                                    <div className={styles.profileName}>{showActivity.name}</div>
                                    <div className={styles.profileId}>ID: {showActivity.id}</div>
                                    <span className={`${styles.statusPill} ${getStatusClass(showActivity.status)}`} style={{ marginTop: 4 }}>
                                        {showActivity.status} Account
                                    </span>
                                </div>
                            </div>

                            <div className={styles.sectionHeaderRow}>
                                <h4 className={styles.sectionLabel} style={{ margin: 0 }}>Activity Log</h4>
                                <button className={styles.viewAllLink} style={{ color: '#DC2626' }}>
                                    <Download size={13} /> Export Log
                                </button>
                            </div>

                            {/* Filters */}
                            <div className={styles.activityFilters}>
                                <div className={styles.selectWrap}>
                                    <select><option>All Regions</option></select>
                                    <ChevronDown size={14} className={styles.selectArrow} />
                                </div>
                                <div className={styles.activitySearch}>
                                    <Search size={14} />
                                    <input placeholder="Search partners, orders, or ID..." />
                                </div>
                            </div>

                            {/* Activity Items */}
                            <div className={styles.activityList}>
                                {showActivity.details.activityLog.map((item, i) => (
                                    <div key={i} className={styles.activityItem}>
                                        <div className={styles.activityDot} style={{ color: getActivityColor(item.icon) }}>
                                            {getActivityIcon(item.icon)}
                                        </div>
                                        <div className={styles.activityContent}>
                                            <div className={styles.activityLabel}>{item.label}</div>
                                            <div className={styles.activityDetail}>{item.detail}</div>
                                            {item.amount && <div className={styles.activityAmount}>{peso(item.amount)}</div>}
                                        </div>
                                        <div className={styles.activityTime}>{item.time}</div>
                                    </div>
                                ))}
                                {showActivity.details.activityLog.length === 0 && (
                                    <div className={styles.emptyActivity}>No activity recorded yet.</div>
                                )}
                            </div>
                        </div>

                        <div className={styles.panelActions}>
                            <button className={styles.viewHistoryBtn}>View Full History</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
