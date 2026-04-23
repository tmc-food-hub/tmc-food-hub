import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
    User, Shield, Bell, Store, CreditCard, Search,
    CheckCircle2, AlertCircle, X, Save, Check,
    PauseCircle, XCircle, MapPin, Phone, Eye, EyeOff,
    Camera, ImagePlus, Star
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './SettingsSection.module.css';
import api from '../../../api/axios';
import { resolveMediaUrl } from '../../../utils/media';
import { optimizeImageFile, prepareImageUpload, revokeObjectUrl } from '../../../utils/imageUpload';
import ImageCropModal from '../../../components/ui/ImageCropModal';

// Fix Leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const SETTINGS_TABS = [
    { key: 'account', label: 'Account', icon: <User size={16} /> },
    { key: 'security', label: 'Security Settings', icon: <Shield size={16} /> },
    { key: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
    { key: 'restaurant-profile', label: 'Restaurant Profile', icon: <Store size={16} /> },
    { key: 'store-operations', label: 'Store Operations', icon: <Store size={16} /> },
    { key: 'payment', label: 'Payment', icon: <CreditCard size={16} /> },
];

function getRestaurantFallbackImage(restaurantName = '') {
    if (restaurantName.includes('Jollibee')) return '/assets/images/service/resturant_logo/jollibee.svg';
    if (restaurantName.includes("McDonald's") || restaurantName.includes('McDonald')) return '/assets/images/service/resturant_logo/mcdonald-s-7.svg';
    if (restaurantName.includes('Sushi Nori')) return '/assets/images/service/resturant_logo/sushi-nori.svg';
    if (restaurantName.includes('Mang Inasal')) return '/assets/images/service/resturant_logo/Mang_Inasal.svg';
    if (restaurantName.includes('KFC')) return '/assets/images/service/resturant_logo/KFC.svg';
    if (restaurantName.includes('Chowking')) return '/assets/images/service/resturant_logo/chowking.svg';

    return '/assets/images/service/placeholder.svg';
}

function RestaurantLogo({ src, name, className, style, size = 64 }) {
    const fallbackSrc = getRestaurantFallbackImage(name);
    const [logoSrc, setLogoSrc] = useState(resolveMediaUrl(src) || fallbackSrc);

    useEffect(() => {
        setLogoSrc(resolveMediaUrl(src) || fallbackSrc);
    }, [src, fallbackSrc]);

    return (
        <div
            style={{
                width: size,
                height: size,
                borderRadius: '50%',
                overflow: 'hidden',
                flexShrink: 0,
                ...style,
            }}
        >
            <img
                src={logoSrc}
                alt={name}
                className={className}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                loading="lazy"
                decoding="async"
                onError={() => {
                    if (logoSrc !== fallbackSrc) {
                        setLogoSrc(fallbackSrc);
                    }
                }}
            />
        </div>
    );
}

export default function SettingsSection({ store, refreshOwner, items = [], refreshInventory, activeSubTab }) {
    const [activeTab, setActiveTab] = useState(activeSubTab || 'account');

    useEffect(() => {
        if (activeSubTab) setActiveTab(activeSubTab);
    }, [activeSubTab]);

    return (
        <div className={styles.settingsLayout}>
            <div className={styles.settingsSidebar}>
                {SETTINGS_TABS.map((tab) => (
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

            <div className={styles.settingsContent}>
                {activeTab === 'account' && <AccountTab store={store} refreshOwner={refreshOwner} />}
                {activeTab === 'security' && <SecuritySettingsTab />}
                {activeTab === 'notifications' && <NotificationsTab />}
                {activeTab === 'restaurant-profile' && <RestaurantProfileTab store={store} refreshOwner={refreshOwner} />}
                {activeTab === 'store-operations' && <StoreOperationsTab store={store} items={items} refreshInventory={refreshInventory} refreshOwner={refreshOwner} />}
                {activeTab === 'payment' && <PaymentConfigTab refreshOwner={refreshOwner} />}
            </div>
        </div>
    );
}

function AccountTab({ store, refreshOwner }) {
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

            await api.post('/owner/profile-update', formData);

            await refreshOwner?.();
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
        const optimizedFile = await optimizeImageFile(file);

        const formData = new FormData();
        formData.append('first_name', store.firstName || '');
        formData.append('last_name', store.lastName || '');
        formData.append('restaurant_name', store.branchName || '');
        formData.append('business_address', store.location || '');
        formData.append('business_contact_number', store.phone || '');
        formData.append('logo_file', optimizedFile);

        try {
            await api.post('/owner/profile-update', formData);
            await refreshOwner?.();
        } catch (err) {
            console.error('Failed to upload avatar:', err);
        }
    };

    return (
        <>
            <div className={styles.card}>
                <div className={styles.profileHeader}>
                    <div className={styles.avatarUploadWrapper} onClick={() => avatarRef.current?.click()}>
                        {store.logo ? (
                            <RestaurantLogo src={store.logo} name={store.branchName || fullName} className={styles.avatar} size={72} />
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

            <div className={styles.card}>
                <h3 className={styles.cardTitle}>Personal Information</h3>
                <div className={styles.formGrid}>
                    <div className={styles.field}>
                        <label className={styles.fieldLabel}>Full Name</label>
                        {editing ? (
                            <input
                                className={styles.fieldInput}
                                value={`${form.firstName} ${form.lastName}`}
                                onChange={(e) => {
                                    const parts = e.target.value.split(' ');
                                    setForm({
                                        firstName: parts[0] || '',
                                        lastName: parts.slice(1).join(' ') || '',
                                    });
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
                            <button
                                className={styles.btnCancel}
                                onClick={() => {
                                    setEditing(false);
                                    setForm({ firstName: store.firstName || '', lastName: store.lastName || '' });
                                }}
                            >
                                Cancel
                            </button>
                            <button className={styles.btnSave} disabled={saving} onClick={handleSave}>
                                {saving ? 'Saving...' : <><Save size={14} /> Save Changes</>}
                            </button>
                        </>
                    ) : (
                        <>
                            <button className={styles.btnCancel}>Cancel</button>
                            <button className={styles.btnSave} onClick={() => setEditing(true)}>
                                <Save size={14} /> Save Changes
                            </button>
                        </>
                    )}
                </div>
            </div>

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
                        </div>
                    </div>
                    <button className={styles.changeLink}>Change Phone</button>
                </div>
            </div>

            {saved && (
                <div className={styles.savedToast}>
                    <Check size={16} /> Profile updated successfully!
                </div>
            )}
        </>
    );
}

function StoreOperationsTab({ store, items = [], refreshInventory, refreshOwner }) {
    const [restaurantStatus, setRestaurantStatus] = useState(store.operatingStatus || 'open');
    const [autoAcceptOrders, setAutoAcceptOrders] = useState(store.autoAcceptOrders ?? true);
    const [manualConfirmation, setManualConfirmation] = useState(store.manualConfirmation ?? false);
    const [prepTime, setPrepTime] = useState(store.defaultPrepTime || 15);
    const [hideModalOpen, setHideModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryBlacklist, setCategoryBlacklist] = useState(true);
    const [dialog, setDialog] = useState(null);
    const [lastAction, setLastAction] = useState(null);
    const [savingControls, setSavingControls] = useState(false);

    useEffect(() => {
        setRestaurantStatus(store.operatingStatus || 'open');
        setAutoAcceptOrders(store.autoAcceptOrders ?? true);
        setManualConfirmation(store.manualConfirmation ?? false);
        setPrepTime(store.defaultPrepTime || 15);
    }, [store.autoAcceptOrders, store.defaultPrepTime, store.manualConfirmation, store.operatingStatus]);

    const groupedItems = items.reduce((acc, item) => {
        const categoryName = item.category?.name || 'Uncategorized';
        if (!acc[categoryName]) acc[categoryName] = [];
        acc[categoryName].push(item);
        return acc;
    }, {});

    const filteredGroups = Object.entries(groupedItems)
        .map(([categoryName, categoryItems]) => [
            categoryName,
            categoryItems.filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase())),
        ])
        .filter(([, categoryItems]) => categoryItems.length > 0);

    const statusOptions = [
        { key: 'open', label: 'Open', hint: 'Accepting all orders', icon: <CheckCircle2 size={18} /> },
        { key: 'paused', label: 'Pause Orders', hint: 'Busy? Pause for 30m', icon: <PauseCircle size={18} /> },
        { key: 'closed', label: 'Closed', hint: 'Stop for the day', icon: <XCircle size={18} /> },
    ];

    async function persistStoreOperations(nextState) {
        setSavingControls(true);
        try {
            await api.put('/owner/store-operations', nextState);
            await refreshOwner?.();
        } catch (error) {
            console.error('Failed to save store operations:', error);
            setDialog({
                type: 'error',
                action: 'settings',
                itemName: 'store settings',
                message: error?.response?.data?.message || 'We could not save your store operation settings right now.',
            });
            throw error;
        } finally {
            setSavingControls(false);
        }
    }

    async function handleStatusChange(nextStatus) {
        const previousStatus = restaurantStatus;
        setRestaurantStatus(nextStatus);

        try {
            await persistStoreOperations({
                operating_status: nextStatus,
                auto_accept_orders: autoAcceptOrders,
                manual_confirmation: manualConfirmation,
                default_prep_time: prepTime,
            });
        } catch {
            setRestaurantStatus(previousStatus);
        }
    }

    async function handlePreferenceChange(nextAutoAccept, nextManualConfirmation) {
        const previousAutoAccept = autoAcceptOrders;
        const previousManual = manualConfirmation;
        setAutoAcceptOrders(nextAutoAccept);
        setManualConfirmation(nextManualConfirmation);

        try {
            await persistStoreOperations({
                operating_status: restaurantStatus,
                auto_accept_orders: nextAutoAccept,
                manual_confirmation: nextManualConfirmation,
                default_prep_time: prepTime,
            });
        } catch {
            setAutoAcceptOrders(previousAutoAccept);
            setManualConfirmation(previousManual);
        }
    }

    async function handlePrepTimeChange(minutes) {
        const previousPrepTime = prepTime;
        setPrepTime(minutes);

        try {
            await persistStoreOperations({
                operating_status: restaurantStatus,
                auto_accept_orders: autoAcceptOrders,
                manual_confirmation: manualConfirmation,
                default_prep_time: minutes,
            });
        } catch {
            setPrepTime(previousPrepTime);
        }
    }

    async function runAvailabilityAction(item, nextAvailable) {
        await api.patch(`/owner/inventory/items/${item.id}/availability`, { available: nextAvailable });
        await refreshInventory?.();
    }

    async function handleAvailabilityChange(item, nextAvailable) {
        setLastAction(() => () => runAvailabilityAction(item, nextAvailable));

        try {
            await runAvailabilityAction(item, nextAvailable);
            setDialog({
                type: 'success',
                action: nextAvailable ? 'restore' : 'hide',
                itemName: item.title,
            });
        } catch (error) {
            console.error('Failed to update item availability:', error);
            setDialog({
                type: 'error',
                action: nextAvailable ? 'restore' : 'hide',
                itemName: item.title,
                message: error?.response?.data?.message,
            });
        }
    }

    return (
        <>
            <div className={styles.storeOpsShell}>
                <div className={styles.storeOpsIntro}>
                    <h3 className={styles.storeOpsTitle}>Store Settings</h3>
                    <p className={styles.storeOpsSubtitle}>Configure how your restaurant accepts and processes orders in real-time.</p>
                </div>

                <div className={styles.storeOpsCard}>
                    <div className={styles.storeOpsSectionHead}>
                        <h4>Restaurant Status</h4>
                        <p>Quickly change your availability to customers.</p>
                    </div>
                    <div className={styles.statusOptionGrid}>
                        {statusOptions.map((option) => (
                            <button
                                key={option.key}
                                type="button"
                                className={`${styles.statusOptionCard} ${restaurantStatus === option.key ? styles.statusOptionCardActive : ''}`}
                                onClick={() => handleStatusChange(option.key)}
                                disabled={savingControls}
                            >
                                <span className={styles.statusOptionIcon}>{option.icon}</span>
                                <span className={styles.statusOptionLabel}>{option.label}</span>
                                <span className={styles.statusOptionHint}>{option.hint}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.storeOpsCard}>
                    <div className={styles.storeOpsSectionHead}>
                        <h4>Order Preferences</h4>
                        <p>Define how incoming orders are handled by the system.</p>
                    </div>

                    <div className={styles.preferenceList}>
                        <div className={styles.preferenceRow}>
                            <button
                                type="button"
                                className={`${styles.switchBtn} ${autoAcceptOrders ? styles.switchBtnActive : ''}`}
                                onClick={() => handlePreferenceChange(true, false)}
                                disabled={savingControls}
                            >
                                <span className={styles.switchThumb}></span>
                            </button>
                            <div>
                                <div className={styles.preferenceLabel}>Auto-accept orders</div>
                                <div className={styles.preferenceHint}>Recommended for fast-paced kitchens to reduce order wait times.</div>
                            </div>
                        </div>

                        <div className={styles.preferenceRow}>
                            <button
                                type="button"
                                className={`${styles.switchBtn} ${manualConfirmation ? styles.switchBtnActive : ''}`}
                                onClick={() => handlePreferenceChange(false, true)}
                                disabled={savingControls}
                            >
                                <span className={styles.switchThumb}></span>
                            </button>
                            <div>
                                <div className={styles.preferenceLabel}>Manual confirmation</div>
                                <div className={styles.preferenceHint}>Best for small staff counts or when stock levels vary frequently.</div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.prepTimeWrap}>
                        <div className={styles.preferenceLabel}>Default Preparation Time</div>
                        <div className={styles.prepTimeOptions}>
                            {[10, 15, 20, 30].map((minutes) => (
                                <button
                                    key={minutes}
                                    type="button"
                                    className={`${styles.prepTimeBtn} ${prepTime === minutes ? styles.prepTimeBtnActive : ''}`}
                                    onClick={() => handlePrepTimeChange(minutes)}
                                    disabled={savingControls}
                                >
                                    {minutes} min
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.storeOpsCard}>
                    <div className={styles.hideItemsRow}>
                        <div>
                            <h4>Hide Items</h4>
                            <p>Temporarily hide items from the menu.</p>
                        </div>
                        <button type="button" className={styles.hideItemsBtn} onClick={() => setHideModalOpen(true)}>
                            Hide Items
                        </button>
                    </div>
                </div>
            </div>

            {hideModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setHideModalOpen(false)}>
                    <div className={styles.blacklistModal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.blacklistHeader}>
                            <div>
                                <h3 className={styles.blacklistTitle}>Hide Items</h3>
                                <p className={styles.blacklistSubtitle}>Select which items to hide from your customers</p>
                            </div>
                            <button type="button" className={styles.blacklistCloseBtn} onClick={() => setHideModalOpen(false)}>
                                <X size={18} />
                            </button>
                        </div>

                        <div className={styles.blacklistSearch}>
                            <Search size={15} className={styles.blacklistSearchIcon} />
                            <input
                                type="text"
                                placeholder="Search full menu..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className={styles.blacklistToggleRow}>
                            <button
                                type="button"
                                className={`${styles.switchBtn} ${categoryBlacklist ? styles.switchBtnActive : ''}`}
                                onClick={() => setCategoryBlacklist((value) => !value)}
                            >
                                <span className={styles.switchThumb}></span>
                            </button>
                            <div>
                                <div className={styles.preferenceLabel}>Category Blacklist</div>
                                <div className={styles.preferenceHint}>Hide entire menu sections at once</div>
                            </div>
                        </div>

                        <div className={styles.blacklistBody}>
                            {filteredGroups.length === 0 ? (
                                <div className={styles.blacklistEmpty}>No menu items matched your search.</div>
                            ) : (
                                filteredGroups.map(([categoryName, categoryItems]) => (
                                    <div key={categoryName} className={styles.blacklistCategoryBlock}>
                                        <div className={styles.blacklistCategoryTitle}>{categoryName}</div>
                                        <div className={styles.blacklistItems}>
                                            {categoryItems.map((item) => {
                                                const isHidden = item.available === false;
                                                return (
                                                    <div key={item.id} className={styles.blacklistItemRow}>
                                                        <div className={styles.blacklistItemInfo}>
                                                            <img src={resolveMediaUrl(item.image)} alt={item.title} className={styles.blacklistItemImage} />
                                                            <span className={styles.blacklistItemTitle}>{item.title}</span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            className={`${styles.blacklistActionBtn} ${isHidden ? styles.blacklistRestoreBtn : ''}`}
                                                            onClick={() => handleAvailabilityChange(item, isHidden)}
                                                        >
                                                            {isHidden ? 'Restore' : 'Hide'}
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className={styles.blacklistFooter}>
                            <button type="button" className={styles.btnCancel} onClick={() => setHideModalOpen(false)}>Cancel</button>
                            <button type="button" className={styles.btnSave} onClick={() => setHideModalOpen(false)}>Save Changes</button>
                        </div>
                    </div>
                </div>
            )}

            {dialog && (
                <OperationDialog
                    dialog={dialog}
                    onClose={() => setDialog(null)}
                    onRetry={async () => {
                        if (!lastAction) {
                            setDialog(null);
                            return;
                        }

                        try {
                            await lastAction();
                            setDialog((prev) => prev ? { type: 'success', action: prev.action, itemName: prev.itemName } : null);
                        } catch (error) {
                            console.error('Retry failed:', error);
                        }
                    }}
                />
            )}
        </>
    );
}

function OperationDialog({ dialog, onClose, onRetry }) {
    const success = dialog.type === 'success';
    const isRestore = dialog.action === 'restore';
    const title = success
        ? isRestore ? 'Item Restored Successfully' : 'Item Hidden Successfully'
        : isRestore ? 'Restore Failed' : 'Update Failed';
    const description = success
        ? isRestore
            ? `The "${dialog.itemName}" is now visible and available for order on your digital menu.`
            : `The "${dialog.itemName}" has been hidden from your menu. You can restore it anytime from this list.`
        : dialog.message || `We couldn't ${isRestore ? 'restore' : 'update the blacklist status for'} "${dialog.itemName}" due to a temporary connection issue.`;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.operationDialog}>
                <div className={`${styles.operationDialogIcon} ${success ? styles.operationDialogSuccess : styles.operationDialogError}`}>
                    {success ? <CheckCircle2 size={28} /> : <AlertCircle size={28} />}
                </div>
                <h3 className={styles.operationDialogTitle}>{title}</h3>
                <p className={styles.operationDialogText}>{description}</p>
                {success ? (
                    <button type="button" className={styles.operationDialogPrimary} onClick={onClose}>Done</button>
                ) : (
                    <>
                        <button type="button" className={styles.operationDialogPrimary} onClick={onRetry}>Try Again</button>
                        <button type="button" className={styles.operationDialogSecondary} onClick={onClose}>Cancel</button>
                    </>
                )}
            </div>
        </div>
    );
}

/* ── Security Settings Tab ───────────────────────── */
function SecuritySettingsTab() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');
    const [twoFA, setTwoFA] = useState(true);
    const [secNotifs, setSecNotifs] = useState({ newDevice: true, passwordChange: true, suspicious: true });

    const getStrength = (pw) => {
        if (!pw) return { label: '', color: '#E5E7EB', pct: 0 };
        let score = 0;
        if (pw.length >= 8) score++;
        if (/[A-Z]/.test(pw)) score++;
        if (/[0-9]/.test(pw)) score++;
        if (/[^A-Za-z0-9]/.test(pw)) score++;
        if (pw.length >= 12) score++;
        if (score <= 1) return { label: 'Weak', color: '#EF4444', pct: 25 };
        if (score <= 2) return { label: 'Fair', color: '#F59E0B', pct: 50 };
        if (score <= 3) return { label: 'Good', color: '#3B82F6', pct: 75 };
        return { label: 'Strong', color: '#10B981', pct: 100 };
    };

    const strength = getStrength(newPassword);

    const handleSave = async () => {
        setError('');
        if (!currentPassword) { setError('Current password is required.'); return; }
        if (newPassword.length < 8) { setError('New password must be at least 8 characters.'); return; }
        if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }
        setSaving(true);
        try {
            await api.put('/owner/change-password', {
                current_password: currentPassword,
                password: newPassword,
                password_confirmation: confirmPassword,
            });
            setSaved(true);
            setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
            setTimeout(() => setSaved(false), 2500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to change password.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.5rem', color: '#111827' }}>Security Settings</h2>
                <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9rem' }}>Enhance your account's protection and manage access.</p>
            </div>

            {/* Change Password */}
            <div className={styles.card} style={{ padding: '1.5rem' }}>
                <h3 className={styles.cardTitle} style={{ marginBottom: '0.25rem' }}>Change Password</h3>
                <p style={{ color: '#6B7280', fontSize: '0.82rem', margin: '0 0 1.25rem' }}>Update your account password regularly to keep it secure.</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>Current Password</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={e => { setCurrentPassword(e.target.value); setError(''); }}
                            className={styles.fieldInput}
                            placeholder="••••••••"
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>New Password</label>
                        <input
                            type={showNew ? 'text' : 'password'}
                            value={newPassword}
                            onChange={e => { setNewPassword(e.target.value); setError(''); }}
                            className={styles.fieldInput}
                            placeholder="••••••••"
                        />
                        <button onClick={() => setShowNew(!showNew)} style={{ position: 'absolute', right: '10px', top: '30px', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: '4px' }}>
                            {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>Confirm Password</label>
                        <input
                            type={showConfirm ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={e => { setConfirmPassword(e.target.value); setError(''); }}
                            className={styles.fieldInput}
                            placeholder="••••••••"
                        />
                        <button onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: '10px', top: '30px', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: '4px' }}>
                            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                {/* Strength bar */}
                {newPassword && (
                    <div style={{ marginTop: '0.75rem' }}>
                        <div style={{ width: '100%', height: '4px', backgroundColor: '#E5E7EB', borderRadius: '99px', overflow: 'hidden' }}>
                            <div style={{ width: `${strength.pct}%`, height: '100%', backgroundColor: strength.color, borderRadius: '99px', transition: 'all 0.3s' }} />
                        </div>
                        <p style={{ fontSize: '0.78rem', color: strength.color, fontWeight: 600, marginTop: '0.35rem' }}>Password Strength: {strength.label}</p>
                    </div>
                )}

                {error && (
                    <div style={{ background: '#FEF2F2', color: '#991B1B', fontSize: '0.82rem', padding: '0.6rem 0.85rem', borderRadius: '8px', marginTop: '0.75rem', fontWeight: 500 }}>
                        {error}
                    </div>
                )}

                <div className={styles.formActions} style={{ marginTop: '1rem' }}>
                    <button className={styles.btnCancel} onClick={() => { setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); setError(''); }}>Cancel</button>
                    <button className={styles.btnSave} disabled={saving} onClick={handleSave}>
                        {saving ? 'Saving...' : <><Save size={14} /> Save Changes</>}
                    </button>
                </div>
            </div>

            {/* 2FA Toggle */}
            <div className={styles.card} style={{ padding: '1.25rem 1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        type="button"
                        className={`${styles.switchBtn} ${twoFA ? styles.switchBtnActive : ''}`}
                        onClick={() => setTwoFA(!twoFA)}
                    >
                        <span className={styles.switchThumb} />
                    </button>
                    <div>
                        <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#111827' }}>Two-Factor Authentication (2FA)</div>
                        <div style={{ fontSize: '0.82rem', color: '#6B7280', marginTop: '2px' }}>Add an extra layer of security to your account by requiring a code from your phone.</div>
                    </div>
                </div>
            </div>

            {/* Security Notifications */}
            <div className={styles.card} style={{ padding: '1.5rem' }}>
                <h3 className={styles.cardTitle} style={{ marginBottom: '1.25rem' }}>Security Notifications</h3>
                {[
                    { key: 'newDevice', title: 'New device login', desc: 'Notify me when my account is accessed from a new device.' },
                    { key: 'passwordChange', title: 'Password change', desc: 'Send an email alert whenever my password is updated.' },
                    { key: 'suspicious', title: 'Suspicious activity', desc: 'Critical alerts about potentially compromised security.' },
                ].map((item, idx) => (
                    <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem 0', borderTop: idx > 0 ? '1px solid #F3F4F6' : 'none' }}>
                        <button
                            type="button"
                            className={`${styles.switchBtn} ${secNotifs[item.key] ? styles.switchBtnActive : ''}`}
                            onClick={() => setSecNotifs(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                        >
                            <span className={styles.switchThumb} />
                        </button>
                        <div>
                            <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#111827' }}>{item.title}</div>
                            <div style={{ fontSize: '0.82rem', color: '#6B7280', marginTop: '2px' }}>{item.desc}</div>
                        </div>
                    </div>
                ))}
            </div>

            {saved && (
                <div className={styles.savedToast}>
                    <Check size={16} /> Password changed successfully!
                </div>
            )}
        </div>
    );
}

/* ── Notifications Tab ───────────────────────── */
function NotificationsTab() {
    const [notifs, setNotifs] = useState({
        emailUpdates: true,
        smsAlerts: true,
        dashboardPush: true,
        emailInvoices: true,
        transferSms: true,
        balanceAlert: true,
        reviewDigest: true,
        newReviewAlerts: true,
        reviewBalance: true,
    });

    const toggle = (key) => setNotifs(prev => ({ ...prev, [key]: !prev[key] }));

    const sections = [
        {
            title: 'Order Notifications',
            items: [
                { key: 'emailUpdates', title: 'Email Updates', desc: 'Daily summary and major order issues' },
                { key: 'smsAlerts', title: 'SMS Alerts', desc: 'Immediate text for every new incoming order' },
                { key: 'dashboardPush', title: 'Dashboard Push', desc: 'Browser notifications while logged in' },
            ],
        },
        {
            title: 'Payout Notifications',
            items: [
                { key: 'emailInvoices', title: 'Email Invoices', desc: 'Receive weekly earnings statements' },
                { key: 'transferSms', title: 'Transfer Confirmation (SMS)', desc: 'Get notified when money hits your account' },
                { key: 'balanceAlert', title: 'Dashboard Balance Alert', desc: 'Notifications for low balance or failed transfers' },
            ],
        },
        {
            title: 'Review Notifications',
            items: [
                { key: 'reviewDigest', title: 'Review Digest (Email)', desc: 'Weekly report of customer ratings and feedback' },
                { key: 'newReviewAlerts', title: 'New Review Alerts', desc: 'Get notified the moment a customer leaves feedback' },
                { key: 'reviewBalance', title: 'Dashboard Balance Alert', desc: 'Notifications for low balance or failed transfers' },
            ],
        },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.5rem', color: '#111827' }}>Notification Preferences</h2>
                <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9rem' }}>Choose how you'd like to stay informed about your restaurant's activity.</p>
            </div>

            {sections.map(section => (
                <div key={section.title} className={styles.card} style={{ padding: '1.5rem' }}>
                    <h3 className={styles.cardTitle} style={{ marginBottom: '1rem' }}>{section.title}</h3>
                    {section.items.map((item, idx) => (
                        <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem 0', borderTop: idx > 0 ? '1px solid #F3F4F6' : 'none' }}>
                            <button
                                type="button"
                                className={`${styles.switchBtn} ${notifs[item.key] ? styles.switchBtnActive : ''}`}
                                onClick={() => toggle(item.key)}
                            >
                                <span className={styles.switchThumb} />
                            </button>
                            <div>
                                <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#111827' }}>{item.title}</div>
                                <div style={{ fontSize: '0.82rem', color: '#6B7280', marginTop: '2px' }}>{item.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

/* ── Payment Config Tab ─────────────────────────── */
function PaymentConfigTab({ refreshOwner }) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');
    const [methods, setMethods] = useState(['cod']);
    const [gcashNumber, setGcashNumber] = useState('');
    const [mayaNumber, setMayaNumber] = useState('');
    const [bankName, setBankName] = useState('');
    const [bankAccountName, setBankAccountName] = useState('');
    const [bankAccountNumber, setBankAccountNumber] = useState('');

    useEffect(() => {
        api.get('/owner/payment-settings').then(res => {
            const d = res.data;
            setMethods(d.accepted_payment_methods || ['cod']);
            setGcashNumber(d.gcash_number || '');
            setMayaNumber(d.maya_number || '');
            setBankName(d.bank_name || '');
            setBankAccountName(d.bank_account_name || '');
            setBankAccountNumber(d.bank_account_number || '');
            setError('');
        }).catch((err) => {
            setError(err?.response?.data?.message || 'Failed to load payment settings.');
        }).finally(() => setLoading(false));
    }, []);

    const toggleMethod = (m) => {
        setMethods(prev => {
            if (prev.includes(m)) {
                if (prev.length === 1) return prev; // must keep at least one
                return prev.filter(x => x !== m);
            }
            return [...prev, m];
        });
    };

    const handleSave = async () => {
        setSaving(true);
        setError('');
        try {
            await api.put('/owner/payment-settings', {
                accepted_payment_methods: methods,
                gcash_number: gcashNumber || null,
                maya_number: mayaNumber || null,
                bank_name: bankName || null,
                bank_account_name: bankAccountName || null,
                bank_account_number: bankAccountNumber || null,
            });
            await refreshOwner?.();
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        } catch (err) {
            console.error(err);
            setError(err?.response?.data?.message || 'Failed to save payment settings.');
        } finally {
            setSaving(false);
        }
    };

    const paymentOptions = [
        { key: 'cod', label: 'Cash on Delivery', icon: '💵', desc: 'Customer pays upon delivery. No additional setup needed.' },
        { key: 'gcash', label: 'GCash', icon: '📱', desc: 'Accept payments via GCash. Enter your GCash number below.' },
        { key: 'maya', label: 'Maya', icon: '💳', desc: 'Accept payments via Maya (PayMaya). Enter your Maya number below.' },
        { key: 'bank_transfer', label: 'Bank Transfer', icon: '🏦', desc: 'Accept direct bank transfers. Enter your bank details below.' },
    ];

    if (loading) return <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>Loading payment settings...</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.5rem', color: '#111827' }}>Payment Settings</h2>
                <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9rem' }}>Configure which payment methods your customers can use at checkout.</p>
            </div>

            {error && (
                <div style={{ background: '#FEF2F2', borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start', border: '1px solid #FECACA' }}>
                    <AlertCircle size={18} color="#991B1B" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ fontSize: '0.82rem', color: '#7F1D1D' }}>{error}</div>
                </div>
            )}

            {/* Accepted Payment Methods */}
            <div className={styles.card} style={{ padding: '1.5rem' }}>
                <h3 className={styles.cardTitle} style={{ marginBottom: '1rem' }}>Accepted Payment Methods</h3>
                <p style={{ color: '#6B7280', fontSize: '0.82rem', margin: '0 0 1.25rem' }}>Toggle the methods you want to accept. At least one must be enabled.</p>

                {paymentOptions.map((opt, idx) => (
                    <div key={opt.key} style={{ borderTop: idx > 0 ? '1px solid #F3F4F6' : 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem 0' }}>
                            <button
                                type="button"
                                className={`${styles.switchBtn} ${methods.includes(opt.key) ? styles.switchBtnActive : ''}`}
                                onClick={() => toggleMethod(opt.key)}
                            >
                                <span className={styles.switchThumb} />
                            </button>
                            <span style={{ fontSize: '1.25rem' }}>{opt.icon}</span>
                            <div>
                                <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#111827' }}>{opt.label}</div>
                                <div style={{ fontSize: '0.82rem', color: '#6B7280', marginTop: '2px' }}>{opt.desc}</div>
                            </div>
                        </div>

                        {/* GCash details */}
                        {opt.key === 'gcash' && methods.includes('gcash') && (
                            <div style={{ padding: '0 0 1rem 3.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>GCash Number</label>
                                <input
                                    type="text"
                                    className={styles.fieldInput}
                                    placeholder="09XX XXX XXXX"
                                    value={gcashNumber}
                                    onChange={e => setGcashNumber(e.target.value)}
                                    style={{ maxWidth: '280px' }}
                                />
                            </div>
                        )}

                        {/* Maya details */}
                        {opt.key === 'maya' && methods.includes('maya') && (
                            <div style={{ padding: '0 0 1rem 3.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>Maya Number</label>
                                <input
                                    type="text"
                                    className={styles.fieldInput}
                                    placeholder="09XX XXX XXXX"
                                    value={mayaNumber}
                                    onChange={e => setMayaNumber(e.target.value)}
                                    style={{ maxWidth: '280px' }}
                                />
                            </div>
                        )}

                        {/* Bank Transfer details */}
                        {opt.key === 'bank_transfer' && methods.includes('bank_transfer') && (
                            <div style={{ padding: '0 0 1rem 3.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', maxWidth: '700px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>Bank Name</label>
                                    <input type="text" className={styles.fieldInput} placeholder="e.g. BDO, BPI" value={bankName} onChange={e => setBankName(e.target.value)} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>Account Name</label>
                                    <input type="text" className={styles.fieldInput} placeholder="Juan Dela Cruz" value={bankAccountName} onChange={e => setBankAccountName(e.target.value)} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>Account Number</label>
                                    <input type="text" className={styles.fieldInput} placeholder="0000 0000 0000" value={bankAccountNumber} onChange={e => setBankAccountNumber(e.target.value)} />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Info Banner */}
            <div style={{ background: '#FEF2F2', borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start', border: '1px solid #FECACA' }}>
                <AlertCircle size={18} color="#991B1B" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.82rem', color: '#7F1D1D' }}>
                    <strong>How online payments work:</strong> When a customer pays via GCash, Maya, or Bank Transfer, they will be shown your account details and asked to upload a screenshot of their payment receipt. You can then confirm or reject the payment from the order details page.
                </div>
            </div>

            <div className={styles.formActions}>
                <button className={styles.btnSave} disabled={saving} onClick={handleSave}>
                    {saving ? 'Saving...' : saved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> Save Payment Settings</>}
                </button>
            </div>
        </div>
    );
}

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

const SectionIcon = ({ children }) => (
    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b91c1c', flexShrink: 0 }}>
        {children}
    </div>
);

const DEFAULT_CENTER = [14.6433, 121.0425]; // Quezon City default

// Geocode address text → [lat, lng] via Nominatim (free OSM)
async function geocodeAddressToLatLng(address) {
    if (!address || address.trim().length < 3) return null;
    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`);
        const data = await res.json();
        if (data.length > 0) return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    } catch (e) { console.error('Geocode failed:', e); }
    return null;
}

// Reverse geocode [lat, lng] → address string
async function reverseGeocode(lat, lng) {
    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await res.json();
        return data.display_name || '';
    } catch (e) { console.error('Reverse geocode failed:', e); }
    return '';
}

// Helper: fly the map to a new position
function MapFlyTo({ position }) {
    const map = useMap();
    useEffect(() => { map.flyTo(position, 15); }, [position, map]);
    return null;
}

// Read-only map for the profile view
function ReadOnlyMap({ address }) {
    const [pos, setPos] = useState(DEFAULT_CENTER);
    useEffect(() => {
        if (address) {
            geocodeAddressToLatLng(address).then(result => { if (result) setPos(result); });
        }
    }, [address]);
    return (
        <MapContainer center={pos} zoom={15} style={{ height: '100%', minHeight: '160px', width: '100%' }} scrollWheelZoom={false} dragging={false} zoomControl={false}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
            <Marker position={pos} />
            <MapFlyTo position={pos} />
        </MapContainer>
    );
}

// Editable map for the modal — click to move pin
function ClickHandler({ onPositionChange }) {
    useMapEvents({ click(e) { onPositionChange([e.latlng.lat, e.latlng.lng]); } });
    return null;
}

function EditableMap({ position, onPositionChange }) {
    return (
        <MapContainer center={position} zoom={15} style={{ height: '100%', minHeight: '160px', width: '100%' }} scrollWheelZoom={true}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
            <Marker position={position} />
            <ClickHandler onPositionChange={onPositionChange} />
            <MapFlyTo position={position} />
        </MapContainer>
    );
}

function BrandImagesCard({ store, refreshOwner }) {
    const coverRef = useRef(null);
    const logoRef = useRef(null);
    const [uploadingCover, setUploadingCover] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [saved, setSaved] = useState('');
    // Crop modal state
    const [cropSrc, setCropSrc] = useState(null);
    const [cropMode, setCropMode] = useState(null); // 'cover' | 'logo'

    const coverSrc = resolveMediaUrl(store.cover);
    const logoSrc = resolveMediaUrl(store.logo);
    const cuisine = Array.isArray(store.cuisineType) && store.cuisineType.length > 0 ? store.cuisineType : [];

    async function uploadImage(field, file) {
        const formData = new FormData();
        formData.append('first_name', store.firstName || '');
        formData.append('last_name', store.lastName || '');
        formData.append('restaurant_name', store.branchName || '');
        formData.append('business_address', store.location || '');
        formData.append('business_contact_number', store.phone || '');
        formData.append(field, file);
        await api.post('/owner/profile-update', formData);
        await refreshOwner?.();
    }

    // Open file picker → show cropper
    const handleFileSelect = (mode) => (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const objectUrl = URL.createObjectURL(file);
        setCropSrc(objectUrl);
        setCropMode(mode);
        // Reset input so same file can be re-selected
        e.target.value = '';
    };

    // After crop is applied
    const handleCropComplete = async (croppedFile) => {
        setCropSrc(null);
        const mode = cropMode;
        setCropMode(null);

        if (mode === 'cover') {
            setUploadingCover(true);
            try {
                await uploadImage('cover_file', croppedFile);
                setSaved('Cover image updated!');
                setTimeout(() => setSaved(''), 2500);
            } catch (err) { console.error('Cover upload failed:', err); }
            finally { setUploadingCover(false); }
        } else {
            setUploadingLogo(true);
            try {
                await uploadImage('logo_file', croppedFile);
                setSaved('Logo updated!');
                setTimeout(() => setSaved(''), 2500);
            } catch (err) { console.error('Logo upload failed:', err); }
            finally { setUploadingLogo(false); }
        }
    };

    const handleCropCancel = () => {
        if (cropSrc) URL.revokeObjectURL(cropSrc);
        setCropSrc(null);
        setCropMode(null);
    };

    return (
        <>
            <div className={styles.brandImagesCard}>
                <div className={styles.brandImagesHeader}>
                    <div>
                        <h3 className={styles.brandImagesTitle}>Brand Images</h3>
                        <p className={styles.brandImagesSubtitle}>Manage how your restaurant appears to customers</p>
                    </div>
                </div>

                {/* Cover Image */}
                <div className={styles.coverImageContainer} onClick={() => coverRef.current?.click()}>
                    {uploadingCover && (
                        <div className={styles.uploadingOverlay}>
                            <div className={styles.uploadSpinner} />
                            Uploading cover...
                        </div>
                    )}
                    {coverSrc ? (
                        <img src={coverSrc} alt="Cover" className={styles.coverImage} />
                    ) : (
                        <div className={styles.coverImagePlaceholder}>
                            <ImagePlus size={32} />
                            <span className={styles.coverImagePlaceholderText}>Upload Cover Image</span>
                            <span className={styles.coverImagePlaceholderHint}>Recommended: 1600×500px · Max 10 MB</span>
                        </div>
                    )}
                    {coverSrc && (
                        <div className={styles.coverImageOverlay}>
                            <span className={styles.coverImageBtn}><Camera size={14} /> Change Cover</span>
                        </div>
                    )}
                    <input ref={coverRef} type="file" accept="image/*" onChange={handleFileSelect('cover')} style={{ display: 'none' }} />
                </div>

                {/* Logo Row */}
                <div className={styles.brandLogoRow}>
                    <div className={styles.logoUploadWrapper} onClick={() => logoRef.current?.click()}>
                        {uploadingLogo && (
                            <div className={styles.uploadingOverlay}>
                                <div className={styles.uploadSpinner} />
                            </div>
                        )}
                        {logoSrc ? (
                            <div className={styles.logoPreviewCircle}>
                                <img src={logoSrc} alt="Logo" />
                            </div>
                        ) : (
                            <div className={styles.logoPreviewInitial}>
                                {(store.branchName || 'R').charAt(0)}
                            </div>
                        )}
                        <div className={styles.logoUploadOverlay}>
                            <Camera size={18} />
                        </div>
                        <input ref={logoRef} type="file" accept="image/*" onChange={handleFileSelect('logo')} style={{ display: 'none' }} />
                    </div>
                    <div className={styles.brandLogoInfo}>
                        <h4 className={styles.brandLogoName}>{store.branchName || 'Your Restaurant'}</h4>
                        <p className={styles.brandLogoHint}>Click logo to change · Max 10 MB</p>
                    </div>
                    <button className={styles.brandLogoChangeBtn} onClick={() => logoRef.current?.click()}>
                        <Camera size={14} /> Change Logo
                    </button>
                </div>

                {/* Customer Preview */}
                <div className={styles.customerPreviewSection}>
                    <p className={styles.customerPreviewLabel}>Customer Preview</p>
                    <div className={styles.customerPreviewCard}>
                        {coverSrc ? (
                            <img src={coverSrc} alt="Preview cover" className={styles.customerPreviewCover} />
                        ) : (
                            <div className={styles.customerPreviewCover} />
                        )}
                        <div className={styles.customerPreviewBody}>
                            {logoSrc ? (
                                <img src={logoSrc} alt="Preview logo" className={styles.customerPreviewLogo} />
                            ) : (
                                <div className={styles.customerPreviewLogoInitial}>
                                    {(store.branchName || 'R').charAt(0)}
                                </div>
                            )}
                            <div>
                                <p className={styles.customerPreviewName}>{store.branchName || 'Your Restaurant'}</p>
                                <p className={styles.customerPreviewCuisine}>{cuisine.length > 0 ? cuisine.join(' · ') : 'No cuisine set'}</p>
                            </div>
                            <div className={styles.customerPreviewRating}>
                                <Star size={13} fill="#F59E0B" /> 5.0
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {saved && (
                <div className={styles.brandImagesSaved}>
                    <Check size={16} /> {saved}
                </div>
            )}

            {/* Crop Modal */}
            {cropSrc && cropMode && (
                <ImageCropModal
                    imageSrc={cropSrc}
                    aspect={cropMode === 'cover' ? 16 / 5 : 1}
                    title={cropMode === 'cover' ? 'Crop Cover Image' : 'Crop Logo'}
                    cropShape={cropMode === 'logo' ? 'round' : 'rect'}
                    outputWidth={cropMode === 'cover' ? 1600 : 500}
                    outputHeight={cropMode === 'cover' ? 500 : 500}
                    onComplete={handleCropComplete}
                    onCancel={handleCropCancel}
                />
            )}
        </>
    );
}


function RestaurantProfileTab({ store, refreshOwner }) {
    const [editMode, setEditMode] = useState(false);
    
    const cuisine = Array.isArray(store.cuisineType) && store.cuisineType.length > 0 ? store.cuisineType : [];
    const priceRange = store.priceRange || '';
    const brn = store.businessRegistrationNumber || 'BRN-9823-X102';
    const email = store.email || 'pattyshack@email.com';
    const phone = store.phone || '+1 (555) 000-1234';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#111827' }}>Restaurant Profile</h2>
                <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9rem' }}>Update your restaurant's brand details, contact information, and store visibility.</p>
            </div>

            <BrandImagesCard store={store} refreshOwner={refreshOwner} />

            <div className={styles.card} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    {store.logo ? (
                        <RestaurantLogo
                            src={store.logo}
                            name={store.branchName}
                            size={64}
                            style={{ padding: '0.2rem', border: '1px solid #e5e7eb', backgroundColor: 'white' }}
                        />
                    ) : (
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 600 }}>
                            {(store.branchName || 'P').charAt(0)}
                        </div>
                    )}
                    <div>
                        <p style={{ color: '#6b7280', margin: '0 0 0.25rem 0', fontSize: '0.85rem', fontWeight: 500 }}>{cuisine.length > 0 ? cuisine.join(' • ') : 'No cuisine tags set'}</p>
                        <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#111827' }}>{store.branchName || 'Patty Shack'}</h3>
                    </div>
                </div>
                <button
                    onClick={() => setEditMode(true)}
                    style={{ padding: '0.6rem 1.25rem', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: 'white', fontWeight: 500, cursor: 'pointer', fontSize: '0.85rem', color: '#374151', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                >
                    Edit Profile
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
                <div className={styles.card} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <SectionIcon><Store size={16} /></SectionIcon>
                        <h4 style={{ margin: 0, color: '#111827', fontSize: '1.05rem', fontWeight: 600 }}>Restaurant Information</h4>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem' }}>Restaurant Name</label>
                            <div style={{ backgroundColor: '#f9fafb', padding: '0.6rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem', color: '#4b5563', fontWeight: 500 }}>{store.branchName || 'Patty Shack'}</div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem' }}>Business Registration Number</label>
                            <div style={{ backgroundColor: '#f9fafb', padding: '0.6rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem', color: '#4b5563', fontWeight: 500 }}>{brn}</div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem' }}>Cuisine Type</label>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {cuisine.length > 0 ? cuisine.map((c, i) => (
                                    <span key={i} style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.2rem 0.6rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600 }}>{c}</span>
                                )) : <span style={{ color: '#9ca3af', fontSize: '0.85rem', fontStyle: 'italic' }}>None set</span>}
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem' }}>Price Range</label>
                            <div style={{ color: '#b91c1c', fontSize: '0.85rem', fontWeight: 800, display: 'inline-block', backgroundColor: '#fee2e2', padding: '0.25rem 0.75rem', borderRadius: '99px' }}>
                                {priceRange ? priceRange.replace(/P/g, '₱') : 'Not set'}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.card} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <SectionIcon><Phone size={16} /></SectionIcon>
                        <h4 style={{ margin: 0, color: '#111827', fontSize: '1.05rem', fontWeight: 600 }}>Contact Information</h4>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '0.5rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem' }}>Email</label>
                            <div style={{ backgroundColor: '#f9fafb', padding: '0.6rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem', color: '#4b5563', fontWeight: 500 }}>{email}</div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem' }}>Phone Number</label>
                            <div style={{ backgroundColor: '#f9fafb', padding: '0.6rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem', color: '#4b5563', fontWeight: 500 }}>{phone}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.card} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <SectionIcon><MapPin size={16} /></SectionIcon>
                    <h4 style={{ margin: 0, color: '#111827', fontSize: '1.05rem', fontWeight: 600 }}>Restaurant Location</h4>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
                    <div style={{ flex: 1.2 }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem' }}>Address</label>
                        <div style={{ backgroundColor: '#f9fafb', padding: '1.25rem 1rem', borderRadius: '6px', fontSize: '0.9rem', color: '#4b5563', lineHeight: '1.5', minHeight: '90px', fontWeight: 500 }}>
                            {store.location || 'No address set'}
                        </div>
                    </div>
                    <div style={{ flex: 1, borderRadius: '8px', overflow: 'hidden', border: '1px solid #e5e7eb', minHeight: '160px' }}>
                        <ReadOnlyMap address={store.location} />
                    </div>
                </div>
            </div>

            {editMode && <EditRestaurantProfileModal store={store} onClose={() => setEditMode(false)} refreshOwner={refreshOwner} />}
        </div>
    );
}

function EditRestaurantProfileModal({ store, onClose, refreshOwner }) {
    const defaultCuisines = Array.isArray(store.cuisineType) ? store.cuisineType : [];
    const [form, setForm] = useState({
        restaurantName: store.branchName || '',
        brn: store.businessRegistrationNumber || '',
        cuisines: defaultCuisines,
        priceRange: store.priceRange || '',
        email: store.email || '',
        phone: store.phone || '',
        address: store.location || '',
        newCuisine: ''
    });
    const [logoFile, setLogoFile] = useState(null);
    const [previewLogo, setPreviewLogo] = useState(resolveMediaUrl(store.logo));
    const [coverFile, setCoverFile] = useState(null);
    const [previewCover, setPreviewCover] = useState(resolveMediaUrl(store.cover));
    const [saving, setSaving] = useState(false);
    const [mapPosition, setMapPosition] = useState(DEFAULT_CENTER);
    const fileRef = useRef(null);
    const coverFileRef = useRef(null);
    // Crop modal state for the edit modal
    const [modalCropSrc, setModalCropSrc] = useState(null);
    const [modalCropMode, setModalCropMode] = useState(null);

    // Geocode initial address on mount
    useEffect(() => {
        if (store.location) {
            geocodeAddressToLatLng(store.location).then(r => { if (r) setMapPosition(r); });
        }
    }, []);

    useEffect(() => () => revokeObjectUrl(previewLogo), [previewLogo]);
    useEffect(() => () => revokeObjectUrl(previewCover), [previewCover]);

    const geocodeAddress = useCallback(async (addr) => {
        const result = await geocodeAddressToLatLng(addr);
        if (result) setMapPosition(result);
    }, []);

    const handleMapClick = useCallback(async (pos) => {
        setMapPosition(pos);
        const addr = await reverseGeocode(pos[0], pos[1]);
        if (addr) setForm(prev => ({ ...prev, address: addr }));
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setModalCropSrc(url);
        setModalCropMode('logo');
        e.target.value = '';
    };

    const handleCoverFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setModalCropSrc(url);
        setModalCropMode('cover');
        e.target.value = '';
    };

    const handleModalCropComplete = (croppedFile) => {
        const previewUrl = URL.createObjectURL(croppedFile);
        if (modalCropMode === 'cover') {
            revokeObjectUrl(previewCover);
            setCoverFile(croppedFile);
            setPreviewCover(previewUrl);
        } else {
            revokeObjectUrl(previewLogo);
            setLogoFile(croppedFile);
            setPreviewLogo(previewUrl);
        }
        if (modalCropSrc) URL.revokeObjectURL(modalCropSrc);
        setModalCropSrc(null);
        setModalCropMode(null);
    };

    const handleModalCropCancel = () => {
        if (modalCropSrc) URL.revokeObjectURL(modalCropSrc);
        setModalCropSrc(null);
        setModalCropMode(null);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('first_name', store.firstName || '');
            formData.append('last_name', store.lastName || '');
            formData.append('restaurant_name', form.restaurantName);
            formData.append('business_address', form.address);
            formData.append('business_contact_number', form.phone);
            formData.append('business_registration_number', form.brn);
            formData.append('price_range', form.priceRange);
            form.cuisines.forEach(c => formData.append('cuisine_type[]', c));
            
            if (logoFile) formData.append('logo_file', logoFile);
            if (coverFile) formData.append('cover_file', coverFile);
            
            await api.post('/owner/profile-update', formData);

            await refreshOwner?.();
            onClose();
        } catch (err) {
            console.error('Failed to update profile:', err);
        } finally {
            setSaving(false);
        }
    };

    const addCuisine = () => {
        const v = form.newCuisine.trim();
        if (v && !form.cuisines.includes(v)) {
            setForm({ ...form, cuisines: [...form.cuisines, v], newCuisine: '' });
        }
    };
    
    const removeCuisine = (idx) => {
        setForm({ ...form, cuisines: form.cuisines.filter((_, i) => i !== idx) });
    };

    return (
        <>
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={onClose}>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', width: '100%', maxWidth: '780px', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.75rem', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 10 }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#111827' }}>Edit Restaurant Profile</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex', padding: '0.25rem' }}><X size={20} /></button>
                </div>

                <div style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: '#f9fafb' }}>
                    
                    {/* Cover Image Upload */}
                    <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.5rem', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}>
                        <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '1rem', color: '#111827', fontWeight: 700 }}>Cover Image</h4>
                        <p style={{ margin: '0 0 1rem', fontSize: '0.8rem', color: '#6B7280' }}>This image appears on the menu listing page. Recommended 1600×500px.</p>
                        <div className={styles.modalCoverUpload} onClick={() => coverFileRef.current?.click()}>
                            {previewCover ? (
                                <img src={previewCover} alt="Cover preview" />
                            ) : (
                                <div className={styles.modalCoverPlaceholder}>
                                    <ImagePlus size={24} />
                                    <span>Click to upload cover image</span>
                                </div>
                            )}
                        </div>
                        <input ref={coverFileRef} type="file" accept="image/*" onChange={handleCoverFileChange} style={{ display: 'none' }} />
                    </div>

                    <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.5rem', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}>
                        <h4 style={{ margin: '0 0 1.25rem 0', fontSize: '1rem', color: '#111827', fontWeight: 700 }}>Restaurant Information</h4>
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                            <div style={{ flexShrink: 0 }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem' }}>Restaurant Logo</label>
                                <div 
                                    onClick={() => fileRef.current?.click()}
                                    style={{ width: '110px', height: '110px', borderRadius: '12px', border: '1px dashed #d1d5db', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', backgroundColor: 'white', padding: '0.5rem' }}
                                >
                                    {previewLogo ? (
                                        <img src={previewLogo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    ) : (
                                        <div style={{ color: '#9ca3af', fontSize: '0.85rem', fontWeight: 500 }}>Upload</div>
                                    )}
                                </div>
                                <input type="file" ref={fileRef} accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                            </div>

                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>Restaurant Name</label>
                                        <input value={form.restaurantName} onChange={e => setForm({...form, restaurantName: e.target.value})} style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.85rem', outline: 'none' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>Business Registration Number</label>
                                        <input value={form.brn} onChange={e => setForm({...form, brn: e.target.value})} style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.85rem', outline: 'none' }} />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.25rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>Cuisine Type</label>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
                                            {form.cuisines.map((c, i) => (
                                                <span key={i} style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.2rem 0.6rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', border: '1px solid #fca5a5' }}>
                                                    {c} <X size={12} cursor="pointer" onClick={() => removeCuisine(i)} />
                                                </span>
                                            ))}
                                            <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px dashed #d1d5db', borderRadius: '99px', padding: '0.1rem 0.5rem', backgroundColor: 'white' }}>
                                                <span style={{ color: '#6b7280', fontSize: '0.85rem', marginRight: '0.3rem' }}>+</span>
                                                <input 
                                                    value={form.newCuisine} 
                                                    onChange={e => setForm({...form, newCuisine: e.target.value})}
                                                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCuisine(); } }}
                                                    placeholder="Add Cuisine" 
                                                    style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.8rem', width: '75px', color: '#4b5563', fontWeight: 500 }} 
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>Price Range</label>
                                        <div style={{ display: 'flex', borderRadius: '6px', border: '1px solid #d1d5db', height: '36px', overflow: 'hidden' }}>
                                            {['P', 'PP', 'PPP', 'PPPP'].map(p => (
                                                <button 
                                                    key={p} 
                                                    type="button"
                                                    onClick={() => setForm({...form, priceRange: p})}
                                                    style={{ flex: 1, backgroundColor: form.priceRange === p ? '#991b1b' : 'white', color: form.priceRange === p ? 'white' : '#6b7280', border: 'none', borderRight: p !== 'PPPP' ? '1px solid #e5e7eb' : 'none', fontWeight: form.priceRange === p ? 700 : 500, fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.15s' }}
                                                >
                                                    {p.replace(/P/g, '₱')}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.5rem', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}>
                        <h4 style={{ margin: '0 0 1.25rem 0', fontSize: '1rem', color: '#111827', fontWeight: 700 }}>Contact Information</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', paddingBottom: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '0.3rem' }}>Email</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <span style={{ fontSize: '0.9rem', color: '#111827', fontWeight: 600 }}>{form.email}</span>
                                        <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '0.15rem 0.6rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <CheckCircle2 size={12} /> Verified
                                        </span>
                                    </div>
                                </div>
                                <button style={{ color: '#b91c1c', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>Change Email</button>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '0.3rem' }}>Phone Number</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <span style={{ fontSize: '0.9rem', color: '#111827', fontWeight: 600 }}>{form.phone}</span>
                                        <span style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '0.15rem 0.6rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            Not Verified
                                        </span>
                                    </div>
                                </div>
                                <button style={{ color: '#b91c1c', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>Change Phone</button>
                            </div>
                        </div>
                    </div>

                    <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.5rem', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}>
                        <h4 style={{ margin: '0 0 1.25rem 0', fontSize: '1rem', color: '#111827', fontWeight: 700 }}>Restaurant Location</h4>
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                            <div style={{ flex: 1.2 }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>Address</label>
                                <textarea value={form.address} onChange={e => setForm({...form, address: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.85rem', outline: 'none', minHeight: '90px', resize: 'vertical', fontFamily: 'inherit' }} />
                                <button
                                    type="button"
                                    onClick={() => geocodeAddress(form.address)}
                                    style={{ marginTop: '0.5rem', padding: '0.4rem 0.8rem', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#f9fafb', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600, color: '#374151', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                                >
                                    <MapPin size={14} /> Pin on Map
                                </button>
                            </div>
                            <div style={{ flex: 1, borderRadius: '8px', overflow: 'hidden', border: '1px solid #e5e7eb', minHeight: '160px' }}>
                                <EditableMap position={mapPosition} onPositionChange={handleMapClick} />
                            </div>
                        </div>
                    </div>

                </div>

                <div style={{ padding: '1rem 1.75rem', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end', gap: '1rem', backgroundColor: 'white', position: 'sticky', bottom: 0, zIndex: 10, borderRadius: '0 0 12px 12px' }}>
                    <button onClick={onClose} style={{ padding: '0.6rem 1.5rem', border: '1px solid #d1d5db', borderRadius: '8px', backgroundColor: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', color: '#374151' }}>Cancel</button>
                    <button onClick={handleSave} disabled={saving} style={{ padding: '0.6rem 1.5rem', border: 'none', borderRadius: '8px', backgroundColor: '#991b1b', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', opacity: saving ? 0.7 : 1 }}>{saving ? 'Saving...' : 'Save Changes'}</button>
                </div>
            </div>
        </div>

        {modalCropSrc && modalCropMode && (
            <ImageCropModal
                imageSrc={modalCropSrc}
                aspect={modalCropMode === 'cover' ? 16 / 5 : 1}
                title={modalCropMode === 'cover' ? 'Crop Cover Image' : 'Crop Logo'}
                cropShape={modalCropMode === 'logo' ? 'round' : 'rect'}
                outputWidth={modalCropMode === 'cover' ? 1600 : 500}
                outputHeight={modalCropMode === 'cover' ? 500 : 500}
                onComplete={handleModalCropComplete}
                onCancel={handleModalCropCancel}
            />
        )}
        </>
    );
}

