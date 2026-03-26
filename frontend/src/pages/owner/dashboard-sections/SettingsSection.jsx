import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
    User, Shield, Bell, Store, CreditCard, Search,
    CheckCircle2, AlertCircle, X, Save, Check,
    PauseCircle, XCircle, MapPin, Phone
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './SettingsSection.module.css';
import api from '../../../api/axios';

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
                {activeTab === 'security' && <PlaceholderTab title="Security Settings" description="Manage your password, two-factor authentication, and login sessions." />}
                {activeTab === 'notifications' && <PlaceholderTab title="Notifications" description="Configure your notification preferences for orders, promotions, and system alerts." />}
                {activeTab === 'restaurant-profile' && <RestaurantProfileTab store={store} refreshOwner={refreshOwner} />}
                {activeTab === 'store-operations' && <StoreOperationsTab store={store} items={items} refreshInventory={refreshInventory} />}
                {activeTab === 'payment' && <PlaceholderTab title="Payment" description="Manage payment methods and billing information." />}
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

            await api.post('/owner/profile-update', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

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

        const formData = new FormData();
        formData.append('first_name', store.firstName || '');
        formData.append('last_name', store.lastName || '');
        formData.append('restaurant_name', store.branchName || '');
        formData.append('business_address', store.location || '');
        formData.append('business_contact_number', store.phone || '');
        formData.append('logo_file', file);

        try {
            await api.post('/owner/profile-update', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
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
                            <img src={store.logo} alt={fullName} className={styles.avatar} loading="lazy" decoding="async" />
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

function StoreOperationsTab({ store, items = [], refreshInventory }) {
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
                                                            <img src={item.image} alt={item.title} className={styles.blacklistItemImage} />
                                                            <span className={styles.blacklistItemName}>{item.title}</span>
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

            <div className={styles.card} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    {store.logo ? (
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', padding: '0.2rem', border: '1px solid #e5e7eb', backgroundColor: 'white' }}>
                            <img src={store.logo} alt={store.branchName} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                        </div>
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
    const [previewLogo, setPreviewLogo] = useState(store.logo);
    const [saving, setSaving] = useState(false);
    const [mapPosition, setMapPosition] = useState(DEFAULT_CENTER);
    const fileRef = useRef(null);

    // Geocode initial address on mount
    useEffect(() => {
        if (store.location) {
            geocodeAddressToLatLng(store.location).then(r => { if (r) setMapPosition(r); });
        }
    }, []);

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
        if (file) {
            setLogoFile(file);
            setPreviewLogo(URL.createObjectURL(file));
        }
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
            
            await api.post('/owner/profile-update', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

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
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={onClose}>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', width: '100%', maxWidth: '780px', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.75rem', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 10 }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#111827' }}>Edit Restaurant Profile</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex', padding: '0.25rem' }}><X size={20} /></button>
                </div>

                <div style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: '#f9fafb' }}>
                    
                    <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.5rem', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}>
                        <h4 style={{ margin: '0 0 1.25rem 0', fontSize: '1rem', color: '#111827', fontWeight: 700 }}>Restaurant Information</h4>
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                            <div style={{ flexShrink: 0 }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem' }}>Restaurant Name</label>
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
    );
}

