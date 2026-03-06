import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ThemeContext } from '../components/ui/ThemeContext';
import Navbar from '../components/sections/Navbar';
import Footer from '../components/sections/Footer';
import styles from './ProfilePage.module.css';

function ProfilePage() {
    const { user, isAuthenticated, loading, logout } = useAuth();
    const { isDarkMode } = useContext(ThemeContext);
    const navigate = useNavigate();

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
                    <div className={styles.identityRow} data-aos="fade-up" data-aos-duration="600">

                        <div className={styles.avatarCircle} data-aos="zoom-in" data-aos-delay="100">
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
                            <button className={styles.btnOutline}>
                                <i className="bi bi-pencil-square" /> Edit Profile
                            </button>
                            <button className={styles.btnRed} onClick={handleLogout}>
                                <i className="bi bi-box-arrow-right" /> Logout
                            </button>
                        </div>
                    </div>

                    <div className={styles.divider} />

                    {/* ── Card grid ── */}
                    <div className={styles.cardsGrid}>

                        {/* Personal Info */}
                        <div className={styles.infoCard} data-aos="fade-up" data-aos-delay="100">
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
                                <Field label="Contact Number" value={user?.contactNumber} />
                                <Field label="Account Role" value={user?.role || 'Customer'} />
                            </div>
                        </div>

                        {/* Account Security */}
                        <div className={styles.infoCard} data-aos="fade-up" data-aos-delay="200">
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
                        <div className={`${styles.infoCard} ${styles.cardFull}`} data-aos="fade-up" data-aos-delay="300">
                            <div className={styles.cardHeader}>
                                <div className={styles.cardIcon}><i className="bi bi-geo-alt" /></div>
                                <div>
                                    <h3 className={styles.cardTitle}>Delivery Information</h3>
                                    <p className={styles.cardSubtitle}>Where your orders will be sent</p>
                                </div>
                            </div>
                            <div className={styles.fieldList}>
                                <Field label="Default Address" value={user?.address} />
                                <Field label="Delivery Instructions" value={user?.deliveryInstructions} />
                            </div>
                        </div>

                        {/* Restaurant Info – Partners only */}
                        {user?.role === 'Partner' && (
                            <div className={`${styles.infoCard} ${styles.cardFull}`} data-aos="fade-up" data-aos-delay="400">
                                <div className={styles.cardHeader}>
                                    <div className={styles.cardIcon}><i className="bi bi-shop" /></div>
                                    <div>
                                        <h3 className={styles.cardTitle}>Restaurant Information</h3>
                                        <p className={styles.cardSubtitle}>Your business details as a Partner</p>
                                    </div>
                                </div>
                                <div className={styles.fieldList}>
                                    <Field label="Restaurant Name" value={user?.restaurantName} />
                                    <Field label="Business Contact" value={user?.businessContactNumber} />
                                    <Field label="Business Address" value={user?.businessAddress} />
                                    <Field label="Permit / TIN" value={user?.businessPermit} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}

export default ProfilePage;
