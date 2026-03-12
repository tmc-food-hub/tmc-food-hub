import React, { useState } from 'react';
import { Plus, Search, Tag, Calendar, Edit2, Trash2 } from 'lucide-react';
import styles from '../OwnerDashboard.module.css';
import PromoCreateModal from './PromoCreateModal';
import PromoStatusDialog from './PromoStatusDialog';

const MOCK_PROMOTIONS = [
    {
        id: 1,
        name: 'Lunch Rush Special',
        appliesTo: 'All Lunch Bowls',
        type: 'Percentage Off (%)',
        value: '20% Off',
        validDates: 'Mar 2 - Mar 6, 2026',
        status: 'Active'
    },
    {
        id: 2,
        name: 'Weekend Feast',
        appliesTo: 'Fixed $5 Off',
        type: 'Fixed Amount ($)',
        value: 'Fixed $5 Off',
        validDates: 'Mar 9 - Mar 13, 2026',
        status: 'Active'
    },
    {
        id: 3,
        name: 'BOGO Burger Day',
        appliesTo: 'Premium Burgers',
        type: 'Buy 1 Get 1 (BOGO)',
        value: 'Buy 1, Get 1',
        validDates: 'Mar 8, 2026',
        status: 'Scheduled'
    },
    {
        id: 4,
        name: 'Free Delivery Monday',
        appliesTo: 'Orders > $30.00',
        type: 'Free Delivery',
        value: 'Free Delivery',
        validDates: 'Feb 23, 2026',
        status: 'Expired'
    }
];

function PromotionsSection() {
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [showErrorDialog, setShowErrorDialog] = useState(false);

    const tabs = ['All', 'Active', 'Scheduled', 'Expired'];

    const filteredPromotions = MOCK_PROMOTIONS.filter(promo => {
        const matchesTab = activeTab === 'All' || promo.status === activeTab;
        const matchesSearch = promo.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const handleSavePromotion = () => {
        // Mock save action
        console.log("Saving new promotion...");
        setShowCreateModal(false);
        // Show success exactly like the design
        setShowSuccessDialog(true);
    };

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
                            placeholder="Search items..."
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
                    <div className={styles.metricLabel}>Avg. Promotion Conversion</div>
                    <div className={styles.metricValue}>24.5%</div>
                    <div className={styles.metricTrendPositive}>+2.4% vs last month</div>
                </div>
                <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Promo-Assisted Sales</div>
                    <div className={styles.metricValue}>$124,500</div>
                    <div className={styles.metricSubtext}>Current active campaigns</div>
                </div>
                <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Redeemed Today</div>
                    <div className={styles.metricValue}>142</div>
                    <div className={styles.metricSubtext}>Peak hour approaching</div>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Promotion Name</th>
                            <th>Discount Type</th>
                            <th>Valid Dates</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPromotions.map(promo => (
                            <tr key={promo.id}>
                                <td>
                                    <div className={styles.itemTitle}>{promo.name}</div>
                                    <div className={styles.itemSubtitle}>Applies to: {promo.appliesTo}</div>
                                </td>
                                <td>
                                    <span className={`${styles.discountBadge} ${styles['discount' + promo.type.split(' ')[0]]}`}>
                                        <Tag size={14} /> {promo.value}
                                    </span>
                                </td>
                                <td>
                                    <div className={styles.validDates}>{promo.validDates}</div>
                                </td>
                                <td>
                                    <span className={`${styles.statusBadge} ${styles['status' + promo.status]}`}>
                                        {promo.status}
                                    </span>
                                </td>
                                <td>
                                    <div className={styles.actionButtons}>
                                        <button className={styles.iconBtn}><Edit2 size={16} /></button>
                                        <button className={styles.iconBtn}><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredPromotions.length === 0 && (
                    <div className={styles.emptyState}>
                        <p>No promotions found.</p>
                    </div>
                )}
            </div>

            {showCreateModal && (
                <PromoCreateModal
                    onClose={() => setShowCreateModal(false)}
                    onSave={handleSavePromotion}
                />
            )}

            {showSuccessDialog && (
                <PromoStatusDialog
                    type="success"
                    title="Promotion Published!"
                    message='Your "Weekend Feast" deal is now active and visible to customers.'
                    actionText="Done"
                    onAction={() => setShowSuccessDialog(false)}
                />
            )}

            {showErrorDialog && (
                <PromoStatusDialog
                    type="error"
                    title="Failed to Create Promotion"
                    message="Something went wrong while publishing your discount. Please check your schedule dates or try again later."
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
