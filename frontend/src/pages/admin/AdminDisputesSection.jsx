import React, { useEffect, useState, useMemo } from 'react';
import {
    AlertTriangle, Shield, DollarSign, Eye, X, CheckCircle2, ChevronDown,
    Mail, Phone, MapPin, Clock, TrendingUp, Info, Store, Loader
} from 'lucide-react';
import styles from './AdminDisputesSection.module.css';

/* ─── Mock Data ─────────────────────────────────────────────────────────────── */
const MOCK_DISPUTES = [
    {
        id: 'DSP-1092', status: 'Under Investigation',
        customer: { name: 'Jane Doe', email: 'janedoe@email.com', phone: '+63 917 *** 4567', location: 'Makati City', accountAge: '1 year, 1 month', avatar: null, accountStatus: 'Active Account' },
        orderId: 'ORD-9912', amount: 850,
        restaurant: { name: 'Patty Shack', date: 'Mar 16, 2026', distance: '2.1 km from delivery' },
        reviewType: 'Missing Items', reviewText: 'I ordered 2 classic burger, an...',
        details: {
            ticketId: '#TMC-00421', date: 'Today, 12:44 PM',
            riskAlert: "Based on Burger Hub's dispute history (6.2% ratio, above 5% threshold) and customer's clear photo evidence, recommend full refund of ₱850. Restaurant has had 3 similar complaints this week.",
            disputeRatio: 6.2, totalOrders: 1248,
            statement: '"I ordered 2 Chickenjoy meals but only 1 arrived. The rider confirmed that the restaurant only handed over one meal to him, so the mistake clearly happened during prep. Please fix this and refund the missing portion of my bill."',
            timeline: [
                { label: 'Order Placed', time: '12:30 PM', type: 'success' },
                { label: 'Order accepted by restaurant', time: '12:35 PM', type: 'success' },
                { label: 'Order delivered', time: '12:50 PM', type: 'success' },
                { label: 'Dispute opened - Missing items received', time: '1:00 PM', type: 'warning' },
                { label: 'Refund requested - Missing items received', time: '1:15 PM', type: 'danger' },
            ],
        }
    },
    {
        id: 'DSP-1093', status: 'Flagged for Fraud',
        customer: { name: 'Michael Smith', email: 'msmith@email.com', phone: '+63 920 *** 1122', location: 'Quezon City', accountAge: '2 months', avatar: null, accountStatus: 'Active Account' },
        orderId: 'ORD-8821', amount: 450,
        restaurant: { name: 'Jollibee', date: 'Mar 16, 2026', distance: '3.5 km from delivery' },
        reviewType: 'Food Quality', reviewText: 'I ordered 1 pizza margherita b...',
        details: {
            ticketId: '#TMC-00422', date: 'Today, 11:00 AM',
            riskAlert: "Multiple dispute claims from this customer in the past 30 days. Pattern suggests potential fraud.",
            disputeRatio: 2.1, totalOrders: 850,
            statement: '"The pizza was cold and tasted stale. This is not acceptable for the price I paid."',
            timeline: [
                { label: 'Order Placed', time: '10:00 AM', type: 'success' },
                { label: 'Order accepted by restaurant', time: '10:05 AM', type: 'success' },
                { label: 'Order delivered', time: '10:30 AM', type: 'success' },
                { label: 'Dispute opened - Food quality complaint', time: '11:00 AM', type: 'warning' },
            ],
        }
    },
    {
        id: 'DSP-1094', status: 'Under Investigation',
        customer: { name: 'Amy Lee', email: 'amylee@email.com', phone: '+63 918 *** 3344', location: 'Pasig City', accountAge: '6 months', avatar: null, accountStatus: 'Active Account' },
        orderId: 'ORD-8821', amount: 450,
        restaurant: { name: 'Mcdonalds', date: 'Mar 16, 2026', distance: '1.8 km from delivery' },
        reviewType: 'Wrong order received', reviewText: 'Customer received completel...',
        details: {
            ticketId: '#TMC-00423', date: 'Yesterday, 3:30 PM',
            riskAlert: null,
            disputeRatio: 1.2, totalOrders: 320,
            statement: '"I ordered a Big Mac meal but received a Filet-O-Fish instead. The order was completely wrong."',
            timeline: [
                { label: 'Order Placed', time: '2:30 PM', type: 'success' },
                { label: 'Order accepted by restaurant', time: '2:35 PM', type: 'success' },
                { label: 'Order delivered', time: '3:00 PM', type: 'success' },
                { label: 'Dispute opened - Wrong order', time: '3:30 PM', type: 'warning' },
            ],
        }
    },
    {
        id: 'DSP-1095', status: 'Under Investigation',
        customer: { name: 'Robert Brown', email: 'rbrown@email.com', phone: '+63 927 *** 5566', location: 'Cebu City', accountAge: '3 months', avatar: null, accountStatus: 'Active Account' },
        orderId: 'ORD-8821', amount: 450,
        restaurant: { name: 'Jollibee', date: 'Mar 16, 2026', distance: '4.2 km from delivery' },
        reviewType: 'Missing Items', reviewText: 'I ordered Veggie Bowl Speciai...',
        details: {
            ticketId: '#TMC-00424', date: 'Yesterday, 1:15 PM',
            riskAlert: null,
            disputeRatio: 0.8, totalOrders: 150,
            statement: '"I ordered a Veggie Bowl Special but two items were missing from my order."',
            timeline: [
                { label: 'Order Placed', time: '12:00 PM', type: 'success' },
                { label: 'Order delivered', time: '12:45 PM', type: 'success' },
                { label: 'Dispute opened - Missing items', time: '1:15 PM', type: 'warning' },
            ],
        }
    },
    {
        id: 'DSP-1093', status: 'Fake',
        customer: { name: 'Kevin White', email: 'kwhite@email.com', phone: '+63 915 *** 7788', location: 'Manila', accountAge: '1 week', avatar: null, accountStatus: 'New Account' },
        orderId: 'ORD-8821', amount: 450,
        restaurant: { name: 'Burger King', date: 'Mar 16, 2026', distance: '5.0 km from delivery' },
        reviewType: 'Late Delivery', reviewText: 'Order arrived 2 hours late, foo...',
        details: {
            ticketId: '#TMC-00425', date: '2 days ago',
            riskAlert: "New account with suspicious dispute pattern. Likely fraudulent claim.",
            disputeRatio: 50.0, totalOrders: 2,
            statement: '"The order arrived 2 hours late and the food was completely cold and inedible."',
            timeline: [
                { label: 'Order Placed', time: '6:00 PM', type: 'success' },
                { label: 'Order delivered', time: '8:00 PM', type: 'danger' },
                { label: 'Dispute opened - Late delivery', time: '8:05 PM', type: 'warning' },
            ],
        }
    },
];

const STATUS_TABS = ['All', 'Needs Review (12)', 'Fraud Flagged (3)', 'Resolvable (8)'];
const REFUND_REASONS = ['Merchant Error — Missing Items', 'Merchant Error — Wrong Order', 'Delivery Issue — Late Delivery', 'Food Quality — Below Standard', 'Other'];
const REJECT_REASONS = ['Insufficient Evidence — No proof provided', 'Duplicate Claim — Already resolved', 'Policy Violation — Customer abuse', 'Time Expired — Outside dispute window', 'Other'];

function getStatusClass(s) {
    const v = s.toLowerCase().replace(/\s+/g, '');
    if (v === 'underinvestigation') return styles.statusInvestigation;
    if (v === 'flaggedforfraud') return styles.statusFraud;
    if (v === 'fake') return styles.statusFake;
    if (v === 'resolved') return styles.statusResolved;
    return styles.statusInvestigation;
}
function getInitials(n) { return n.split(' ').map(x => x[0]).join('').toUpperCase().slice(0, 2); }
function getColor(n) {
    const c = ['#DC2626','#EA580C','#D97706','#059669','#2563EB','#7C3AED','#DB2777'];
    let h = 0; for (let i = 0; i < n.length; i++) h = n.charCodeAt(i) + ((h << 5) - h);
    return c[Math.abs(h) % c.length];
}
function peso(v) { return `₱${Number(v||0).toLocaleString(undefined,{minimumFractionDigits:0,maximumFractionDigits:0})}`; }

/* ─── Component ─────────────────────────────────────────────────────────────── */
export default function AdminDisputesSection() {
    const [activeTab, setActiveTab] = useState('All');
    const [selectedDispute, setSelectedDispute] = useState(null);
    const [showRefund, setShowRefund] = useState(null);
    const [showReject, setShowReject] = useState(null);
    const [refundReason, setRefundReason] = useState(REFUND_REASONS[0]);
    const [refundType, setRefundType] = useState('full');
    const [rejectReason, setRejectReason] = useState(REJECT_REASONS[0]);
    const [toast, setToast] = useState(null);
    const [disputes, setDisputes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDisputes();
    }, [activeTab]);

    const fetchDisputes = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('admin_auth_token');
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/admin/disputes?per_page=50`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch disputes');
            }

            const data = await response.json();
            setDisputes(data.data || []);
        } catch (err) {
            console.error('Error fetching disputes:', err);
            setError(err.message);
            // Fallback to mock data for development
            setDisputes(MOCK_DISPUTES);
        } finally {
            setLoading(false);
        }
    };

    const filteredDisputes = useMemo(() => {
        let d = disputes;
        if (activeTab === 'All') return d;
        if (activeTab.startsWith('Needs')) return d.filter(x => x.status === 'Under Investigation');
        if (activeTab.startsWith('Fraud')) return d.filter(x => x.status === 'Flagged for Fraud' || x.status === 'Fake');
        return MOCK_DISPUTES;
    }, [activeTab]);

    const openRefund = (d) => { setSelectedDispute(null); setShowRefund(d); };
    const openReject = (d) => { setSelectedDispute(null); setShowReject(d); };
    const handleRefund = () => {
        const d = showRefund;
        setShowRefund(null);
        setToast({ msg: 'Success', sub: `A total of ${peso(d.amount)} has been refund successfully` });
        setTimeout(() => setToast(null), 4000);
    };
    const handleReject = () => {
        const d = showReject;
        setShowReject(null);
        setToast({ msg: 'Success', sub: `The claim for Order #${d.orderId} has been dismissed` });
        setTimeout(() => setToast(null), 4000);
    };

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
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: '#FEF2F2', color: '#DC2626' }}><AlertTriangle size={18} /></div>
                    <div className={styles.statBody}>
                        <div className={styles.statLabel}>Active Disputes</div>
                        <div className={styles.statValue}>42</div>
                        <div className={styles.statSub}>+12% vs last week</div>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: '#FFF7ED', color: '#EA580C' }}><Shield size={18} /></div>
                    <div className={styles.statBody}>
                        <div className={styles.statLabel}>Integrity Score</div>
                        <div className={styles.statValue}>98.2%</div>
                        <div className={styles.statSub2}>Based on order success rate</div>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: '#FEF2F2', color: '#DC2626' }}><DollarSign size={18} /></div>
                    <div className={styles.statBody}>
                        <div className={styles.statLabelRow}>
                            <span>Refund Liability</span>
                            <button className={styles.bulkResolveBtn}>Bulk Resolve</button>
                        </div>
                        <div className={styles.statValue}>₱12,500</div>
                        <div className={styles.statSub2}>Total potential cost of pending disputes</div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
                {STATUS_TABS.map(tab => (
                    <button key={tab} className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`} onClick={() => setActiveTab(tab)}>{tab}</button>
                ))}
            </div>

            {/* Table */}
            <div className={styles.tableCard}>
                {loading && (
                    <div style={{display:'flex',justifyContent:'center',alignItems:'center',padding:'40px',gap:'10px',color:'#666'}}>
                        <Loader size={20} className={styles.spinner} /> Loading disputes...
                    </div>
                )}
                {error && (
                    <div style={{padding:'20px',background:'#FEE2E2',border:'1px solid #FECACA',borderRadius:'8px',color:'#991B1B'}}>
                        ⚠️ {error}
                    </div>
                )}
                {!loading && !error && (
                    <table className={styles.table}>
                        <thead><tr><th>Order ID</th><th>Name</th><th>Restaurant</th><th>Review</th><th>Actions</th></tr></thead>
                        <tbody>
                            {filteredDisputes.length > 0 ? filteredDisputes.map((d, i) => (
                                <tr key={i} className={styles.tableRow}>
                                    <td>
                                        <div className={styles.disputeId}>{d.id}</div>
                                        <span className={`${styles.statusPill} ${getStatusClass(d.status)}`}>{d.status}</span>
                                    </td>
                                    <td>
                                        <div className={styles.nameCell}>
                                            <div className={styles.avatarCircle} style={{ background: getColor(d.customer.name) }}>{getInitials(d.customer.name)}</div>
                                            <div>
                                                <div className={styles.customerName}>{d.customer.name}</div>
                                                <div className={styles.orderInfo}>{d.orderId} • {peso(d.amount)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.restName}>{d.restaurant.name}</div>
                                        <div className={styles.restDate}>{d.restaurant.date}</div>
                                    </td>
                                    <td>
                                        <div className={styles.reviewType}>{d.reviewType}</div>
                                        <div className={styles.reviewPreview}>{d.reviewText}</div>
                                    </td>
                                    <td>
                                        <button className={styles.viewBtn} onClick={() => setSelectedDispute(d)}><Eye size={16} /></button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="5" style={{textAlign:'center',padding:'40px',color:'#999'}}>No disputes found</td></tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* ── Dispute Details Panel ── */}
            {selectedDispute && (
                <>
                    <div className={styles.panelOverlay} onClick={() => setSelectedDispute(null)} />
                    <div className={styles.detailPanel}>
                        <div className={styles.panelHeader}>
                            <div>
                                <h2 className={styles.panelTitle}>Dispute {selectedDispute.id}</h2>
                                <div className={styles.panelMeta}>
                                    <span>{selectedDispute.details.ticketId}</span> • <span>{selectedDispute.details.date}</span>
                                </div>
                                <span className={`${styles.statusPill} ${getStatusClass(selectedDispute.status)}`}>{selectedDispute.status}</span>
                            </div>
                            <button className={styles.panelClose} onClick={() => setSelectedDispute(null)}><X size={20} /></button>
                        </div>
                        <div className={styles.panelBody}>
                            {/* Risk Alert */}
                            {selectedDispute.details.riskAlert && (
                                <div className={styles.riskAlert}>
                                    <div className={styles.riskHeader}><AlertTriangle size={14} /> <strong>Merchant Risk Profile</strong></div>
                                    <p>{selectedDispute.details.riskAlert}</p>
                                </div>
                            )}

                            {/* Customer Profile */}
                            <div className={styles.customerProfile}>
                                <div className={styles.profileAvatar} style={{ background: getColor(selectedDispute.customer.name) }}>{getInitials(selectedDispute.customer.name)}</div>
                                <div>
                                    <div className={styles.profileName}>{selectedDispute.customer.name}</div>
                                    <span className={styles.accountBadge}>{selectedDispute.customer.accountStatus}</span>
                                </div>
                            </div>

                            {/* Personal Information */}
                            <div className={styles.infoSection}>
                                <h4 className={styles.sectionLabel}>Personal Information</h4>
                                <div className={styles.infoRow}><Mail size={14} /> <span>Email</span> <span>{selectedDispute.customer.email}</span></div>
                                <div className={styles.infoRow}><Phone size={14} /> <span>Phone</span> <span>{selectedDispute.customer.phone} <Eye size={12} className={styles.infoReveal} /></span></div>
                                <div className={styles.infoRow}><MapPin size={14} /> <span>Location</span> <span>{selectedDispute.customer.location}</span></div>
                                <div className={styles.infoRow}><Clock size={14} /> <span>Account Age</span> <span>{selectedDispute.customer.accountAge}</span></div>
                            </div>

                            {/* Restaurant */}
                            <div className={styles.restaurantCard}>
                                <div className={styles.restCardIcon} style={{ background: getColor(selectedDispute.restaurant.name) }}><Store size={16} /></div>
                                <div>
                                    <div className={styles.restCardName}>{selectedDispute.restaurant.name}</div>
                                    <div className={styles.restCardSub}>{selectedDispute.restaurant.distance}</div>
                                </div>
                            </div>

                            {/* Merchant Risk */}
                            <div className={styles.riskProfile}>
                                <h4 className={styles.sectionLabel}>Merchant Risk Profile</h4>
                                <div className={styles.riskStats}>
                                    <div className={styles.riskStat}>
                                        <div className={styles.riskStatIcon}><DollarSign size={14} /></div>
                                        <div>
                                            <div className={styles.riskStatLabel}>Dispute Ratio</div>
                                            <div className={styles.riskStatValue}>{selectedDispute.details.disputeRatio}%</div>
                                        </div>
                                    </div>
                                    <div className={styles.riskStat}>
                                        <div className={styles.riskStatIcon}><TrendingUp size={14} /></div>
                                        <div>
                                            <div className={styles.riskStatLabel}>Total orders</div>
                                            <div className={styles.riskStatValue}>{selectedDispute.details.totalOrders.toLocaleString()}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Customer Statement */}
                            <div className={styles.statementSection}>
                                <h4 className={styles.sectionLabel}>Customer Statement</h4>
                                <div className={styles.statementBox}>{selectedDispute.details.statement}</div>
                            </div>

                            {/* Order Timeline */}
                            <div className={styles.timelineSection}>
                                <h4 className={styles.sectionLabel}>Order Timeline</h4>
                                <div className={styles.timeline}>
                                    {selectedDispute.details.timeline.map((ev, i) => (
                                        <div key={i} className={styles.timelineItem}>
                                            <div className={`${styles.timelineDot} ${ev.type === 'success' ? styles.dotSuccess : ev.type === 'danger' ? styles.dotDanger : styles.dotWarning}`} />
                                            {i < selectedDispute.details.timeline.length - 1 && <div className={styles.timelineLine} />}
                                            <div className={styles.timelineContent}>
                                                <div className={styles.timelineLabel}>{ev.label}</div>
                                                <div className={styles.timelineTime}>{ev.time}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className={styles.panelActions}>
                            <button className={styles.rejectPanelBtn} onClick={() => openReject(selectedDispute)}>Reject</button>
                            <button className={styles.refundPanelBtn} onClick={() => openRefund(selectedDispute)}>Issue Refund</button>
                        </div>
                    </div>
                </>
            )}

            {/* ── Issue Refund Modal ── */}
            {showRefund && (
                <>
                    <div className={styles.modalOverlay} onClick={() => setShowRefund(null)} />
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <div>
                                <h2 className={styles.modalTitle}>Issue Refund</h2>
                                <p className={styles.modalSub}>Dispute {showRefund.id} · Order {showRefund.orderId}</p>
                            </div>
                            <button className={styles.modalClose} onClick={() => setShowRefund(null)}><X size={20} /></button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.refundCustomer}>
                                <div className={styles.avatarCircle} style={{ background: getColor(showRefund.customer.name) }}>{getInitials(showRefund.customer.name)}</div>
                                <div>
                                    <div className={styles.refundLabel}>Customer</div>
                                    <div className={styles.refundName}>{showRefund.customer.name}</div>
                                </div>
                                <div className={styles.refundAmountRight}>
                                    <div className={styles.refundLabel}>Claimed Amount</div>
                                    <div className={styles.refundAmountVal}>{peso(showRefund.amount)}</div>
                                </div>
                            </div>

                            <label className={styles.fieldLabel}>Refund Reason</label>
                            <div className={styles.selectWrap}><select value={refundReason} onChange={e => setRefundReason(e.target.value)}>{REFUND_REASONS.map(r => <option key={r}>{r}</option>)}</select><ChevronDown size={14} className={styles.selectArrow} /></div>

                            <label className={styles.fieldLabel} style={{ marginTop: '1rem' }}>Refund Amount</label>
                            <div className={styles.refundToggle}>
                                <button className={`${styles.refundToggleBtn} ${refundType === 'full' ? styles.refundToggleActive : ''}`} onClick={() => setRefundType('full')}>
                                    <div>Full Refund</div>
                                    <div className={styles.refundToggleSub}>{peso(showRefund.amount)}</div>
                                </button>
                                <button className={`${styles.refundToggleBtn} ${refundType === 'partial' ? styles.refundToggleActive : ''}`} onClick={() => setRefundType('partial')}>
                                    <div>Partial Refund</div>
                                    <div className={styles.refundToggleSub}>Customer Amount</div>
                                </button>
                            </div>

                            <div className={styles.refundNote}>
                                Refund of <strong>{peso(showRefund.amount)}</strong> will be initiated to the customer's original payment method via the payment gateway. Customer will be notified via notification.
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={styles.confirmRefundBtn} onClick={handleRefund}>Confirm Refund</button>
                            <button className={styles.cancelLink} onClick={() => setShowRefund(null)}>Cancel</button>
                        </div>
                    </div>
                </>
            )}

            {/* ── Reject Dispute Modal ── */}
            {showReject && (
                <>
                    <div className={styles.modalOverlay} onClick={() => setShowReject(null)} />
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <div>
                                <h2 className={styles.modalTitle}>Reject Dispute</h2>
                                <p className={styles.modalSub}>Dispute {showReject.id} · Order {showReject.orderId}</p>
                            </div>
                            <button className={styles.modalClose} onClick={() => setShowReject(null)}><X size={20} /></button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.refundCustomer}>
                                <div className={styles.avatarCircle} style={{ background: getColor(showReject.customer.name) }}>{getInitials(showReject.customer.name)}</div>
                                <div>
                                    <div className={styles.refundLabel}>Customer</div>
                                    <div className={styles.refundName}>{showReject.customer.name}</div>
                                </div>
                                <div className={styles.refundAmountRight}>
                                    <div className={styles.refundLabel}>Claimed Amount</div>
                                    <div className={styles.refundAmountVal}>{peso(showReject.amount)}</div>
                                </div>
                            </div>

                            <label className={styles.fieldLabel}>Justification for Rejection</label>
                            <div className={styles.selectWrap}><select value={rejectReason} onChange={e => setRejectReason(e.target.value)}>{REJECT_REASONS.map(r => <option key={r}>{r}</option>)}</select><ChevronDown size={14} className={styles.selectArrow} /></div>

                            <div className={styles.impactBox}>
                                <div className={styles.impactHeader}><TrendingUp size={14} /> <strong>Merchant Integrity Impact</strong></div>
                                <p>A successful defense will apply a small <strong style={{ color: '#059669' }}>Trust Bonus</strong> to <strong>{showReject.restaurant.name}</strong> integrity score. No refund will be issued.</p>
                            </div>

                            <div className={styles.notifyBox}>
                                <div className={styles.notifyHeader}><Info size={14} /> <strong>Customer Notification</strong></div>
                                <p>Exports include only data visible to your admin role. Confidential financial fields may be masked based on your permissions.</p>
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={styles.confirmRejectBtn} onClick={handleReject}>Confirm Rejection</button>
                            <button className={styles.cancelLink} onClick={() => setShowReject(null)}>Cancel</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
