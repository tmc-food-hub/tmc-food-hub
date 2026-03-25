import React, { useState, useEffect } from 'react';
import {
    ShoppingCart, DollarSign, Users, Store, TrendingUp, ChevronDown, Download,
    X, CheckCircle2, Info, Star, Clock, AlertTriangle, Loader
} from 'lucide-react';
import styles from './AdminAnalyticsSection.module.css';

/* ─── Mock data ─────────────────────────────────────────────────────────── */
const STATS = [
    { label: 'Total Orders', value: '1,284', badge: '+12%', icon: <ShoppingCart size={18} />, color: '#FEF2F2', iconColor: '#DC2626' },
    { label: 'Total Revenue', value: '₱452k', badge: '+12%', icon: <DollarSign size={18} />, color: '#FFF7ED', iconColor: '#EA580C' },
    { label: 'Active Customers', value: '45,312', badge: '-2%', icon: <Users size={18} />, color: '#FEF9C3', iconColor: '#CA8A04', down: true },
    { label: 'Active Restaurants', value: '827', badge: '+12%', icon: <Store size={18} />, color: '#FEF2F2', iconColor: '#DC2626' },
    { label: 'Avg Order Value', value: '₱352', badge: '+3.7%', icon: <TrendingUp size={18} />, color: '#FFF7ED', iconColor: '#EA580C' },
];

const ORDERS_CHART = [
    { day: 'Mon', completed: 1200, cancelled: 180 },
    { day: 'Tue', completed: 1450, cancelled: 200 },
    { day: 'Wed', completed: 1300, cancelled: 170 },
    { day: 'Thu', completed: 1800, cancelled: 250 },
    { day: 'Fri', completed: 2100, cancelled: 300 },
    { day: 'Sat', completed: 2500, cancelled: 380 },
    { day: 'Sun', completed: 2200, cancelled: 350 },
];
const ORDERS_MAX = 3500;

const REVENUE_CHART = [
    { label: 'Mar 1-7', gross: 600000, net: 400000 },
    { label: 'Mar 8-14', gross: 700000, net: 500000 },
    { label: 'Mar 15-21', gross: 900000, net: 650000 },
    { label: 'Mar 22-31', gross: 1200000, net: 800000 },
];
const REV_MAX = 1400000;

const HEATMAP_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HEATMAP_HOURS = ['00:00', '06:00', '12:00', '18:00', '23:59'];
const HEATMAP_DATA = [
    [2, 1, 5, 4, 2],
    [1, 2, 4, 5, 2],
    [2, 3, 5, 5, 3],
    [1, 2, 6, 5, 2],
    [2, 3, 7, 8, 4],
    [3, 4, 8, 9, 5],
    [4, 5, 9, 10, 6],
];

const TOP_RESTAURANTS = [
    { rank: 1, name: 'Patty Shack', sub: '+ 2 places', orders: '1,245', rating: 4.8, commission: '₱41,250', status: 'Top Performer', statusClass: 'topPerf' },
    { rank: 2, name: 'Jollibee', sub: 'Stable', orders: '982', rating: 4.7, commission: '₱35,420', status: 'High Demand', statusClass: 'highDemand' },
    { rank: 3, name: 'Mcdonalds', sub: 'New', orders: '856', rating: 4.9, commission: '₱28,910', status: 'Rising', statusClass: 'rising' },
    { rank: 4, name: 'Burger King', sub: '+ 1 place', orders: '743', rating: 4.5, commission: '₱18,200', status: 'Stable', statusClass: 'stable' },
];

const CITY_DATA = [
    { city: 'Quezon City', pct: 42 },
    { city: 'Makati', pct: 28 },
    { city: 'Pasig', pct: 15 },
    { city: 'Manila', pct: 10 },
    { city: 'Others', pct: 5 },
];

const EXPORT_COLS = ['Total Orders', 'Dispute Rate', 'Total Revenue', 'Avg Delivery Time', 'Active Customers', 'Restaurant Rankings', 'Active Restaurants', 'Distribution by City', 'Avg Order Value', 'Customer Retention', 'Completion Rate', 'Revenue Growth'];

function getLogoColor(n) {
    const m = { 'Patty Shack': '#8B4513', 'Jollibee': '#DC2626', 'Mcdonalds': '#EA580C', 'Burger King': '#1D4ED8' };
    return m[n] || '#6B7280';
}

/* ─── Component ─────────────────────────────────────────────────────────── */
export default function AdminAnalyticsSection() {
    const [dateTab, setDateTab] = useState('Last 30 Days');
    const [showExport, setShowExport] = useState(false);
    const [exportFormat, setExportFormat] = useState('csv');
    const [exportCols, setExportCols] = useState(EXPORT_COLS.reduce((a, c) => ({ ...a, [c]: true }), {}));
    const [toast, setToast] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('admin_auth_token');
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
            const response = await fetch(`${apiUrl}/admin/analytics`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setAnalytics(data);
        } catch (err) {
            console.error('Error fetching analytics:', err);
            setError(err.message || 'Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        setShowExport(false);
        setToast({ msg: 'Success', sub: 'Your analytics report has been downloaded successfully.' });
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

            {/* Filters */}
            <div className={styles.filtersBar}>
                <div className={styles.dateTabRow}>
                    <button className={`${styles.dateTab} ${dateTab === 'Last 30 Days' ? styles.dateTabActive : ''}`} onClick={() => setDateTab('Last 30 Days')}>Last 30 Days</button>
                    <button className={`${styles.dateTab} ${dateTab === 'vs Previous Period' ? styles.dateTabActive : ''}`} onClick={() => setDateTab('vs Previous Period')}>vs Previous Period</button>
                    <div className={styles.selectWrap}><select><option>All Restaurants</option></select><ChevronDown size={14} className={styles.selectArrow} /></div>
                    <div className={styles.selectWrap}><select><option>All Categories</option></select><ChevronDown size={14} className={styles.selectArrow} /></div>
                    <div className={styles.selectWrap}><select><option>All Locations</option></select><ChevronDown size={14} className={styles.selectArrow} /></div>
                </div>
                <button className={styles.exportBtn} onClick={() => setShowExport(true)}><Download size={16} /> Export</button>
            </div>

            {/* Stats */}
            <div className={styles.statsRow}>
                {loading ? (
                    <div style={{display:'flex',justifyContent:'center',alignItems:'center',padding:'40px',gap:'10px',color:'#666',gridColumn:'1/-1'}}>
                        <Loader size={20} className={styles.spinner} /> Loading analytics...
                    </div>
                ) : error ? (
                    <div style={{padding:'20px',background:'#FEE2E2',border:'1px solid #FECACA',borderRadius:'8px',color:'#991B1B',gridColumn:'1/-1'}}>
                        ⚠️ {error}
                    </div>
                ) : analytics ? (
                    <>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon} style={{ background: '#FEF2F2', color: '#DC2626' }}><ShoppingCart size={18} /></div>
                            <div className={styles.statBody}>
                                <div className={styles.statLabel}>Total Orders</div>
                                <div className={styles.statValRow}>
                                    <span className={styles.statValue}>{analytics.stats.total_orders?.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon} style={{ background: '#FFF7ED', color: '#EA580C' }}><DollarSign size={18} /></div>
                            <div className={styles.statBody}>
                                <div className={styles.statLabel}>Total Revenue</div>
                                <div className={styles.statValRow}>
                                    <span className={styles.statValue}>₱{(analytics.stats.total_revenue / 1000).toFixed(0)}k</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon} style={{ background: '#FEF9C3', color: '#CA8A04' }}><Users size={18} /></div>
                            <div className={styles.statBody}>
                                <div className={styles.statLabel}>Active Customers</div>
                                <div className={styles.statValRow}>
                                    <span className={styles.statValue}>{analytics.stats.active_customers?.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon} style={{ background: '#FEF2F2', color: '#DC2626' }}><Store size={18} /></div>
                            <div className={styles.statBody}>
                                <div className={styles.statLabel}>Active Restaurants</div>
                                <div className={styles.statValRow}>
                                    <span className={styles.statValue}>{analytics.stats.active_restaurants?.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon} style={{ background: '#FFF7ED', color: '#EA580C' }}><TrendingUp size={18} /></div>
                            <div className={styles.statBody}>
                                <div className={styles.statLabel}>Avg Order Value</div>
                                <div className={styles.statValRow}>
                                    <span className={styles.statValue}>₱{analytics.stats.avg_order_value?.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    STATS.map(s => (
                        <div key={s.label} className={styles.statCard}>
                            <div className={styles.statIcon} style={{ background: s.color, color: s.iconColor }}>{s.icon}</div>
                            <div className={styles.statBody}>
                                <div className={styles.statLabel}>{s.label}</div>
                                <div className={styles.statValRow}>
                                    <span className={styles.statValue}>{s.value}</span>
                                    <span className={`${styles.statBadge} ${s.down ? styles.badgeDown : styles.badgeUp}`}>{s.badge}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Charts Row */}
            <div className={styles.chartsRow}>
                {/* Orders Over Time */}
                <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                        <div><h3 className={styles.chartTitle}>Orders Over Time</h3><span className={styles.chartSub}>Daily granularity: Completed vs Cancelled</span></div>
                        <div className={styles.selectWrap}><select><option>Weekly</option></select><ChevronDown size={14} className={styles.selectArrow} /></div>
                    </div>
                    <div className={styles.barChart}>
                        <div className={styles.barYAxis}>
                            {[3500,3000,2500,2000,1500,1000,500,0].map(v => <span key={v}>{v >= 1000 ? `${(v/1000).toFixed(v%1000?1:0)}k` : v == 0 ? '0' : v}</span>)}
                        </div>
                        <div className={styles.barArea}>
                            {(analytics?.orders_chart || ORDERS_CHART).map(d => (
                                <div key={d.day} className={styles.barGroup}>
                                    <div className={styles.barStack} style={{ height: '100%' }}>
                                        <div className={styles.barCancelled} style={{ height: `${(d.cancelled / 3500) * 100}%` }} title={`Cancelled: ${d.cancelled}`} />
                                        <div className={styles.barCompleted} style={{ height: `${(d.completed / 3500) * 100}%` }} title={`Completed: ${d.completed}`} />
                                    </div>
                                    <span className={styles.barLabel}>{d.day}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={styles.chartLegend}>
                        <span><span className={styles.legendDot} style={{ background: '#991B1B' }} /> Completed</span>
                        <span><span className={styles.legendDot} style={{ background: '#FECACA' }} /> Cancelled</span>
                    </div>
                </div>

                {/* Revenue Growth */}
                <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                        <div><h3 className={styles.chartTitle}>Revenue Growth</h3><span className={styles.chartSub}>Gross vs Net Revenue trend</span></div>
                        <span className={styles.peakBadge}>Peak: ₱1.2m (Mar 24)</span>
                    </div>
                    <div className={styles.lineChart}>
                        <div className={styles.lineYAxis}>
                            {['₱1.4m','₱1.2m','₱1m','₱800k','₱600k','₱400k','₱200k'].map(v => <span key={v}>{v}</span>)}
                        </div>
                        <div className={styles.lineArea}>
                            <svg viewBox="0 0 300 200" className={styles.lineSvg} preserveAspectRatio="none">
                                {/* Grid lines */}
                                {[0,1,2,3,4,5,6].map(i => <line key={i} x1="0" y1={i*200/6} x2="300" y2={i*200/6} stroke="#F3F4F6" strokeWidth="0.5" />)}
                                {/* Gross Revenue line */}
                                <polyline fill="none" stroke="#DC2626" strokeWidth="2.5" points={REVENUE_CHART.map((d,i) => `${i*(300/(REVENUE_CHART.length-1))},${200 - (d.gross/REV_MAX)*200}`).join(' ')} />
                                {/* Net Revenue line */}
                                <polyline fill="none" stroke="#FECACA" strokeWidth="2.5" strokeDasharray="6,4" points={REVENUE_CHART.map((d,i) => `${i*(300/(REVENUE_CHART.length-1))},${200 - (d.net/REV_MAX)*200}`).join(' ')} />
                                {/* Dots for gross */}
                                {REVENUE_CHART.map((d,i) => <circle key={i} cx={i*(300/(REVENUE_CHART.length-1))} cy={200 - (d.gross/REV_MAX)*200} r="4" fill="#DC2626" />)}
                            </svg>
                            <div className={styles.lineXLabels}>{(analytics?.revenue_chart || REVENUE_CHART).map(d => <span key={d.label}>{d.label}</span>)}</div>
                        </div>
                    </div>
                    <div className={styles.chartLegend}>
                        <span><span className={styles.legendDot} style={{ background: '#DC2626' }} /> Gross Revenue</span>
                        <span><span className={styles.legendDot} style={{ background: '#FECACA' }} /> Net Revenue</span>
                    </div>
                </div>
            </div>

            {/* Health + Heatmap */}
            <div className={styles.chartsRow}>
                {/* Platform Health */}
                <div className={styles.chartCard}>
                    <h3 className={styles.chartTitle}>Platform Health</h3>
                    <span className={styles.chartSub}>Items requiring your attention</span>
                    <div className={styles.healthGrid}>
                        <div className={styles.healthItem}>
                            <div className={styles.healthLabel}>Avg Delivery Time</div>
                            <div className={styles.healthRow}>
                                <span className={styles.healthValue}>{analytics?.health?.avg_delivery_time || 32} mins</span>
                                <span className={styles.healthBadgeGreen}>Fast</span>
                            </div>
                        </div>
                        <div className={styles.healthItem}>
                            <div className={styles.healthLabel}>Completion Rate</div>
                            <div className={styles.healthRow}>
                                <span className={styles.healthValue}>{analytics?.health?.completion_rate || 91.2}%</span>
                                <div className={styles.healthBar}><div className={styles.healthBarFill} style={{ width: `${analytics?.health?.completion_rate || 91.2}%` }} /></div>
                            </div>
                        </div>
                        <div className={styles.healthItem}>
                            <div className={styles.healthLabel}>Dispute Rate</div>
                            <div className={styles.healthRow}>
                                <span className={styles.healthValue}>{analytics?.health?.dispute_rate || 1.4}%</span>
                                <span className={`${styles.healthBadgeRed} ${(analytics?.health?.dispute_rate || 1.4) > 1 ? '' : styles.healthBadgeGreen}`}>{(analytics?.health?.dispute_rate || 1.4) > 1 ? 'Alert > 1%' : 'Good'}</span>
                            </div>
                        </div>
                        <div className={styles.healthItem}>
                            <div className={styles.healthLabel}>Customer Retention</div>
                            <div className={styles.retentionRow}>
                                <div className={styles.donutWrap}>
                                    <svg viewBox="0 0 36 36" className={styles.donut}>
                                        <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#F3F4F6" strokeWidth="3" />
                                        <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#991B1B" strokeWidth="3" strokeDasharray={`${analytics?.health?.customer_retention || 65} ${100 - (analytics?.health?.customer_retention || 65)}`} strokeDashoffset="25" strokeLinecap="round" />
                                    </svg>
                                    <span className={styles.donutLabel}>{analytics?.health?.customer_retention || 65}%</span>
                                </div>
                                <div className={styles.retentionLegend}>
                                    <span><span className={styles.legendDot} style={{ background: '#991B1B' }} /> Returning ({analytics?.health?.customer_retention || 65}%)</span>
                                    <span><span className={styles.legendDot} style={{ background: '#F3F4F6' }} /> New ({100 - (analytics?.health?.customer_retention || 65)}%)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Heatmap */}
                <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                        <div><h3 className={styles.chartTitle}>Order Frequency Heatmap</h3><span className={styles.chartSub}>Popular peak times (24h x 7d)</span></div>
                        <div className={styles.heatLegend}><span>Low</span><span className={styles.heatSwatch} style={{ background: '#FECACA' }} /><span className={styles.heatSwatch} style={{ background: '#F87171' }} /><span className={styles.heatSwatch} style={{ background: '#DC2626' }} /><span>High</span></div>
                    </div>
                    <div className={styles.heatmap}>
                        {HEATMAP_DAYS.map((day, di) => (
                            <div key={day} className={styles.heatRow}>
                                <span className={styles.heatDay}>{day}</span>
                                {(analytics?.heatmap ? analytics.heatmap[di] : HEATMAP_DATA[di]).map((v, hi) => (
                                    <div key={hi} className={styles.heatCell} style={{ background: `rgba(153, 27, 27, ${Math.min(v / 10, 1)})` }} />
                                ))}
                            </div>
                        ))}
                        <div className={styles.heatXLabels}><span />{HEATMAP_HOURS.map(h => <span key={h}>{h}</span>)}</div>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className={styles.chartsRow}>
                {/* Top Performing Restaurants */}
                <div className={styles.chartCard} style={{ flex: 1.3 }}>
                    <h3 className={styles.chartTitle}>Top Performing Restaurants</h3>
                    <table className={styles.topTable}>
                        <thead><tr><th>Rank & Restaurant Name</th><th>Orders</th><th>Rating</th><th>Commission</th><th>Status</th></tr></thead>
                        <tbody>
                            {(analytics?.top_restaurants || TOP_RESTAURANTS).map((r, idx) => {
                                const statusMap = {
                                    'Top Performer': 'topPerf',
                                    'High Demand': 'highDemand',
                                    'Rising': 'rising',
                                    'Stable': 'stable'
                                };
                                return (
                                    <tr key={r.name || idx}>
                                        <td>
                                            <div className={styles.rankCell}>
                                                <span className={styles.rankNum}>{idx + 1}</span>
                                                <div className={styles.restLogo} style={{ background: getLogoColor(r.name) }}>{r.name?.[0]}</div>
                                                <div><div className={styles.restName}>{r.name}</div><div className={styles.restSub}>{r.status}</div></div>
                                            </div>
                                        </td>
                                        <td className={styles.orderCount}>{r.orders?.toLocaleString() || r.orders}</td>
                                        <td><span className={styles.ratingCell}><Star size={12} fill="#F59E0B" stroke="#F59E0B" /> {r.rating}</span></td>
                                        <td className={styles.commVal}>₱{r.commission?.toLocaleString() || r.commission}</td>
                                        <td><span className={`${styles.statusPill} ${styles[statusMap[r.status] || 'stable']}`}>{r.status}</span></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Distribution by City */}
                <div className={styles.chartCard} style={{ flex: .7 }}>
                    <h3 className={styles.chartTitle}>Distribution by City</h3>
                    <div className={styles.cityList}>
                        {(analytics?.city_distribution || CITY_DATA).map(c => (
                            <div key={c.city} className={styles.cityItem}>
                                <div className={styles.cityHeader}><span>{c.city}</span><span className={styles.cityPct}>{c.pct}%</span></div>
                                <div className={styles.cityBar}><div className={styles.cityBarFill} style={{ width: `${c.pct}%` }} /></div>
                            </div>
                        ))}
                    </div>
                    <div className={styles.cityNote}><Info size={12} /> Data visualization based on last 5,000 localized transactions.</div>
                </div>
            </div>

            {/* ── Export Modal ── */}
            {showExport && (
                <>
                    <div className={styles.modalOverlay} onClick={() => setShowExport(false)} />
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <div><h2 className={styles.modalTitle}>Export Reviews Data</h2><p className={styles.modalSub}>Download a snapshot of your platform analytics based on your selected filters and date range.</p></div>
                            <button className={styles.modalClose} onClick={() => setShowExport(false)}><X size={20} /></button>
                        </div>
                        <div className={styles.modalBody}>
                            <label className={styles.fieldLabel}>Date Range</label>
                            <div className={styles.selectWrap} style={{ width: '100%' }}><select style={{ width: '100%' }}><option>Last 30 Days</option><option>Last 7 Days</option><option>All Time</option></select><ChevronDown size={14} className={styles.selectArrow} /></div>

                            <label className={styles.fieldLabel} style={{ marginTop: '1rem' }}>File Format</label>
                            <div className={styles.formatRow}>
                                <label className={`${styles.formatOption} ${exportFormat === 'csv' ? styles.formatActive : ''}`}><input type="radio" name="fmt" checked={exportFormat === 'csv'} onChange={() => setExportFormat('csv')} /><div><div className={styles.formatTitle}>CSV</div><div className={styles.formatSub}>Spreadsheet data</div></div></label>
                                <label className={`${styles.formatOption} ${exportFormat === 'pdf' ? styles.formatActive : ''}`}><input type="radio" name="fmt" checked={exportFormat === 'pdf'} onChange={() => setExportFormat('pdf')} /><div><div className={styles.formatTitle}>PDF</div><div className={styles.formatSub}>Visual report</div></div></label>
                            </div>

                            <label className={styles.fieldLabel} style={{ marginTop: '1rem' }}>Select columns to include</label>
                            <div className={styles.columnsGrid}>
                                {EXPORT_COLS.map(c => (
                                    <label key={c} className={styles.columnCheck}><input type="checkbox" checked={exportCols[c]} onChange={() => setExportCols(p => ({ ...p, [c]: !p[c] }))} /><span className={styles.customCheckbox}><CheckCircle2 size={14} /></span>{c}</label>
                                ))}
                            </div>
                            <div className={styles.exportNote}><Info size={14} /> Analytics exports reflect data based on your currently applied filters — restaurant, category, location, and date range. Exports include only data visible to your admin role.</div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={styles.downloadBtn} onClick={handleExport}>Download Report</button>
                            <button className={styles.cancelLink} onClick={() => setShowExport(false)}>Cancel</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
