import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeContext } from '../../components/ui/ThemeContext';
import styles from '../../pages/AuthPages.module.css';
import heroImage from '../../assets/home/main_hero.png';

const AuthLayout = ({ children, heroSubtitle }) => {
    const { isDarkMode } = useContext(ThemeContext);
    const location = useLocation();

    return (
        <div className={`container-fluid p-0 ${isDarkMode ? styles.darkTheme : styles.lightTheme}`}>
            <div className="row g-0 vh-100">
                {/* Left Side: Hero Image Cover (Hidden on Mobile) */}
                <div className="col-lg-6 d-none d-lg-block position-relative">
                    <div className={styles.imageBackgroundWrapper}>
                        <img
                            src={heroImage}
                            alt="TMC Food Hub Kitchen"
                            className={styles.coverImage}
                        />
                        <div className={styles.gradientOverlay}></div>
                    </div>

                    <div className={styles.heroContent} style={{ color: '#FFFFFF' }}>
                        <h1 className={styles.heroTitle} style={{ color: '#FFFFFF' }}>
                            Hungry? You're in<br />the Right Place.
                        </h1>
                        <p className={styles.heroSubtitle} style={{ color: '#E5E7EB' }}>
                            {heroSubtitle || "Browse menus, place orders, track deliveries, earn rewards"}
                        </p>

                        <div className={styles.heroFeatures}>
                            <div className={styles.featureItem}>
                                <div className={styles.featureIconBox}>
                                    <i className="bi bi-shop"></i>
                                </div>
                                <span className={styles.featureText}>100+ Local Restaurants</span>
                            </div>
                            <div className={styles.featureItem}>
                                <div className={styles.featureIconBox}>
                                    <i className="bi bi-truck"></i>
                                </div>
                                <span className={styles.featureText}>Real-Time Order Tracking</span>
                            </div>
                            <div className={styles.featureItem}>
                                <div className={styles.featureIconBox}>
                                    <i className="bi bi-patch-check"></i>
                                </div>
                                <span className={styles.featureText}>Exclusive Deals & Promos</span>
                            </div>
                        </div>

                        <div className={styles.heroLogoWrapper}>
                            <img src="/assets/images/TMClogo.png" alt="TMC Logo" className={styles.heroLogo} />
                        </div>
                    </div>
                </div>

                {/* Right Side: Auth Form Container */}
                <div className={`col-12 col-lg-6 d-flex flex-column overflow-y-auto ${styles.formSide}`} style={{ maxHeight: '100vh' }}>
                    {/* Optional close/back button could go here, for now it's just the content centering */}
                    <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center w-100 p-4 p-md-5">
                        <div className={styles.formContentWrapper}>
                            {children}
                        </div>
                    </div>

                    {(location.pathname === '/login' || location.pathname === '/forgot-password') && (
                        <footer className={styles.authFooter}>
                            &copy; 2026 TMC Foodhub. All Rights Reserved.
                        </footer>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
