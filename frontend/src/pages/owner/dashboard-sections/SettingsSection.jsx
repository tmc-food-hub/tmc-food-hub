import React, { useState, useRef } from 'react';
import {
    User, Shield, Bell, Store, CreditCard,
    Camera, CheckCircle2, AlertCircle, X, Plus, MapPin,
    Mail, Phone, Save, Check
} from 'lucide-react';
import styles from './SettingsSection.module.css';
import api from '../../../api/axios';

const SETTINGS_TABS = [
    { key: 'account', label: 'Account', icon: <User size={16} /> },
    { key: 'security', label: 'Security Settings', icon: <Shield size={16} /> },
    { key: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
    { key: 'store-operations', label: 'Store Operations', icon: <Store size={16} /> },
    { key: 'payment', label: 'Payment', icon: <CreditCard size={16} /> },
];

export default function SettingsSection({ store, onUpdate, currentOwner, refreshOwner }) {
    const [activeTab, setActiveTab] = useState('account');

    return (
        <div className={styles.settingsLayout}>
            {/* Sub-tab sidebar */}
            <div className={styles.settingsSidebar}>
                {SETTINGS_TABS.map(tab => (
                    <button
                        key={tab.key}
                        className={`${styles.settingsTabBtn} ${activeTab === tab.key ? styles.settingsTabBtnActive : ''}`}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        <span className={styles.settingsTabIcon}>{tab.icon}</span>
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className={styles.settingsContent}>
                {activeTab === 'account' && <AccountTab store={store} onUpdate={onUpdate} refreshOwner={refreshOwner} />}
                {activeTab === 'security' && <PlaceholderTab title="Security Settings" description="Manage your password, two-factor authentication, and login sessions." />}
                {activeTab === 'notifications' && <PlaceholderTab title="Notifications" description="Configure your notification preferences for orders, promotions, and system alerts." />}
                {activeTab === 'store-operations' && <StoreOperationsTab store={store} onUpdate={onUpdate} refreshOwner={refreshOwner} />}
                {activeTab === 'payment' && <PlaceholderTab title="Payment" description="Manage payment methods and billing information." />}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  ACCOUNT TAB (Pic 1)                                                      */
/* ═══════════════════════════════════════════════════════════════════════════ */
function AccountTab({ store, onUpdate, refreshOwner }) {
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [form, setForm] = useState({
        firstName: store.firstName || '',
        lastName: store.lastName || '',
    });
    const avatarRef = useRef(null);

    const fullName = `${store.firstName || ''} ${store.lastName || ''}`.trim() || 'Owner';
    const role = 'Restaurant Owner';

    const handleSave = async () => {
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('first_name', form.firstName);
            formData.append('last_name', form.lastName);
            formData.append('restaurant_name', store.branchName);
            formData.append('business_address', store.location);
            formData.append('business_contact_number', store.phone || '');

            await api.post('/owner/profile-update', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (refreshOwner) await refreshOwner();
            setSaved(true);
            setEditing(false);
            setTimeout(() => setSaved(false), 2500);
        } catch (err) {
            console.error('Failed to update profile:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('first_name', store.firstName);
        formData.append('last_name', store.lastName);
        formData.append('restaurant_name', store.branchName);
        formData.append('business_address', store.location);
        formData.append('business_contact_number', store.phone || '');
        formData.append('logo_file', file);

        try {
            await api.post('/owner/profile-update', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (refreshOwner) await refreshOwner();
        } catch (err) {
            console.error('Failed to upload avatar:', err);
        }
    };

    return (
        <>
            {/* Profile Header */}
            <div className={styles.card}>
                <div className={styles.profileHeader}>
                    <div className={styles.avatarUploadWrapper} onClick={() => avatarRef.current?.click()}>
                        {store.logo ? (
                            <img src={store.logo} alt={fullName} className={styles.avatar} />
                        ) : (
                            <div className={styles.avatar}>{fullName.charAt(0)}</div>
                        )}
                        <input ref={avatarRef} type="file" accept="image/*" onChange={handleAvatarChange} />
                    </div>
                    <div className={styles.profileInfo}>
                        <h3 className={styles.profileName}>{fullName}</h3>
                        <p className={styles.profileRole}>{role}</p>
                        <p className={styles.profileEmail}>{store.email}</p>
                    </div>
                    <button className={styles.changeImageBtn} onClick={() => avatarRef.current?.click()}>
                        Change Image
                    </button>
                </div>
            </div>

            {/* Personal Information */}
            <div className={styles.card}>
                <h3 className={styles.cardTitle}>Personal Information</h3>
                <div className={styles.formGrid}>
                    <div className={styles.field}>
                        <label className={styles.fieldLabel}>Full Name</label>
                        {editing ? (
                            <input
                                className={styles.fieldInput}
                                value={`${form.firstName} ${form.lastName}`}
                                onChange={e => {
                                    const parts = e.target.value.split(' ');
                                    setForm(p => ({
                                        ...p,
                                        firstName: parts[0] || '',
                                        lastName: parts.slice(1).join(' ') || ''
                                    }));
                                }}
                            />
                        ) : (
                            <input className={styles.fieldInput} value={fullName} disabled />
                        )}
                    </div>
                    <div className={styles.field}>
                        <label className={styles.fieldLabel}>Role</label>
                        <input className={styles.fieldInput} value={role} disabled />
                    </div>
                </div>
                <div className={styles.formActions}>
                    {editing ? (
                        <>
                            <button className={styles.btnCancel} onClick={() => { setEditing(false); setForm({ firstName: store.firstName || '', lastName: store.lastName || '' }); }}>Cancel</button>
                            <button className={styles.btnSave} disabled={saving} onClick={handleSave}>
                                {saving ? 'Saving...' : <><Save size={14} /> Save Changes</>}
                            </button>
                        </>
                    ) : (
                        <>
                            <button className={styles.btnCancel} onClick={() => setEditing(false)}>Cancel</button>
                            <button className={styles.btnSave} onClick={() => setEditing(true)}>
                                <Save size={14} /> Save Changes
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Contact Information */}
            <div className={styles.card}>
                <h3 className={styles.cardTitle}>Contact Information</h3>
                <div className={styles.contactRow}>
                    <div className={styles.contactLeft}>
                        <span className={styles.contactLabel}>Email</span>
                        <div className={styles.contactValueRow}>
                            <span className={styles.contactValue}>{store.email}</span>
                            {store.emailVerifiedAt ? (
                                <span className={`${styles.verifiedBadge} ${styles.verifiedBadgeGreen}`}>
                                    <CheckCircle2 size={12} /> Verified
                                </span>
                            ) : (
                                <span className={`${styles.verifiedBadge} ${styles.verifiedBadgeOrange}`}>
                                    <AlertCircle size={12} /> Not Verified
                                </span>
                            )}
                        </div>
                    </div>
                    <button className={styles.changeLink}>Change Email</button>
                </div>
                <div className={styles.cardDivider} />
                <div className={styles.contactRow}>
                    <div className={styles.contactLeft}>
                        <span className={styles.contactLabel}>Phone Number</span>
                        <div className={styles.contactValueRow}>
                            <span className={styles.contactValue}>{store.personalPhone || store.phone || 'Not set'}</span>
                            {store.personalPhone ? (
                                <span className={`${styles.verifiedBadge} ${styles.verifiedBadgeOrange}`}>
                                    <AlertCircle size={12} /> Not Verified
                                </span>
                            ) : null}
                        </div>
                    </div>
                    <button className={styles.changeLink}>Change Phone</button>
                </div>
            </div>

            {/* Linked Accounts */}
            <div className={styles.card}>
                <h3 className={styles.cardTitle}>Linked Accounts</h3>
                <div className={styles.linkedAccountRow}>
                    <div className={`${styles.linkedIcon} ${styles.linkedIconGoogle}`}>G</div>
                    <div className={styles.linkedInfo}>
                        <div className={styles.linkedName}>Google</div>
                        <div className={styles.linkedStatus}>Not Connected</div>
                    </div>
                    <button className={`${styles.btnConnect} ${styles.btnConnectGreen}`}>Connect</button>
                </div>
                <div className={styles.linkedAccountRow}>
                    <div className={`${styles.linkedIcon} ${styles.linkedIconFacebook}`}>f</div>
                    <div className={styles.linkedInfo}>
                        <div className={styles.linkedName}>Facebook</div>
                        <div className={styles.linkedStatus}>Not Connected</div>
                    </div>
                    <button className={`${styles.btnConnect} ${styles.btnConnectGreen}`}>Connect</button>
                </div>
            </div>

            {/* Deactivate / Delete */}
            <div className={styles.dangerCard}>
                <div className={styles.dangerInfo}>
                    <div className={styles.dangerTitle}>Deactivate account</div>
                    <div className={styles.dangerDesc}>Temporarily hide your restaurant and profile from the platform.</div>
                </div>
                <button className={styles.btnDeactivate}>Deactivate</button>
            </div>

            <div className={styles.dangerCard}>
                <div className={styles.dangerInfo}>
                    <div className={styles.dangerTitle}>Request account deletion</div>
                    <div className={styles.dangerDesc}>Permanently remove all your data and access. This cannot be undone.</div>
                </div>
                <button className={styles.btnDelete}>Delete Account</button>
            </div>

            {saved && (
                <div className={styles.savedToast}>
                    <Check size={16} /> Profile updated successfully!
                </div>
            )}
        </>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  STORE OPERATIONS TAB — Restaurant Profile (Pics 2 & 3)                   */
/* ═══════════════════════════════════════════════════════════════════════════ */
function StoreOperationsTab({ store, onUpdate, refreshOwner }) {
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [saved, setSaved] = useState(false);

    const cuisines = store.cuisineType || [];
    const priceRange = store.priceRange || '';
    const brn = store.businessRegistrationNumber || '';

    const googleMapsUrl = store.location
        ? `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(store.location)}&zoom=14&size=400x200&key=DEMO`
        : null;

    return (
        <>
            {/* Restaurant Header */}
            <div className={styles.card}>
                <div className={styles.restaurantHeader}>
                    <div className={styles.restaurantHeaderLeft}>
                        {store.logo ? (
                            <img src={store.logo} alt={store.branchName} className={styles.restaurantLogo} />
                        ) : (
                            <div className={styles.restaurantLogoPlaceholder}>
                                {(store.branchName || 'R').charAt(0)}
                            </div>
                        )}
                        <div className={styles.restaurantMeta}>
                            {cuisines.length > 0 && (
                                <span className={styles.restaurantCuisineLabel}>
                                    {cuisines.join(' • ')}
                                </span>
                            )}
                            <h3 className={styles.restaurantName}>{store.branchName || 'My Restaurant'}</h3>
                        </div>
                    </div>
                    <button className={styles.btnEditProfile} onClick={() => setEditModalOpen(true)}>
                        Edit Profile
                    </button>
                </div>
            </div>

            {/* Info Sections */}
            <div className={styles.card}>
                <div className={styles.infoSectionsGrid}>
                    {/* Restaurant Information */}
                    <div className={styles.infoSection}>
                        <div className={styles.infoSectionHeader}>
                            <span className={styles.infoSectionIcon}><Store size={16} /></span>
                            Restaurant Information
                        </div>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Restaurant Name</span>
                                <input className={styles.infoValueInput} value={store.branchName || ''} disabled />
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Business Registration Number</span>
                                <input className={styles.infoValueInput} value={brn || 'Not set'} disabled />
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Cuisine Type</span>
                                <div className={styles.cuisineTags}>
                                    {cuisines.length > 0 ? cuisines.map((c, i) => (
                                        <span key={i} className={styles.cuisineTag}>{c}</span>
                                    )) : <span style={{ fontSize: '0.82rem', color: '#9CA3AF' }}>Not set</span>}
                                </div>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Price Range</span>
                                <div className={styles.priceRangePills}>
                                    {['₱', '₱₱', '₱₱₱', '₱₱₱₱'].map(p => (
                                        <span
                                            key={p}
                                            className={`${styles.priceRangePill} ${priceRange === p ? styles.priceRangePillActive : ''}`}
                                        >
                                            {p}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className={styles.infoSection}>
                        <div className={styles.infoSectionHeader}>
                            <span className={styles.infoSectionIcon}><Mail size={16} /></span>
                            Contact Information
                        </div>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Email</span>
                                <input className={styles.infoValueInput} value={store.email || ''} disabled />
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Phone Number</span>
                                <input className={styles.infoValueInput} value={store.phone || 'Not set'} disabled />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Restaurant Location */}
            <div className={styles.card}>
                <div className={styles.locationSection}>
                    <div className={styles.locationHeader}>
                        <span className={styles.infoSectionIcon}><MapPin size={16} /></span>
                        Restaurant Location
                    </div>
                    <div className={styles.locationContent}>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>Address</span>
                            <p className={styles.addressText}>{store.location || 'No address set'}</p>
                        </div>
                        <div className={styles.mapPlaceholder}>
                            {store.location ? (
                                <>
                                    <iframe
                                        title="Restaurant Location"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        loading="lazy"
                                        src={`https://maps.google.com/maps?q=${encodeURIComponent(store.location)}&output=embed`}
                                    />
                                    <a
                                        className={styles.viewOnMap}
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.location)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        View on Map
                                    </a>
                                </>
                            ) : (
                                <span>No location set</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {editModalOpen && (
                <EditRestaurantModal
                    store={store}
                    onClose={() => setEditModalOpen(false)}
                    onSaved={() => {
                        setSaved(true);
                        setTimeout(() => setSaved(false), 2500);
                    }}
                    refreshOwner={refreshOwner}
                />
            )}

            {saved && (
                <div className={styles.savedToast}>
                    <Check size={16} /> Restaurant profile updated!
                </div>
            )}
        </>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  EDIT RESTAURANT PROFILE MODAL (Pic 3)                                    */
/* ═══════════════════════════════════════════════════════════════════════════ */
function EditRestaurantModal({ store, onClose, onSaved, refreshOwner }) {
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        restaurantName: store.branchName || '',
        businessRegistrationNumber: store.businessRegistrationNumber || '',
        cuisineType: store.cuisineType || [],
        priceRange: store.priceRange || '',
        email: store.email || '',
        phone: store.phone || '',
        address: store.location || '',
    });
    const [newCuisine, setNewCuisine] = useState('');
    const [showCuisineInput, setShowCuisineInput] = useState(false);
    const logoRef = useRef(null);
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setLogoFile(file);
        setLogoPreview(URL.createObjectURL(file));
    };

    const addCuisine = () => {
        const val = newCuisine.trim();
        if (val && !form.cuisineType.includes(val)) {
            setForm(p => ({ ...p, cuisineType: [...p.cuisineType, val] }));
        }
        setNewCuisine('');
        setShowCuisineInput(false);
    };

    const removeCuisine = (idx) => {
        setForm(p => ({ ...p, cuisineType: p.cuisineType.filter((_, i) => i !== idx) }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('first_name', store.firstName || 'Store');
            formData.append('last_name', store.lastName || 'Manager');
            formData.append('restaurant_name', form.restaurantName);
            formData.append('business_address', form.address);
            formData.append('business_contact_number', form.phone);
            formData.append('business_registration_number', form.businessRegistrationNumber);
            formData.append('price_range', form.priceRange);

            // Send cuisine_type as array items
            form.cuisineType.forEach((c, i) => {
                formData.append(`cuisine_type[${i}]`, c);
            });

            if (logoFile) {
                formData.append('logo_file', logoFile);
            }

            await api.post('/owner/profile-update', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (refreshOwner) await refreshOwner();
            onSaved();
            onClose();
        } catch (err) {
            console.error('Failed to update restaurant profile:', err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Edit Restaurant Profile</h2>
                    <button className={styles.modalCloseBtn} onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <div className={styles.modalBody}>
                    {/* Restaurant Information */}
                    <div className={styles.modalSection}>
                        <h4 className={styles.modalSectionTitle}>Restaurant Information</h4>
                        <div className={styles.modalLogoRow}>
                            <div onClick={() => logoRef.current?.click()} style={{ cursor: 'pointer' }}>
                                {logoPreview || store.logo ? (
                                    <img src={logoPreview || store.logo} alt="Logo" className={styles.modalLogoPreview} />
                                ) : (
                                    <div className={styles.modalLogoPlaceholder}>
                                        {(form.restaurantName || 'R').charAt(0)}
                                    </div>
                                )}
                                <input ref={logoRef} type="file" hidden accept="image/*" onChange={handleLogoChange} />
                            </div>
                            <div className={styles.modalFormGrid} style={{ flex: 1 }}>
                                <div className={styles.field}>
                                    <label className={styles.fieldLabel}>Restaurant Name</label>
                                    <input
                                        className={styles.fieldInput}
                                        value={form.restaurantName}
                                        onChange={e => setForm(p => ({ ...p, restaurantName: e.target.value }))}
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label className={styles.fieldLabel}>Business Registration Number</label>
                                    <input
                                        className={styles.fieldInput}
                                        value={form.businessRegistrationNumber}
                                        onChange={e => setForm(p => ({ ...p, businessRegistrationNumber: e.target.value }))}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Cuisine Type */}
                        <div className={styles.field}>
                            <label className={styles.fieldLabel}>Cuisine Type</label>
                            <div className={styles.modalCuisineRow}>
                                {form.cuisineType.map((c, i) => (
                                    <span key={i} className={styles.cuisineTagRemovable} onClick={() => removeCuisine(i)}>
                                        {c} <X size={10} />
                                    </span>
                                ))}
                                {showCuisineInput ? (
                                    <div className={styles.cuisineInputWrapper}>
                                        <input
                                            className={styles.cuisineInput}
                                            value={newCuisine}
                                            onChange={e => setNewCuisine(e.target.value)}
                                            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCuisine(); } }}
                                            placeholder="e.g. Italian"
                                            autoFocus
                                        />
                                        <button className={styles.addCuisineBtn} onClick={addCuisine} type="button">
                                            <Check size={10} />
                                        </button>
                                        <button className={styles.addCuisineBtn} onClick={() => { setShowCuisineInput(false); setNewCuisine(''); }} type="button">
                                            <X size={10} />
                                        </button>
                                    </div>
                                ) : (
                                    <button className={styles.addCuisineBtn} onClick={() => setShowCuisineInput(true)} type="button">
                                        <Plus size={10} /> Add Cuisine
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Price Range */}
                        <div className={styles.field}>
                            <label className={styles.fieldLabel}>Price Range</label>
                            <div className={styles.priceRangePills}>
                                {['₱', '₱₱', '₱₱₱', '₱₱₱₱'].map(p => (
                                    <button
                                        key={p}
                                        type="button"
                                        className={`${styles.priceRangePill} ${form.priceRange === p ? styles.priceRangePillActive : ''}`}
                                        onClick={() => setForm(prev => ({ ...prev, priceRange: p }))}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className={styles.modalSection}>
                        <h4 className={styles.modalSectionTitle}>Contact Information</h4>
                        <div className={styles.contactRow}>
                            <div className={styles.contactLeft}>
                                <span className={styles.contactLabel}>Email</span>
                                <div className={styles.contactValueRow}>
                                    <span className={styles.contactValue}>{form.email}</span>
                                    {store.emailVerifiedAt ? (
                                        <span className={`${styles.verifiedBadge} ${styles.verifiedBadgeGreen}`}>
                                            <CheckCircle2 size={12} /> Verified
                                        </span>
                                    ) : (
                                        <span className={`${styles.verifiedBadge} ${styles.verifiedBadgeOrange}`}>
                                            <AlertCircle size={12} /> Not Verified
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button className={styles.changeLink}>Change Email</button>
                        </div>
                        <div className={styles.cardDivider} />
                        <div className={styles.contactRow}>
                            <div className={styles.contactLeft}>
                                <span className={styles.contactLabel}>Phone Number</span>
                                <div className={styles.contactValueRow}>
                                    <span className={styles.contactValue}>{form.phone || 'Not set'}</span>
                                    <span className={`${styles.verifiedBadge} ${styles.verifiedBadgeOrange}`}>
                                        <AlertCircle size={12} /> Not Verified
                                    </span>
                                </div>
                            </div>
                            <button className={styles.changeLink}>Change Phone</button>
                        </div>
                    </div>

                    {/* Restaurant Location */}
                    <div className={styles.modalSection}>
                        <h4 className={styles.modalSectionTitle}>Restaurant Location</h4>
                        <div className={styles.field}>
                            <label className={styles.fieldLabel}>Address</label>
                            <input
                                className={styles.fieldInput}
                                value={form.address}
                                onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                            />
                        </div>
                        {form.address && (
                            <div className={styles.mapPlaceholder}>
                                <iframe
                                    title="Location Preview"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    src={`https://maps.google.com/maps?q=${encodeURIComponent(form.address)}&output=embed`}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.modalFooter}>
                    <button className={styles.btnCancel} onClick={onClose}>Cancel</button>
                    <button className={styles.btnSave} disabled={saving} onClick={handleSave}>
                        {saving ? 'Saving...' : <><Save size={14} /> Save Changes</>}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  PLACEHOLDER TAB                                                          */
/* ═══════════════════════════════════════════════════════════════════════════ */
function PlaceholderTab({ title, description }) {
    return (
        <div className={styles.card}>
            <h3 className={styles.cardTitle}>{title}</h3>
            <p style={{ color: '#6B7280', fontSize: '0.88rem' }}>{description}</p>
            <p style={{ color: '#9CA3AF', fontSize: '0.82rem', marginTop: '1rem', fontStyle: 'italic' }}>
                This section is coming soon.
            </p>
        </div>
    );
}
