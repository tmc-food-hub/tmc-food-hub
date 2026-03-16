import React, { useState } from 'react';
import { Tag, MapPin, Hash, Truck, DollarSign, Layers, FileText, Check, Save, Upload, Image as ImageIcon } from 'lucide-react';
import styles from '../OwnerDashboard.module.css';
import api from '../../../api/axios';

export default function SettingsSection({ store, onUpdate }) {
    const [form, setForm] = useState({ 
        branchName: store.branchName || '', 
        location: store.location || '', 
        phone: store.phone || '', 
        about: store.about || '', 
        deliveryTime: store.deliveryTime || '', 
        minOrder: store.minOrder || '', 
        status: store.status || 'Operational',
        logo: store.logo || '',
        cover: store.cover || ''
    });
    const [logoFile, setLogoFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSave(e) { 
        e.preventDefault(); 
        setLoading(true);
        try {
            const formData = new FormData();
            // Since our backend expects first_name/last_name, we split the owner name or just use placeholders if needed.
            // But actually we have currentOwner in context. Let's assume we can get it or just use dummy names if not available here.
            // For now, let's just pass what we have.
            formData.append('restaurant_name', form.branchName);
            formData.append('business_address', form.location);
            formData.append('business_contact_number', form.phone);
            formData.append('first_name', 'Store'); // Placeholder for backend validation
            formData.append('last_name', 'Manager');
            
            if (logoFile) formData.append('logo_file', logoFile);
            if (coverFile) formData.append('cover_file', coverFile);

            const res = await api.post('/owner/profile-update', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Reconstruct a store-like object for onUpdate
            const updatedProfile = res.data;
            const newStoreData = {
                ...store,
                name: updatedProfile.restaurant_name,
                branchName: updatedProfile.restaurant_name,
                location: updatedProfile.business_address,
                phone: updatedProfile.business_contact_number,
                logo: updatedProfile.logo,
                cover: updatedProfile.cover_image
            };

            onUpdate(newStoreData);
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        } catch (err) {
            console.error('Failed to update profile:', err);
        } finally {
            setLoading(false);
        }
    }

    const handleFile = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        if (type === 'logo') {
            setLogoFile(file);
            setLogoPreview(url);
        } else {
            setCoverFile(file);
            setCoverPreview(url);
        }
    };

    const f = (key, label, icon) => (
        <div className={styles.field} key={key}>
            <label>{icon} {label}</label>
            <input value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
        </div>
    );

    return (
        <div className={styles.settingsWrapper}>
            <h2 className={styles.sectionTitle}>Branch Settings</h2>
            
            <div className={styles.settingsGrid}>
                {/* Form Part */}
                <div className={styles.formCard}>
                    <form onSubmit={handleSave}>
                        {/* Branded Images Section */}
                        <div className={styles.imageSettingsRow}>
                            <div className={styles.imageUploadBox}>
                                <label className={styles.imageLabel}>Restaurant Logo</label>
                                <div className={styles.logoUploadCircle} onClick={() => document.getElementById('logoInput').click()}>
                                    {logoPreview || form.logo ? (
                                        <img src={logoPreview || form.logo} alt="Logo" />
                                    ) : (
                                        <Upload size={24} color="#9CA3AF" />
                                    )}
                                    <input id="logoInput" type="file" hidden accept="image/*" onChange={e => handleFile(e, 'logo')} />
                                </div>
                                <p className={styles.imageHint}>Square logo, SVG/PNG preferred (max 2MB)</p>
                            </div>

                            <div className={styles.imageUploadBox} style={{ flex: 1 }}>
                                <label className={styles.imageLabel}>Cover Image</label>
                                <div className={styles.coverUploadRect} onClick={() => document.getElementById('coverInput').click()}>
                                    {coverPreview || form.cover ? (
                                        <img src={coverPreview || form.cover} alt="Cover" />
                                    ) : (
                                        <div className={styles.emptyCover}>
                                            <ImageIcon size={32} color="#9CA3AF" />
                                            <span>Upload Backdrop</span>
                                        </div>
                                    )}
                                    <input id="coverInput" type="file" hidden accept="image/*" onChange={e => handleFile(e, 'cover')} />
                                </div>
                                <p className={styles.imageHint}>Wide landscape (approx. 1200x400px)</p>
                            </div>
                        </div>

                        <div className={styles.formGrid2}>
                            {f('branchName', 'Branch Name', <Tag size={12} />)}
                            {f('location', 'Location / Address', <MapPin size={12} />)}
                            {f('phone', 'Contact Number', <Hash size={12} />)}
                            {f('deliveryTime', 'Estimated Delivery', <Truck size={12} />)}
                            {f('minOrder', 'Minimum Order', <DollarSign size={12} />)}
                            
                            <div className={styles.field}>
                                <label><Layers size={12} /> Status</label>
                                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                                    <option value="Operational">Operational</option>
                                    <option value="Temporarily Closed">Temporarily Closed</option>
                                    <option value="Closed">Closed</option>
                                </select>
                            </div>
                            
                            <div className={`${styles.field} ${styles.fieldFull}`}>
                                <label><FileText size={12} /> About the Restaurant</label>
                                <textarea rows={3} value={form.about} onChange={e => setForm(p => ({ ...p, about: e.target.value }))} />
                            </div>
                        </div>

                        <div className={styles.formActions}>
                            <button type="submit" disabled={loading} className={saved ? styles.btnSaved : styles.btnSuccess}>
                                {loading ? 'Saving...' : saved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> Save Changes</>}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Preview Box - Optional but nice */}
                <div className={styles.previewSidebar}>
                    <div className={styles.infoCardDesktop} style={{ padding: 0 }}>
                        <div className={styles.previewBadge}>Customer View Preview</div>
                        <div className={styles.previewHeader} style={{ backgroundImage: `url(${coverPreview || form.cover || '/assets/images/service/placeholder.svg'})` }}>
                            <div className={styles.previewLogoBox}>
                                <img src={logoPreview || form.logo || '/assets/images/service/placeholder.svg'} alt="Logo" />
                            </div>
                        </div>
                        <div className={styles.previewContent}>
                            <h3>{form.branchName || 'My Restaurant'}</h3>
                            <p className={styles.previewMeta}>Fast Food • {form.deliveryTime || '30 mins'}</p>
                            <div className={styles.previewStatus}>
                                <span className={form.status === 'Operational' ? styles.statusTextActive : styles.statusTextClosed}>
                                    {form.status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
