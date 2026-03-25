import React, { useState, useEffect } from 'react';
import {
    Plus, Trash2, Edit2, Eye, EyeOff, TrendingUp, Users, Clock, Loader, AlertCircle, X, Check
} from 'lucide-react';
import styles from './AdminPromotionsSection.module.css';

const MOCK_PROMOTIONS = [
    { id: 1, name: 'Black Friday Blitz', code: 'BFF20%OFF', discount: '20% Off', discountType: 'percentage', validDates: 'Mar 2 - Mar 6, 2026', usage: '4.2k / 6k', usagePercent: 70, conversion: '22.4%', status: 'Active', visible: true },
    { id: 2, name: 'Winter Starter Pack', code: 'WINTERSP50FF', discount: 'Fixed ₱50 Off', discountType: 'fixed', validDates: 'Mar 9 - Mar 13, 2026', usage: '0 / 2k', usagePercent: 0, conversion: '-', status: 'Active', visible: true },
    { id: 3, name: 'Lunch Hour BOGO', code: 'LUNCHRBOGO', discount: 'Buy 1, Get 1', discountType: 'bogo', validDates: 'Mar 8, 2026', usage: '1.8k / 2k', usagePercent: 90, conversion: '14.1%', status: 'Scheduled', visible: true },
    { id: 4, name: 'First Order Free Delivery', code: 'I5TORDREDELIV', discount: 'Free Delivery', discountType: 'free', validDates: 'Feb 23, 2026', usage: '12.5k', usagePercent: 100, conversion: '38.2%', status: 'Expired', visible: false },
];

export default function AdminPromotionsSection() {
    const [promotions, setPromotions] = useState(MOCK_PROMOTIONS);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [selectedPromo, setSelectedPromo] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [filterType, setFilterType] = useState('All');
    const [dateRange, setDateRange] = useState('Feb 20 - Mar 20, 2026');
    const [showExportModal, setShowExportModal] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [exportOptions, setExportOptions] = useState({
        dateRange: 'Last 30 Days',
        fileFormat: 'csv',
        columns: {
            name: true,
            discountType: true,
            validDates: true,
            usage: true,
            conversion: true,
            status: true,
        }
    });
    const [adminNotes, setAdminNotes] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [itemSearch, setItemSearch] = useState('');
    const [applicabilityType, setApplicabilityType] = useState('all');
    const [formData, setFormData] = useState({
        name: '',
        type: 'percentage',
        discountValue: '',
        minimumOrderValue: '',
        startDate: '',
        endDate: '',
    });

    const handleAddPromotion = () => {
        setShowForm(true);
        setEditingId(null);
        setFormData({
            code: '',
            discount: '',
            type: 'percentage',
            maxUses: '',
            restaurants: 'All',
            startDate: '',
            endDate: '',
        });
    };

    const handleSavePromotion = () => {
        if (!formData.code || !formData.discount || !formData.maxUses) {
            alert('Please fill in all required fields');
            return;
        }

        if (editingId) {
            setPromotions(promotions.map(p => p.id === editingId ? { ...p, ...formData } : p));
        } else {
            const newPromotion = {
                id: Math.max(...promotions.map(p => p.id), 0) + 1,
                ...formData,
                usedCount: 0,
                status: 'Active',
                roi: 0,
            };
            setPromotions([...promotions, newPromotion]);
        }
        setShowForm(false);
    };

    const handleDeletePromotion = (id) => {
        if (confirm('Are you sure you want to delete this promotion?')) {
            setPromotions(promotions.filter(p => p.id !== id));
        }
    };

    const handleEditPromotion = (promotion) => {
        setFormData(promotion);
        setEditingId(promotion.id);
        setShowForm(true);
    };

    const handleExport = () => {
        setShowSuccessMessage(true);
        setShowExportModal(false);
        setTimeout(() => setShowSuccessMessage(false), 3000);
    };

    const toggleColumn = (column) => {
        setExportOptions({
            ...exportOptions,
            columns: {
                ...exportOptions.columns,
                [column]: !exportOptions.columns[column]
            }
        });
    };

    const handlePromotionClick = (promo) => {
        setSelectedPromo(promo);
        setShowDetails(true);
        setAdminNotes('');
    };

    const closeDetails = () => {
        setShowDetails(false);
        setSelectedPromo(null);
    };

    return (
        <div className={styles.container}>
            {/* Stats Row */}
            <div className={styles.statsRow}>
                <div className={styles.statCard}>
                    <div className={styles.statContent}>
                        <div className={styles.statLabel}>Active Campaigns</div>
                        <div className={styles.statValue}>12</div>
                    </div>
                    <div className={styles.statTrend}>
                        <TrendingUp size={14} /> +2%
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statContent}>
                        <div className={styles.statLabel}>Total Usage</div>
                        <div className={styles.statValue}>8.4k</div>
                        <div className={styles.statSub}>Avg 1.2k per day</div>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statContent}>
                        <div className={styles.statLabel}>Revenue Lift</div>
                        <div className={styles.statValue}>₱24,902</div>
                    </div>
                    <div className={styles.statTrend}>
                        <TrendingUp size={14} /> +14%
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statContent}>
                        <div className={styles.statLabel}>Conversion Rate</div>
                        <div className={styles.statValue}>18.4%</div>
                    </div>
                    <div className={styles.statTrend}>
                        <TrendingUp size={14} /> +1.2%
                    </div>
                </div>
            </div>

            {/* Alert Banner */}
            <div className={styles.alertBanner}>
                <AlertCircle size={18} />
                <div className={styles.alertText}>
                    <strong>2 Active promotions are expiring in less than 48 hours.</strong> Review extension options.
                </div>
                <a href="#" className={styles.actionLink}>Action Required</a>
            </div>

            {/* Main Content */}
            <div className={styles.mainLayout}>
                <div className={styles.mainContent}>
                    {/* Filters */}
                    <div className={styles.filterBar}>
                        <div className={styles.filterTabs}>
                            {['All', '% Off', 'Fixed', 'BOGO', 'Free', 'Code'].map(tab => (
                                <button 
                                    key={tab} 
                                    className={`${styles.filterTab} ${filterType === tab ? styles.active : ''}`}
                                    onClick={() => setFilterType(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <div className={styles.filterControls}>
                            <input type="text" placeholder="Feb 20 - Mar 20, 2026" className={styles.dateInput} />
                            <select className={styles.statusSelect}>
                                <option>Status: All</option>
                                <option>Active</option>
                                <option>Scheduled</option>
                                <option>Expired</option>
                            </select>
                            <button className={styles.exportBtn} onClick={() => setShowExportModal(true)}>↓ Export</button>
                            <button className={styles.createBtn} onClick={() => setShowForm(!showForm)}>
                                <Plus size={16} /> Create Promotion
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    {showForm && (
                        <div className={styles.formModal}>
                            <div className={styles.formModalOverlay} onClick={() => setShowForm(false)} />
                            <div className={styles.formModalContent}>
                                <div className={styles.formModalHeader}>
                                    <h3>Create New Promotion</h3>
                                    <button className={styles.formModalClose} onClick={() => setShowForm(false)}>
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Promotion Details */}
                                <div className={styles.formSection}>
                                    <h4>Promotion Details</h4>
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label>Name of Promotion</label>
                                            <input 
                                                type="text" 
                                                placeholder="e.g. Summer Pizza Party"
                                                value={formData.name}
                                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Promotion Type</label>
                                            <select 
                                                value={formData.type}
                                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                                            >
                                                <option value="percentage">Percentage Off (%)</option>
                                                <option value="fixed">Fixed Amount (₱)</option>
                                                <option value="bogo">Buy 1 Get 1</option>
                                                <option value="free">Free Delivery</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Discount Configuration */}
                                <div className={styles.formSection}>
                                    <h4>Discount Configuration</h4>
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label>Discount Value</label>
                                            <div className={styles.currencyInput}>
                                                <span>₱</span>
                                                <input 
                                                    type="number" 
                                                    placeholder="0.00"
                                                    value={formData.discountValue}
                                                    onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Minimum Order Value</label>
                                            <div className={styles.currencyInput}>
                                                <span>₱</span>
                                                <input 
                                                    type="number" 
                                                    placeholder="250.00"
                                                    value={formData.minimumOrderValue}
                                                    onChange={(e) => setFormData({...formData, minimumOrderValue: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Applicability */}
                                <div className={styles.formSection}>
                                    <h4>Applicability</h4>
                                    <div className={styles.radioGroup}>
                                        <label className={styles.radioOption}>
                                            <input
                                                type="radio"
                                                name="applicability"
                                                value="all"
                                                checked={applicabilityType === 'all'}
                                                onChange={(e) => setApplicabilityType(e.target.value)}
                                            />
                                            <span>All Menu Items</span>
                                        </label>
                                        <label className={styles.radioOption}>
                                            <input
                                                type="radio"
                                                name="applicability"
                                                value="specific"
                                                checked={applicabilityType === 'specific'}
                                                onChange={(e) => setApplicabilityType(e.target.value)}
                                            />
                                            <span>Specific Categories/Items</span>
                                        </label>
                                    </div>

                                    {applicabilityType === 'specific' && (
                                        <>
                                            <input 
                                                type="text" 
                                                placeholder="Search items..."
                                                className={styles.searchInput}
                                                value={itemSearch}
                                                onChange={(e) => setItemSearch(e.target.value)}
                                            />
                                            <div className={styles.tagList}>
                                                {selectedItems.map((item, idx) => (
                                                    <span key={idx} className={styles.tag}>
                                                        {item}
                                                        <button onClick={() => setSelectedItems(selectedItems.filter((_, i) => i !== idx))}>×</button>
                                                    </span>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Date Schedule */}
                                <div className={styles.formSection}>
                                    <h4>Date Schedule</h4>
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label>Start Date</label>
                                            <input 
                                                type="date"
                                                value={formData.startDate}
                                                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>End Date</label>
                                            <input 
                                                type="date"
                                                value={formData.endDate}
                                                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className={styles.formActions}>
                                    <button className={styles.formCancelBtn} onClick={() => setShowForm(false)}>Cancel</button>
                                    <button className={styles.formSaveBtn} onClick={() => setShowForm(false)}>Save Promotion</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Table */}
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Promotion Name</th>
                                <th>Discount Type</th>
                                <th>Valid Dates</th>
                                <th>Usage</th>
                                <th>Conversion</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {promotions.map(promo => (
                                <tr key={promo.id} className={styles.tableRow} onClick={() => handlePromotionClick(promo)}>
                                    <td>
                                        <div className={styles.promoName}>{promo.name}</div>
                                        <div className={styles.promoCode}>{promo.code}</div>
                                    </td>
                                    <td><span className={styles.discountBadge}>{promo.discount}</span></td>
                                    <td className={styles.datesCell}>{promo.validDates}</td>
                                    <td className={styles.usageCell}>
                                        <div className={styles.usageBar}>
                                            <div className={styles.usageFill} style={{width: `${promo.usagePercent}%`}} />
                                        </div>
                                        <span className={styles.usageText}>{promo.usage}</span>
                                    </td>
                                    <td className={styles.conversionCell}>{promo.conversion}</td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${styles[promo.status.toLowerCase()]}`}>
                                            {promo.status}
                                        </span>
                                    </td>
                                    <td className={styles.actionCell} onClick={(e) => e.stopPropagation()}>
                                        <button className={styles.iconBtn} title="Toggle visibility">
                                            {promo.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                                        </button>
                                        <button className={styles.iconBtn} title="Edit">
                                            <Edit2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Performance Overview Sidebar */}
                <aside className={styles.sidebar}>
                    <div className={styles.sidebarCard}>
                        <h4 className={styles.sidebarTitle}>Performance Overview</h4>
                        
                        <div className={styles.trendChart}>
                            <div className={styles.chartLabel}>Conversion Trend</div>
                            <div className={styles.miniChart}>
                                <div className={styles.bar} style={{height: '40%'}} />
                                <div className={styles.bar} style={{height: '58%'}} />
                                <div className={styles.bar} style={{height: '72%'}} />
                                <div className={styles.bar} style={{height: '65%'}} />
                                <div className={styles.bar} style={{height: '78%'}} />
                                <div className={styles.bar} style={{height: '85%'}} />
                                <div className={styles.bar} style={{height: '92%'}} />
                            </div>
                            <div className={styles.chartTrend}>
                                <TrendingUp size={12} /> +4.5%
                            </div>
                        </div>

                        <div className={styles.metricRow}>
                            <div className={styles.metricLabel}>Total Usage</div>
                            <div className={styles.metricValue}>12,402</div>
                        </div>

                        <div className={styles.metricRow}>
                            <div className={styles.metricLabel}>Revenue Lift</div>
                            <div className={styles.metricValue}>₱42,800</div>
                        </div>

                        <div className={styles.activeTimeline}>
                            <h5 className={styles.timelineTitle}>Active Timeline</h5>
                            <div className={styles.timelineItem}>
                                <div className={styles.timelineDot} style={{background: '#FCD34D'}} />
                                <div className={styles.timelineInfo}>
                                    <div className={styles.timelineLabel}>Black Friday Blitz</div>
                                    <div className={styles.timelineTime}>6 days left</div>
                                </div>
                            </div>
                            <div className={styles.timelineItem}>
                                <div className={styles.timelineDot} style={{background: '#F87171'}} />
                                <div className={styles.timelineInfo}>
                                    <div className={styles.timelineLabel}>Lunch BOGO</div>
                                    <div className={styles.timelineTime}>Ends Tomorrow</div>
                                </div>
                            </div>
                            <div className={styles.timelineItem}>
                                <div className={styles.timelineDot} style={{background: '#4ADE80'}} />
                                <div className={styles.timelineInfo}>
                                    <div className={styles.timelineLabel}>Free Delivery</div>
                                    <div className={styles.timelineTime}>Permanent</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Promotion Details Sidebar */}
            {showDetails && selectedPromo && (
                <div className={styles.detailsOverlay} onClick={closeDetails}>
                    <div className={styles.detailsPanel} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.detailsHeader}>
                            <button className={styles.detailsClose} onClick={closeDetails}>
                                <X size={20} />
                            </button>
                            <div className={styles.detailsTitle}>
                                <h2>{selectedPromo.name}</h2>
                                <span className={`${styles.detailsBadge} ${styles[selectedPromo.status.toLowerCase()]}`}>
                                    {selectedPromo.status}
                                </span>
                            </div>
                        </div>

                        <div className={styles.detailsContent}>
                            {/* General Information */}
                            <section className={styles.detailsSection}>
                                <h3 className={styles.sectionTitle}>General Information</h3>
                                <div className={styles.infoGrid}>
                                    <div className={styles.infoItem}>
                                        <label>Discount Value</label>
                                        <div className={styles.infoValue}>{selectedPromo.discount}</div>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <label>Promo Code</label>
                                        <div className={styles.codeBox}>
                                            <code>{selectedPromo.code}</code>
                                            <button className={styles.copyBtn} title="Copy code">📋</button>
                                        </div>
                                    </div>
                                    <div className={styles.infoItem} style={{gridColumn: '1 / -1'}}>
                                        <label>Description</label>
                                        <div className={styles.infoValue}>50% discount on orders over $120. Exclusive to weekend...</div>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <label>Start Date</label>
                                        <div className={styles.infoValue}>Mar 12, 2026</div>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <label>End Date</label>
                                        <div className={styles.infoValue}>Apr 15, 2026</div>
                                    </div>
                                </div>
                            </section>

                            {/* Performance Metrics */}
                            <section className={styles.detailsSection}>
                                <h3 className={styles.sectionTitle}>Performance Metrics</h3>
                                <div className={styles.metricsGrid}>
                                    <div className={styles.metricItem}>
                                        <label>Redemptions</label>
                                        <div className={styles.metricValue}>856 <span className={styles.trend}>+15%</span></div>
                                    </div>
                                    <div className={styles.metricItem}>
                                        <label>Unique Customers</label>
                                        <div className={styles.metricValue}>742</div>
                                    </div>
                                    <div className={styles.metricItem}>
                                        <label>Avg Order Value</label>
                                        <div className={styles.metricValue}>₱142.25</div>
                                    </div>
                                    <div className={styles.metricItem}>
                                        <label>Conversion Rate</label>
                                        <div className={styles.metricValue}>68.4%</div>
                                    </div>
                                </div>
                            </section>

                            {/* Conversion Funnel */}
                            <section className={styles.detailsSection}>
                                <h3 className={styles.sectionTitle}>Conversion Funnel</h3>
                                <div className={styles.funnelChart}>
                                    <div className={styles.funnelRow}>
                                        <div className={styles.funnelLabel}>Impressions</div>
                                        <div className={styles.funnelBar} style={{width: '100%', background: '#FEF2F2'}}>
                                            <div className={styles.funnelValue}>12.5k</div>
                                        </div>
                                    </div>
                                    <div className={styles.funnelRow}>
                                        <div className={styles.funnelLabel}>Clicks</div>
                                        <div className={styles.funnelBar} style={{width: '36%', background: '#FECACA'}}>
                                            <div className={styles.funnelValue}>4.5k</div>
                                        </div>
                                    </div>
                                    <div className={styles.funnelRow}>
                                        <div className={styles.funnelLabel}>Redemptions</div>
                                        <div className={styles.funnelBar} style={{width: '7%', background: '#DC2626'}}>
                                            <div className={styles.funnelValue}>856</div>
                                        </div>
                                    </div>
                                    <div className={styles.funnelRow}>
                                        <div className={styles.funnelLabel}>Cumulative RTR</div>
                                        <div className={styles.funnelBar} style={{width: '6.8%', background: '#991B1B'}}>
                                            <div className={styles.funnelValue}>815</div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Top Performing Restaurants */}
                            <section className={styles.detailsSection}>
                                <h3 className={styles.sectionTitle}>Performance Metrics</h3>
                                <div className={styles.restaurantsList}>
                                    <div className={styles.restaurantItem}>
                                        <div className={styles.restaurantLogo}>🍕</div>
                                        <div className={styles.restaurantInfo}>
                                            <div className={styles.restaurantName}>Petty Shack</div>
                                            <div className={styles.restaurantSub}>142 orders redeemed</div>
                                        </div>
                                        <div className={styles.restaurantRevenue}>+₱2,630</div>
                                    </div>
                                    <div className={styles.restaurantItem}>
                                        <div className={styles.restaurantLogo}>🍔</div>
                                        <div className={styles.restaurantInfo}>
                                            <div className={styles.restaurantName}>Burger King</div>
                                            <div className={styles.restaurantSub}>105 orders redeemed</div>
                                        </div>
                                        <div className={styles.restaurantRevenue}>+₱2,160</div>
                                    </div>
                                    <div className={styles.restaurantItem}>
                                        <div className={styles.restaurantLogo}>🍟</div>
                                        <div className={styles.restaurantInfo}>
                                            <div className={styles.restaurantName}>Mcdonalds</div>
                                            <div className={styles.restaurantSub}>94 orders redeemed</div>
                                        </div>
                                        <div className={styles.restaurantRevenue}>+₱1,890</div>
                                    </div>
                                </div>
                            </section>

                            {/* Customer Acquisition */}
                            <section className={styles.detailsSection}>
                                <h3 className={styles.sectionTitle}>Customer Acquisition</h3>
                                <div className={styles.acquisitionChart}>
                                    <div className={styles.acqusitionBar}>
                                        <div className={styles.acqLabel}>New Users (35%)</div>
                                        <div className={styles.acqBar}>
                                            <div className={styles.acqFill} style={{width: '35%', background: '#DC2626'}} />
                                        </div>
                                    </div>
                                    <div className={styles.acqusitionBar}>
                                        <div className={styles.acqLabel}>Returning (86%)</div>
                                        <div className={styles.acqBar}>
                                            <div className={styles.acqFill} style={{width: '86%', background: '#10B981'}} />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Admin Notes */}
                            <section className={styles.detailsSection}>
                                <h3 className={styles.sectionTitle}>Admin Notes</h3>
                                <textarea 
                                    className={styles.notesInput}
                                    placeholder="Add a note..."
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                />
                            </section>
                        </div>

                        {/* Action Buttons */}
                        <div className={styles.detailsActions}>
                            <button className={styles.editPromoBg}>✎ Edit Promotion</button>
                            <div className={styles.actionButtonsRow}>
                                <button className={styles.actionBtnSecondary}>⏸ Pause</button>
                                <button className={styles.actionBtnSecondary}>⎘ Duplicate</button>
                            </div>
                            <div className={styles.actionButtonsRow}>
                                <button className={styles.actionBtnSecondary}>⏭ End Early</button>
                                <button className={styles.actionBtnDanger}>🗑 Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showExportModal && (
                <div className={styles.modalOverlay} onClick={() => setShowExportModal(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>Export Promotions Data</h3>
                            <button className={styles.modalClose} onClick={() => setShowExportModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <p className={styles.modalSubtitle}>
                            Download a snapshot of your promotions data including usage metrics and conversion performance.
                        </p>

                        {/* Date Range */}
                        <div className={styles.exportGroup}>
                            <label>Date Range</label>
                            <select 
                                className={styles.exportSelect}
                                value={exportOptions.dateRange}
                                onChange={(e) => setExportOptions({...exportOptions, dateRange: e.target.value})}
                            >
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                                <option>Last 90 Days</option>
                                <option>Last Year</option>
                            </select>
                        </div>

                        {/* File Format */}
                        <div className={styles.exportGroup}>
                            <label>File Format</label>
                            <div className={styles.formatOptions}>
                                <label className={styles.formatOption}>
                                    <input
                                        type="radio"
                                        name="format"
                                        value="csv"
                                        checked={exportOptions.fileFormat === 'csv'}
                                        onChange={(e) => setExportOptions({...exportOptions, fileFormat: e.target.value})}
                                    />
                                    <span className={styles.formatLabel}>
                                        <strong>CSV</strong>
                                        <span>Spreadsheet data</span>
                                    </span>
                                </label>
                                <label className={styles.formatOption}>
                                    <input
                                        type="radio"
                                        name="format"
                                        value="pdf"
                                        checked={exportOptions.fileFormat === 'pdf'}
                                        onChange={(e) => setExportOptions({...exportOptions, fileFormat: e.target.value})}
                                    />
                                    <span className={styles.formatLabel}>
                                        <strong>PDF</strong>
                                        <span>Visual report</span>
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Columns Selection */}
                        <div className={styles.exportGroup}>
                            <label>Select columns to include</label>
                            <div className={styles.columnGrid}>
                                <label className={styles.columnOption}>
                                    <input
                                        type="checkbox"
                                        checked={exportOptions.columns.name}
                                        onChange={() => toggleColumn('name')}
                                    />
                                    Promotion Name
                                </label>
                                <label className={styles.columnOption}>
                                    <input
                                        type="checkbox"
                                        checked={exportOptions.columns.discountType}
                                        onChange={() => toggleColumn('discountType')}
                                    />
                                    Discount Type
                                </label>
                                <label className={styles.columnOption}>
                                    <input
                                        type="checkbox"
                                        checked={exportOptions.columns.validDates}
                                        onChange={() => toggleColumn('validDates')}
                                    />
                                    Valid Dates
                                </label>
                                <label className={styles.columnOption}>
                                    <input
                                        type="checkbox"
                                        checked={exportOptions.columns.usage}
                                        onChange={() => toggleColumn('usage')}
                                    />
                                    Usage
                                </label>
                                <label className={styles.columnOption}>
                                    <input
                                        type="checkbox"
                                        checked={exportOptions.columns.conversion}
                                        onChange={() => toggleColumn('conversion')}
                                    />
                                    Conversion
                                </label>
                                <label className={styles.columnOption}>
                                    <input
                                        type="checkbox"
                                        checked={exportOptions.columns.status}
                                        onChange={() => toggleColumn('status')}
                                    />
                                    Status
                                </label>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className={styles.modalActions}>
                            <button className={styles.modalCancel} onClick={() => setShowExportModal(false)}>
                                Cancel
                            </button>
                            <button className={styles.modalDownload} onClick={handleExport}>
                                Download Report
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Message */}
            {showSuccessMessage && (
                <div className={styles.successMessage}>
                    <div className={styles.successContent}>
                        <Check size={20} />
                        <div>
                            <strong>Success</strong>
                            <p>Your promotions data report has been successfully.</p>
                        </div>
                    </div>
                    <button onClick={() => setShowSuccessMessage(false)}>
                        <X size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}
