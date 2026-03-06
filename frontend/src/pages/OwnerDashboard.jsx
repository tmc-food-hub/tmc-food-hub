import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    LayoutDashboard, UtensilsCrossed, Clock, Settings, LogOut,
    Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Save, X, Check,
    Package, DollarSign, ShoppingBag, Truck, Bell,
    AlertCircle, CheckCircle2, Timer, MapPin, FileText, Tag,
    Hash, Layers, ExternalLink
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
    const active = store.menuItems.filter(i => i.available).length;
    const pending = orders.filter(o => o.status === 'Pending').length;
    const todayRev = orders.filter(o => o.status === 'Delivered').reduce((s, o) => s + o.total, 0);
    const cats = [...new Set(store.menuItems.map(i => i.category))].length;
    const stats = [
        { icon: <Package size={20} />, label: 'Menu Items', value: store.menuItems.length, sub: `${active} available`, color: '#2563EB' },
        { icon: <ShoppingBag size={20} />, label: 'New Orders', value: pending, sub: 'awaiting action', color: '#D97706' },
        { icon: <DollarSign size={20} />, label: "Today's Revenue", value: `$${todayRev.toFixed(2)}`, sub: `${orders.filter(o => o.status === 'Delivered').length} delivered`, color: '#059669' },
        { icon: <UtensilsCrossed size={20} />, label: 'Categories', value: cats, sub: 'menu sections', color: '#7C3AED' },
    ];
    return (
        <div>
            <div className={styles.statsGrid}>
                {stats.map(s => (
                    <div key={s.label} className={styles.statCard}>
                        <div className={styles.statIconWrap} style={{ '--c': s.color }}>{s.icon}</div>
                        <div className={styles.statBody}>
                            <span className={styles.statValue}>{s.value}</span>
                            <span className={styles.statLabel}>{s.label}</span>
                            <span className={styles.statSub}>{s.sub}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Popular items */}
            <div className={styles.overviewSection}>
                <div className={styles.cardHeader}>Popular Menu Items</div>
                <div className={styles.topItems}>
                    {store.menuItems.slice(0, 6).map(item => (
                        <div key={item.id} className={styles.topItemCard}>
                            <img src={item.image} alt={item.title} className={styles.topItemImg} />
                            <div className={styles.topItemInfo}><span className={styles.topItemName}>{item.title}</span><span className={styles.topItemPrice}>${item.price.toFixed(2)}</span></div>
                            <span className={`${styles.topItemBadge} ${item.available ? styles.badgeGreen : styles.badgeRed}`}>{item.available ? 'Active' : 'Out'}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.overviewCards}>
                <div className={styles.infoCard}>
                    <div className={styles.cardHeader}>Branch Details</div>
                    {[['Branch', store.branchName], ['Location', store.location], ['Phone', store.phone], ['Delivery', store.deliveryTime], ['Min. Order', store.minOrder], ['Status', store.status]].map(([k, v]) => (
                        <div key={k} className={styles.infoRow}><span>{k}</span><strong className={k === 'Status' ? (v === 'Operational' ? styles.pillGreen : styles.pillRed) : ''}>{k === 'Status' ? `● ${v}` : v}</strong></div>
                    ))}
                </div>
                <div className={styles.infoCard}>
                    <div className={styles.cardHeader}>Recent Orders</div>
                    {orders.slice(0, 4).map(o => {
                        const m = statusMeta(o.status); return (
                            <div key={o.id} className={styles.infoRow}>
                                <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{o.id}</span>
                                <span>{o.customer}</span>
                                <span className={styles.statusPillSmall} style={{ background: m.bg, color: m.color }}>{o.status}</span>
                                <strong>${o.total.toFixed(2)}</strong>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

/* ─── Orders ─────────────────────────────────────────────────────────────── */
function OrdersSection({ store }) {
    const [orders, setOrders] = useState(() => buildOrders(store));
    const [filt, setFilt] = useState('All');
    function advance(id) { setOrders(p => p.map(o => { if (o.id !== id) return o; const m = statusMeta(o.status); return m.next ? { ...o, status: m.next } : o; })) }
    const displayed = filt === 'All' ? orders : orders.filter(o => o.status === filt);
    const counts = { All: orders.length }; STATUS_ORDER.forEach(s => { counts[s] = orders.filter(o => o.status === s).length; });
    return (
        <div>
            <div className={styles.orderFilterRow}>
                {['All', ...STATUS_ORDER].map(s => (<button key={s} className={`${styles.filterPill} ${filt === s ? styles.filterPillActive : ''}`} onClick={() => setFilt(s)}>{s} <span className={styles.filterCount}>{counts[s]}</span></button>))}
            </div>
            <div className={styles.orderList}>
                {displayed.length === 0 && <div className={styles.emptyState}><ShoppingBag size={40} color="#D1D5DB" /><p>No orders</p></div>}
                {displayed.map(order => {
                    const meta = statusMeta(order.status); return (
                        <div key={order.id} className={styles.orderCard}>
                            <div className={styles.orderLeft}>
                                <div className={styles.orderTop}><span className={styles.orderId}>{order.id}</span><span className={styles.orderTime}>{order.time}</span></div>
                                <div className={styles.orderCustomer}>{order.customer}</div>
                                <div className={styles.orderAddr}><MapPin size={11} /> {order.address}</div>
                                <div className={styles.orderItemsRow}>
                                    {order.items.map((it, i) => (<div key={i} className={styles.orderItemChip}><img src={it.image} alt={it.name} className={styles.orderItemImg} /><span className={styles.orderItemName}>×{it.qty} {it.name}</span></div>))}
                                </div>
                                {order.note && <div className={styles.orderNote}>📝 {order.note}</div>}
                            </div>
                            <div className={styles.orderRight}>
                                <span className={styles.orderTotal}>${order.total.toFixed(2)}</span>
                                <span className={styles.statusPill} style={{ background: meta.bg, color: meta.color }}>{meta.icon} {order.status}</span>
                                {meta.next && <button className={styles.advanceBtn} style={{ '--c': meta.color }} onClick={() => advance(order.id)}>{meta.nextLabel}</button>}
                            </div>
                        </div>
                    );
                })}
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
const NAV = [
    { key: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { key: 'orders', label: 'Orders', icon: <ShoppingBag size={18} /> },
    { key: 'menu', label: 'Menu', icon: <UtensilsCrossed size={18} /> },
    { key: 'hours', label: 'Hours', icon: <Clock size={18} /> },
    { key: 'settings', label: 'Settings', icon: <Settings size={18} /> },
];

function OwnerDashboard() {
    const { currentOwner, ownerStore, logout, updateStore } = useOwnerAuth();
    const navigate = useNavigate();
    const [active, setActive] = useState('overview');

    if (!currentOwner) { navigate('/owner-login'); return null; }
    if (!ownerStore) return <p>Store not found.</p>;

    const mockOrders = buildOrders(ownerStore);
    const pendingCount = mockOrders.filter(o => o.status === 'Pending').length;

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

                {/* Store info */}
                <div className={styles.storeInfo}>
                    <div className={styles.storeAvatar}>{ownerStore.name.charAt(0)}</div>
                    <div className={styles.storeDetails}>
                        <div className={styles.storeName}>{ownerStore.name}</div>
                        <div className={styles.branchName}>{ownerStore.branchName}</div>
                    </div>
                    <span className={`${styles.statusDot} ${ownerStore.status === 'Operational' ? styles.dotGreen : styles.dotRed}`} />
                </div>

                {/* Navigation */}
                <nav className={styles.nav}>
                    <div className={styles.navLabel}>MANAGEMENT</div>
                    {NAV.map(n => (
                        <button key={n.key} className={`${styles.navBtn} ${active === n.key ? styles.navBtnActive : ''}`} onClick={() => setActive(n.key)}>
                            <span className={styles.navIcon}>{n.icon}</span>
                            <span>{n.label}</span>
                            {n.key === 'orders' && pendingCount > 0 && <span className={styles.badge}>{pendingCount}</span>}
                        </button>
                    ))}
                </nav>

                {/* Footer */}
                <div className={styles.sidebarFooter}>
                    <Link to="/" className={styles.backToSite}><ExternalLink size={13} /> Back to TMC Food Hub</Link>
                    <div className={styles.ownerEmail}>{currentOwner.email}</div>
                    <button className={styles.logoutBtn} onClick={() => { logout(); navigate('/owner-login'); }}><LogOut size={14} /> Sign out</button>
                </div>
            </aside>

            {/* ── Main ── */}
            <div className={styles.main}>
                <div className={styles.topBar}>
                    <div>
                        <h1 className={styles.topTitle}>{NAV.find(n => n.key === active)?.label}</h1>
                        <p className={styles.topSub}>{ownerStore.branchName} — {ownerStore.name}</p>
                    </div>
                    <span className={`${styles.statusPill} ${ownerStore.status === 'Operational' ? styles.pillGreen : styles.pillRed}`}>● {ownerStore.status}</span>
                </div>
                <div className={styles.content}>
                    {active === 'overview' && <OverviewSection store={ownerStore} orders={mockOrders} />}
                    {active === 'orders' && <OrdersSection store={ownerStore} />}
                    {active === 'menu' && <MenuSection store={ownerStore} onUpdate={updateStore} />}
                    {active === 'hours' && <HoursSection store={ownerStore} onUpdate={updateStore} />}
                    {active === 'settings' && <SettingsSection store={ownerStore} onUpdate={updateStore} />}
                </div>
            </div>
        </div>
    );
}

export default OwnerDashboard;
