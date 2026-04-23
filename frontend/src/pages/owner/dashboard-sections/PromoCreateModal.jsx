import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import styles from '../OwnerDashboard.module.css';

function PromoCreateModal({ onClose, onSave, isSubmitting }) {
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        discount_type: 'percentage',
        discount_value: '',
        minimum_order_value: '',
        start_date: '',
        end_date: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        if (!formData.name || !formData.code || !formData.discount_value || !formData.start_date || !formData.end_date) {
            alert('Please fill out all required fields.');
            return;
        }
        onSave(formData);
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h3 className={styles.modalTitle}>Create New Promotion</h3>
                    <button className={styles.modalCloseBtn} onClick={onClose} disabled={isSubmitting}>
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.formSection}>
                        <h4 className={styles.formSectionTitle}>Promotion Details</h4>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Name of Promotion</label>
                                <input type="text" name="name" className={styles.formInput} placeholder="e.g. Summer Pizza Party" value={formData.name} onChange={handleChange} />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Promo Code <span style={{ color: '#991B1B' }}>*</span></label>
                                <input type="text" name="code" className={styles.formInput} placeholder="e.g. SUMMER20" style={{ textTransform: 'uppercase' }} value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} />
                            </div>
                        </div>
                        <div className={styles.formRow} style={{ marginTop: '1rem' }}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Promotion Type</label>
                                <select name="discount_type" className={styles.formSelect} value={formData.discount_type} onChange={handleChange}>
                                    <option value="percentage">Percentage Off (%)</option>
                                    <option value="fixed">Fixed Amount ($)</option>
                                    <option value="free_delivery">Free Delivery</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>
                                    {formData.discount_type === 'percentage' ? 'Percentage %' : 'Value $'}
                                </label>
                                <div className={styles.inputWithPrefix}>
                                    <span className={styles.inputPrefix}>
                                        {formData.discount_type === 'percentage' ? '%' : '$'}
                                    </span>
                                    <input type="number" name="discount_value" className={styles.formInput} placeholder="0" value={formData.discount_value} onChange={handleChange} disabled={formData.discount_type === 'free_delivery'} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.formSection}>
                        <h4 className={styles.formSectionTitle}>Configuration</h4>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Minimum Order Value (Optional)</label>
                                <div className={styles.inputWithPrefix}>
                                    <span className={styles.inputPrefix}>$</span>
                                    <input type="number" name="minimum_order_value" className={styles.formInput} placeholder="0.00" value={formData.minimum_order_value} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.formSection}>
                        <h4 className={styles.formSectionTitle}>Date Schedule</h4>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Start Date</label>
                                <input type="date" name="start_date" className={styles.formInput} value={formData.start_date} onChange={handleChange} />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>End Date</label>
                                <input type="date" name="end_date" className={styles.formInput} value={formData.end_date} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.modalFooter}>
                    <button className={styles.btnCancel} onClick={onClose} disabled={isSubmitting}>Cancel</button>
                    <button className={styles.btnSave} onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? <><Loader2 size={16} className="spinner" /> Saving...</> : 'Save Promotion'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PromoCreateModal;
