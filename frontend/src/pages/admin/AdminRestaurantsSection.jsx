import React, { useEffect, useState, useMemo } from 'react';
import {
    Store, CheckCircle2, Clock, AlertTriangle, Star, Download, ChevronDown, Eye,
    MoreVertical, X, MapPin, Phone, Mail, Edit, Send, Ban, FileText, Info,
    ArrowLeft, ExternalLink, TrendingUp, Truck, DollarSign, Shield, Loader
} from 'lucide-react';
import styles from './AdminRestaurantsSection.module.css';

/* ─── Mock Data ─────────────────────────────────────────────────────────────── */
const MOCK_RESTAURANTS = [
    {
        id: 'RE-4852', name: 'Patty Shack', badge: 'New Branch', cuisine: 'Burgers',
        owner: { name: 'Juan Dela Cruz', email: 'juandelacruz@gmail.com', phone: '+63 917 123 4567', avatar: null },
        rating: 4.6, reviewCount: 210, revenue: 452000, status: 'Active', joined: 'Jan 20, 2026', logo: null,
        details: {
            location: 'Quezon City, Manila', registered: 'Jan 25, 2026',
            totalOrders: 1284, totalRevenue: 452000, avgRating: 4.8, fulfillmentRate: 98.2,
            ownerBranches: 3, accountCreated: 'Jan 25, 2026',
            documents: [
                { name: 'bir_form_2303_2026.pdf', signed: 'Jan 25, 2026', expiry: 'Jan 26, 2027', status: 'Valid' },
                { name: 'Driver_License.jpg', signed: 'Dec 31, 2025', expiry: 'Dec 31, 2027', status: 'Valid' },
            ],
            chartData: [3200, 5100, 8500, 11200, 14800, 9100, 6500],
            payoutSummary: { pending: 42850.50, lastPayout: 18200, lastPayoutDate: 'Jan 30', commRate: 10.0 },
            operational: { deliveryRadius: '5.0 km', prepTime: '15-20 mins', minOrder: 250.00 },
            recentOrders: [
                { id: '#8842', items: '2x Classic Burger, 1x Large Fries', status: 'Cancelled', amount: 1240.00 },
                { id: '#8841', items: '1x Pizza Margherita (Large)', status: 'Preparing', amount: 850.50 },
                { id: '#8840', items: '3x Street Tacos, 1x Coke Zero', status: 'Delivered', amount: 3100.00 },
                { id: '#8842', items: '2x Classic Burger, 1x Large Fries', status: 'Cancelled', amount: 1240.00 },
                { id: '#8840', items: '3x Street Tacos, 1x Coke Zero', status: 'Delivered', amount: 3100.00 },
            ],
            recentReviews: [
                { author: 'Maria L.', rating: 5, text: 'The Lumpiang Shanghai is so crispy and still hot when it arrived! SM Baguio branch never fails to deliver quality food. Highly recommended for family dinners.', orderId: '#60184', time: '5 mins ago' },
                { author: 'James T.', rating: 5, text: 'Great food as always. Delivery was a bit slow today due to the rain, but the rider was very polite and the packaging kept everything dry.', orderId: '#8802', time: '3 hours ago' },
            ],
            disputes: [
                { id: '#DS-2910', type: 'Missing Items', date: 'Jan 18, 2026', resolution: 'Refund Issued (Partner Deducted)', status: 'Resolved' },
                { id: '#DS-2915', type: 'Poor Food Quality', date: 'Jan 10, 2026', resolution: 'Awaiting partner response', status: 'Pending' },
                { id: '#DS-2862', type: 'Delivery Delay', date: 'Jan 15, 2026', resolution: 'Rejected (No proof provided)', status: 'Closed' },
            ],
            unresolvedDisputes: 3,
            responseRate: 72,
        }
    },
    {
        id: 'RE-3210', name: 'Mcdonalds', badge: null, cuisine: 'Fast Food',
        owner: { name: 'Daniel Reyes', email: 'danielreyes@email.com', phone: '+63 920 111 2233', avatar: null },
        rating: 4.8, reviewCount: 184, revenue: 359000, status: 'Pending', joined: 'Feb 15, 2026', logo: null,
        details: {
            location: 'Makati City, Manila', registered: 'Feb 15, 2026',
            totalOrders: 920, totalRevenue: 359000, avgRating: 4.8, fulfillmentRate: 95.1,
            ownerBranches: 1, accountCreated: 'Feb 10, 2026',
            documents: [{ name: 'business_permit.pdf', signed: 'Feb 10, 2026', expiry: 'Feb 10, 2027', status: 'Valid' }],
            chartData: [2100, 3800, 4500, 6200, 8000, 5500, 4200],
            payoutSummary: { pending: 28500.00, lastPayout: 12000, lastPayoutDate: 'Feb 1', commRate: 10.0 },
            operational: { deliveryRadius: '3.0 km', prepTime: '10-15 mins', minOrder: 150.00 },
            recentOrders: [{ id: '#9010', items: '1x Big Mac Meal', status: 'Delivered', amount: 350.00 }],
            recentReviews: [{ author: 'Carlo A.', rating: 4, text: 'Good food, fast delivery.', orderId: '#9010', time: '2h ago' }],
            disputes: [], unresolvedDisputes: 0, responseRate: 85,
        }
    },
    {
        id: 'RE-1050', name: 'Burger King', badge: null, cuisine: 'Fast Food',
        owner: { name: 'Adrian Cruz', email: 'adriancruz@email.com', phone: '+63 918 222 3344', avatar: null },
        rating: 0, reviewCount: 0, revenue: 0, status: 'Under Review', joined: 'Mar 12, 2026', logo: null,
        details: {
            location: 'Pasig City', registered: 'Mar 12, 2026',
            totalOrders: 0, totalRevenue: 0, avgRating: 0, fulfillmentRate: 0,
            ownerBranches: 1, accountCreated: 'Mar 10, 2026',
            documents: [], chartData: [0, 0, 0, 0, 0, 0, 0],
            payoutSummary: { pending: 0, lastPayout: 0, lastPayoutDate: '-', commRate: 10.0 },
            operational: { deliveryRadius: '2.0 km', prepTime: '20-25 mins', minOrder: 200.00 },
            recentOrders: [], recentReviews: [], disputes: [], unresolvedDisputes: 0, responseRate: 0,
        }
    },
    {
        id: 'RE-0820', name: 'Jollibee', badge: null, cuisine: 'Fast Food',
        owner: { name: 'Miguel Santos', email: 'miguelsantos@email.com', phone: '+63 927 333 4455', avatar: null },
        rating: 4.7, reviewCount: 393, revenue: 148000, status: 'Suspended', joined: 'Jan 12, 2026', logo: null,
        details: {
            location: 'Cebu City', registered: 'Jan 12, 2026',
            totalOrders: 450, totalRevenue: 148000, avgRating: 4.7, fulfillmentRate: 88.5,
            ownerBranches: 2, accountCreated: 'Jan 10, 2026',
            documents: [{ name: 'sanitary_permit.pdf', signed: 'Jan 8, 2026', expiry: 'Jan 8, 2027', status: 'Valid' }],
            chartData: [1800, 2200, 3100, 2800, 3500, 2100, 1500],
            payoutSummary: { pending: 12400.00, lastPayout: 8500, lastPayoutDate: 'Jan 15', commRate: 10.0 },
            operational: { deliveryRadius: '4.0 km', prepTime: '15-20 mins', minOrder: 200.00 },
            recentOrders: [{ id: '#7500', items: '2x Chickenjoy', status: 'Delivered', amount: 280.00 }],
            recentReviews: [{ author: 'Lisa B.', rating: 5, text: 'Best Chickenjoy ever!', orderId: '#7500', time: '1d ago' }],
            disputes: [{ id: '#DS-2800', type: 'Late Delivery', date: 'Jan 5, 2026', resolution: 'Warning Issued', status: 'Resolved' }],
            unresolvedDisputes: 0, responseRate: 68,
        }
    },
];

const STATUS_TABS = ['All Partners', 'Pending Review (85)', 'Active', 'Suspended', 'Under Review', 'New This Month'];
const STATS = [
    { label: 'Total Partners', value: '1,298', sub: '+12% from last m...', icon: <Store size={18} />, color: '#FEF2F2', iconColor: '#DC2626' },
    { label: 'Active', value: '1,150', sub: '5.2% growth', icon: <CheckCircle2 size={18} />, color: '#ECFDF5', iconColor: '#059669' },
    { label: 'Pending Review', value: '85', sub: 'Requires Attention', icon: <Clock size={18} />, color: '#FFF7ED', iconColor: '#EA580C' },
    { label: 'Suspended', value: '49', sub: 'Policy Violations', icon: <AlertTriangle size={18} />, color: '#FEF2F2', iconColor: '#DC2626' },
    { label: 'Average Rating', value: '4.3', sub: 'Platform Health Indic...', icon: <Star size={18} />, color: '#FFF7ED', iconColor: '#EA580C', isStar: true },
];
const EXPORT_COLUMNS = ['Restaurant Name', 'Owner', 'Cuisine', 'Rating', 'Revenue', 'Status', 'Date Joined'];
const SUSPEND_REASONS = ['Policy Violation', 'Customer Complaints', 'Poor Food Quality', 'Health & Safety Concern', 'Fraudulent Activity', 'Other'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getStatusClass(s) {
    const v = s.toLowerCase().replace(/\s+/g, '');
    if (v === 'active') return styles.statusActive;
    if (v === 'pending') return styles.statusPending;
    if (v === 'underreview') return styles.statusUnderReview;
    if (v === 'suspended') return styles.statusSuspended;
    return '';
}
function getOrderStatusClass(s) {
    const v = s.toLowerCase();
    if (v === 'cancelled') return styles.orderCancelled;
    if (v === 'preparing') return styles.orderPreparing;
    if (v === 'delivered') return styles.orderDelivered;
    if (v === 'pending') return styles.orderPending;
    return '';
}
function getDisputeStatusClass(s) {
    const v = s.toLowerCase();
    if (v === 'resolved') return styles.disputeResolved;
    if (v === 'pending') return styles.disputePending;
    if (v === 'closed') return styles.disputeClosed;
    return '';
}
function getInitials(name) { return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2); }
function getColor(name) {
    const c = ['#DC2626','#EA580C','#D97706','#059669','#2563EB','#7C3AED','#DB2777'];
    let h = 0; for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
    return c[Math.abs(h) % c.length];
}
function peso(v) { return `₱${Number(v||0).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}`; }
function pesoShort(v) { return v >= 1000 ? `₱${Math.round(v/1000)}k` : `₱${v}`; }

/* ─── Component ─────────────────────────────────────────────────────────────── */
export default function AdminRestaurantsSection() {
    const [activeTab, setActiveTab] = useState('All Partners');
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [showExport, setShowExport] = useState(false);
    const [showSuspend, setShowSuspend] = useState(null);
    const [exportFormat, setExportFormat] = useState('csv');
    const [exportColumns, setExportColumns] = useState(EXPORT_COLUMNS.reduce((a,c)=>({...a,[c]:true}),{}));
    const [suspendReason, setSuspendReason] = useState('');
    const [suspendNotes, setSuspendNotes] = useState('');
    const [suspendNotify, setSuspendNotify] = useState(true);
    const [toast, setToast] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [locationFilter, setLocationFilter] = useState('All');
    const [ratingFilter, setRatingFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRestaurants();
    }, [activeTab]);

    const fetchRestaurants = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('admin_auth_token');
            let statusParam = '';
            
            if (activeTab === 'Active') {
                statusParam = '&status=Active';
            } else if (activeTab === 'Suspended') {
                statusParam = '&status=Suspended';
            } else if (activeTab === 'Under Review') {
                statusParam = '&status=Under Review';
            } else if (activeTab.startsWith('Pending')) {
                statusParam = '&status=Pending Review';
            }

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/admin/restaurants?per_page=50${statusParam}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch restaurants');
            }

            const data = await response.json();
            setRestaurants(data.data || []);
        } catch (err) {
            console.error('Error fetching restaurants:', err);
            setError(err.message);
            // Fallback to mock data for development
            setRestaurants(MOCK_RESTAURANTS);
        } finally {
            setLoading(false);
        }
    };

    const filteredRestaurants = useMemo(() => {
        let r = restaurants;
        if (ratingFilter !== 'All') {
            r = r.filter(x => x.rating >= parseInt(ratingFilter));
        }
        if (categoryFilter !== 'All') {
            r = r.filter(x => x.cuisine === categoryFilter);
        }
        return r;
    }, [restaurants, ratingFilter, categoryFilter]);

    const clearFilters = () => { setCategoryFilter('All'); setLocationFilter('All'); setRatingFilter('All'); setStatusFilter('All'); setActiveTab('All Partners'); };
    const handleExport = () => { setShowExport(false); setToast({ msg: 'Export ready - downloading now', sub: 'TMC_Foodhub_Partners_Export.csv' }); setTimeout(() => setToast(null), 4000); };
    const handleSuspend = () => { const n = showSuspend.name; setShowSuspend(null); setSuspendReason(''); setSuspendNotes(''); setToast({ msg: 'Success', sub: `${n} has been suspended successfully` }); setTimeout(() => setToast(null), 4000); };

    // ─── Restaurant Details View ────────────────────────────────────────────
    if (selectedRestaurant) {
        const r = selectedRestaurant;
        const d = r.details;
        const maxChart = Math.max(...d.chartData, 1);
        return (
            <div className={styles.detailsPage}>
                {/* Toast */}
                {toast && (
                    <div className={styles.toast}>
                        <CheckCircle2 size={20} className={styles.toastIcon} />
                        <div><div className={styles.toastTitle}>{toast.msg}</div><div className={styles.toastSub}>{toast.sub}</div></div>
                        <button className={styles.toastClose} onClick={() => setToast(null)}><X size={16} /></button>
                    </div>
                )}

                {/* Back nav */}
                <button className={styles.backBtn} onClick={() => setSelectedRestaurant(null)}>
                    <ArrowLeft size={16} /> <span>Restaurant Details</span>
                </button>
                <div className={styles.breadcrumb}>Restaurant &gt; {r.name}</div>

                {/* Alert banners */}
                {d.unresolvedDisputes > 0 && (
                    <div className={styles.alertBanner + ' ' + styles.alertDanger}>
                        <AlertTriangle size={16} />
                        <span><strong>Unresolved disputes</strong> — This restaurant currently has {d.unresolvedDisputes} unresolved disputes that require administrator attention.</span>
                        <button className={styles.alertAction}>Review Now</button>
                    </div>
                )}

                {/* Profile Header */}
                <div className={styles.profileHeader}>
                    <div className={styles.profileLeft}>
                        <div className={styles.restaurantLogo} style={{ background: getColor(r.name) }}>{r.name[0]}</div>
                        <div>
                            <h2 className={styles.restaurantTitle}>{r.name}</h2>
                            <div className={styles.restaurantMeta}>
                                <span>ID: {r.id}</span> <span>•</span> <MapPin size={13} /> <span>{d.location}</span> <span>•</span> <span>Registered: {d.registered}</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.profileActions}>
                        <button className={styles.profileBtn}><Edit size={14} /> Edit Profile</button>
                        <button className={styles.profileBtn}><Send size={14} /> Send Warning</button>
                        <button className={styles.suspendHeaderBtn} onClick={() => setShowSuspend(r)}><Ban size={14} /> Suspend Restaurant</button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className={styles.quickStats}>
                    <div className={styles.qStat}>
                        <div className={styles.qLabel}>Total Orders <span className={styles.qTrend}>+12%</span></div>
                        <div className={styles.qValue}>{d.totalOrders.toLocaleString()}</div>
                        <div className={styles.qSub}>vs last month</div>
                    </div>
                    <div className={styles.qStat}>
                        <div className={styles.qLabel}>Total Revenue <span className={styles.qTrend}>+8.4%</span></div>
                        <div className={styles.qValue}>{pesoShort(d.totalRevenue)}</div>
                        <div className={styles.qSub}>Commission Earned</div>
                    </div>
                    <div className={styles.qStat}>
                        <div className={styles.qLabel}>Average Rating</div>
                        <div className={styles.qValue}>{d.avgRating} <Star size={16} className={styles.starFilled} /></div>
                        <div className={styles.qSub}>{r.reviewCount} total reviews</div>
                    </div>
                    <div className={styles.qStat}>
                        <div className={styles.qLabel}>Fulfillment Rate</div>
                        <div className={styles.qValue}>{d.fulfillmentRate}%</div>
                        <div className={styles.qSub} style={{ color: d.fulfillmentRate > 95 ? '#059669' : '#D97706' }}>
                            {d.fulfillmentRate > 95 ? 'Optimal' : 'Needs improvement'}
                        </div>
                        <div className={styles.fulfillmentBar}>
                            <div className={styles.fulfillmentFill} style={{ width: `${d.fulfillmentRate}%`, background: d.fulfillmentRate > 95 ? '#059669' : '#D97706' }} />
                        </div>
                    </div>
                </div>

                {/* Two-column layout */}
                <div className={styles.detailGrid}>
                    {/* Left Column */}
                    <div className={styles.detailLeft}>
                        {/* Compliance */}
                        <div className={styles.detailCard}>
                            <h3 className={styles.cardTitle}>Compliance & Document Health</h3>
                            <p className={styles.cardSub}>All operational and legal permits</p>
                            {d.documents.length > 0 ? (
                                <table className={styles.docTable}>
                                    <thead><tr><th>Document Name</th><th>Signed/Valid</th><th>Expiry Date</th><th>Status</th><th>Action</th></tr></thead>
                                    <tbody>
                                        {d.documents.map((doc, i) => (
                                            <tr key={i}>
                                                <td className={styles.docName}><FileText size={14} /> {doc.name}</td>
                                                <td>{doc.signed}</td>
                                                <td>{doc.expiry}</td>
                                                <td><span className={styles.docValid}>{doc.status}</span></td>
                                                <td><Eye size={14} className={styles.docAction} /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : <p className={styles.emptyText}>No documents uploaded yet.</p>}
                        </div>

                        {/* Revenue Chart */}
                        <div className={styles.detailCard}>
                            <div className={styles.chartHeader}>
                                <div>
                                    <h3 className={styles.cardTitle}>Compliance & Document Health</h3>
                                    <p className={styles.cardSub}>Revenue vs Order Volume</p>
                                </div>
                                <div className={styles.selectWrap}>
                                    <select><option>Daily</option><option>Weekly</option></select>
                                    <ChevronDown size={14} className={styles.selectArrow} />
                                </div>
                            </div>
                            <div className={styles.chart}>
                                <div className={styles.chartYAxis}>
                                    <span>₱15k</span><span>₱10k</span><span>₱5k</span><span>0</span>
                                </div>
                                <div className={styles.chartBars}>
                                    {d.chartData.map((val, i) => (
                                        <div key={i} className={styles.chartCol}>
                                            <div className={styles.barWrap}>
                                                <div className={styles.bar} style={{ height: `${(val / 15000) * 100}%` }} />
                                            </div>
                                            <span className={styles.chartLabel}>{DAYS[i]}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Recent Orders */}
                        <div className={styles.detailCard}>
                            <div className={styles.sectionHeaderRow}>
                                <h3 className={styles.cardTitle}>Recent Orders</h3>
                                <button className={styles.viewAllLink}>View All</button>
                            </div>
                            {d.recentOrders.length > 0 ? (
                                <table className={styles.ordersTable}>
                                    <thead><tr><th>Order ID</th><th>Items</th><th>Status</th><th>Amount</th></tr></thead>
                                    <tbody>
                                        {d.recentOrders.map((o, i) => (
                                            <tr key={i}>
                                                <td className={styles.orderId}>{o.id}</td>
                                                <td className={styles.orderItems}>{o.items}</td>
                                                <td><span className={`${styles.orderStatus} ${getOrderStatusClass(o.status)}`}>{o.status}</span></td>
                                                <td className={styles.orderAmount}>{peso(o.amount)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : <p className={styles.emptyText}>No orders yet.</p>}
                        </div>

                        {/* Dispute History */}
                        <div className={styles.detailCard}>
                            <div className={styles.sectionHeaderRow}>
                                <h3 className={styles.cardTitle}>Dispute History</h3>
                                <button className={styles.viewAllLink}>Full Dispute Log</button>
                            </div>
                            {d.disputes.length > 0 ? (
                                <table className={styles.disputeTable}>
                                    <thead><tr><th>Dispute ID</th><th>Issue Type</th><th>Date</th><th>Resolution</th><th>Status</th></tr></thead>
                                    <tbody>
                                        {d.disputes.map((dp, i) => (
                                            <tr key={i}>
                                                <td className={styles.orderId}>{dp.id}</td>
                                                <td>{dp.type}</td>
                                                <td>{dp.date}</td>
                                                <td className={styles.disputeRes}>{dp.resolution}</td>
                                                <td><span className={`${styles.disputeStatus} ${getDisputeStatusClass(dp.status)}`}>{dp.status}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : <p className={styles.emptyText}>No disputes on record.</p>}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className={styles.detailRight}>
                        {/* Owner Info */}
                        <div className={styles.detailCard}>
                            <div className={styles.sectionHeaderRow}>
                                <h3 className={styles.cardTitle}>Owner Information</h3>
                                <span className={styles.verifiedBadge}><Shield size={12} /> Verified Partner</span>
                            </div>
                            <div className={styles.ownerProfile}>
                                <div className={styles.ownerAvatar} style={{ background: getColor(r.owner.name) }}>
                                    {getInitials(r.owner.name)}
                                </div>
                                <div>
                                    <div className={styles.ownerName}>{r.owner.name}</div>
                                    <div className={styles.ownerEmail}>{r.owner.email}</div>
                                </div>
                            </div>
                            <div className={styles.ownerDetails}>
                                <div className={styles.ownerRow}><span>Phone Number</span><span>{r.owner.phone}</span></div>
                                <div className={styles.ownerRow}><span>Account Created</span><span>{d.accountCreated}</span></div>
                                <div className={styles.ownerRow}><span>Owned Branches</span><span>{d.ownerBranches} Locations</span></div>
                            </div>
                        </div>

                        {/* Payout Summary */}
                        <div className={styles.payoutCard}>
                            <div className={styles.payoutHeader}>
                                <DollarSign size={16} />
                                <span>Payout Summary</span>
                            </div>
                            <div className={styles.payoutLabel}>Financial overview</div>
                            <div className={styles.payoutSubLabel}>Pending Payout</div>
                            <div className={styles.payoutAmount}>{peso(d.payoutSummary.pending)}</div>
                            <div className={styles.payoutDetails}>
                                <div><span>Last Payout</span><span>{peso(d.payoutSummary.lastPayout)} ({d.payoutSummary.lastPayoutDate})</span></div>
                                <div><span>Comm. Rate</span><span>{d.payoutSummary.commRate}% Fixed</span></div>
                            </div>
                            <button className={styles.payoutBtn}>View Payments Page</button>
                        </div>

                        {/* Operational Settings */}
                        <div className={styles.detailCard}>
                            <h3 className={styles.cardTitle}>Operational Settings</h3>
                            <div className={styles.opGrid}>
                                <div><div className={styles.opLabel}>Delivery Radius</div><div className={styles.opValue}>{d.operational.deliveryRadius}</div></div>
                                <div><div className={styles.opLabel}>Prep Time</div><div className={styles.opValue}>{d.operational.prepTime}</div></div>
                                <div><div className={styles.opLabel}>Min. Order</div><div className={styles.opValue}>{peso(d.operational.minOrder)}</div></div>
                            </div>
                        </div>

                        {/* Recent Reviews */}
                        <div className={styles.detailCard}>
                            <div className={styles.sectionHeaderRow}>
                                <h3 className={styles.cardTitle}>Recent Reviews</h3>
                                <div className={styles.responseRate}>Response Rate<br /><strong>{d.responseRate}% Responsive</strong></div>
                            </div>
                            <div className={styles.reviewSummary}>
                                <div className={styles.reviewBig}>{d.avgRating}</div>
                                <div className={styles.reviewStars}>
                                    {[1,2,3,4,5].map(s => <Star key={s} size={14} className={s <= Math.round(d.avgRating) ? styles.starFilled : styles.starEmpty} />)}
                                </div>
                            </div>
                            {d.recentReviews.map((rev, i) => (
                                <div key={i} className={styles.reviewItem}>
                                    <div className={styles.reviewHeader}>
                                        <div className={styles.reviewAuthorAva} style={{ background: getColor(rev.author) }}>{getInitials(rev.author)}</div>
                                        <div>
                                            <div className={styles.reviewAuthor}>{rev.author}</div>
                                            <div className={styles.reviewStarsSmall}>{[1,2,3,4,5].map(s => <Star key={s} size={11} className={s <= rev.rating ? styles.starFilled : styles.starEmpty} />)}</div>
                                        </div>
                                    </div>
                                    <p className={styles.reviewText}>{rev.text}</p>
                                    <div className={styles.reviewMeta}>Order {rev.orderId} • {rev.time}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Suspend Modal */}
                {showSuspend && (
                    <>
                        <div className={styles.modalOverlay} onClick={() => setShowSuspend(null)} />
                        <div className={styles.modal}>
                            <div className={styles.modalHeader}>
                                <h2 className={styles.modalTitle}>Suspend Restaurant?</h2>
                                <button className={styles.modalClose} onClick={() => setShowSuspend(null)}><X size={20} /></button>
                            </div>
                            <div className={styles.modalBody}>
                                <div className={styles.suspendProfile}>
                                    <div className={styles.restaurantLogo} style={{ background: getColor(showSuspend.name), width: 40, height: 40, fontSize: '.85rem' }}>{showSuspend.name[0]}</div>
                                    <div><div className={styles.suspendLabel}>Restaurant</div><div className={styles.suspendName}>{showSuspend.name}</div></div>
                                </div>
                                <div className={styles.cautionBox}><AlertTriangle size={16} /><span>This will immediately deactivate the restaurant on the platform. Customers will no longer be able to place orders.<br /><strong>Active orders will not be affected.</strong></span></div>
                                <label className={styles.fieldLabel}>Reason for Suspension *</label>
                                <div className={styles.selectWrap} style={{width:'100%'}}><select value={suspendReason} onChange={e=>setSuspendReason(e.target.value)} style={{width:'100%'}}><option value="">Select a reason...</option>{SUSPEND_REASONS.map(r=><option key={r}>{r}</option>)}</select><ChevronDown size={14} className={styles.selectArrow}/></div>
                                <label className={styles.fieldLabel} style={{marginTop:'1rem'}}>Admin Notes (Optional)</label>
                                <textarea className={styles.textarea} placeholder="Provide additional context for this suspension..." value={suspendNotes} onChange={e=>setSuspendNotes(e.target.value)} rows={3} />
                                <label className={styles.checkboxLabel}><input type="checkbox" checked={suspendNotify} onChange={()=>setSuspendNotify(!suspendNotify)} /><span className={styles.customCheckbox}><CheckCircle2 size={14}/></span><div><div>Notify restaurant owner via email</div><div className={styles.checkSub}>The owner will receive an automated notification regarding this suspension.</div></div></label>
                            </div>
                            <div className={styles.modalFooterRow}>
                                <button className={styles.cancelModalBtn} onClick={() => setShowSuspend(null)}>Cancel</button>
                                <button className={styles.confirmSuspendBtn} onClick={handleSuspend}>Confirm Suspension</button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        );
    }

    // ─── List View ──────────────────────────────────────────────────────────
    return (
        <div className={styles.container}>
            {toast && (
                <div className={styles.toast}>
                    <CheckCircle2 size={20} className={styles.toastIcon} />
                    <div><div className={styles.toastTitle}>{toast.msg}</div><div className={styles.toastSub}>{toast.sub}</div></div>
                    <button className={styles.toastClose} onClick={() => setToast(null)}><X size={16} /></button>
                </div>
            )}

            {/* Alert Banner */}
            <div className={styles.alertBanner + ' ' + styles.alertWarning}>
                <AlertTriangle size={16} />
                <span>85 restaurants pending review • 3 flagged for policy violations</span>
            </div>

            {/* Stats */}
            <div className={styles.statsRow}>
                {STATS.map(stat => (
                    <div key={stat.label} className={styles.statCard}>
                        <div className={styles.statIcon} style={{ background: stat.color, color: stat.iconColor }}>{stat.icon}</div>
                        <div className={styles.statBody}>
                            <div className={styles.statLabel}>{stat.label}</div>
                            <div className={styles.statValue}>
                                {stat.value}
                                {stat.isStar && <Star size={20} className={styles.starFilled} />}
                            </div>
                            <div className={styles.statSub}>{stat.sub}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabs & Export */}
            <div className={styles.filtersBar}>
                <div className={styles.tabs}>
                    {STATUS_TABS.map(tab => (
                        <button key={tab} className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`} onClick={() => setActiveTab(tab)}>{tab}</button>
                    ))}
                </div>
                <button className={styles.exportBtn} onClick={() => setShowExport(true)}><Download size={16} /> Export</button>
            </div>

            {/* Dropdown Filters */}
            <div className={styles.dropdownFilters}>
                <div className={styles.selectWrap}><select value={categoryFilter} onChange={e=>setCategoryFilter(e.target.value)}><option value="All">Category: All</option><option>Fast Food</option><option>Burgers</option><option>Asian</option></select><ChevronDown size={14} className={styles.selectArrow}/></div>
                <div className={styles.selectWrap}><select value={locationFilter} onChange={e=>setLocationFilter(e.target.value)}><option value="All">Location</option><option>Makati City</option><option>Quezon City</option><option>Cebu City</option></select><ChevronDown size={14} className={styles.selectArrow}/></div>
                <div className={styles.selectWrap}><select value={ratingFilter} onChange={e=>setRatingFilter(e.target.value)}><option value="All">Rating Range</option><option>4.0+</option><option>3.0 - 4.0</option><option>Below 3.0</option></select><ChevronDown size={14} className={styles.selectArrow}/></div>
                <div className={styles.selectWrap}><select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}><option value="All">Status: All</option><option>Active</option><option>Pending</option><option>Suspended</option></select><ChevronDown size={14} className={styles.selectArrow}/></div>
                <button className={styles.clearBtn} onClick={clearFilters}>Clear all</button>
            </div>

            {/* Table */}
            <div className={styles.tableCard}>
                {loading && (
                    <div style={{display:'flex',justifyContent:'center',alignItems:'center',padding:'40px',gap:'10px',color:'#666'}}>
                        <Loader size={20} className={styles.spinner} /> Loading restaurants...
                    </div>
                )}
                {error && (
                    <div style={{padding:'20px',background:'#FEE2E2',border:'1px solid #FECACA',borderRadius:'8px',color:'#991B1B'}}>
                        ⚠️ {error}
                    </div>
                )}
                {!loading && !error && (
                    <table className={styles.table}>
                        <thead><tr><th>Restaurant</th><th>Owner</th><th>Cuisine</th><th>Rating</th><th>Revenue</th><th>Status</th><th>Date Joined</th><th>Actions</th></tr></thead>
                        <tbody>
                            {filteredRestaurants.length > 0 ? filteredRestaurants.map(rest => (
                                <tr key={rest.id} className={styles.tableRow}>
                                    <td>
                                        <div className={styles.restaurantCell}>
                                            <div className={styles.restaurantLogo} style={{ background: getColor(rest.name) }}>{rest.name[0]}</div>
                                            <div>
                                                <div className={styles.restaurantName}>{rest.name}</div>
                                                {rest.badge && <div className={styles.restaurantBadge}>{rest.badge}</div>}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.ownerCell}>
                                            <div className={styles.avatarCircle} style={{ background: getColor(rest.owner.name) }}>{getInitials(rest.owner.name)}</div>
                                            <span>{rest.owner.name}</span>
                                        </div>
                                    </td>
                                    <td>{rest.cuisine}</td>
                                    <td>
                                        {rest.rating > 0 ? (
                                            <span className={styles.ratingCell}><Star size={13} className={styles.starFilled} /> {rest.rating} <span className={styles.ratingCount}>({rest.reviewCount})</span></span>
                                        ) : (
                                            <span className={styles.noReviews}>No reviews</span>
                                        )}
                                    </td>
                                    <td className={styles.revenueCell}>{rest.revenue > 0 ? pesoShort(rest.revenue) : '0'}</td>
                                    <td><span className={`${styles.statusPill} ${getStatusClass(rest.status)}`}>{rest.status}</span></td>
                                    <td className={styles.dateCell}>{rest.joined}</td>
                                    <td>
                                        <div className={styles.actionBtns}>
                                            {rest.status === 'Under Review' && <button className={styles.actionTextBtn}>Review</button>}
                                            <button className={styles.actionIcon} onClick={() => setSelectedRestaurant(rest)}><Eye size={15} /></button>
                                            <button className={styles.actionIcon} onClick={() => setShowSuspend(rest)}><MoreVertical size={15} /></button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="8" style={{textAlign:'center',padding:'40px',color:'#999'}}>No restaurants found</td></tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Export Modal */}
            {showExport && (
                <>
                    <div className={styles.modalOverlay} onClick={() => setShowExport(false)} />
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <div><h2 className={styles.modalTitle}>Export Restaurant Data</h2><p className={styles.modalSub}>Download a snapshot of your restaurant partner data based on your selected filters and date range.</p></div>
                            <button className={styles.modalClose} onClick={() => setShowExport(false)}><X size={20} /></button>
                        </div>
                        <div className={styles.modalBody}>
                            <label className={styles.fieldLabel}>Date Range</label>
                            <div className={styles.selectWrap} style={{width:'100%'}}><select style={{width:'100%'}}><option>Last 30 Days</option><option>Last 7 days</option><option>All Time</option></select><ChevronDown size={14} className={styles.selectArrow}/></div>
                            <label className={styles.fieldLabel} style={{marginTop:'1rem'}}>File Format</label>
                            <div className={styles.formatRow}>
                                <label className={`${styles.formatOption} ${exportFormat==='csv'?styles.formatActive:''}`}><input type="radio" name="fmt" checked={exportFormat==='csv'} onChange={()=>setExportFormat('csv')} /><div><div className={styles.formatTitle}>CSV</div><div className={styles.formatSub}>Spreadsheet data</div></div></label>
                                <label className={`${styles.formatOption} ${exportFormat==='pdf'?styles.formatActive:''}`}><input type="radio" name="fmt" checked={exportFormat==='pdf'} onChange={()=>setExportFormat('pdf')} /><div><div className={styles.formatTitle}>PDF</div><div className={styles.formatSub}>Visual report</div></div></label>
                            </div>
                            <label className={styles.fieldLabel} style={{marginTop:'1rem'}}>Select columns to include</label>
                            <div className={styles.columnsGrid}>
                                {EXPORT_COLUMNS.map(col => (
                                    <label key={col} className={styles.columnCheck}><input type="checkbox" checked={exportColumns[col]} onChange={()=>setExportColumns(p=>({...p,[col]:!p[col]}))} /><span className={styles.customCheckbox}><CheckCircle2 size={14}/></span>{col}</label>
                                ))}
                            </div>
                            <div className={styles.exportNote}><Info size={14}/> Exports include only data visible to your admin role. Confidential financial fields may be masked based on your permissions.</div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={styles.downloadBtn} onClick={handleExport}>Download Report</button>
                            <button className={styles.cancelLink} onClick={() => setShowExport(false)}>Cancel</button>
                        </div>
                    </div>
                </>
            )}

            {/* Suspend Modal (from list) */}
            {showSuspend && (
                <>
                    <div className={styles.modalOverlay} onClick={() => setShowSuspend(null)} />
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>Suspend Restaurant?</h2>
                            <button className={styles.modalClose} onClick={() => setShowSuspend(null)}><X size={20} /></button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.suspendProfile}>
                                <div className={styles.restaurantLogo} style={{ background: getColor(showSuspend.name), width: 40, height: 40, fontSize: '.85rem' }}>{showSuspend.name[0]}</div>
                                <div><div className={styles.suspendLabel}>Restaurant</div><div className={styles.suspendName}>{showSuspend.name}</div></div>
                            </div>
                            <div className={styles.cautionBox}><AlertTriangle size={16} /><span>This will immediately deactivate the restaurant on the platform. Customers will no longer be able to place orders.<br /><strong>Active orders will not be affected.</strong></span></div>
                            <label className={styles.fieldLabel}>Reason for Suspension *</label>
                            <div className={styles.selectWrap} style={{width:'100%'}}><select value={suspendReason} onChange={e=>setSuspendReason(e.target.value)} style={{width:'100%'}}><option value="">Select a reason...</option>{SUSPEND_REASONS.map(r=><option key={r}>{r}</option>)}</select><ChevronDown size={14} className={styles.selectArrow}/></div>
                            <label className={styles.fieldLabel} style={{marginTop:'1rem'}}>Admin Notes (Optional)</label>
                            <textarea className={styles.textarea} placeholder="Provide additional context for this suspension..." value={suspendNotes} onChange={e=>setSuspendNotes(e.target.value)} rows={3} />
                            <label className={styles.checkboxLabel}><input type="checkbox" checked={suspendNotify} onChange={()=>setSuspendNotify(!suspendNotify)}/><span className={styles.customCheckbox}><CheckCircle2 size={14}/></span><div><div>Notify restaurant owner via email</div><div className={styles.checkSub}>The owner will receive an automated notification regarding this suspension.</div></div></label>
                        </div>
                        <div className={styles.modalFooterRow}>
                            <button className={styles.cancelModalBtn} onClick={() => setShowSuspend(null)}>Cancel</button>
                            <button className={styles.confirmSuspendBtn} onClick={handleSuspend}>Confirm Suspension</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
