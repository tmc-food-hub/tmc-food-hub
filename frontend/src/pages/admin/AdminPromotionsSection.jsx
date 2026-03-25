import React, { useState, useEffect } from 'react';
import {
    Plus, Trash2, Edit2, Eye, EyeOff, TrendingUp, Users, Clock, Loader, AlertCircle, TrendingUpIcon
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
    const [editingId, setEditingId] = useState(null);
    const [filterType, setFilterType] = useState('All');
    const [dateRange, setDateRange] = useState('Feb 20 - Mar 20, 2026');
    const [formData, setFormData] = useState({
        code: '',
        discount: '',
        type: 'percentage',
        maxUses: '',
        restaurants: 'All',
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

    const totalPromos = promotions.length;
    const activePromos = promotions.filter(p => p.status === 'Active').length;
    const totalRedemptions = promotions.reduce((sum, p) => sum + p.usedCount, 0);
    const avgROI = (promotions.reduce((sum, p) => sum + p.roi, 0) / promotions.length).toFixed(2);

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
                            <button className={styles.exportBtn}>↓ Export</button>
                            <button className={styles.createBtn} onClick={() => setShowForm(!showForm)}>
                                <Plus size={16} /> Create Promotion
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    {showForm && (
                        <div className={styles.formCard}>
                            <h4 className={styles.formTitle}>{editingId ? 'Edit Promotion' : 'Create New Promotion'}</h4>
                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label>Promotion Name</label>
                                    <input type="text" placeholder="E.g., Summer Flash Sale" />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Promo Code</label>
                                    <input type="text" placeholder="E.g., SUMMER50" />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Discount Type</label>
                                    <select>
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount (₱)</option>
                                        <option value="bogo">Buy 1 Get 1</option>
                                        <option value="free">Free Delivery</option>
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Discount Amount</label>
                                    <input type="number" placeholder="E.g., 50" />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Start Date</label>
                                    <input type="date" />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>End Date</label>
                                    <input type="date" />
                                </div>
                            </div>
                            <div className={styles.formActions}>
                                <button className={styles.cancelBtn} onClick={() => setShowForm(false)}>Cancel</button>
                                <button className={styles.saveBtn}>Save Promotion</button>
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
                                <tr key={promo.id}>
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
                                    <td className={styles.actionCell}>
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
        </div>
    );
}
