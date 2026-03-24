import React, { useState, useMemo } from 'react';
import {
    Star, Flag, Trash2, Download, ChevronDown, Eye, X, CheckCircle2,
    AlertTriangle, Info, Settings, Plus, Minus, MessageSquare, Shield,
    Check, ExternalLink
} from 'lucide-react';
import styles from './AdminReviewsSection.module.css';

/* ─── Mock Data ─────────────────────────────────────────────────────────────── */
const MOCK_REVIEWS = [
    {
        id: 1, reviewer: 'Juan Dela Cruz', reviewCount: 42, restaurant: 'Jollibee BGC', date: 'Mar 16, 2026',
        rating: 5, review: 'This is a scam restaurant! They took my money and never delivered. Tot...',
        flag: 'None', status: 'Approved', avatar: null,
        details: {
            fullReview: 'The Chickenjoy was perfectly crispy and the service was super fast! Will definitely order again. Best Jollibee branch in BGC hands down.',
            accountAge: '1 month', restaurantOrders: 16, joined: 'Feb 20, 2026',
            restaurantBranch: 'Makati Branch', reviewDate: 'Mar 20, 2026', reviewRating: 1.0,
            restaurantResponse: '"We are sorry to hear about your experience. We are looking into our delivery dispatch times to ensure food quality."',
            responseRate: 85,
            flagInfo: null,
            merchantRequest: null,
            adminNotes: [{ author: 'Admin Sarah', text: 'Check if this user has duplicate accounts.', time: '2h ago' }],
        }
    },
    {
        id: 2, reviewer: 'Ryan Tan', reviewCount: 1, restaurant: "Max's Restaurant", date: 'Mar 16, 2026',
        rating: 4, review: 'The Chickenjoy was perfectly crispy and the service was super fast! Will...',
        flag: 'Fake', status: 'Flagged', avatar: null,
        details: {
            fullReview: 'The Chickenjoy was perfectly crispy and the service was super fast! Will definitely order again. Best Jollibee branch in BGC hands down.',
            accountAge: '1 month', restaurantOrders: 16, joined: 'Feb 20, 2026',
            restaurantBranch: 'Makati Branch', reviewDate: 'Mar 20, 2026', reviewRating: 1.0,
            restaurantResponse: '"We are sorry to hear about your experience. We are looking into our delivery dispatch times to ensure food quality."',
            responseRate: 85,
            flagInfo: { type: 'Potentially Fake', flaggedBy: 'Restaurant Owner (ID #882)', reason: 'User never ordered this specific item in current month.', reports: 3, timestamp: 'Mar 20, 2026 - 07:26 PM' },
            merchantRequest: { restaurant: 'Patty Shack', fee: 150.00, requestStatus: 'Pending', reason: '"Defamatory language used, damaging brand reputation without factual basis."' },
            adminNotes: [{ author: 'Admin Sarah', text: 'Check if this user has duplicate accounts.', time: '2h ago' }],
        }
    },
    {
        id: 3, reviewer: 'Carlo Reyes', reviewCount: 8, restaurant: 'Mang Inasal QC', date: 'Mar 16, 2026',
        rating: 2, review: 'Rice was undercooked and chicken was cold. Rider was also rude when...',
        flag: 'Dispute', status: 'Pending', avatar: null,
        details: {
            fullReview: 'Rice was undercooked and chicken was cold. Rider was also rude when delivering the food.',
            accountAge: '3 months', restaurantOrders: 5, joined: 'Dec 16, 2025',
            restaurantBranch: 'QC Branch', reviewDate: 'Mar 16, 2026', reviewRating: 2.0,
            restaurantResponse: null, responseRate: 45,
            flagInfo: { type: 'Disputed', flaggedBy: 'Restaurant Owner', reason: 'Customer complaint is under investigation.', reports: 1, timestamp: 'Mar 16, 2026 - 10:15 AM' },
            merchantRequest: null,
            adminNotes: [],
        }
    },
    {
        id: 4, reviewer: 'Maria Santos', reviewCount: 3, restaurant: 'Tokyo Tokyo Mall', date: 'Mar 16, 2026',
        rating: 3, review: 'BUY CHEAP FOLLOWERS AT WWW.BOOST-GRAM.COM PROMO...',
        flag: 'Spam', status: 'Flagged', avatar: null,
        details: {
            fullReview: 'BUY CHEAP FOLLOWERS AT WWW.BOOST-GRAM.COM PROMO CODE: FOOD50',
            accountAge: '2 weeks', restaurantOrders: 0, joined: 'Mar 2, 2026',
            restaurantBranch: 'Mall Branch', reviewDate: 'Mar 16, 2026', reviewRating: 3.0,
            restaurantResponse: null, responseRate: 0,
            flagInfo: { type: 'Spam', flaggedBy: 'Auto-detection System', reason: 'Contains promotional/spam content.', reports: 5, timestamp: 'Mar 16, 2026 - 08:00 AM' },
            merchantRequest: null,
            adminNotes: [],
        }
    },
    {
        id: 5, reviewer: 'Jose Padilla', reviewCount: 5, restaurant: 'Pizza Hut Ortigas', date: 'Mar 16, 2026',
        rating: 2, review: '[REMOVED] This review was removed for violating community gu...',
        flag: 'Offensive', status: 'Removed', avatar: null,
        details: {
            fullReview: '[REMOVED] This review was removed for violating community guidelines.',
            accountAge: '6 months', restaurantOrders: 12, joined: 'Sep 16, 2025',
            restaurantBranch: 'Ortigas Branch', reviewDate: 'Mar 16, 2026', reviewRating: 2.0,
            restaurantResponse: null, responseRate: 60,
            flagInfo: { type: 'Offensive', flaggedBy: 'Community Report', reason: 'Contains offensive language.', reports: 8, timestamp: 'Mar 16, 2026 - 11:30 AM' },
            merchantRequest: null,
            adminNotes: [{ author: 'Admin John', text: 'Review removed. User warned.', time: '1d ago' }],
        }
    },
];

const STATUS_TABS = ['All', 'Flagged', 'Pending', 'Approved', 'Removed'];
const STATS = [
    { label: 'Reviews Today', value: '342', sub: '8.3% vs. yesterday', icon: <Star size={18} />, color: '#FEF2F2', iconColor: '#DC2626' },
    { label: 'Flagged & Pending', value: '28', sub: 'Needs attention', icon: <Flag size={18} />, color: '#FFF7ED', iconColor: '#EA580C' },
    { label: 'Removed This Month', value: '61', sub: '19 paid · 42 organic', icon: <Trash2 size={18} />, color: '#FEF2F2', iconColor: '#DC2626' },
    { label: 'Avg. Platform Rating', value: '4.8', sub: '0.1 this week', icon: <AlertTriangle size={18} />, color: '#FEF2F2', iconColor: '#DC2626', isStar: true },
];
const EXPORT_COLUMNS = ['Reviewer', 'Restaurant', 'Rating', 'Review', 'Flag', 'Status'];
const TIERED_FEES = [{ rating: '1 star', fee: 300 }, { rating: '2 stars', fee: 200 }, { rating: '3 stars', fee: 150 }, { rating: '4-5 stars', fee: 100 }];

function getFlagClass(f) {
    const v = (f||'').toLowerCase();
    if (v === 'fake') return styles.flagFake;
    if (v === 'dispute') return styles.flagDispute;
    if (v === 'spam') return styles.flagSpam;
    if (v === 'offensive') return styles.flagOffensive;
    return '';
}
function getStatusClass(s) {
    const v = s.toLowerCase();
    if (v === 'approved') return styles.statusApproved;
    if (v === 'flagged') return styles.statusFlagged;
    if (v === 'pending') return styles.statusPending;
    if (v === 'removed') return styles.statusRemoved;
    return '';
}
function getInitials(n) { return n.split(' ').map(x=>x[0]).join('').toUpperCase().slice(0,2); }
function getColor(n) {
    const c = ['#DC2626','#EA580C','#D97706','#059669','#2563EB','#7C3AED','#DB2777'];
    let h=0; for(let i=0;i<n.length;i++) h=n.charCodeAt(i)+((h<<5)-h);
    return c[Math.abs(h)%c.length];
}
function peso(v) { return `₱${Number(v||0).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}`; }

function StarRating({ rating, size = 14 }) {
    return (
        <span className={styles.starsWrap}>
            {[1,2,3,4,5].map(s => <Star key={s} size={size} className={s <= Math.round(rating) ? styles.starFilled : styles.starEmpty} />)}
        </span>
    );
}

/* ─── Component ─────────────────────────────────────────────────────────────── */
export default function AdminReviewsSection() {
    const [activeTab, setActiveTab] = useState('All');
    const [selectedReview, setSelectedReview] = useState(null);
    const [showExport, setShowExport] = useState(false);
    const [showFeeSettings, setShowFeeSettings] = useState(false);
    const [exportFormat, setExportFormat] = useState('csv');
    const [exportColumns, setExportColumns] = useState(EXPORT_COLUMNS.reduce((a,c)=>({...a,[c]:true}),{}));
    const [feeType, setFeeType] = useState('fixed');
    const [fixedFee, setFixedFee] = useState('150.00');
    const [maxRequests, setMaxRequests] = useState(3);
    const [cooldown, setCooldown] = useState('7 days');
    const [payoutRouting, setPayoutRouting] = useState('platform');
    const [toast, setToast] = useState(null);
    const [ratingFilter, setRatingFilter] = useState('All');
    const [flagFilter, setFlagFilter] = useState('All');
    const [dateFilter, setDateFilter] = useState('Today');
    const [adminNote, setAdminNote] = useState('');

    const filteredReviews = useMemo(() => {
        let r = MOCK_REVIEWS;
        if (activeTab !== 'All') r = r.filter(x => x.status.toLowerCase() === activeTab.toLowerCase());
        return r;
    }, [activeTab]);

    const handleExport = () => { setShowExport(false); setToast({ msg: 'Export ready - downloading now', sub: 'TMC_Foodhub_Reviews_Export.csv' }); setTimeout(()=>setToast(null),4000); };
    const handleSaveFees = () => { setShowFeeSettings(false); setToast({ msg: 'Success', sub: 'Fee settings updated successfully' }); setTimeout(()=>setToast(null),4000); };

    return (
        <div className={styles.container}>
            {/* Toast */}
            {toast && (
                <div className={styles.toast}>
                    <CheckCircle2 size={20} className={styles.toastIcon} />
                    <div><div className={styles.toastTitle}>{toast.msg}</div><div className={styles.toastSub}>{toast.sub}</div></div>
                    <button className={styles.toastClose} onClick={()=>setToast(null)}><X size={16}/></button>
                </div>
            )}

            {/* Top actions */}
            <div className={styles.topActions}>
                <div style={{flex:1}} />
                <button className={styles.exportBtn} onClick={()=>setShowExport(true)}><Download size={16}/> Export</button>
                <button className={styles.feeBtn} onClick={()=>setShowFeeSettings(true)}>Fee Settings</button>
            </div>

            {/* Stats */}
            <div className={styles.statsRow}>
                {STATS.map(stat => (
                    <div key={stat.label} className={styles.statCard}>
                        <div className={styles.statIcon} style={{background:stat.color,color:stat.iconColor}}>{stat.icon}</div>
                        <div className={styles.statBody}>
                            <div className={styles.statLabel}>{stat.label}</div>
                            <div className={styles.statValue}>
                                {stat.value}
                                {stat.isStar && <Star size={20} className={styles.starFilled}/>}
                            </div>
                            <div className={styles.statSub}>{stat.sub}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabs & Filters */}
            <div className={styles.filtersBar}>
                <div className={styles.tabs}>
                    {STATUS_TABS.map(tab => (
                        <button key={tab} className={`${styles.tab} ${activeTab===tab?styles.tabActive:''}`} onClick={()=>setActiveTab(tab)}>{tab}</button>
                    ))}
                </div>
                <div className={styles.dropdownFilters}>
                    <div className={styles.selectWrap}><select value={ratingFilter} onChange={e=>setRatingFilter(e.target.value)}><option value="All">All ratings</option><option>5 stars</option><option>4 stars</option><option>3 stars</option><option>2 stars</option><option>1 star</option></select><ChevronDown size={14} className={styles.selectArrow}/></div>
                    <div className={styles.selectWrap}><select value={flagFilter} onChange={e=>setFlagFilter(e.target.value)}><option value="All">All flag types</option><option>Fake</option><option>Spam</option><option>Offensive</option><option>Dispute</option></select><ChevronDown size={14} className={styles.selectArrow}/></div>
                    <div className={styles.selectWrap}><select value={dateFilter} onChange={e=>setDateFilter(e.target.value)}><option>Today</option><option>Last 7 days</option><option>Last 30 days</option><option>All Time</option></select><ChevronDown size={14} className={styles.selectArrow}/></div>
                </div>
            </div>

            {/* Table */}
            <div className={styles.tableCard}>
                <table className={styles.table}>
                    <thead><tr><th>Reviewer</th><th>Restaurant</th><th>Rating</th><th>Review</th><th>Flag</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                        {filteredReviews.map(rev => (
                            <tr key={rev.id} className={styles.tableRow}>
                                <td>
                                    <div className={styles.reviewerCell}>
                                        <div className={styles.avatarCircle} style={{background:getColor(rev.reviewer)}}>{getInitials(rev.reviewer)}</div>
                                        <div>
                                            <div className={styles.reviewerName}>{rev.reviewer}</div>
                                            <div className={styles.reviewerCount}>{rev.reviewCount} reviews</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className={styles.restaurantName}>{rev.restaurant}</div>
                                    <div className={styles.restaurantDate}>{rev.date}</div>
                                </td>
                                <td><StarRating rating={rev.rating} /></td>
                                <td className={styles.reviewText}>{rev.review}</td>
                                <td>
                                    {rev.flag !== 'None' ? (
                                        <span className={`${styles.flagPill} ${getFlagClass(rev.flag)}`}>{rev.flag}</span>
                                    ) : (
                                        <span className={styles.flagNone}>None</span>
                                    )}
                                </td>
                                <td><span className={`${styles.statusPill} ${getStatusClass(rev.status)}`}>{rev.status}</span></td>
                                <td>
                                    <div className={styles.actionBtns}>
                                        {(rev.status === 'Pending' || rev.status === 'Flagged') && (
                                            <button className={styles.actionIcon} title="Approve" onClick={()=>{setToast({msg:'Success',sub:`Review by ${rev.reviewer} approved`});setTimeout(()=>setToast(null),4000);}}><Check size={15}/></button>
                                        )}
                                        <button className={styles.actionIcon} title="View" onClick={()=>setSelectedReview(rev)}><Eye size={15}/></button>
                                        <button className={styles.actionIcon} title="Remove" onClick={()=>{setToast({msg:'Removed',sub:`Review by ${rev.reviewer} removed`});setTimeout(()=>setToast(null),4000);}}><X size={15}/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ── Review Details Panel ── */}
            {selectedReview && (
                <>
                    <div className={styles.panelOverlay} onClick={()=>setSelectedReview(null)} />
                    <div className={styles.detailPanel}>
                        <div className={styles.panelHeader}>
                            <h2 className={styles.panelTitle}>Review Details</h2>
                            <button className={styles.panelClose} onClick={()=>setSelectedReview(null)}><X size={20}/></button>
                        </div>
                        <div className={styles.panelBody}>
                            {/* Reviewer Profile */}
                            <div className={styles.reviewerProfile}>
                                <div className={styles.profileAvatar} style={{background:getColor(selectedReview.reviewer)}}>{getInitials(selectedReview.reviewer)}</div>
                                <div className={styles.profileInfo}>
                                    <div className={styles.profileName}>{selectedReview.reviewer}</div>
                                    <button className={styles.profileLink}>View Full Profile</button>
                                    <div className={styles.profileMeta}>
                                        <span>Total Reviews: <strong>{selectedReview.reviewCount}</strong></span>
                                        <span>Restaurant Orders: <strong>{selectedReview.details.restaurantOrders}</strong></span>
                                    </div>
                                </div>
                                <div className={styles.profileRight}>
                                    <div>Account Age: <strong>{selectedReview.details.accountAge}</strong></div>
                                    <div>Joined: <strong>{selectedReview.details.joined}</strong></div>
                                </div>
                            </div>

                            {/* Restaurant & Review */}
                            <div className={styles.reviewContext}>
                                <div className={styles.reviewRestaurant}>
                                    <div className={styles.restIcon} style={{background:getColor(selectedReview.restaurant)}}>{selectedReview.restaurant[0]}</div>
                                    <div>
                                        <div className={styles.restName}>{selectedReview.restaurant.split(' ')[0] === 'Jollibee' ? 'Patty Shack' : selectedReview.restaurant}</div>
                                        <div className={styles.restMeta}>{selectedReview.details.restaurantBranch} • {selectedReview.details.reviewDate}</div>
                                    </div>
                                    <div className={styles.reviewRating}>{selectedReview.details.reviewRating} <Star size={14} className={styles.starFilled}/></div>
                                </div>
                                <div className={styles.reviewQuote}>{selectedReview.details.fullReview}</div>
                            </div>

                            {/* Restaurant Response */}
                            {selectedReview.details.restaurantResponse && (
                                <div className={styles.responseSection}>
                                    <div className={styles.sectionHeaderRow}>
                                        <span className={styles.sectionLabel}>Restaurant Response</span>
                                        <span className={styles.respRate}>Resp. rate: {selectedReview.details.responseRate}%</span>
                                    </div>
                                    <div className={styles.responseQuote}>{selectedReview.details.restaurantResponse}</div>
                                </div>
                            )}

                            {/* Flag Info */}
                            {selectedReview.details.flagInfo && (
                                <div className={styles.flagSection}>
                                    <span className={`${styles.flagBadge} ${getFlagClass(selectedReview.details.flagInfo.type.split(' ').pop())}`}>
                                        {selectedReview.details.flagInfo.type}
                                    </span>
                                    <div className={styles.flagDetails}>
                                        <div><strong>Flagged By:</strong> {selectedReview.details.flagInfo.flaggedBy}</div>
                                        <div><strong>Reason:</strong> {selectedReview.details.flagInfo.reason}</div>
                                        <div><strong>Reports:</strong> {selectedReview.details.flagInfo.reports}</div>
                                        <div><strong>Timestamp:</strong> {selectedReview.details.flagInfo.timestamp}</div>
                                    </div>
                                </div>
                            )}

                            {/* Merchant Request */}
                            {selectedReview.details.merchantRequest && (
                                <div className={styles.merchantCard}>
                                    <div className={styles.merchantHeader}>
                                        <div className={styles.merchantIcon} style={{background:getColor(selectedReview.details.merchantRequest.restaurant)}}>{selectedReview.details.merchantRequest.restaurant[0]}</div>
                                        <span className={styles.merchantName}>{selectedReview.details.merchantRequest.restaurant}</span>
                                    </div>
                                    <div className={styles.merchantRow}>
                                        <div><span className={styles.merchantLabel}>Service Fee</span><span className={styles.merchantVal}>{peso(selectedReview.details.merchantRequest.fee)}</span></div>
                                        <div><span className={styles.merchantLabel}>Request Status</span><span className={styles.merchantVal}>{selectedReview.details.merchantRequest.requestStatus}</span></div>
                                    </div>
                                    <div className={styles.merchantReason}>
                                        <span className={styles.merchantLabel}>Merchant Reason</span>
                                        <p>{selectedReview.details.merchantRequest.reason}</p>
                                    </div>
                                    <div className={styles.merchantActions}>
                                        <button className={styles.rejectBtn}>Reject Request</button>
                                        <button className={styles.approveRemovalBtn}>Approve Removal</button>
                                    </div>
                                </div>
                            )}

                            {/* Admin Notes */}
                            <div className={styles.notesSection}>
                                <h4 className={styles.sectionLabel}>Admin Notes</h4>
                                <input className={styles.noteInput} placeholder="Add a private note for other admins..." value={adminNote} onChange={e=>setAdminNote(e.target.value)} />
                                {selectedReview.details.adminNotes.map((n,i) => (
                                    <div key={i} className={styles.noteItem}>
                                        <span className={styles.noteBar} />
                                        <span>{n.author}: {n.text} ({n.time})</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className={styles.panelActions}>
                            <div className={styles.panelActionRow}>
                                <button className={styles.approveBtn}>Approve Review</button>
                                <button className={styles.removeBtn}>Remove Review</button>
                            </div>
                            <div className={styles.panelActionRow}>
                                <button className={styles.warnBtn}>Warn Customer</button>
                                <button className={styles.editBtn}>Edit Review</button>
                            </div>
                            <button className={styles.escalateBtn}>Escalate to Dispute</button>
                        </div>
                    </div>
                </>
            )}

            {/* ── Export Modal ── */}
            {showExport && (
                <>
                    <div className={styles.modalOverlay} onClick={()=>setShowExport(false)} />
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <div><h2 className={styles.modalTitle}>Export Reviews Data</h2><p className={styles.modalSub}>Download a snapshot of your reviews moderation data based on your selected filters and date range.</p></div>
                            <button className={styles.modalClose} onClick={()=>setShowExport(false)}><X size={20}/></button>
                        </div>
                        <div className={styles.modalBody}>
                            <label className={styles.fieldLabel}>Date Range</label>
                            <div className={styles.selectWrap} style={{width:'100%'}}><select style={{width:'100%'}}><option>Last 30 Days</option><option>Last 7 days</option><option>All Time</option></select><ChevronDown size={14} className={styles.selectArrow}/></div>
                            <label className={styles.fieldLabel} style={{marginTop:'1rem'}}>File Format</label>
                            <div className={styles.formatRow}>
                                <label className={`${styles.formatOption} ${exportFormat==='csv'?styles.formatActive:''}`}><input type="radio" name="fmt" checked={exportFormat==='csv'} onChange={()=>setExportFormat('csv')}/><div><div className={styles.formatTitle}>CSV</div><div className={styles.formatSub}>Spreadsheet data</div></div></label>
                                <label className={`${styles.formatOption} ${exportFormat==='pdf'?styles.formatActive:''}`}><input type="radio" name="fmt" checked={exportFormat==='pdf'} onChange={()=>setExportFormat('pdf')}/><div><div className={styles.formatTitle}>PDF</div><div className={styles.formatSub}>Visual report</div></div></label>
                            </div>
                            <label className={styles.fieldLabel} style={{marginTop:'1rem'}}>Select columns to include</label>
                            <div className={styles.columnsGrid}>
                                {EXPORT_COLUMNS.map(col => (
                                    <label key={col} className={styles.columnCheck}><input type="checkbox" checked={exportColumns[col]} onChange={()=>setExportColumns(p=>({...p,[col]:!p[col]}))}/><span className={styles.customCheckbox}><CheckCircle2 size={14}/></span>{col}</label>
                                ))}
                            </div>
                            <div className={styles.exportNote}><Info size={14}/> Removed reviews are included in exports for audit and compliance purposes. Exports include only data visible to your admin role.</div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={styles.downloadBtn} onClick={handleExport}>Download Report</button>
                            <button className={styles.cancelLink} onClick={()=>setShowExport(false)}>Cancel</button>
                        </div>
                    </div>
                </>
            )}

            {/* ── Fee Settings Modal ── */}
            {showFeeSettings && (
                <>
                    <div className={styles.modalOverlay} onClick={()=>setShowFeeSettings(false)} />
                    <div className={styles.modal + ' ' + styles.modalWide}>
                        <div className={styles.modalHeader}>
                            <div><h2 className={styles.modalTitle}>Review Removal Fee Settings</h2><p className={styles.modalSub}>Configure how paid review removal requests are priced and processed</p></div>
                            <button className={styles.modalClose} onClick={()=>setShowFeeSettings(false)}><X size={20}/></button>
                        </div>
                        <div className={styles.modalBody}>
                            <label className={styles.fieldLabel}>Current Fee Configuration</label>
                            <div className={styles.feeToggle}>
                                <button className={`${styles.feeToggleBtn} ${feeType==='fixed'?styles.feeToggleActive:''}`} onClick={()=>setFeeType('fixed')}>Fixed Fee</button>
                                <button className={`${styles.feeToggleBtn} ${feeType==='tiered'?styles.feeToggleActive:''}`} onClick={()=>setFeeType('tiered')}>Tiered by Rating</button>
                            </div>

                            {feeType === 'fixed' && (
                                <div className={styles.feeInputWrap}>
                                    <span className={styles.feeCurrency}>₱</span>
                                    <input className={styles.feeInput} value={fixedFee} onChange={e=>setFixedFee(e.target.value)} />
                                </div>
                            )}
                            <p className={styles.feeHint}>This amount is charged to the restaurant upfront and is non-refundable regardless of outcome.</p>

                            <label className={styles.fieldLabel} style={{marginTop:'1.25rem'}}>Tiered Fee Structure</label>
                            <table className={styles.feeTable}>
                                <thead><tr><th>Rating</th><th>Fee Amount</th></tr></thead>
                                <tbody>
                                    {TIERED_FEES.map(t => (
                                        <tr key={t.rating}><td>{t.rating}</td><td>₱{t.fee}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                            <p className={styles.feeHint}>Lower-rated reviews cost more to appeal - discourages frivolous removal of legitimate critical feedback.</p>

                            <div className={styles.feeRow}>
                                <div>
                                    <label className={styles.fieldLabel}>Max requests per restaurant /mo</label>
                                    <div className={styles.counter}>
                                        <button onClick={()=>setMaxRequests(Math.max(1,maxRequests-1))}><Minus size={14}/></button>
                                        <span>{maxRequests}</span>
                                        <button onClick={()=>setMaxRequests(maxRequests+1)}><Plus size={14}/></button>
                                    </div>
                                </div>
                                <div>
                                    <label className={styles.fieldLabel}>Cooldown after rejection</label>
                                    <div className={styles.selectWrap}><select value={cooldown} onChange={e=>setCooldown(e.target.value)}><option>7 days</option><option>14 days</option><option>30 days</option></select><ChevronDown size={14} className={styles.selectArrow}/></div>
                                </div>
                            </div>

                            <label className={styles.fieldLabel} style={{marginTop:'1.25rem'}}>Payout Routing</label>
                            <div className={styles.radioGroup}>
                                <label className={styles.radioLabel}><input type="radio" name="payout" checked={payoutRouting==='platform'} onChange={()=>setPayoutRouting('platform')}/><span className={styles.radioCircle}/> Platform Revenue</label>
                                <label className={styles.radioLabel}><input type="radio" name="payout" checked={payoutRouting==='moderation'} onChange={()=>setPayoutRouting('moderation')}/><span className={styles.radioCircle}/> Moderation Fund</label>
                                <label className={styles.radioLabel}><input type="radio" name="payout" checked={payoutRouting==='split'} onChange={()=>setPayoutRouting('split')}/><span className={styles.radioCircle}/> Split (Platform + Moderation)</label>
                            </div>
                        </div>
                        <div className={styles.modalFooterRow}>
                            <button className={styles.cancelModalBtn} onClick={()=>setShowFeeSettings(false)}>Cancel</button>
                            <button className={styles.saveBtn} onClick={handleSaveFees}>Save Changes</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
