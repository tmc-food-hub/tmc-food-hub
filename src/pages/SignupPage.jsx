import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../components/layout/AuthLayout';
import styles from './AuthPages.module.css';

function SignupPage() {
    const [role, setRole] = useState('Customer'); // 'Customer' or 'Partner'
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Form fields
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const togglePassword = () => setShowPassword(!showPassword);
    const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Signup attempt:', { role, ...formData });
        // Handle actual registration logic here
    };

    // Dynamic subtext for left banner
    const customHeroSubtitle = role === 'Customer'
        ? "Browse menus, place orders, track deliveries, earn rewards"
        : "List your restaurant, manage your menu, receive and track orders";

    return (
        <AuthLayout heroSubtitle={customHeroSubtitle}>
            <div className={styles.slideInLeft}>
                <h2 className={styles.pageTitle} style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>
                    Sign up as a Customer or
                    <br />
                    Restaurant Partner
                </h2>
                <p className={styles.pageSubtitle} style={{ marginBottom: '2rem' }}>
                    Already have an account? <Link to="/login" className={styles.switchAccountLink}>Log in</Link>
                </p>

                <form onSubmit={handleSubmit}>
                    {/* Role Switcher */}
                    <label className={styles.formLabel}>I am a...</label>
                    <div className={styles.roleToggleContainer}>
                        <div
                            className={styles.roleToggleIndicator}
                            style={{ transform: role === 'Customer' ? 'translateX(0)' : 'translateX(100%)' }}
                        />
                        <button
                            type="button"
                            className={`${styles.roleToggleBtn} ${role === 'Customer' ? styles.active : ''}`}
                            onClick={() => setRole('Customer')}
                        >
                            I am a Customer
                        </button>
                        <button
                            type="button"
                            className={`${styles.roleToggleBtn} ${role === 'Partner' ? styles.active : ''}`}
                            onClick={() => setRole('Partner')}
                        >
                            I am a Restaurant Partner
                        </button>
                    </div>

                    <label className={styles.formLabel}>Name</label>
                    <div className="row g-3 mb-3">
                        <div className="col-12 col-sm-6">
                            <input
                                type="text"
                                name="firstName"
                                className={styles.formControl}
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-12 col-sm-6">
                            <input
                                type="text"
                                name="lastName"
                                className={styles.formControl}
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>
                            {role === 'Customer' ? 'Email' : 'Work/Business Email'}
                        </label>
                        <input
                            type="email"
                            name="email"
                            className={styles.formControl}
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.formGroup} style={{ marginBottom: '0.5rem' }}>
                        <label className={styles.formLabel}>Password</label>
                        <div className={styles.inputIconWrapper}>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                className={`${styles.formControl} ${styles.hasTrailing}`}
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                className={styles.inputTrailingIcon}
                                onClick={togglePassword}
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <small className="text-muted d-block mb-3" style={{ fontSize: '0.75rem' }}>
                        Must be at least 8 characters with a symbol & number
                    </small>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Confirm Password</label>
                        <div className={styles.inputIconWrapper}>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                className={`${styles.formControl} ${styles.hasTrailing}`}
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                className={styles.inputTrailingIcon}
                                onClick={toggleConfirmPassword}
                                aria-label="Toggle confirm password visibility"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <label className={`${styles.customCheckbox} mb-4`}>
                        <input type="checkbox" required />
                        <span>
                            I agree to the <Link to="/terms" style={{ color: '#B91C1C', textDecoration: 'none', fontWeight: 500 }}>Terms of Service</Link> and <Link to="/privacy" style={{ color: '#B91C1C', textDecoration: 'none', fontWeight: 500 }}>Privacy Policy</Link>
                        </span>
                    </label>

                    <button type="submit" className={styles.submitBtn}>
                        Next Step
                    </button>
                </form>

                <div className={styles.divider}>
                    <span className={styles.dividerText}>Or continue with</span>
                </div>

                <div className={styles.socialGrid}>
                    <button type="button" className={styles.socialBtn}>
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="18" height="18" />
                        Google
                    </button>
                    <button type="button" className={styles.socialBtn}>
                        <i className="bi bi-linkedin text-primary"></i>
                        LinkedIn
                    </button>
                </div>
            </div>
        </AuthLayout>
    );
}

export default SignupPage;
