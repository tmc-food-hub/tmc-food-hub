import React, { useState, useEffect } from 'react';
import { Plus, Search, Tag, Calendar, Edit2, Trash2, Loader2, Power, Clock } from 'lucide-react';
import styles from '../OwnerDashboard.module.css';
import PromoCreateModal from './PromoCreateModal';
import PromoStatusDialog from './PromoStatusDialog';
import api from '../../../api/axios';

function PromotionsSection() {
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const tabs = ['All', 'Active', 'Scheduled', 'Inactive', 'Expired'];

    const fetchPromotions = async () => {
        setLoading(true);
        try {
            const res = await api.get('/owner/promotions');
            setPromotions(res.data);
        } catch (err) {
            console.error('Failed to fetch promotions', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPromotions();
    }, []);

    const filteredPromotions = promotions.filter(promo => {
        const matchesTab = activeTab === 'All' || promo.status === activeTab;
        const matchesSearch = promo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            promo.code.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const handleSavePromotion = async (data) => {
        setIsSubmitting(true);
        try {
            await api.post('/owner/promotions', data);
            await fetchPromotions();
            setShowCreateModal(false);
            setSuccessMessage(`"${data.name}" has been ${data.status === 'active' ? 'activated' : 'scheduled'} successfully!`);
            setShowSuccessDialog(true);
        } catch (err) {
            console.error('Failed to create promotion', err);
            setShowErrorDialog(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeletePromotion = async (id) => {
        if (!window.confirm('Delete this promotion?')) return;
        try {
            await api.delete(`/owner/promotions/${id}`);
            await fetchPromotions();
        } catch (err) {
            console.error('Failed to delete promotion', err);
        }
    };

    const handleToggleStatus = async (promo) => {
        const newStatus = promo.raw_status === 'active' ? 'inactive' : 'active';
        try {
            await api.put(`/owner/promotions/${promo.id}`, { status: newStatus });
            await fetchPromotions();
        } catch (err) {
            console.error('Failed to toggle promotion status', err);
        }
    };

    const activeCount = promotions.filter(p => p.status === 'Active').length;
    const scheduledCount = promotions.filter(p => p.status === 'Scheduled').length;

    return (
        <div className={styles.sectionContainer}>
            <div className={styles.sectionHeader}>
                <div>
                    <h2 className={styles.sectionTitle}>Promotions & Deals</h2>
                    <p className={styles.sectionSubtitle}>Create discounts, special deals, or limited-time offers to attract more customers.</p>
                </div>
                <div className={styles.headerActions}>
                    <div className={styles.searchWrap}>
                        <Search className={styles.searchIcon} size={16} />
                        <input
                            type="text"
                            placeholder="Search promos..."
                            className={styles.searchInput}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className={styles.notificationBtn} onClick={() => setShowCreateModal(true)}>
                        <Plus size={20} />
                    </button>
                </div>
            </div>

            <div className={styles.tabsContainer}>
                {tabs.map(tab => (
                    <button
                        key={tab}
                        className={`${styles.tabBtn} ${activeTab === tab ? styles.tabBtnActive : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className={styles.metricsGrid}>
                <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Active Promotions</div>
                    <div className={styles.metricValue}>{activeCount}</div>
                    <div className={styles.metricSubtext}>Currently running</div>
                </div>
                <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Scheduled</div>
                    <div className={styles.metricValue}>{scheduledCount}</div>
                    <div className={styles.metricSubtext}>Upcoming promotions</div>
                </div>
                <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Total Promotions</div>
                    <div className={styles.metricValue}>{promotions.length}</div>
                    <div className={styles.metricSubtext}>All time</div>
                </div>
            </div>

            {loading ? (
                <div className={styles.emptyState} style={{ padding: '3rem' }}>
                    <Loader2 size={24} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
                    <p style={{ marginTop: '0.5rem' }}>Loading promotions...</p>
                </div>
            ) : (
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Promotion</th>
                                <th>Code</th>
                                <th>Discount</th>
                                <th>Valid Period</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPromotions.map(promo => (
                                <tr key={promo.id}>
                                    <td>
                                        <div className={styles.itemTitle}>{promo.name}</div>
                                        <div className={styles.itemSubtitle}>
                                            {promo.minimum_order_value ? `Min. order: $${Number(promo.minimum_order_value).toFixed(2)}` : 'No minimum'}
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.85rem', color: '#991B1B', background: '#FEF2F2', padding: '0.25rem 0.6rem', borderRadius: '6px', border: '1px solid #FECACA' }}>
                                            {promo.code}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`${styles.discountBadge} ${styles['discount' + promo.type.split(' ')[0]]}`}>
                                            <Tag size={14} /> {promo.value}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.validDates} style={{ fontSize: '0.78rem', lineHeight: 1.4 }}>
                                            {promo.validDates}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${styles['status' + promo.status]}`}>
                                            {promo.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.actionButtons}>
                                            {(promo.status === 'Active' || promo.raw_status === 'inactive') && (
                                                <button
                                                    className={styles.iconBtn}
                                                    onClick={() => handleToggleStatus(promo)}
                                                    title={promo.raw_status === 'active' ? 'Deactivate' : 'Activate'}
                                                    style={{ color: promo.raw_status === 'active' ? '#DC2626' : '#059669' }}
                                                >
                                                    <Power size={16} />
                                                </button>
                                            )}
                                            <button className={styles.iconBtn} onClick={() => handleDeletePromotion(promo.id)}><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredPromotions.length === 0 && (
                        <div className={styles.emptyState}>
                            <p>{activeTab === 'All' ? 'No promotions yet. Create your first one!' : `No ${activeTab.toLowerCase()} promotions.`}</p>
                        </div>
                    )}
                </div>
            )}

            {showCreateModal && (
                <PromoCreateModal
                    onClose={() => setShowCreateModal(false)}
                    onSave={handleSavePromotion}
                    isSubmitting={isSubmitting}
                />
            )}

            {showSuccessDialog && (
                <PromoStatusDialog
                    type="success"
                    title="Promotion Published!"
                    message={successMessage}
                    actionText="Done"
                    onAction={() => setShowSuccessDialog(false)}
                />
            )}

            {showErrorDialog && (
                <PromoStatusDialog
                    type="error"
                    title="Failed to Create Promotion"
                    message="Something went wrong. Please check your details (promo code might already exist) and try again."
                    actionText="Try Again"
                    onAction={() => setShowErrorDialog(false)}
                    secondaryActionText="Discard"
                    onSecondaryAction={() => {
                        setShowErrorDialog(false);
                        setShowCreateModal(false);
                    }}
                />
            )}
        </div>
    );
}

export default PromotionsSection;
