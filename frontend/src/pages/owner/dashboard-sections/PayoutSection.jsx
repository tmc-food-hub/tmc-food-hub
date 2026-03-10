import React, { useState } from 'react';
import {
    Search, Bell, Download, ChevronLeft, ChevronDown,
    Check, CheckCircle2, Circle, AlertCircle, X, FileText, Wallet, Calendar,
    TrendingUp, ArrowRight, RefreshCcw, File
} from 'lucide-react';
import styles from './PayoutSection.module.css';

function PayoutSection({ initialViewData, clearInitViewData }) {
    const [viewData, setViewData] = useState(initialViewData || null); // null = list view, object = details view
    const [showExportModal, setShowExportModal] = useState(false);

    React.useEffect(() => {
        if (initialViewData) {
            setViewData(initialViewData);
        }
    }, [initialViewData]);

    // Mock History
    const payoutHistory = [
        { id: 'PAY-2026-9842', date: 'Mar 9, 2026', amount: '₱32,450.00', method: 'Bank Transfer', status: 'Completed', numTx: 43 },
        { id: 'PAY-2026-9104', date: 'Mar 2, 2026', amount: '₱28,910.00', method: 'Bank Transfer', status: 'Completed', numTx: 38 },
        { id: 'PAY-2026-8891', date: 'Feb 23, 2026', amount: '₱30,120.00', method: 'Bank Transfer', status: 'Completed', numTx: 41 },
    ];

    const generateMockTransactions = () => {
        return [
            { id: '#ORD-29938', total: '₱450.00', comm: '-₱67.50', net: '₱382.50' },
            { id: '#ORD-29937', total: '₱1,200.00', comm: '-₱180.00', net: '₱1,020.00' },
            { id: '#ORD-29936', total: '₱890.00', comm: '-₱133.50', net: '₱756.50' },
            { id: '#ORD-29935', total: '₱350.00', comm: '-₱52.50', net: '₱297.50' },
            { id: '#ORD-29934', total: '₱2,100.00', comm: '-₱315.00', net: '₱1,785.00' },
        ];
    };

    const handleViewDetails = (payout) => {
        setViewData(payout);
    };

    const handleBack = () => {
        setViewData(null);
        if (clearInitViewData) clearInitViewData();
    };

    if (viewData) {
        // Detailed View
        return (
            <div className={styles.wrapper}>
                {/* ── Top Bar (Details View) ── */}
                <div className={styles.topBar}>
                    <div className={styles.detailsHeader}>
                        <div className={styles.backBtnRow}>
                            <button className={styles.btnBackIcon} onClick={handleBack}>
                                <ChevronLeft size={20} />
                            </button>
                            <h2 className={styles.title} style={{ fontSize: '1.5rem', margin: 0 }}>Payout Details</h2>
                        </div>
                        <div className={styles.detailsSubtitle}>
                            ID: #{viewData.id} • {viewData.date}, 8:12 AM
                        </div>
                    </div>

                    <div className={styles.topRight}>
                        <div className={styles.searchWrap} style={{ width: '320px', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
                            <Search className={styles.searchIcon} size={16} color="#9CA3AF" />
                            <input type="text" placeholder="Search items..." className={styles.searchInput} style={{ backgroundColor: 'transparent' }} />
                        </div>
                        <button className={styles.notificationBtn}>
                            <Bell size={20} />
                            <span className={styles.notificationBadge}></span>
                        </button>
                    </div>
                </div>

                {/* ── Content ── */}
                <div className={styles.container}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                        <button className={styles.btnDownloadReport} onClick={() => setShowExportModal(true)} style={{ backgroundColor: '#991B1B', color: 'white', border: 'none' }}>
                            <Download size={16} /> Download Report
                        </button>
                    </div>

                    <div className={styles.detailMetricsGrid}>
                        <div className={styles.detailMetricCard}>
                            <div className={styles.detailMetricLabel}>Total Orders</div>
                            <div className={styles.detailMetricValue}>{viewData.numTx}</div>
                            <div className={styles.detailMetricSub}>Gross Revenue: ₱14,294.50</div>
                        </div>
                        <div className={styles.detailMetricCard}>
                            <div className={styles.detailMetricLabel}>Total Commission</div>
                            <div className={styles.detailMetricValue} style={{ color: '#DC2626' }}>-₱1,864.50</div>
                            <div className={styles.detailMetricSub}>Calculated at 15% fixed rate</div>
                        </div>
                        <div className={styles.detailMetricCard}>
                            <div className={styles.detailMetricLabel}>Final Net Transfer</div>
                            <div className={styles.detailMetricValue}>₱12,430.00</div>
                            <div className={styles.detailMetricSub}>Ready for disbursement</div>
                        </div>
                    </div>

                    <div className={styles.detailsLayout}>
                        <div className={styles.detailsLeft}>
                            <div className={styles.transactionsCard}>
                                <div className={styles.txHeader}>
                                    <h3 className={styles.txTitle}>Transactions Included</h3>
                                    <span className={styles.txCount}>{viewData.numTx} Orders</span>
                                </div>
                                <table className={styles.txTable}>
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Order Total</th>
                                            <th>Commission (15%)</th>
                                            <th style={{ textAlign: 'right' }}>Net Earnings</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {generateMockTransactions().map((tx, i) => (
                                            <tr key={i}>
                                                <td className={styles.orderId} style={{ fontWeight: 600, color: '#111827' }}>{tx.id}</td>
                                                <td className={styles.orderTotal} style={{ fontWeight: 600, color: '#111827' }}>{tx.total}</td>
                                                <td className={styles.orderComm} style={{ fontWeight: 600, color: '#DC2626' }}>{tx.comm}</td>
                                                <td className={styles.orderNet} style={{ fontWeight: 600, color: '#111827', textAlign: 'right' }}>{tx.net}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <button className={styles.btnViewAllTx}>
                                    View All {viewData.numTx} transactions <ChevronDown size={16} />
                                </button>
                            </div>
                        </div>

                        <div className={styles.detailsRight}>
                            <div className={styles.summaryCard}>
                                <h3 className={styles.summaryTitle}>Payout Summary</h3>
                                <div className={styles.summaryTotalBox}>
                                    <div className={styles.summaryTotalLabel}>Total Net Amount</div>
                                    <div className={styles.summaryTotalValue}>₱12,430.00</div>
                                </div>

                                <div className={styles.summaryRow}>
                                    <div className={styles.summaryIconWrap}><Wallet size={16} /></div>
                                    <div className={styles.summaryRowDetails}>
                                        <div className={styles.summaryRowLabel}>Payout Method</div>
                                        <div className={styles.summaryRowValue}>BDO Bank Transfer **** 4821</div>
                                    </div>
                                </div>
                                <div className={styles.summaryRow}>
                                    <div className={styles.summaryIconWrap}><Calendar size={16} /></div>
                                    <div className={styles.summaryRowDetails}>
                                        <div className={styles.summaryRowLabel}>Initiated On</div>
                                        <div className={styles.summaryRowValue}>{viewData.date}</div>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.timelineCard}>
                                <h3 className={styles.timelineTitle}>Transfer Timeline</h3>
                                <div className={styles.timeline}>
                                    <div className={styles.timelineItem}>
                                        <div className={`${styles.timelineIcon} ${styles.iconDone}`}><CheckCircle2 size={18} fill="#059669" color="#fff" strokeWidth={2.5} /></div>
                                        <div className={styles.timelineContent}>
                                            <div className={styles.timelineStep}>Orders Completed</div>
                                            <div className={styles.timelineDate}>Mar 3 - Mar 8</div>
                                        </div>
                                    </div>
                                    <div className={styles.timelineItem}>
                                        <div className={`${styles.timelineIcon} ${styles.iconDone}`}><CheckCircle2 size={18} fill="#059669" color="#fff" strokeWidth={2.5} /></div>
                                        <div className={styles.timelineContent}>
                                            <div className={styles.timelineStep}>Revenue Calculated</div>
                                            <div className={styles.timelineDate}>Mar 9, 12:00 AM</div>
                                        </div>
                                    </div>
                                    <div className={styles.timelineItem}>
                                        <div className={`${styles.timelineIcon} ${styles.iconDone}`}><CheckCircle2 size={18} fill="#059669" color="#fff" strokeWidth={2.5} /></div>
                                        <div className={styles.timelineContent}>
                                            <div className={styles.timelineStep}>Payout Scheduled</div>
                                            <div className={styles.timelineDate}>Mar 9, 9:30 AM</div>
                                        </div>
                                    </div>
                                    <div className={styles.timelineItem}>
                                        <div className={`${styles.timelineIcon} ${styles.iconPending}`}><Circle size={12} fill="#D1D5DB" color="#D1D5DB" /></div>
                                        <div className={styles.timelineContent}>
                                            <div className={styles.timelineStep}>Bank Transfer Initiated</div>
                                            <div className={styles.timelineDate}>Mar 9, 2:15 PM</div>
                                        </div>
                                    </div>
                                    <div className={styles.timelineItem}>
                                        <div className={`${styles.timelineIcon} ${styles.iconPending}`}><Circle size={12} fill="#D1D5DB" color="#D1D5DB" /></div>
                                        <div className={styles.timelineContent}>
                                            <div className={`${styles.timelineStep} ${styles.stepPending}`}>Transfer Completed</div>
                                            <div className={styles.timelineDate}>Estimated 1-3 working days</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {showExportModal && <ExportModal onClose={() => setShowExportModal(false)} txCount={viewData.numTx} />}
                </div>
            </div>
        );
    }

    // Default List View
    return (
        <div className={styles.wrapper}>
            {/* ── Top Bar (List View) ── */}
            <div className={styles.topBar}>
                <div>
                    <h2 className={styles.title} style={{ fontSize: '1.5rem', margin: 0 }}>Payouts</h2>
                    <p className={styles.subtitle} style={{ marginTop: '0.25rem' }}>Manage your restaurant's earnings.</p>
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

            {/* ── Content ── */}
            <div className={styles.container}>
                <div className={styles.metricsGrid}>
                    <div className={styles.metricCard}>
                        <div className={styles.metricLabel}>Available Balance</div>
                        <div className={styles.metricValue}>₱15,240.00</div>
                        <div className={styles.metricSubtext} style={{ color: '#059669', fontWeight: 600 }}>+12% from last week</div>
                    </div>
                    <div className={styles.metricCard}>
                        <div className={styles.metricLabel}>Pending Balance</div>
                        <div className={styles.metricValue}>₱152.40</div>
                        <div className={styles.metricSubtext}>Estimated arrival in 2-3 days</div>
                    </div>
                    <div className={styles.metricCard}>
                        <div className={styles.metricLabel}>Total Paid Out</div>
                        <div className={styles.metricValue}>₱124,500.00</div>
                        <div className={styles.metricSubtext}>Since Sept 2025</div>
                    </div>
                    <div className={styles.metricCard}>
                        <div className={styles.metricLabel}>Payout Frequency</div>
                        <div className={styles.metricValue}>Weekly</div>
                        <div className={styles.metricSubtext}>Every Monday</div>
                    </div>
                </div>

                <div className={styles.nextPayoutCard}>
                    <div className={styles.nextPayoutLeft}>
                        <div className={styles.nextPayoutHeader}>
                            <div className={styles.walletIconWrap}><Wallet size={16} /></div>
                            <div>
                                <div className={styles.nextPayoutLabel}>Next Payout</div>
                                <div className={styles.nextPayoutDate}>Monday, Mar 13, 2026</div>
                            </div>
                        </div>
                        <div className={styles.nextPayoutValue}>
                            ₱12,430.00 <span className={styles.estimatedTag}>Estimated</span>
                        </div>
                        <div>
                            <div className={styles.progressLabelRow}>
                                <span className={styles.progressLabelText}>Payout Cycle Progress</span>
                                <span className={styles.progressPercent}>85% Complete</span>
                            </div>
                            <div className={styles.progressBarTrack}>
                                <div className={styles.progressBarFill} style={{ width: '85%' }}></div>
                            </div>
                            <div className={styles.progressSubtext}>43 Transactions included in this cycle</div>
                        </div>
                    </div>

                    <div className={styles.nextPayoutRight}>
                        <div className={styles.breakdownRow}>
                            <span>Gross Sales</span>
                            <span>₱15,537.50</span>
                        </div>
                        <div className={`${styles.breakdownRow} ${styles.breakdownRowRed}`}>
                            <span>Commission (20%)</span>
                            <span>-₱3,107.50</span>
                        </div>
                        <div className={styles.breakdownTotal}>
                            <span>Net Earnings</span>
                            <span>₱12,430.00</span>
                        </div>
                        <button
                            className={styles.btnViewDetails}
                            onClick={() => handleViewDetails({
                                id: 'EST-12430',
                                date: 'Mar 13, 2026',
                                amount: '₱12,430.00',
                                method: 'Bank Transfer',
                                status: 'Pending',
                                numTx: 43
                            })}
                        >
                            View Details
                        </button>
                    </div>
                </div>

                <div className={styles.historySection}>
                    <div className={styles.historyHeader}>
                        <h3 className={styles.historyTitle}>Payout History</h3>
                        <select className={styles.filterSelect}>
                            <option>Last 3 months</option>
                            <option>Last 6 months</option>
                            <option>This Year</option>
                        </select>
                    </div>
                    <div className={styles.tableWrap}>
                        <table className={styles.historyTable}>
                            <thead>
                                <tr>
                                    <th>Reference ID</th>
                                    <th>Date Paid</th>
                                    <th>Amount</th>
                                    <th>Method</th>
                                    <th>Status</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {payoutHistory.map((row, i) => (
                                    <tr key={i}>
                                        <td className={styles.refId}>{row.id}</td>
                                        <td className={styles.datePaid}>{row.date}</td>
                                        <td className={styles.amount}>{row.amount}</td>
                                        <td>{row.method}</td>
                                        <td><span className={styles.statusPill}>{row.status}</span></td>
                                        <td>
                                            <button className={styles.btnActionOutline} onClick={() => handleViewDetails(row)}>
                                                <FileText size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ExportModal({ onClose, txCount }) {
    const [format, setFormat] = useState('csv');
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = () => {
        setIsDownloading(true);
        // Simulate download delay
        setTimeout(() => {
            setIsDownloading(false);
            onClose();
        }, 1500);
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.exportModal}>
                <div className={styles.modalHeader}>
                    <div className={styles.modalTitleBox}>
                        <h3>Export Payout Report</h3>
                        <p>Select criteria for your payout data export</p>
                    </div>
                    <button className={styles.btnCloseModal} onClick={onClose}><X size={20} /></button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Date Range</label>
                        <select className={styles.formSelect}>
                            <option>Last 30 Days</option>
                            <option>Last 7 Days</option>
                            <option>This Month</option>
                            <option>Custom Range</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Payout Status</label>
                        <div className={styles.pillsRow}>
                            <button className={`${styles.pillBtn} ${styles.pillActive}`}>All</button>
                            <button className={styles.pillBtn}>Paid</button>
                            <button className={styles.pillBtn}>Pending</button>
                            <button className={styles.pillBtn}>Cancelled</button>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>File Format</label>
                        <div className={styles.formatGrid}>
                            <div className={`${styles.formatOption} ${format === 'csv' ? styles.formatOptionAct : ''}`} onClick={() => setFormat('csv')}>
                                <div className={styles.radioCircle}>
                                    {format === 'csv' && <div className={styles.radioDot}></div>}
                                </div>
                                <div className={styles.formatText}>
                                    <span className={styles.formatTitle}>CSV</span>
                                    <span className={styles.formatSub}>Spreadsheet data</span>
                                </div>
                            </div>
                            <div className={`${styles.formatOption} ${format === 'pdf' ? styles.formatOptionAct : ''}`} onClick={() => setFormat('pdf')}>
                                <div className={styles.radioCircle}>
                                    {format === 'pdf' && <div className={styles.radioDot}></div>}
                                </div>
                                <div className={styles.formatText}>
                                    <span className={styles.formatTitle}>PDF</span>
                                    <span className={styles.formatSub}>Visual report</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.alertBox}>
                        <AlertCircle size={16} />
                        {txCount} payouts included in this report.
                    </div>
                </div>

                <div className={styles.modalFooter}>
                    <button
                        className={`${styles.btnSubmitModal} ${isDownloading ? styles.btnDownloading : ''}`}
                        onClick={handleDownload}
                        disabled={isDownloading}
                    >
                        {isDownloading ? <div className={styles.spinner}></div> : 'Download Report'}
                    </button>
                    <button className={styles.btnCancelModal} onClick={onClose} disabled={isDownloading}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PayoutSection;
