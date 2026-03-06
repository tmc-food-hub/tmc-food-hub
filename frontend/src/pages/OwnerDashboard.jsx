import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    LayoutDashboard, UtensilsCrossed, Clock, Settings, LogOut,
    Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Save, X, Check,
    Package, DollarSign, ShoppingBag, Truck, Bell,
    AlertCircle, CheckCircle2, Timer, MapPin, FileText, Tag,
    Hash, Layers, ExternalLink, Search, TrendingUp, TrendingDown, Star
} from 'lucide-react';
import { useOwnerAuth } from '../context/OwnerAuthContext';
import tmcLogo from '../assets/imgs/tmc-foodhub-logo.svg';
import styles from './OwnerDashboard.module.css';

/* ── image options ── */
const IMAGES = [
    '/assets/images/service/fries.webp',
    '/assets/images/service/spag.webp',
    '/assets/images/service/burger.webp',
    '/assets/images/service/juice.webp',
    '/assets/images/service/steak.webp',
    '/assets/images/service/sushi.webp',
];

/* ── mock orders ── */
function buildOrders(store) {
    const img = (name) => store.menuItems.find(i => i.title === name)?.image || IMAGES[0];
    return [
        { id: 'ORD-1041', customer: 'Maria Santos', address: 'Lahug, Cebu City', items: [{ name: 'Chickenjoy 2-pc', qty: 2, image: img('Chickenjoy 2-pc') }, { name: 'Jolly Spaghetti', qty: 1, image: img('Jolly Spaghetti') }], total: 15.60, status: 'Pending', time: '2 min ago', note: '' },
        { id: 'ORD-1040', customer: 'Juan dela Cruz', address: 'Mabolo, Cebu City', items: [{ name: 'Yumburger', qty: 3, image: img('Yumburger') }, { name: 'Peach Mango Pie', qty: 2, image: img('Peach Mango Pie') }], total: 7.80, status: 'Preparing', time: '8 min ago', note: 'No onions please' },
        { id: 'ORD-1039', customer: 'Ana Reyes', address: 'Banilad, Cebu City', items: [{ name: 'Chickenjoy Bucket 8-pc', qty: 1, image: img('Chickenjoy Bucket 8-pc') }], total: 18.00, status: 'Delivering', time: '18 min ago', note: '' },
        { id: 'ORD-1038', customer: 'Ramon Villanueva', address: 'IT Park, Cebu City', items: [{ name: 'Garlic Rice', qty: 2, image: img('Garlic Rice') }, { name: 'Jolly Hotdog', qty: 2, image: img('Jolly Hotdog') }], total: 7.00, status: 'Delivered', time: '35 min ago', note: '' },
        { id: 'ORD-1037', customer: 'Leila Bautista', address: 'Apas, Cebu City', items: [{ name: 'Chickenjoy Solo', qty: 1, image: img('Chickenjoy Solo') }, { name: 'Jolly Sundae', qty: 1, image: img('Jolly Sundae') }], total: 4.50, status: 'Delivered', time: '52 min ago', note: 'Leave at gate' },
    ];
}

const STATUS_ORDER = ['Pending', 'Preparing', 'Delivering', 'Delivered'];
function statusMeta(s) {
    return { Pending: { color: '#D97706', bg: '#FEF3C7', icon: <Bell size={13} />, next: 'Preparing', nextLabel: 'Accept & Prepare' }, Preparing: { color: '#2563EB', bg: '#DBEAFE', icon: <Timer size={13} />, next: 'Delivering', nextLabel: 'Out for Delivery' }, Delivering: { color: '#7C3AED', bg: '#EDE9FE', icon: <Truck size={13} />, next: 'Delivered', nextLabel: 'Mark Delivered' }, Delivered: { color: '#059669', bg: '#D1FAE5', icon: <CheckCircle2 size={13} />, next: null, nextLabel: null } }[s] || {};
}

/* ─── Overview ───────────────────────────────────────────────────────────── */
function OverviewSection({ store, orders }) {
    const pending = orders.filter(o => o.status === 'Pending').length;
    const todayRev = orders.filter(o => o.status === 'Delivered').reduce((s, o) => s + o.total, 0);

    // Example metrics mapping to the design shown
    const stats = [
        {
            icon: <ShoppingBag size={18} color="#DC2626" />,
            label: "Today's Orders",
            value: '142',
            trend: '+12%',
            trendUp: true,
            iconBg: '#FEF2F2'
        },
        {
            icon: <Package size={18} color="#DC2626" />,
            label: 'Active Orders',
            value: '12',
            trend: '+8%',
            trendUp: true,
            iconBg: '#FEF2F2'
        },
        {
            icon: <DollarSign size={18} color="#DC2626" />,
            label: "Revenue Today",
            value: `$2,450.00`,
            trend: '-12%',
            trendUp: false,
            iconBg: '#FEF2F2'
        },
        {
            icon: <AlertCircle size={18} color="#DC2626" />,
            label: 'Inventory Alerts',
            value: '5',
            badge: 'Critical',
            iconBg: '#FEF2F2'
        },
    ];

    return (
        <div className={styles.overviewContainer}>
            {/* Stat Cards */}
            <div className={styles.statsGrid}>
                {stats.map(s => (
                    <div key={s.label} className={styles.statCardNew}>
                        <div className={styles.statCardTopRow}>
                            <div className={styles.statIconWrapNew} style={{ background: s.iconBg }}>
                                {s.icon}
                            </div>
                            {s.trend && (
                                <div className={`${styles.statTrend} ${s.trendUp ? styles.trendUp : styles.trendDown}`}>
                                    {s.trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />} {s.trend}
                                </div>
                            )}
                            {s.badge && (
                                <div className={styles.statBadgeCritical}>
                                    {s.badge}
                                </div>
                            )}
                        </div>
                        <div className={styles.statBodyNew}>
                            <span className={styles.statLabelNew}>{s.label}</span>
                            <span className={styles.statValueNew}>{s.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Middle Row: Recent Orders and Popular Menu */}
            <div className={styles.overviewMiddleRow}>
                {/* Recent Orders List */}
                <div className={styles.infoCardDesktop}>
                    <div className={styles.cardHeaderRow}>
                        <h3 className={styles.cardDesktopTitle}>Recent Orders</h3>
                        <button className={styles.btnViewAll}>View All</button>
                    </div>

                    <div className={styles.tableWrap}>
                        <table className={styles.recentOrdersTable}>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Items</th>
                                    <th>Status</th>
                                    <th>Time</th>
                                    <th className={styles.textRight}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.slice(0, 3).map(o => {
                                    const m = statusMeta(o.status);
                                    let statusPillClass = styles.pillPending;
                                    if (o.status === 'Preparing') statusPillClass = styles.pillPreparing;
                                    if (o.status === 'Delivering') statusPillClass = styles.pillDelivering;
                                    if (o.status === 'Delivered') statusPillClass = styles.pillDelivered;

                                    return (
                                        <tr key={o.id}>
                                            <td className={styles.orderIdCell}>{o.id}</td>
                                            <td className={styles.itemsSummaryCell}>
                                                {o.items.map(it => `${it.qty}x ${it.name}`).join(', ')}
                                            </td>
                                            <td>
                                                <span className={`${styles.statusPillSmall} ${statusPillClass}`}>{o.status}</span>
                                            </td>
                                            <td className={styles.timeCell}>{o.time}</td>
                                            <td className={styles.textRight}>
                                                <button className={styles.actionBtnOutline}>{m.nextLabel || 'View'}</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Popular Menu List */}
                <div className={styles.infoCardDesktop}>
                    <div className={styles.cardHeaderRow}>
                        <h3 className={styles.cardDesktopTitle}>Popular Menu</h3>
                        <button className={styles.btnViewAll}>View All</button>
                    </div>
                    <div className={styles.popularMenuList}>
                        {store.menuItems.slice(0, 3).map(item => (
                            <div key={item.id} className={styles.popularMenuItemRow}>
                                <img src={item.image} alt={item.title} className={styles.popularMenuImg} />
                                <div className={styles.popularMenuInfo}>
                                    <div className={styles.popularMenuTitle}>{item.title}</div>
                                    <div className={styles.popularMenuOrders}>
                                        {Math.floor(Math.random() * 300) + 50} orders this week
                                    </div>
                                </div>
                                <div className={styles.popularMenuPrice}>${item.price.toFixed(2)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Row: Sales Revenue & Recent Reviews */}
            <div className={styles.overviewBottomRow}>
                {/* Sales Revenue Chart (Mock) */}
                <div className={styles.infoCardDesktop}>
                    <div className={styles.cardHeaderRow}>
                        <h3 className={styles.cardDesktopTitle}>Sales Revenue</h3>
                        <select className={styles.chartSelect}>
                            <option>Last 7 days</option>
                            <option>This Month</option>
                        </select>
                    </div>
                    <div className={styles.chartWrapper}>
                        <div className={styles.chartYAxis}>
                            <span>$15k</span>
                            <span>$10k</span>
                            <span>$5k</span>
                            <span>0</span>
                        </div>
                        <div className={styles.chartBars}>
                            {/* Mon - Sun */}
                            <div className={styles.chartCol}><div className={styles.chartBar} style={{ height: '20%' }}></div><span className={styles.chartDay}>Mon</span></div>
                            <div className={styles.chartCol}><div className={styles.chartBar} style={{ height: '65%' }}></div><span className={styles.chartDay}>Tue</span></div>
                            <div className={styles.chartCol}><div className={styles.chartBar} style={{ height: '35%' }}></div><span className={styles.chartDay}>Wed</span></div>
                            <div className={styles.chartCol}><div className={styles.chartBar} style={{ height: '55%' }}></div><span className={styles.chartDay}>Thu</span></div>
                            <div className={styles.chartCol}><div className={styles.chartBar} style={{ height: '40%' }}></div><span className={styles.chartDay}>Fri</span></div>
                            <div className={styles.chartCol}><div className={styles.chartBar} style={{ height: '75%' }}></div><span className={styles.chartDay}>Sat</span></div>
                            <div className={styles.chartCol}><div className={styles.chartBar} style={{ height: '90%' }}></div><span className={styles.chartDay}>Sun</span></div>
                        </div>
                    </div>
                </div>

                {/* Recent Reviews */}
                <div className={styles.infoCardDesktop}>
                    <div className={styles.cardHeaderRow}>
                        <h3 className={styles.cardDesktopTitle}>Recent Reviews</h3>
                        <button className={styles.btnViewAll}>View All</button>
                    </div>
                    <div className={styles.recentReviewsList}>
                        {[
                            { id: 1, name: 'Maria L.', rating: 5, text: 'The Lumpiang Shanghai is so crispy and still hot when it arrived! SM Baguio branch never fails to deliver quality food.', img: 'https://i.pravatar.cc/100?u=1' },
                            { id: 2, name: 'James T.', rating: 4, text: 'Great food as always. Delivery was a bit slow today due to the rain, but the rider was very polite.', img: 'https://i.pravatar.cc/100?u=2' },
                        ].map(rev => (
                            <div key={rev.id} className={styles.recentReviewCard}>
                                <div className={styles.reviewCardHeaderRow}>
                                    <div className={styles.reviewAuthor}>
                                        <img src={rev.img} alt={rev.name} className={styles.reviewAvatarSmall} />
                                        <span className={styles.reviewAuthorName}>{rev.name}</span>
                                    </div>
                                    <div className={styles.reviewStarsSmall}>
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} fill={i <= rev.rating ? "#F5A623" : "none"} color="#F5A623" />)}
                                    </div>
                                </div>
                                <div className={styles.reviewTextSmall}>{rev.text}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─── Orders ─────────────────────────────────────────────────────────────── */
function OrdersSection({ store }) {
    const [orders, setOrders] = useState(() => buildOrders(store));
    const [filt, setFilt] = useState('All');
    const [selectedOrder, setSelectedOrder] = useState(null);

    const STATUS_TABS = [
        { key: 'All', label: 'All' },
        { key: 'Pending', label: 'New' },
        { key: 'Preparing', label: 'Preparing' },
        { key: 'Delivering', label: 'Ready' },
        { key: 'Delivered', label: 'Complete' }
    ];

    const counts = { All: orders.length };
    STATUS_ORDER.forEach(s => { counts[s] = orders.filter(o => o.status === s).length; });

    const displayed = filt === 'All' ? orders : orders.filter(o => o.status === filt);

    return (
        <div className={styles.ordersContainer}>
            {/* Header Area */}
            <div className={styles.ordersHeaderArea}>
                <div>
                    <h2 className={styles.ordersTitle}>Orders</h2>
                    <p className={styles.ordersSub}>Manage incoming orders, track their status, and ensure timely fulfillment.</p>
                </div>
            </div>

            {/* Controls Row */}
            <div className={styles.ordersControlsRow}>
                <div className={styles.ordersTabs}>
                    {STATUS_TABS.map(tab => (
                        <button
                            key={tab.key}
                            className={`${styles.orderTabBtn} ${filt === tab.key ? styles.orderTabActive : ''}`}
                            onClick={() => setFilt(tab.key)}
                        >
                            {tab.label} {tab.key === 'Pending' && counts['Pending'] > 0 && <span className={styles.tabBadge}>{counts['Pending']}</span>}
                        </button>
                    ))}
                </div>
                <div className={styles.ordersFiltersRight}>
                    <button className={styles.dateFilterBtn}>
                        <MapPin size={16} /> {/* Placeholder for calendar icon */} Today, Mar 5
                    </button>
                    <button className={styles.settingsFilterBtn}>
                        <Layers size={16} /> Filters
                    </button>
                </div>
            </div>

            {/* Orders Table */}
            <div className={styles.infoCardDesktop}>
                <div className={styles.tableWrap}>
                    <table className={styles.ordersMainTable}>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Time</th>
                                <th className={styles.textRight}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayed.map(o => {
                                // Map old status to new simplified ones for the pill display only
                                let displayStatus = 'New';
                                let statusPillClass = styles.pillNew;
                                let actionBtn = <button className={styles.btnActionAccept}>Accept</button>;

                                if (o.status === 'Preparing') {
                                    displayStatus = 'Preparing';
                                    statusPillClass = styles.pillPreparing;
                                    actionBtn = <button className={styles.btnActionReady}>Ready</button>;
                                }
                                if (o.status === 'Delivering' || o.status === 'Delivered') {
                                    displayStatus = 'Ready'; // Simplify for this view
                                    statusPillClass = styles.pillReady;
                                    actionBtn = <button className={styles.btnActionHandover}>Handover</button>;
                                }

                                return (
                                    <tr key={o.id} className={styles.ordersTableRow} onClick={() => setSelectedOrder(o)} style={{ cursor: 'pointer' }}>
                                        <td className={styles.orderIdCell}>{o.id}</td>
                                        <td>
                                            <div className={styles.customerCell}>
                                                <img src={`https://i.pravatar.cc/100?u=${o.id}`} alt="Customer" className={styles.customerAvatar} />
                                                <span className={styles.customerName}>{o.customer}</span>
                                            </div>
                                        </td>
                                        <td className={styles.multiLineItemsCell}>
                                            {o.items.map((it, idx) => (
                                                <div key={idx} className={styles.itemLine}>{it.qty}x {it.name}</div>
                                            ))}
                                        </td>
                                        <td className={styles.totalCell}>${o.total.toFixed(2)}</td>
                                        <td>
                                            <span className={`${styles.statusPillSmall} ${statusPillClass}`}>{displayStatus}</span>
                                        </td>
                                        <td className={styles.timeCell}>{o.time}</td>
                                        <td className={styles.textRight}>
                                            {actionBtn}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Details Panel */}
            {selectedOrder && (
                <>
                    <div className={styles.overlay} onClick={() => setSelectedOrder(null)}></div>
                    <div className={styles.orderDetailsPanel}>
                        <div className={styles.panelHeader}>
                            <div>
                                <h2 className={styles.panelTitle}>Order Details</h2>
                                <p className={styles.panelSubtitle}>{selectedOrder.id}</p>
                            </div>
                            <button className={styles.closePanelBtn} onClick={() => setSelectedOrder(null)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className={styles.panelContent}>
                            <div className={styles.statusAlert}>
                                <AlertCircle size={16} /> Awaiting Kitchen Approval
                            </div>

                            {/* Status Tracker */}
                            <div className={styles.statusTracker}>
                                <div className={styles.trackerStepInfo}>
                                    <div className={styles.trackerDotActive}><Check size={12} color="#fff" /></div>
                                    <div>
                                        <div className={styles.trackerLabelActive}>Order Placed</div>
                                        <div className={styles.trackerTime}>12:30 PM</div>
                                    </div>
                                </div>
                                <div className={styles.trackerLine}></div>
                                <div className={styles.trackerStepInfo}>
                                    <div className={styles.trackerDotInactive}></div>
                                    <div className={styles.trackerLabelInactive}>Confirmed</div>
                                </div>
                            </div>

                            {/* Customer Info */}
                            <div className={styles.panelSection}>
                                <h4 className={styles.sectionHeading}>Customer Information</h4>
                                <div className={styles.customerInfoBlock}>
                                    <img src={`https://i.pravatar.cc/100?u=${selectedOrder.id}`} alt="Customer" className={styles.customerAvatarLarge} />
                                    <div>
                                        <div className={styles.customerNameLarge}>{selectedOrder.customer}</div>
                                        <div className={styles.customerPhone}>+1 (555) 000-1234</div>
                                    </div>
                                </div>
                            </div>

                            {/* Items List */}
                            <div className={styles.panelSection}>
                                <h4 className={styles.sectionHeading}>Items ({selectedOrder.items.reduce((s, it) => s + it.qty, 0)})</h4>
                                <div className={styles.panelItemsList}>
                                    {selectedOrder.items.map((it, idx) => (
                                        <div key={idx} className={styles.panelItemRow}>
                                            <img src={it.image} alt={it.name} className={styles.panelItemImg} />
                                            <div className={styles.panelItemDetails}>
                                                <div className={styles.panelItemName}>{it.name}</div>
                                                <div className={styles.panelItemQty}>Qty: x{it.qty}</div>
                                            </div>
                                            <div className={styles.panelItemPrice}>${(it.qty * it.price).toFixed(2)}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Special Instructions */}
                            {selectedOrder.note && (
                                <div className={styles.panelSection}>
                                    <h4 className={styles.sectionHeading}>Special Instructions</h4>
                                    <div className={styles.instructionsBlock}>
                                        "{selectedOrder.note}"
                                    </div>
                                </div>
                            )}

                            {/* Price Breakdown */}
                            <div className={styles.panelBreakdown}>
                                <div className={styles.breakdownRow}>
                                    <span>Subtotal</span>
                                    <span>${selectedOrder.total.toFixed(2)}</span>
                                </div>
                                <div className={styles.breakdownRow}>
                                    <span>Delivery Fee</span>
                                    <span>$3.00</span>
                                </div>
                                <div className={`${styles.breakdownRow} ${styles.breakdownDiscount}`}>
                                    <span>Discount (PROMO5)</span>
                                    <span>-$5.00</span>
                                </div>
                                <div className={styles.breakdownTotalRow}>
                                    <span>Total Amount</span>
                                    <span className={styles.breakdownTotalValue}>${(selectedOrder.total - 2).toFixed(2)} <span className={styles.currency}>USD</span></span>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className={styles.panelFooter}>
                            <button className={styles.btnPrint}>Print</button>
                            <button className={styles.btnAcceptOrder}>Accept Order</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

/* ─── Inventory ──────────────────────────────────────────────────────────── */
function InventorySection({ store, onUpdate }) {
    const items = store.menuItems || [];

    // Top Metric stats
    const totalItems = items.length;
    const lowStockItems = items.filter(i => i.stockLevel > 0 && i.stockLevel <= (i.minThreshold || 10)).length;
    const outOfStockItems = items.filter(i => i.stockLevel === 0).length;
    const availableItems = items.filter(i => i.stockLevel > (i.minThreshold || 10)).length;
    const coverage = totalItems > 0 ? Math.round(((totalItems - outOfStockItems) / totalItems) * 100) : 0;

    return (
        <div className={styles.inventoryContainer}>
            {/* Top Metrics Cards */}
            <div className={styles.inventoryMetricsGrid}>
                {/* Total Items */}
                <div className={styles.inventoryMetricCard}>
                    <div className={styles.inventoryMetricHeader}>
                        <div className={styles.inventoryIconBoxGray}>
                            <FileText size={18} color="#4B5563" />
                        </div>
                        <span className={styles.inventoryMetricLabel}>Total Items</span>
                    </div>
                    <div className={styles.inventoryMetricValue}>{totalItems}</div>
                    <div className={styles.inventoryMetricSub}>+4 This week</div>
                </div>

                {/* Low Stock Alert */}
                <div className={styles.inventoryMetricCard}>
                    <div className={styles.inventoryMetricHeader}>
                        <div className={`${styles.inventoryIconBoxRed} ${styles.bgLightRed}`}>
                            <AlertCircle size={18} color="#DC2626" />
                        </div>
                        <span className={styles.inventoryMetricLabel}>Low Stock Alert</span>
                    </div>
                    <div className={styles.inventoryMetricValue}>{lowStockItems}</div>
                    <div className={styles.inventoryMetricSub}>Needs replenishment</div>
                </div>

                {/* Out of Stock */}
                <div className={styles.inventoryMetricCard}>
                    <div className={styles.inventoryMetricHeader}>
                        <div className={styles.inventoryIconBoxGray}>
                            <LogOut size={18} color="#4B5563" style={{ transform: 'rotate(180deg)' }} /> {/* Placeholder for block icon */}
                        </div>
                        <span className={styles.inventoryMetricLabel}>Out of Stock</span>
                    </div>
                    <div className={styles.inventoryMetricValue}>{outOfStockItems}</div>
                    <div className={styles.inventoryMetricSub}>Hidden from menu</div>
                </div>

                {/* Available Now */}
                <div className={styles.inventoryMetricCard}>
                    <div className={styles.inventoryMetricHeader}>
                        <div className={`${styles.inventoryIconBoxGreen} ${styles.bgLightGreen}`}>
                            <CheckCircle2 size={18} color="#059669" />
                        </div>
                        <span className={styles.inventoryMetricLabel}>Available Now</span>
                    </div>
                    <div className={styles.inventoryMetricValue}>{availableItems}</div>
                    <div className={styles.inventoryMetricSub}>{coverage}% Coverage</div>
                </div>
            </div>

            {/* Controls Row */}
            <div className={styles.inventoryControlsRow}>
                <div className={styles.inventoryFilters}>
                    <button className={styles.inventoryFilterBtn}>
                        All Categories <TrendingDown size={14} style={{ marginLeft: 4 }} />
                    </button>
                    <button className={styles.inventoryFilterBtn}>
                        Status: All <TrendingDown size={14} style={{ marginLeft: 4 }} />
                    </button>
                    <button className={styles.inventoryFilterBtn}>
                        <Layers size={14} /> Sort by
                    </button>
                </div>
                <div className={styles.inventoryActionsRight}>
                    <button className={styles.inventoryExportBtn}>
                        <span style={{ transform: 'rotate(90deg)' }}><LogOut size={14} /></span> Export
                    </button>
                </div>
            </div>

            {/* Placeholder for Table */}
            <div className={styles.infoCardDesktop}>
                <p style={{ padding: '2rem', textAlign: 'center', color: '#6B7280' }}>Inventory Table coming soon</p>
            </div>
        </div>
    );
}

/* ─── Menu ───────────────────────────────────────────────────────────────── */
const BLANK = { title: '', description: '', price: '', category: '', available: true, image: IMAGES[0] };

function MenuSection({ store, onUpdate }) {
    const [addOpen, setAddOpen] = useState(false);
    const [form, setForm] = useState(BLANK);
    const [editId, setEditId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [error, setError] = useState('');
    const cats = [...new Set(store.menuItems.map(i => i.category))];

    function handleAdd(e) { e.preventDefault(); if (!form.title || !form.price || !form.category) { setError('Title, category and price are required.'); return; } onUpdate({ ...store, menuItems: [...store.menuItems, { ...form, id: Date.now(), price: parseFloat(form.price), available: true }] }); setForm(BLANK); setAddOpen(false); setError(''); }
    function handleDelete(id) { if (!window.confirm('Delete this item?')) return; onUpdate({ ...store, menuItems: store.menuItems.filter(i => i.id !== id) }); }
    function toggle(id) { onUpdate({ ...store, menuItems: store.menuItems.map(i => i.id === id ? { ...i, available: !i.available } : i) }); }
    function startEdit(item) { setEditId(item.id); setEditForm({ title: item.title, description: item.description, price: item.price, category: item.category, image: item.image || IMAGES[0] }); }
    function saveEdit(id) { onUpdate({ ...store, menuItems: store.menuItems.map(i => i.id === id ? { ...i, ...editForm, price: parseFloat(editForm.price) } : i) }); setEditId(null); }

    return (
        <div>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Menu Management</h2>
                <button className={styles.btnPrimary} onClick={() => setAddOpen(true)}><Plus size={15} /> Add Item</button>
            </div>

            {addOpen && (
                <div className={styles.formCard}>
                    <div className={styles.formCardHead}><h3>New Menu Item</h3><button className={styles.iconBtn} onClick={() => { setAddOpen(false); setError(''); }}><X size={16} /></button></div>
                    {error && <div className={styles.formError}><AlertCircle size={13} /> {error}</div>}
                    <form onSubmit={handleAdd}>
                        <div className={styles.addFormLayout}>
                            <div className={styles.addImgPreview}>
                                <img src={form.image} alt="Preview" className={styles.addImgThumb} />
                                <label className={styles.addImgLabel}>Select Image</label>
                                <div className={styles.imgPicker}>{IMAGES.map(img => (<img key={img} src={img} alt="" className={`${styles.imgOption} ${form.image === img ? styles.imgOptionActive : ''}`} onClick={() => setForm(f => ({ ...f, image: img }))} />))}</div>
                            </div>
                            <div className={styles.addFields}>
                                <div className={styles.formGrid2}>
                                    <div className={styles.field}><label><Tag size={12} /> Item Name *</label><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Chickenjoy Solo" /></div>
                                    <div className={styles.field}><label><Layers size={12} /> Category *</label><input list="cats" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="e.g. Chickenjoy Meals" /><datalist id="cats">{cats.map(c => <option key={c} value={c} />)}</datalist></div>
                                    <div className={styles.field}><label><DollarSign size={12} /> Price (USD) *</label><input type="number" step="0.01" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="0.00" /></div>
                                    <div className={styles.field}><label><Hash size={12} /> Availability</label><select value={form.available ? 'yes' : 'no'} onChange={e => setForm(f => ({ ...f, available: e.target.value === 'yes' }))}><option value="yes">Available</option><option value="no">Unavailable</option></select></div>
                                </div>
                                <div className={styles.field}><label><FileText size={12} /> Description</label><textarea rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Write a short, appetizing description..." /></div>
                            </div>
                        </div>
                        <div className={styles.formActions}><button type="button" className={styles.btnGhost} onClick={() => { setAddOpen(false); setError(''); }}>Cancel</button><button type="submit" className={styles.btnSuccess}><Save size={14} /> Add to Menu</button></div>
                    </form>
                </div>
            )}

            {editId && (
                <div className={styles.editOverlay}>
                    <div className={styles.editModal}>
                        <div className={styles.editModalHead}><h3><Pencil size={15} /> Edit Menu Item</h3><button className={styles.iconBtn} onClick={() => setEditId(null)}><X size={16} /></button></div>
                        <div className={styles.editModalBody}>
                            <div className={styles.editImgSection}>
                                <img src={editForm.image} alt="Preview" className={styles.editImgPreview} />
                                <div className={styles.imgPicker}>{IMAGES.map(img => (<img key={img} src={img} alt="" className={`${styles.imgOption} ${editForm.image === img ? styles.imgOptionActive : ''}`} onClick={() => setEditForm(f => ({ ...f, image: img }))} />))}</div>
                            </div>
                            <div className={styles.editFields}>
                                <div className={styles.formGrid2}>
                                    <div className={styles.field}><label><Tag size={12} /> Item Name</label><input value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} /></div>
                                    <div className={styles.field}><label><Layers size={12} /> Category</label><input list="editCats" value={editForm.category} onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))} /><datalist id="editCats">{cats.map(c => <option key={c} value={c} />)}</datalist></div>
                                    <div className={styles.field}><label><DollarSign size={12} /> Price (USD)</label><input type="number" step="0.01" min="0" value={editForm.price} onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))} /></div>
                                </div>
                                <div className={styles.field}><label><FileText size={12} /> Description</label><textarea rows={3} value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} /></div>
                            </div>
                        </div>
                        <div className={styles.editModalFooter}><button className={styles.btnGhost} onClick={() => setEditId(null)}>Cancel</button><button className={styles.btnSuccess} onClick={() => saveEdit(editId)}><Save size={14} /> Save Changes</button></div>
                    </div>
                </div>
            )}

            {cats.map(cat => (
                <div key={cat} className={styles.menuGroup}>
                    <div className={styles.menuGroupLabel}>{cat}</div>
                    <div className={styles.menuGrid}>
                        {store.menuItems.filter(i => i.category === cat).map(item => (
                            <div key={item.id} className={`${styles.menuCard} ${!item.available ? styles.menuCardDim : ''}`}>
                                <div className={styles.menuCardImg}><img src={item.image} alt={item.title} /><span className={`${styles.menuCardBadge} ${item.available ? styles.badgeGreen : styles.badgeRed}`}>{item.available ? 'Available' : 'Unavailable'}</span></div>
                                <div className={styles.menuCardBody}>
                                    <div className={styles.menuCardTitle}>{item.title}</div>
                                    <div className={styles.menuCardDesc}>{item.description}</div>
                                    <div className={styles.menuCardFoot}>
                                        <span className={styles.menuCardPrice}>${item.price.toFixed(2)}</span>
                                        <div className={styles.menuCardActions}>
                                            <button className={styles.menuCardToggle} onClick={() => toggle(item.id)}>{item.available ? <ToggleRight size={16} color="#059669" /> : <ToggleLeft size={16} color="#DC2626" />}</button>
                                            <button className={`${styles.rowBtn} ${styles.rowBtnBlue}`} onClick={() => startEdit(item)}><Pencil size={12} /></button>
                                            <button className={`${styles.rowBtn} ${styles.rowBtnRed}`} onClick={() => handleDelete(item.id)}><Trash2 size={12} /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ─── Hours ──────────────────────────────────────────────────────────────── */
function HoursSection({ store, onUpdate }) {
    const [hours, setHours] = useState(store.operatingHours);
    const [saved, setSaved] = useState(false);
    function setDay(idx, field, value) { setHours(h => h.map((d, i) => i === idx ? { ...d, [field]: value } : d)); setSaved(false); }
    function handleSave() { onUpdate({ ...store, operatingHours: hours }); setSaved(true); setTimeout(() => setSaved(false), 2500); }
    return (
        <div>
            <div className={styles.sectionHeader}><h2 className={styles.sectionTitle}>Operating Hours</h2><button className={saved ? styles.btnSaved : styles.btnSuccess} onClick={handleSave}>{saved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> Save Hours</>}</button></div>
            <div className={styles.hoursCard}>
                {hours.map((row, idx) => (
                    <div key={row.day} className={`${styles.hoursRow} ${!row.open ? styles.hoursRowClosed : ''}`}>
                        <span className={styles.dayName}>{row.day}</span>
                        <label className={styles.switch}><input type="checkbox" checked={row.open} onChange={e => setDay(idx, 'open', e.target.checked)} /><span className={styles.switchTrack} /><span className={styles.switchLabel}>{row.open ? 'Open' : 'Closed'}</span></label>
                        <input type="time" className={styles.timeInput} value={row.from} disabled={!row.open} onChange={e => setDay(idx, 'from', e.target.value)} />
                        <span className={styles.timeSep}>to</span>
                        <input type="time" className={styles.timeInput} value={row.to} disabled={!row.open} onChange={e => setDay(idx, 'to', e.target.value)} />
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ─── Settings ───────────────────────────────────────────────────────────── */
function SettingsSection({ store, onUpdate }) {
    const [form, setForm] = useState({ branchName: store.branchName, location: store.location, phone: store.phone, about: store.about, deliveryTime: store.deliveryTime, minOrder: store.minOrder, status: store.status });
    const [saved, setSaved] = useState(false);
    function handleSave(e) { e.preventDefault(); onUpdate({ ...store, ...form }); setSaved(true); setTimeout(() => setSaved(false), 2500); }
    const f = (key, label, icon) => (<div className={styles.field} key={key}><label>{icon} {label}</label><input value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} /></div>);
    return (
        <div>
            <h2 className={styles.sectionTitle}>Branch Settings</h2>
            <div className={styles.formCard}>
                <form onSubmit={handleSave}>
                    <div className={styles.formGrid2}>
                        {f('branchName', 'Branch Name', <Tag size={12} />)}
                        {f('location', 'Location / Address', <MapPin size={12} />)}
                        {f('phone', 'Contact Number', <Hash size={12} />)}
                        {f('deliveryTime', 'Delivery Time', <Truck size={12} />)}
                        {f('minOrder', 'Minimum Order', <DollarSign size={12} />)}
                        <div className={styles.field}><label><Layers size={12} /> Status</label><select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}><option value="Operational">Operational</option><option value="Temporarily Closed">Temporarily Closed</option><option value="Closed">Closed</option></select></div>
                        <div className={`${styles.field} ${styles.fieldFull}`}><label><FileText size={12} /> About</label><textarea rows={3} value={form.about} onChange={e => setForm(p => ({ ...p, about: e.target.value }))} /></div>
                    </div>
                    <div className={styles.formActions}><button type="submit" className={saved ? styles.btnSaved : styles.btnSuccess}>{saved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> Save Changes</>}</button></div>
                </form>
            </div>
        </div>
    );
}

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
            { key: 'earnings', label: 'Earnings', icon: <DollarSign size={18} /> },
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

    if (!currentOwner) { navigate('/owner-login'); return null; }
    if (!ownerStore) return <p>Store not found.</p>;

    const mockOrders = buildOrders(ownerStore);
    const pendingCount = mockOrders.filter(o => o.status === 'Pending').length;

    let activeLabel = 'Dashboard';
    NAV_GROUPS.forEach(g => {
        const found = g.items.find(i => i.key === active);
        if (found) activeLabel = found.label;
    });

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
                            {group.items.map(n => (
                                <button key={n.key} className={`${styles.navBtn} ${active === n.key ? styles.navBtnActive : ''}`} onClick={() => setActive(n.key)}>
                                    <span className={styles.navIcon}>{n.icon}</span>
                                    <span>{n.label}</span>
                                    {n.key === 'orders' && pendingCount > 0 && <span className={styles.badge}>{pendingCount}</span>}
                                </button>
                            ))}
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
                <div className={styles.topBar}>
                    <div>
                        <h1 className={styles.topTitle}>{active === 'overview' ? 'Dashboard' : activeLabel}</h1>
                        <p className={styles.topSub}>Welcome back, {ownerStore.branchName}!</p>
                    </div>
                    <div className={styles.topRight}>
                        <div className={styles.searchWrap}>
                            <Search className={styles.searchIcon} size={16} />
                            <input type="text" placeholder="Search orders, menu..." className={styles.searchInput} />
                        </div>
                        <button className={styles.notificationBtn}>
                            <Bell size={20} />
                            <span className={styles.notificationBadge}></span>
                        </button>
                    </div>
                </div>
                <div className={styles.content}>
                    {active === 'overview' && <OverviewSection store={ownerStore} orders={mockOrders} />}
                    {active === 'orders' && <OrdersSection store={ownerStore} />}
                    {active === 'inventory' && <InventorySection store={ownerStore} onUpdate={updateStore} />}
                    {active === 'menu' && <MenuSection store={ownerStore} onUpdate={updateStore} />}
                    {active === 'hours' && <HoursSection store={ownerStore} onUpdate={updateStore} />}
                    {active === 'settings' && <SettingsSection store={ownerStore} onUpdate={updateStore} />}
                </div>
            </div>
        </div>
    );
}

export default OwnerDashboard;
