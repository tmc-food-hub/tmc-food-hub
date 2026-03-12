import React from 'react';
import { X } from 'lucide-react';
import styles from '../OwnerDashboard.module.css';

function PromoCreateModal({ onClose, onSave }) {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h3 className={styles.modalTitle}>Create New Promotion</h3>
                    <button className={styles.modalCloseBtn} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.modalBody}>
                    {/* Promotion Details */}
                    <div className={styles.formSection}>
                        <h4 className={styles.formSectionTitle}>Promotion Details</h4>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Name of Promotion</label>
                                <input type="text" className={styles.formInput} placeholder="e.g. Summer Pizza Party" />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Promotion Type</label>
                                <select className={styles.formSelect}>
                                    <option>Percentage Off (%)</option>
                                    <option>Fixed Amount ($)</option>
                                    <option>Buy 1 Get 1 (BOGO)</option>
                                    <option>Free Delivery</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Discount Configuration */}
                    <div className={styles.formSection}>
                        <h4 className={styles.formSectionTitle}>Discount Configuration</h4>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Discount Value</label>
                                <div className={styles.inputWithPrefix}>
                                    <span className={styles.inputPrefix}>$</span>
                                    <input type="number" className={styles.formInput} placeholder="0.00" />
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Minimum Order Value</label>
                                <div className={styles.inputWithPrefix}>
                                    <span className={styles.inputPrefix}>$</span>
                                    <input type="number" className={styles.formInput} placeholder="250.00" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Applicability */}
                    <div className={styles.formSection}>
                        <h4 className={styles.formSectionTitle}>Applicability</h4>
                        <div className={styles.radioGroup}>
                            <label className={styles.radioLabel}>
                                <input type="radio" name="applicability" defaultChecked />
                                <span>All Menu Items</span>
                            </label>
                            <label className={styles.radioLabel}>
                                <input type="radio" name="applicability" />
                                <span>Specific Categories/Items</span>
                            </label>
                        </div>
                    </div>

                    {/* Date Schedule */}
                    <div className={styles.formSection}>
                        <h4 className={styles.formSectionTitle}>Date Schedule</h4>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Start Date</label>
                                <input type="date" className={styles.formInput} />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>End Date</label>
                                <input type="date" className={styles.formInput} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.modalFooter}>
                    <button className={styles.btnCancel} onClick={onClose}>Cancel</button>
                    <button className={styles.btnSave} onClick={onSave}>Save Promotion</button>
                </div>
            </div>
        </div>
    );
}

export default PromoCreateModal;
