import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ThemeContext } from '../../components/ui/ThemeContext';
import Navbar from '../../components/sections/Navbar';
import Footer from '../../components/sections/Footer';
import styles from './ProfilePage.module.css';

function ProfilePage() {
    const { user, isAuthenticated, loading, logout, updateProfile } = useAuth();
    const { isDarkMode } = useContext(ThemeContext);
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [editErrors, setEditErrors] = useState({});
    const [editServerError, setEditServerError] = useState('');
    const [editLoading, setEditLoading] = useState(false);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, loading, navigate]);

    if (loading || !isAuthenticated) {
        return (
            <div className="min-vh-100 d-flex justify-content-center align-items-center">
                <div className="spinner-border text-danger" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const openEditModal = () => {
        setEditForm({
            first_name: user?.first_name || '',
            last_name: user?.last_name || '',
            phone: user?.phone || '',
            address: user?.address || '',
            delivery_instructions: user?.delivery_instructions || '',
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

        // First name
        if (!editForm.first_name?.trim()) {
            errors.first_name = 'First name is required';
        } else if (editForm.first_name.trim().length < 2) {
            errors.first_name = 'First name must be at least 2 characters';
        } else if (!nameRegex.test(editForm.first_name.trim())) {
            errors.first_name = 'First name must only contain letters, spaces, hyphens, or apostrophes';
        }

        // Last name
        if (!editForm.last_name?.trim()) {
            errors.last_name = 'Last name is required';
        } else if (editForm.last_name.trim().length < 2) {
            errors.last_name = 'Last name must be at least 2 characters';
        } else if (!nameRegex.test(editForm.last_name.trim())) {
            errors.last_name = 'Last name must only contain letters, spaces, hyphens, or apostrophes';
        }

        // Phone (optional but must be valid if provided)
        if (editForm.phone?.trim()) {
            if (editForm.phone.trim().length < 7) {
                errors.phone = 'Phone number must be at least 7 characters';
            } else if (!phoneRegex.test(editForm.phone.trim())) {
                errors.phone = 'Phone number must contain only digits, spaces, dashes, or parentheses';
            }
        }

        // Address (optional but must be meaningful if provided)
        if (editForm.address?.trim() && editForm.address.trim().length < 5) {
            errors.address = 'Address must be at least 5 characters';
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
                setEditServerError(err.response?.data?.message || 'Failed to update profile. Please try again.');
            }
        } finally {
            setEditLoading(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    const Field = ({ label, value }) => (
        <div className={styles.fieldItem}>
            <span className={styles.fieldLabel}>{label}</span>
            {value
                ? <span className={styles.fieldValue}>{value}</span>
                : <span className={styles.fieldEmpty}>Not provided</span>
            }
        </div>
    );

    const memberSince = user?.created_at
        ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : 'Recently joined';

    /* CSS Modules: compose dark variant by toggling a separate class */
    const pageClass = [styles.profilePage, isDarkMode ? styles.profilePageDark : ''].join(' ');

    return (
        <>
            <Navbar />

            <div className={pageClass}>

                {/* ── Page body ── */}
                <div className={styles.profileBody}>

                    {/* ── Identity row ── */}
                    <div className={styles.identityRow}>

                        <div className={styles.avatarCircle}>
                            {getInitials(user?.name)}
                        </div>

                        <div className={styles.identityMeta}>
                            <h1 className={styles.userName}>{user?.name || 'User'}</h1>
                            <p className={styles.userEmail}>{user?.email}</p>
                            <div className={styles.badgeRow}>
                                <span className={`${styles.badge} ${styles.badgeActive}`}>
                                    <span className={styles.badgePulse} />
                                    Active
                                </span>
                                <span className={`${styles.badge} ${styles.badgeMember}`}>
                                    <i className="bi bi-calendar2-check" />
                                    &nbsp;{memberSince}
                                </span>
                            </div>
                        </div>

                        <div className={styles.identityActions}>
                            <button className={styles.btnOutline} onClick={openEditModal}>
                                <i className="bi bi-pencil-square" /> Edit Profile
                            </button>
                            <button className={styles.btnRed} onClick={() => setShowLogoutModal(true)}>
                                <i className="bi bi-box-arrow-right" /> Logout
                            </button>
                        </div>
                    </div>

                    <div className={styles.divider} />

                    {/* ── Card grid ── */}
                    <div className={styles.cardsGrid}>

                        {/* Personal Info */}
                        <div className={styles.infoCard}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardIcon}><i className="bi bi-person-badge" /></div>
                                <div>
                                    <h3 className={styles.cardTitle}>Personal Information</h3>
                                    <p className={styles.cardSubtitle}>Your basic account details</p>
                                </div>
                            </div>
                            <div className={styles.fieldList}>
                                <Field label="Full Name" value={user?.name} />
                                <Field label="Email Address" value={user?.email} />
                                <Field label="Contact Number" value={user?.phone} />
                                <Field label="Account Role" value={user?.role || 'Customer'} />
                            </div>
                        </div>

                        {/* Account Security */}
                        <div className={styles.infoCard}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardIcon}><i className="bi bi-shield-check" /></div>
                                <div>
                                    <h3 className={styles.cardTitle}>Account Security</h3>
                                    <p className={styles.cardSubtitle}>Privacy and login settings</p>
                                </div>
                            </div>
                            <div className={`${styles.fieldList} ${styles.fieldListSingle}`}>
                                <Field label="Password" value="••••••••••" />
                                <Field
                                    label="Email Verified"
                                    value={user?.email_verified_at ? 'Verified ✓' : 'Not verified'}
                                />
                                <Field
                                    label="Member Since"
                                    value={memberSince}
                                />
                            </div>
                        </div>

                        {/* Delivery Information */}
                        <div className={`${styles.infoCard} ${styles.cardFull}`}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardIcon}><i className="bi bi-geo-alt" /></div>
                                <div>
                                    <h3 className={styles.cardTitle}>Delivery Information</h3>
                                    <p className={styles.cardSubtitle}>Where your orders will be sent</p>
                                </div>
                            </div>
                            <div className={styles.fieldList}>
                                <Field label="Default Address" value={user?.address} />
                                <Field label="Delivery Instructions" value={user?.delivery_instructions} />
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <Footer />

            {showLogoutModal && (
                <div className={styles.modalOverlay} onClick={() => setShowLogoutModal(false)}>
                    <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalIcon}>
                            <i className="bi bi-box-arrow-right" />
                        </div>
                        <h3 className={styles.modalTitle}>Confirm Logout</h3>
                        <p className={styles.modalText}>Are you sure you want to log out of your account?</p>
                        <div className={styles.modalActions}>
                            <button className={styles.btnOutline} onClick={() => setShowLogoutModal(false)}>
                                Cancel
                            </button>
                            <button className={styles.btnRed} onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showEditModal && (
                <div className={styles.modalOverlay} onClick={() => setShowEditModal(false)}>
                    <div className={styles.editModalBox} onClick={e => e.stopPropagation()}>
                        <div className={styles.editModalHeader}>
                            <div className={styles.editModalIcon}>
                                <i className="bi bi-pencil-square" />
                            </div>
                            <div>
                                <h3 className={styles.editModalTitle}>Edit Profile</h3>
                                <p className={styles.editModalSubtitle}>Update your personal information</p>
                            </div>
                        </div>

                        {editServerError && (
                            <div className={styles.editServerError}>{editServerError}</div>
                        )}

                        <form onSubmit={handleEditSubmit}>
                            <div className={styles.editFormGrid}>
                                <div className={styles.editFormGroup}>
                                    <label className={styles.editLabel}>First Name</label>
                                    <input
                                        className={styles.editInput}
                                        value={editForm.first_name || ''}
                                        onChange={e => handleEditChange('first_name', e.target.value)}
                                    />
                                    {editErrors.first_name && <span className={styles.editError}>{editErrors.first_name}</span>}
                                </div>
                                <div className={styles.editFormGroup}>
                                    <label className={styles.editLabel}>Last Name</label>
                                    <input
                                        className={styles.editInput}
                                        value={editForm.last_name || ''}
                                        onChange={e => handleEditChange('last_name', e.target.value)}
                                    />
                                    {editErrors.last_name && <span className={styles.editError}>{editErrors.last_name}</span>}
                                </div>
                                <div className={`${styles.editFormGroup} ${styles.editFormFull}`}>
                                    <label className={styles.editLabel}>Phone Number</label>
                                    <input
                                        className={styles.editInput}
                                        value={editForm.phone || ''}
                                        onChange={e => handleEditChange('phone', e.target.value)}
                                    />
                                    {editErrors.phone && <span className={styles.editError}>{editErrors.phone}</span>}
                                </div>

                                    <div className={`${styles.editFormGroup} ${styles.editFormFull}`}>
                                        <label className={styles.editLabel}>Address</label>
                                        <input
                                            className={styles.editInput}
                                            value={editForm.address || ''}
                                            onChange={e => handleEditChange('address', e.target.value)}
                                        />
                                        {editErrors.address && <span className={styles.editError}>{editErrors.address}</span>}
                                    </div>
                                    <div className={`${styles.editFormGroup} ${styles.editFormFull}`}>
                                        <label className={styles.editLabel}>Delivery Instructions</label>
                                        <textarea
                                            className={`${styles.editInput} ${styles.editTextarea}`}
                                            value={editForm.delivery_instructions || ''}
                                            onChange={e => handleEditChange('delivery_instructions', e.target.value)}
                                        />
                                        {editErrors.delivery_instructions && <span className={styles.editError}>{editErrors.delivery_instructions}</span>}
                                    </div>

                            </div>

                            <div className={styles.editActions}>
                                <button type="button" className={styles.btnOutline} onClick={() => setShowEditModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className={styles.btnSave} disabled={editLoading}>
                                    {editLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default ProfilePage;
