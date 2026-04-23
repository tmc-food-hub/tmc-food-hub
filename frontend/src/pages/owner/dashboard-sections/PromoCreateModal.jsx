import React, { useState } from 'react';
import { X, Loader2, Zap } from 'lucide-react';
import styles from '../OwnerDashboard.module.css';

function PromoCreateModal({ onClose, onSave, isSubmitting }) {
    const now = new Date();
    const nowStr = now.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
    const endDefault = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16);

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        discount_type: 'percentage',
        discount_value: '',
        minimum_order_value: '',
        start_date: nowStr,
        end_date: endDefault,
        activate_now: true,
        status: 'active',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleActivateNow = () => {
        setFormData(prev => {
            const next = { ...prev, activate_now: !prev.activate_now };
            if (next.activate_now) {
                // Set start to right now
                const n = new Date();
                next.start_date = n.toISOString().slice(0, 16);
                next.status = 'active';
            } else {
                next.status = 'scheduled';
            }
            return next;
        });
    };

    const handleSubmit = () => {
        if (!formData.name || !formData.code || !formData.end_date) {
            alert('Please fill out all required fields.');
            return;
        }
        if (formData.discount_type !== 'free_delivery' && !formData.discount_value) {
            alert('Please enter a discount value.');
            return;
        }

        const payload = {
            name: formData.name,
            code: formData.code,
            discount_type: formData.discount_type,
            discount_value: formData.discount_type === 'free_delivery' ? 0 : Number(formData.discount_value),
            minimum_order_value: formData.minimum_order_value ? Number(formData.minimum_order_value) : null,
            start_date: formData.activate_now ? new Date().toISOString() : formData.start_date,
            end_date: formData.end_date,
            status: formData.activate_now ? 'active' : 'scheduled',
        };
        onSave(payload);
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
                                    {formData.discount_type === 'percentage' ? 'Percentage %' : formData.discount_type === 'free_delivery' ? 'Value' : 'Value $'}
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
                        <h4 className={styles.formSectionTitle}>Schedule</h4>

                        {/* Activate Now toggle */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', padding: '0.75rem 1rem', borderRadius: '10px', background: formData.activate_now ? '#FEF2F2' : '#F9FAFB', border: `1px solid ${formData.activate_now ? '#FECACA' : '#E5E7EB'}`, cursor: 'pointer', transition: 'all 0.2s' }} onClick={toggleActivateNow}>
                            <div style={{ width: '40px', height: '22px', borderRadius: '11px', background: formData.activate_now ? '#991B1B' : '#D1D5DB', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '2px', left: formData.activate_now ? '20px' : '2px', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: formData.activate_now ? '#991B1B' : '#374151', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <Zap size={14} /> Activate Now
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.15rem' }}>
                                    {formData.activate_now ? 'Promotion will be active immediately' : 'Schedule for a future date and time'}
                                </div>
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Start Date & Time</label>
                                <input
                                    type="datetime-local"
                                    name="start_date"
                                    className={styles.formInput}
                                    value={formData.start_date}
                                    onChange={handleChange}
                                    disabled={formData.activate_now}
                                    style={formData.activate_now ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>End Date & Time</label>
                                <input
                                    type="datetime-local"
                                    name="end_date"
                                    className={styles.formInput}
                                    value={formData.end_date}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.modalFooter}>
                    <button className={styles.btnCancel} onClick={onClose} disabled={isSubmitting}>Cancel</button>
                    <button className={styles.btnSave} onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? <><Loader2 size={16} className="spinner" /> Saving...</> : formData.activate_now ? '🚀 Activate Now' : 'Schedule Promotion'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PromoCreateModal;
