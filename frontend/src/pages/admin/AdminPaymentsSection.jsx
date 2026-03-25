import React, { useState, useMemo, useEffect } from 'react';
import {
    TrendingUp, Percent, Clock, AlertTriangle, Download, ChevronDown, Eye,
    X, CheckCircle2, MoreVertical, Phone, Calendar, MapPin, Store, Tag,
    DollarSign, Info, Building, Loader
} from 'lucide-react';
import styles from './AdminPaymentsSection.module.css';

/* ─── Mock Data ─────────────────────────────────────────────────────────────── */
const MOCK_PAYMENTS = [
    { id: 1, restaurant: 'Patty Shack', category: 'Fast Food', owner: 'Juan Dela Cruz', totalSales: 452000, netPayout: 42000, status: 'Unpaid', lastUpdated: '1 day ago', logo: null,
      details: { payoutId: '#RE-4921', pendingPayout: 42850.50, commissionRate: 10.0, phone: '+63 917 123 4567', accountCreated: 'Jan 25, 2026', location: 'Makati City', branches: 3, grossSales: 452000, commission: 67800, disputes: 2500, scheduledDate: 'Mar 20, 2026', hasUnresolvedDisputes: true, disputeAmount: 2500 }},
    { id: 2, restaurant: 'Jollibee', category: 'Fast Food', owner: 'Michael Smith', totalSales: 321000, netPayout: 304000, status: 'Unpaid', lastUpdated: 'About 6 hours ago', logo: null,
      details: { payoutId: '#RE-4922', pendingPayout: 30400, commissionRate: 10.0, phone: '+63 920 111 2233', accountCreated: 'Dec 15, 2025', location: 'Quezon City', branches: 5, grossSales: 321000, commission: 32100, disputes: 0, scheduledDate: 'Mar 22, 2026', hasUnresolvedDisputes: false, disputeAmount: 0 }},
    { id: 3, restaurant: 'Mcdonalds', category: 'Fast Food', owner: 'Amy Lee', totalSales: 389000, netPayout: 244000, status: 'Paid', lastUpdated: '2 days ago', logo: null,
      details: { payoutId: '#RE-4923', pendingPayout: 0, commissionRate: 10.0, phone: '+63 918 333 4455', accountCreated: 'Nov 1, 2025', location: 'Pasig City', branches: 2, grossSales: 389000, commission: 38900, disputes: 1200, scheduledDate: 'Mar 18, 2026', hasUnresolvedDisputes: false, disputeAmount: 0 }},
    { id: 4, restaurant: 'Jollibee', category: 'Fast Food', owner: 'Robert Brown', totalSales: 610000, netPayout: 541000, status: 'Paid', lastUpdated: '1 day ago', logo: null,
      details: { payoutId: '#RE-4924', pendingPayout: 0, commissionRate: 10.0, phone: '+63 927 555 6677', accountCreated: 'Oct 10, 2025', location: 'Cebu City', branches: 4, grossSales: 610000, commission: 61000, disputes: 0, scheduledDate: 'Mar 19, 2026', hasUnresolvedDisputes: false, disputeAmount: 0 }},
    { id: 5, restaurant: 'Burger King', category: 'Fast Food', owner: 'Kevin White', totalSales: 252000, netPayout: 199000, status: 'Unpaid', lastUpdated: '4 days ago', logo: null,
      details: { payoutId: '#RE-4925', pendingPayout: 19900, commissionRate: 10.0, phone: '+63 915 777 8899', accountCreated: 'Jan 5, 2026', location: 'Manila', branches: 1, grossSales: 252000, commission: 25200, disputes: 800, scheduledDate: 'Mar 24, 2026', hasUnresolvedDisputes: false, disputeAmount: 0 }},
    { id: 6, restaurant: 'Pizza Hut', category: 'Pizza', owner: 'Jennie Kim', totalSales: 176000, netPayout: 150000, status: 'Paid', lastUpdated: '7 days ago', logo: null,
      details: { payoutId: '#RE-4926', pendingPayout: 0, commissionRate: 10.0, phone: '+63 912 000 1122', accountCreated: 'Feb 20, 2026', location: 'Taguig City', branches: 2, grossSales: 176000, commission: 17600, disputes: 0, scheduledDate: 'Mar 15, 2026', hasUnresolvedDisputes: false, disputeAmount: 0 }},
    { id: 7, restaurant: 'Mang Inasal', category: 'Filipino', owner: 'Ramon Santos', totalSales: 234000, netPayout: 199000, status: 'Pending', lastUpdated: '4 days ago', logo: null,
      details: { payoutId: '#RE-4927', pendingPayout: 19900, commissionRate: 10.0, phone: '+63 908 222 3344', accountCreated: 'Mar 1, 2026', location: 'Davao City', branches: 1, grossSales: 234000, commission: 23400, disputes: 500, scheduledDate: 'Mar 26, 2026', hasUnresolvedDisputes: false, disputeAmount: 0 }},
    { id: 8, restaurant: 'Chowking', category: 'Chinese', owner: 'Daniel Reyes', totalSales: 145000, netPayout: 123000, status: 'Paid', lastUpdated: '8 days ago', logo: null,
      details: { payoutId: '#RE-4928', pendingPayout: 0, commissionRate: 10.0, phone: '+63 917 444 5566', accountCreated: 'Sep 15, 2025', location: 'Caloocan', branches: 2, grossSales: 145000, commission: 14500, disputes: 0, scheduledDate: 'Mar 14, 2026', hasUnresolvedDisputes: false, disputeAmount: 0 }},
    { id: 9, restaurant: 'Shakeys', category: 'Pizza', owner: 'Anna Garcia', totalSales: 167000, netPayout: 142000, status: 'Paid', lastUpdated: '9 days ago', logo: null,
      details: { payoutId: '#RE-4929', pendingPayout: 0, commissionRate: 10.0, phone: '+63 926 666 7788', accountCreated: 'Aug 20, 2025', location: 'Paranaque', branches: 3, grossSales: 167000, commission: 16700, disputes: 200, scheduledDate: 'Mar 13, 2026', hasUnresolvedDisputes: false, disputeAmount: 0 }},
];

const STATS = [
    { label: 'Total Marketplace GMV', value: '2,458', sub: '+4.2% this week', icon: <TrendingUp size={18} />, color: '#FEF2F2', iconColor: '#DC2626', up: true },
    { label: 'Platform Commission', value: '459k', sub: '+4% this week', icon: <Percent size={18} />, color: '#FFF7ED', iconColor: '#EA580C', up: true },
    { label: 'Pending Payouts', value: '1,824', sub: '+4.2% this week', icon: <Clock size={18} />, color: '#FFF7ED', iconColor: '#EA580C', up: true },
    { label: 'Disputes Value', value: '3,124', sub: '-1.2% last week', icon: <AlertTriangle size={18} />, color: '#FEF2F2', iconColor: '#DC2626', up: false },
];
const EXPORT_COLUMNS = ['Restaurant', 'Owner', 'Total Sales', 'Net Payout', 'Status', 'Last Updated'];

function getInitials(n) { return n.split(' ').map(x => x[0]).join('').toUpperCase().slice(0, 2); }
function getColor(n) {
    const c = ['#DC2626','#EA580C','#D97706','#059669','#2563EB','#7C3AED','#DB2777'];
    let h = 0; for (let i = 0; i < n.length; i++) h = n.charCodeAt(i) + ((h << 5) - h);
    return c[Math.abs(h) % c.length];
}
function pesoShort(v) { if (v >= 1000000) return `₱${(v/1000000).toFixed(1)}M`; if (v >= 1000) return `₱${Math.round(v/1000)}k`; return `₱${v}`; }
function pesoFull(v) { return `₱${Number(v||0).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}`; }
function getStatusClass(s) {
    const v = s.toLowerCase();
    if (v === 'paid') return styles.statusPaid;
    if (v === 'unpaid') return styles.statusUnpaid;
    if (v === 'pending') return styles.statusPending;
    return '';
}
function getLogoColor(name) {
    const map = { 'Patty Shack': '#8B4513', 'Jollibee': '#DC2626', 'Mcdonalds': '#EA580C', 'Burger King': '#1D4ED8', 'Pizza Hut': '#DC2626', 'Mang Inasal': '#059669', 'Chowking': '#DC2626', 'Shakeys': '#DC2626' };
    return map[name] || getColor(name);
}

/* ─── Component ─────────────────────────────────────────────────────────────── */
export default function AdminPaymentsSection() {
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [showExport, setShowExport] = useState(false);
    const [showConfirmPayout, setShowConfirmPayout] = useState(null);
    const [exportFormat, setExportFormat] = useState('csv');
    const [exportColumns, setExportColumns] = useState(EXPORT_COLUMNS.reduce((a, c) => ({ ...a, [c]: true }), {}));
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [locationFilter, setLocationFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [confirmChecked, setConfirmChecked] = useState(false);
    const [toast, setToast] = useState(null);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPayments();
    }, [statusFilter]);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('admin_auth_token');
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
            const url = `${apiUrl}/admin/payments?per_page=50&status=${statusFilter}`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setPayments(data.data || []);
        } catch (err) {
            console.error('Error fetching payments:', err);
            setError(err.message || 'Failed to load payments');
            setPayments(MOCK_PAYMENTS);
        } finally {
            setLoading(false);
        }
    };

    const filteredPayments = useMemo(() => {
        let r = payments;
        if (categoryFilter !== 'All') r = r.filter(x => x.category === categoryFilter);
        return r;
    }, [payments, categoryFilter]);

    const clearFilters = () => { setCategoryFilter('All'); setLocationFilter('All'); setStatusFilter('All'); };

    const handleExport = () => {
        setShowExport(false);
        setToast({ msg: 'Success', sub: 'Your CSV report has been downloaded successfully.' });
        setTimeout(() => setToast(null), 4000);
    };

    const handleConfirmPayout = () => {
        const p = showConfirmPayout;
        setShowConfirmPayout(null);
        setConfirmChecked(false);
        setToast({ msg: 'Success', sub: `The ${pesoFull(p.details.pendingPayout)} will be transferred to ${p.owner}` });
        setTimeout(() => setToast(null), 4000);
    };

    const openConfirmPayout = (p) => { setSelectedPayment(null); setConfirmChecked(false); setShowConfirmPayout(p); };

    return (
        <div className={styles.container}>
            {/* Toast */}
            {toast && (
                <div className={styles.toast}>
                    <CheckCircle2 size={20} className={styles.toastIcon} />
                    <div><div className={styles.toastTitle}>{toast.msg}</div><div className={styles.toastSub}>{toast.sub}</div></div>
                    <button className={styles.toastClose} onClick={() => setToast(null)}><X size={16} /></button>
                </div>
            )}

            {/* Stats */}
            <div className={styles.statsRow}>
                {STATS.map(stat => (
                    <div key={stat.label} className={styles.statCard}>
                        <div className={styles.statIcon} style={{ background: stat.color, color: stat.iconColor }}>{stat.icon}</div>
                        <div className={styles.statBody}>
                            <div className={styles.statLabel}>{stat.label}</div>
                            <div className={styles.statValue}>{stat.value}</div>
                            <div className={stat.up ? styles.statSubUp : styles.statSubDown}>{stat.sub}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters & Export */}
            <div className={styles.filtersBar}>
                <div className={styles.dropdownFilters}>
                    <div className={styles.selectWrap}><select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}><option value="All">Category: All</option><option>Fast Food</option><option>Pizza</option><option>Filipino</option><option>Chinese</option></select><ChevronDown size={14} className={styles.selectArrow} /></div>
                    <div className={styles.selectWrap}><select value={locationFilter} onChange={e => setLocationFilter(e.target.value)}><option value="All">All Locations</option><option>Makati City</option><option>Quezon City</option><option>Cebu City</option></select><ChevronDown size={14} className={styles.selectArrow} /></div>
                    <div className={styles.selectWrap}><select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}><option value="All">All Status</option><option>Paid</option><option>Unpaid</option><option>Pending</option></select><ChevronDown size={14} className={styles.selectArrow} /></div>
                    <button className={styles.clearBtn} onClick={clearFilters}>Clear all</button>
                </div>
                <button className={styles.exportBtn} onClick={() => setShowExport(true)}><Download size={16} /> Export</button>
            </div>

            {/* Table */}
            <div className={styles.tableCard}>
                {loading && (
                    <div style={{display:'flex',justifyContent:'center',alignItems:'center',padding:'40px',gap:'10px',color:'#666'}}>
                        <Loader size={20} className={styles.spinner} /> Loading payments...
                    </div>
                )}
                {error && (
                    <div style={{padding:'20px',background:'#FEE2E2',border:'1px solid #FECACA',borderRadius:'8px',color:'#991B1B'}}>
                        ⚠️ {error}
                    </div>
                )}
                {!loading && !error && (
                    <table className={styles.table}>
                        <thead><tr><th>Restaurant</th><th>Owner</th><th>Total Sales</th><th>Net Payout</th><th>Payment Status</th><th>Last Updated</th><th>Actions</th></tr></thead>
                        <tbody>
                            {filteredPayments.length > 0 ? filteredPayments.map(p => (
                                <tr key={p.id} className={styles.tableRow}>
                                    <td>
                                        <div className={styles.restCell}>
                                            <div className={styles.restLogo} style={{ background: getLogoColor(p.restaurant) }}>{p.restaurant[0]}</div>
                                            <div>
                                                <div className={styles.restName}>{p.restaurant}</div>
                                                <div className={styles.restCat}>{p.category}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.ownerCell}>
                                            <div className={styles.ownerAvatar} style={{ background: getColor(p.owner) }}>{getInitials(p.owner)}</div>
                                            <span>{p.owner}</span>
                                        </div>
                                    </td>
                                    <td className={styles.amount}>{pesoShort(p.totalSales)}</td>
                                    <td className={styles.amount}>{pesoShort(p.netPayout)}</td>
                                    <td><span className={`${styles.statusPill} ${getStatusClass(p.status)}`}>{p.status}</span></td>
                                    <td className={styles.dateCol}>{p.lastUpdated}</td>
                                    <td>
                                        <div className={styles.actionBtns}>
                                        <button className={styles.actionIcon} onClick={() => setSelectedPayment(p)}><Eye size={15} /></button>
                                        <button className={styles.actionIcon}><MoreVertical size={15} /></button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="7" style={{textAlign:'center',padding:'40px',color:'#999'}}>No payments found</td></tr>
                        )}
                    </tbody>
                </table>
                )}
            </div>

            {/* ── Payout Details Panel ── */}
            {selectedPayment && (
                <>
                    <div className={styles.panelOverlay} onClick={() => setSelectedPayment(null)} />
                    <div className={styles.detailPanel}>
                        <div className={styles.panelHeader}>
                            <div>
                                <h2 className={styles.panelTitle}>{selectedPayment.restaurant} - Payout Details <span className={styles.panelId}>ID: {selectedPayment.details.payoutId}</span></h2>
                                <p className={styles.panelSub}>Review and manage payout request</p>
                            </div>
                            <button className={styles.panelClose} onClick={() => setSelectedPayment(null)}><X size={20} /></button>
                        </div>
                        <div className={styles.panelBody}>
                            {/* Dispute Alert */}
                            {selectedPayment.details.hasUnresolvedDisputes && (
                                <div className={styles.disputeAlert}>
                                    <AlertTriangle size={14} />
                                    <div><strong>Unresolved disputes</strong><br />This restaurant has {pesoFull(selectedPayment.details.disputeAmount)} in pending disputes that require review.</div>
                                </div>
                            )}

                            {/* Restaurant Profile */}
                            <div className={styles.restProfile}>
                                <div className={styles.restProfileLogo} style={{ background: getLogoColor(selectedPayment.restaurant) }}>{selectedPayment.restaurant[0]}</div>
                                <div>
                                    <div className={styles.restProfileName}>{selectedPayment.restaurant}</div>
                                    <div className={styles.restProfileOwner}>Restaurant Owner: {selectedPayment.owner}</div>
                                    <span className={`${styles.statusPill} ${getStatusClass(selectedPayment.status)}`}>{selectedPayment.status}</span>
                                </div>
                            </div>

                            {/* Payout Summary */}
                            <div className={styles.sectionLabel}>Payout Summary</div>
                            <div className={styles.summaryRow}>
                                <div className={styles.summaryCard}>
                                    <div className={styles.summaryLabel}>Pending Payout <DollarSign size={14} className={styles.summaryIcon} /></div>
                                    <div className={styles.summaryValue}>{pesoFull(selectedPayment.details.pendingPayout)}</div>
                                </div>
                                <div className={styles.summaryCard}>
                                    <div className={styles.summaryLabel}>Commission Rate <Percent size={14} className={styles.summaryIcon} /></div>
                                    <div className={styles.summaryValue}>{selectedPayment.details.commissionRate}% Fixed</div>
                                </div>
                            </div>

                            {/* Owner Information */}
                            <div className={styles.sectionLabel}>Owner Information</div>
                            <div className={styles.infoCard}>
                                <div className={styles.infoRow}><Phone size={14} /> <span>Phone</span> <span>{selectedPayment.details.phone}</span></div>
                                <div className={styles.infoRow}><Calendar size={14} /> <span>Account Created</span> <span>{selectedPayment.details.accountCreated}</span></div>
                                <div className={styles.infoRow}><MapPin size={14} /> <span>Location</span> <span>{selectedPayment.details.location}</span></div>
                                <div className={styles.infoRow}><Building size={14} /> <span>Owned Branches</span> <span>{selectedPayment.details.branches} Locations</span></div>
                                <div className={styles.infoRow}><Tag size={14} /> <span>Category</span> <span>{selectedPayment.category}</span></div>
                            </div>

                            {/* Financial Breakdown */}
                            <div className={styles.sectionLabel}>Financial Breakdown</div>
                            <div className={styles.finCard}>
                                <div className={styles.finRow}><span>Gross Sales</span><span className={styles.finGreen}>+{pesoFull(selectedPayment.details.grossSales)}</span></div>
                                <div className={styles.finRow}><span>Platform Commission ({selectedPayment.details.commissionRate}%)</span><span className={styles.finRed}>-{pesoFull(selectedPayment.details.commission)}</span></div>
                                <div className={styles.finRow}><span><AlertTriangle size={12} /> Dispute Adjustments</span><span className={styles.finRed}>-{pesoFull(selectedPayment.details.disputes)}</span></div>
                                <div className={`${styles.finRow} ${styles.finTotal}`}><span>Total Net Payout</span><span className={styles.finTotalVal}>{pesoFull(selectedPayment.details.grossSales - selectedPayment.details.commission - selectedPayment.details.disputes)}</span></div>
                            </div>

                            {/* Payment Details */}
                            <div className={styles.sectionLabel}>Payment Details</div>
                            <div className={styles.paymentDetail}>
                                <Calendar size={14} /> <span>Scheduled Payout Date</span> <span>{selectedPayment.details.scheduledDate}</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className={styles.panelActions}>
                            <div className={styles.panelActionRow}>
                                <button className={styles.holdBtn}>Put on Hold</button>
                                <button className={styles.rejectBtn}>Reject</button>
                            </div>
                            <button className={styles.confirmPayoutBtn} onClick={() => openConfirmPayout(selectedPayment)}>Confirm Payout</button>
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
                            <div><h2 className={styles.modalTitle}>Export Payments Data</h2><p className={styles.modalSub}>Download a snapshot of your payments & payouts data based on your selected filters and date range.</p></div>
                            <button className={styles.modalClose} onClick={() => setShowExport(false)}><X size={20} /></button>
                        </div>
                        <div className={styles.modalBody}>
                            <label className={styles.fieldLabel}>Date Range</label>
                            <div className={styles.selectWrap} style={{ width: '100%' }}><select style={{ width: '100%' }}><option>Last 30 Days</option><option>Last 7 days</option><option>All Time</option></select><ChevronDown size={14} className={styles.selectArrow} /></div>
                            <label className={styles.fieldLabel} style={{ marginTop: '1rem' }}>File Format</label>
                            <div className={styles.formatRow}>
                                <label className={`${styles.formatOption} ${exportFormat === 'csv' ? styles.formatActive : ''}`}><input type="radio" name="fmt" checked={exportFormat === 'csv'} onChange={() => setExportFormat('csv')} /><div><div className={styles.formatTitle}>CSV</div><div className={styles.formatSub}>Spreadsheet data</div></div></label>
                                <label className={`${styles.formatOption} ${exportFormat === 'pdf' ? styles.formatActive : ''}`}><input type="radio" name="fmt" checked={exportFormat === 'pdf'} onChange={() => setExportFormat('pdf')} /><div><div className={styles.formatTitle}>PDF</div><div className={styles.formatSub}>Visual report</div></div></label>
                            </div>
                            <label className={styles.fieldLabel} style={{ marginTop: '1rem' }}>Select columns to include</label>
                            <div className={styles.columnsGrid}>
                                {EXPORT_COLUMNS.map(col => (
                                    <label key={col} className={styles.columnCheck}><input type="checkbox" checked={exportColumns[col]} onChange={() => setExportColumns(p => ({ ...p, [col]: !p[col] }))} /><span className={styles.customCheckbox}><CheckCircle2 size={14} /></span>{col}</label>
                                ))}
                            </div>
                            <div className={styles.exportNote}><Info size={14} /> Removed reviews are included in exports for audit and compliance purposes. Exports include only data visible to your admin role.</div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={styles.downloadBtn} onClick={handleExport}>Download Report</button>
                            <button className={styles.cancelLink} onClick={() => setShowExport(false)}>Cancel</button>
                        </div>
                    </div>
                </>
            )}

            {/* ── Confirm Payout Modal ── */}
            {showConfirmPayout && (
                <>
                    <div className={styles.modalOverlay} onClick={() => setShowConfirmPayout(null)} />
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <div><h2 className={styles.modalTitle}>Confirm Payout for {showConfirmPayout.restaurant}?</h2><p className={styles.modalSub}>Please review the details carefully before confirming this payout.</p></div>
                            <button className={styles.modalClose} onClick={() => setShowConfirmPayout(null)}><X size={20} /></button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.warningBar}><strong>Warning:</strong> This action is final. This cannot be undone.</div>

                            <div className={styles.sectionLabel} style={{ marginTop: '1rem' }}>Owner Information</div>
                            <div className={styles.confirmInfo}>
                                <div className={styles.confirmRow}><span>Restaurant</span><span className={styles.confirmVal}>{showConfirmPayout.restaurant}</span></div>
                                <div className={styles.confirmRow}><span>Owner</span><span className={styles.confirmVal}>{showConfirmPayout.owner}</span></div>
                                <div className={styles.confirmRow}><span>Payout Amount</span><span className={styles.confirmAmount}>{pesoFull(showConfirmPayout.details.pendingPayout)}</span></div>
                            </div>

                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" checked={confirmChecked} onChange={e => setConfirmChecked(e.target.checked)} />
                                <span className={styles.checkboxBox}>✓</span>
                                <div>
                                    <strong>I confirm I have reviewed the sales data</strong>
                                    <p>By checking this box, you acknowledge that all sales date, commission calculations, and dispute adjustments have been verified and the payout amount is accurate.</p>
                                </div>
                            </label>
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={`${styles.confirmFinalBtn} ${!confirmChecked ? styles.confirmDisabled : ''}`} disabled={!confirmChecked} onClick={handleConfirmPayout}>Confirm Payout</button>
                            <button className={styles.cancelLink} onClick={() => setShowConfirmPayout(null)}>Cancel</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
