import React, { useEffect, useRef, useState } from 'react';
import {
    User, Shield, Bell, Store, CreditCard, Search,
    CheckCircle2, AlertCircle, X, Save, Check,
    PauseCircle, XCircle
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

export default function SettingsSection({ store, refreshOwner, items = [], refreshInventory }) {
    const [activeTab, setActiveTab] = useState('account');

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
