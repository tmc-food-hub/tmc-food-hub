import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ThemeContext } from '../../components/ui/ThemeContext';
import Navbar from '../../components/sections/Navbar';
import Footer from '../../components/sections/Footer';
import {
    User, Mail, Phone, Shield, MapPin, Home, Pencil, Lock,
    LogOut, CalendarDays, CheckCircle2, X, ChevronRight, FileText
} from 'lucide-react';
import styles from './ProfilePage.module.css';

function ProfilePage() {
    const { user, isAuthenticated, loading, logout, updateProfile, changePassword, setShowLoginPrompt } = useAuth();
    const { isDarkMode } = useContext(ThemeContext);
    const navigate = useNavigate();

    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [editErrors, setEditErrors] = useState({});
    const [editServerError, setEditServerError] = useState('');
    const [editLoading, setEditLoading] = useState(false);

    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordForm, setPasswordForm] = useState({});
    const [passwordErrors, setPasswordErrors] = useState({});
    const [passwordServerError, setPasswordServerError] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState('');

    const [showAddressModal, setShowAddressModal] = useState(false);
    const [addressForm, setAddressForm] = useState({});
    const [addressLoading, setAddressLoading] = useState(false);
    const [addressErrors, setAddressErrors] = useState({});

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/');
            setShowLoginPrompt(true);
        }
    }, [isAuthenticated, loading, navigate, setShowLoginPrompt]);

    if (loading || !isAuthenticated) {
        return (
            <div className="min-vh-100 d-flex justify-content-center align-items-center">
                <div className="spinner-border text-danger" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    /* ── Handlers ── */

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    /* Edit Profile */
    const openEditModal = () => {
        setEditForm({
            first_name: user?.first_name || '',
            last_name: user?.last_name || '',
            phone: user?.phone || '',
        });
        setEditErrors({});
        setEditServerError('');
        setShowEditModal(true);
    };

    const handleEditChange = (field, value) => {
        setEditForm(prev => ({ ...prev, [field]: value }));
        if (editErrors[field]) {
            setEditErrors(prev => { const next = { ...prev }; delete next[field]; return next; });
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const errors = {};
        const nameRegex = /^[A-Za-z\u00C0-\u024F\s\-']+$/;
        const phoneRegex = /^[+]?[\d\s\-()]+$/;

        if (!editForm.first_name?.trim()) errors.first_name = 'First name is required';
        else if (editForm.first_name.trim().length < 2) errors.first_name = 'First name must be at least 2 characters';
        else if (!nameRegex.test(editForm.first_name.trim())) errors.first_name = 'First name must only contain letters';

        if (!editForm.last_name?.trim()) errors.last_name = 'Last name is required';
        else if (editForm.last_name.trim().length < 2) errors.last_name = 'Last name must be at least 2 characters';
        else if (!nameRegex.test(editForm.last_name.trim())) errors.last_name = 'Last name must only contain letters';

        if (editForm.phone?.trim()) {
            if (editForm.phone.trim().length < 7) errors.phone = 'Phone must be at least 7 characters';
            else if (!phoneRegex.test(editForm.phone.trim())) errors.phone = 'Invalid phone format';
        }

        if (Object.keys(errors).length) { setEditErrors(errors); return; }

        setEditLoading(true);
        setEditServerError('');
        try {
            await updateProfile(editForm);
            setShowEditModal(false);
        } catch (err) {
            if (err.response?.status === 422) {
                const serverErrors = err.response.data.errors || {};
                const mapped = {};
                Object.entries(serverErrors).forEach(([key, msgs]) => { mapped[key] = msgs[0]; });
                setEditErrors(mapped);
            } else {
                setEditServerError(err.response?.data?.message || 'Failed to update profile.');
            }
        } finally {
            setEditLoading(false);
        }
    };

    /* Address */
    const openAddressModal = () => {
        setAddressForm({
            address: user?.address || '',
            delivery_instructions: user?.delivery_instructions || '',
        });
        setAddressErrors({});
        setShowAddressModal(true);
    };

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        const errors = {};
        if (addressForm.address?.trim() && addressForm.address.trim().length < 5) {
            errors.address = 'Address must be at least 5 characters';
        }
        if (Object.keys(errors).length) { setAddressErrors(errors); return; }

        setAddressLoading(true);
        try {
            await updateProfile(addressForm);
            setShowAddressModal(false);
        } catch (err) {
            console.error('Failed to update address:', err);
        } finally {
            setAddressLoading(false);
        }
    };

    /* Change Password */
    const openPasswordModal = () => {
        setPasswordForm({ current_password: '', password: '', password_confirmation: '' });
        setPasswordErrors({});
        setPasswordServerError('');
        setPasswordSuccess('');
        setShowPasswordModal(true);
    };

    const handlePasswordChange = (field, value) => {
        setPasswordForm(prev => ({ ...prev, [field]: value }));
        if (passwordErrors[field]) {
            setPasswordErrors(prev => { const next = { ...prev }; delete next[field]; return next; });
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        const errors = {};
        if (!passwordForm.current_password) errors.current_password = 'Current password is required';
        if (!passwordForm.password) errors.password = 'New password is required';
        else if (passwordForm.password.length < 8) errors.password = 'Must be at least 8 characters';
        if (passwordForm.password !== passwordForm.password_confirmation) errors.password_confirmation = 'Passwords do not match';
        if (Object.keys(errors).length) { setPasswordErrors(errors); return; }

        setPasswordLoading(true);
        setPasswordServerError('');
        setPasswordSuccess('');
        try {
            await changePassword(passwordForm.current_password, passwordForm.password, passwordForm.password_confirmation);
            setPasswordSuccess('Password updated! Redirecting to login...');
            setTimeout(async () => {
                setShowPasswordModal(false);
                setPasswordSuccess('');
                await logout();
                navigate('/login');
            }, 2000);
        } catch (err) {
            if (err.response?.status === 422) {
                const serverErrors = err.response.data.errors || {};
                const mapped = {};
                Object.entries(serverErrors).forEach(([key, msgs]) => { mapped[key] = msgs[0]; });
                setPasswordErrors(mapped);
            } else {
                setPasswordServerError(err.response?.data?.message || 'Failed to change password.');
            }
        } finally {
            setPasswordLoading(false);
        }
    };

    const memberSince = user?.created_at
        ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : 'Recently joined';

    const pageClass = [styles.profilePage, isDarkMode ? styles.profilePageDark : ''].join(' ');

    return (
        <>
            <Navbar />

            <div className={pageClass}>
                <div className={styles.profileBody}>

                    {/* ── Profile Header ── */}
                    <div className={styles.profileHeader}>
                        <div className={styles.avatarCircle}>
                            {getInitials(user?.name)}
                        </div>
                        <div className={styles.headerInfo}>
                            <h1 className={styles.userName}>{user?.name || 'User'}</h1>
                            <p className={styles.userEmail}>{user?.email}</p>
                            <div className={styles.badgeRow}>
                                <span className={`${styles.badge} ${styles.badgeActive}`}>
                                    <span className={styles.badgePulse} />
                                    Active
                                </span>
                                {user?.email_verified_at && (
                                    <span className={`${styles.badge} ${styles.badgeVerified}`}>
                                        <CheckCircle2 size={12} /> Verified
                                    </span>
                                )}
                                <span className={`${styles.badge} ${styles.badgeMember}`}>
                                    <CalendarDays size={12} /> {memberSince}
                                </span>
                            </div>
                        </div>
                        <div className={styles.headerActions}>
                            <button className={styles.btnOutline} onClick={openEditModal}>
                                <Pencil size={15} /> Edit Profile
                            </button>
                            <button className={styles.btnOutlineRed} onClick={() => setShowLogoutModal(true)}>
                                <LogOut size={15} /> Logout
                            </button>
                        </div>
                    </div>

                    {/* ── Home Address Card (Prominent) ── */}
                    <div className={styles.addressCard}>
                        <div className={styles.addressCardHeader}>
                            <div className={styles.addressCardIcon}>
                                <Home size={20} />
                            </div>
                            <div className={styles.addressCardMeta}>
                                <h3 className={styles.addressCardTitle}>Home Address</h3>
                                <p className={styles.addressCardSub}>Your default delivery location</p>
                            </div>
                            <button className={styles.addressChangeBtn} onClick={openAddressModal}>
                                {user?.address ? 'Change' : 'Add Address'}
                            </button>
                        </div>
                        <div className={styles.addressCardBody}>
                            {user?.address ? (
                                <>
                                    <div className={styles.addressDisplay}>
                                        <MapPin size={16} className={styles.addressPinIcon} />
                                        <span>{user.address}</span>
                                    </div>
                                    {user.delivery_instructions && (
                                        <div className={styles.deliveryNote}>
                                            <FileText size={14} />
                                            <span>{user.delivery_instructions}</span>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className={styles.addressEmpty}>
                                    <MapPin size={18} />
                                    <span>No home address set. Add one for faster checkout.</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Info Grid ── */}
                    <div className={styles.infoGrid}>

                        {/* Personal Information */}
                        <div className={styles.infoCard}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardIcon}><User size={18} /></div>
                                <div>
                                    <h3 className={styles.cardTitle}>Personal Information</h3>
                                    <p className={styles.cardSub}>Your account details</p>
                                </div>
                            </div>
                            <div className={styles.fieldList}>
                                <InfoField icon={<User size={15} />} label="Full Name" value={user?.name} />
                                <InfoField icon={<Mail size={15} />} label="Email Address" value={user?.email} />
                                <InfoField icon={<Phone size={15} />} label="Contact Number" value={user?.phone} />
                            </div>
                        </div>

                        {/* Account Security */}
                        <div className={styles.infoCard}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardIcon}><Shield size={18} /></div>
                                <div>
                                    <h3 className={styles.cardTitle}>Account Security</h3>
                                    <p className={styles.cardSub}>Privacy and login settings</p>
                                </div>
                            </div>
                            <div className={styles.fieldList}>
                                <InfoField icon={<Lock size={15} />} label="Password" value="••••••••••" />
                                <InfoField
                                    icon={<CheckCircle2 size={15} />}
                                    label="Email Verified"
                                    value={user?.email_verified_at ? 'Verified ✓' : 'Not verified'}
                                />
                                <InfoField icon={<CalendarDays size={15} />} label="Member Since" value={memberSince} />
                            </div>
                            <button className={styles.changePasswordBtn} onClick={openPasswordModal}>
                                <Lock size={14} />
                                Change Password
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            <Footer />

            {/* ── Logout Modal ── */}
            {showLogoutModal && (
                <div className={styles.modalOverlay} onClick={() => setShowLogoutModal(false)}>
                    <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalIconWrap}>
                            <LogOut size={28} />
                        </div>
                        <h3 className={styles.modalTitle}>Confirm Logout</h3>
                        <p className={styles.modalText}>Are you sure you want to log out of your account?</p>
                        <div className={styles.modalActions}>
                            <button className={styles.btnOutline} onClick={() => setShowLogoutModal(false)}>Cancel</button>
                            <button className={styles.btnRed} onClick={handleLogout}>Logout</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Edit Profile Modal ── */}
            {showEditModal && (
                <div className={styles.modalOverlay} onClick={() => setShowEditModal(false)}>
                    <div className={styles.editModalBox} onClick={e => e.stopPropagation()}>
                        <div className={styles.editModalHeader}>
                            <div className={styles.editModalIcon}><Pencil size={18} /></div>
                            <div>
                                <h3 className={styles.editModalTitle}>Edit Profile</h3>
                                <p className={styles.editModalSub}>Update your personal information</p>
                            </div>
                            <button className={styles.modalCloseBtn} onClick={() => setShowEditModal(false)}><X size={18} /></button>
                        </div>

                        {editServerError && <div className={styles.serverError}>{editServerError}</div>}

                        <form onSubmit={handleEditSubmit}>
                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>First Name</label>
                                    <input className={styles.formInput} value={editForm.first_name || ''} onChange={e => handleEditChange('first_name', e.target.value)} />
                                    {editErrors.first_name && <span className={styles.formError}>{editErrors.first_name}</span>}
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Last Name</label>
                                    <input className={styles.formInput} value={editForm.last_name || ''} onChange={e => handleEditChange('last_name', e.target.value)} />
                                    {editErrors.last_name && <span className={styles.formError}>{editErrors.last_name}</span>}
                                </div>
                                <div className={`${styles.formGroup} ${styles.formFull}`}>
                                    <label className={styles.formLabel}>Phone Number</label>
                                    <input className={styles.formInput} value={editForm.phone || ''} onChange={e => handleEditChange('phone', e.target.value.replace(/\D/g, ''))} />
                                    {editErrors.phone && <span className={styles.formError}>{editErrors.phone}</span>}
                                </div>
                            </div>
                            <div className={styles.modalFooter}>
                                <button type="button" className={styles.btnOutline} onClick={() => setShowEditModal(false)}>Cancel</button>
                                <button type="submit" className={styles.btnSave} disabled={editLoading}>
                                    {editLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Address Modal ── */}
            {showAddressModal && (
                <div className={styles.modalOverlay} onClick={() => setShowAddressModal(false)}>
                    <div className={styles.editModalBox} onClick={e => e.stopPropagation()}>
                        <div className={styles.editModalHeader}>
                            <div className={styles.editModalIcon}><Home size={18} /></div>
                            <div>
                                <h3 className={styles.editModalTitle}>Home Address</h3>
                                <p className={styles.editModalSub}>Set your default delivery location</p>
                            </div>
                            <button className={styles.modalCloseBtn} onClick={() => setShowAddressModal(false)}><X size={18} /></button>
                        </div>

                        <form onSubmit={handleAddressSubmit}>
                            <div className={styles.formGrid}>
                                <div className={`${styles.formGroup} ${styles.formFull}`}>
                                    <label className={styles.formLabel}>Home Address</label>
                                    <input
                                        className={styles.formInput}
                                        placeholder="e.g. 123 Quezon Avenue, Unit 4B, Brgy. South Triangle"
                                        value={addressForm.address || ''}
                                        onChange={e => setAddressForm(prev => ({ ...prev, address: e.target.value }))}
                                    />
                                    {addressErrors.address && <span className={styles.formError}>{addressErrors.address}</span>}
                                </div>
                                <div className={`${styles.formGroup} ${styles.formFull}`}>
                                    <label className={styles.formLabel}>Delivery Instructions</label>
                                    <textarea
                                        className={`${styles.formInput} ${styles.formTextarea}`}
                                        placeholder="e.g. Gate code is 1234, leave at the lobby table..."
                                        value={addressForm.delivery_instructions || ''}
                                        onChange={e => setAddressForm(prev => ({ ...prev, delivery_instructions: e.target.value }))}
                                        rows={3}
                                    />
                                </div>
                            </div>
                            <div className={styles.modalFooter}>
                                <button type="button" className={styles.btnOutline} onClick={() => setShowAddressModal(false)}>Cancel</button>
                                <button type="submit" className={styles.btnSave} disabled={addressLoading}>
                                    {addressLoading ? 'Saving...' : 'Save Address'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Change Password Modal ── */}
            {showPasswordModal && (
                <div className={styles.modalOverlay} onClick={() => setShowPasswordModal(false)}>
                    <div className={styles.editModalBox} onClick={e => e.stopPropagation()}>
                        <div className={styles.editModalHeader}>
                            <div className={styles.editModalIcon}><Lock size={18} /></div>
                            <div>
                                <h3 className={styles.editModalTitle}>Change Password</h3>
                                <p className={styles.editModalSub}>Update your account security</p>
                            </div>
                            <button className={styles.modalCloseBtn} onClick={() => setShowPasswordModal(false)}><X size={18} /></button>
                        </div>

                        {passwordServerError && <div className={styles.serverError}>{passwordServerError}</div>}
                        {passwordSuccess && (
                            <div className={styles.successMsg}>{passwordSuccess}</div>
                        )}

                        <form onSubmit={handlePasswordSubmit}>
                            <div className={styles.formGrid}>
                                <div className={`${styles.formGroup} ${styles.formFull}`}>
                                    <label className={styles.formLabel}>Current Password</label>
                                    <input type="password" className={styles.formInput} value={passwordForm.current_password || ''} onChange={e => handlePasswordChange('current_password', e.target.value)} disabled={passwordLoading || passwordSuccess} />
                                    {passwordErrors.current_password && <span className={styles.formError}>{passwordErrors.current_password}</span>}
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>New Password</label>
                                    <input type="password" className={styles.formInput} value={passwordForm.password || ''} onChange={e => handlePasswordChange('password', e.target.value)} disabled={passwordLoading || passwordSuccess} />
                                    {passwordErrors.password && <span className={styles.formError}>{passwordErrors.password}</span>}
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Confirm New Password</label>
                                    <input type="password" className={styles.formInput} value={passwordForm.password_confirmation || ''} onChange={e => handlePasswordChange('password_confirmation', e.target.value)} disabled={passwordLoading || passwordSuccess} />
                                    {passwordErrors.password_confirmation && <span className={styles.formError}>{passwordErrors.password_confirmation}</span>}
                                </div>
                            </div>
                            <div className={styles.modalFooter}>
                                <button type="button" className={styles.btnOutline} onClick={() => setShowPasswordModal(false)} disabled={passwordLoading}>Cancel</button>
                                <button type="submit" className={styles.btnSave} disabled={passwordLoading || passwordSuccess}>
                                    {passwordLoading ? 'Saving...' : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

/* ── Helper Component ── */
function InfoField({ icon, label, value }) {
    return (
        <div className={styles.fieldItem}>
            <div className={styles.fieldIcon}>{icon}</div>
            <div className={styles.fieldContent}>
                <span className={styles.fieldLabel}>{label}</span>
                {value
                    ? <span className={styles.fieldValue}>{value}</span>
                    : <span className={styles.fieldEmpty}>Not provided</span>
                }
            </div>
        </div>
    );
}

export default ProfilePage;
