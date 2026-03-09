import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout';
import { useOwnerAuth } from '../../context/OwnerAuthContext';
import styles from '../customer/AuthPages.module.css';

function OwnerLoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useOwnerAuth();
    const navigate = useNavigate();

    const togglePassword = () => setShowPassword(!showPassword);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let newErrors = { email: '', password: '' };
        let hasError = false;

        if (!email || !email.includes('@')) {
            newErrors.email = 'Please enter a valid email address.';
            hasError = true;
        }

        if (!password) {
            newErrors.password = 'Please enter your password.';
            hasError = true;
        }

        setErrors(newErrors);
        if (hasError) return;

        setIsLoading(true);
        await new Promise(r => setTimeout(r, 600));
        const result = login(email, password);
        setIsLoading(false);

        if (result.success) {
            navigate('/owner-dashboard');
        } else {
            setErrors({ email: result.message, password: '' });
        }
    };

    return (
        <AuthLayout>
            <div className={styles.slideInRight}>
                <h2 className={styles.pageTitle}>Restaurant Owner Portal</h2>
                <p className={styles.pageSubtitle}>Sign in to manage your branch, menu, and operating hours.</p>

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Email</label>
                        <div className={styles.inputIconWrapper}>
                            <i className={`bi bi-envelope ${styles.inputIcon}`}></i>
                            <input
                                type="email"
                                className={`${styles.formControl} ${styles.hasIcon} ${errors.email ? styles.isInvalid : ''}`}
                                placeholder="yourstore@tmcfoodhub.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (errors.email) setErrors({ ...errors, email: '' });
                                }}
                                required={false}
                            />
                        </div>
                        {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Password</label>
                        <div className={styles.inputIconWrapper}>
                            <i className={`bi bi-lock ${styles.inputIcon}`}></i>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className={`${styles.formControl} ${styles.hasIcon} ${styles.hasTrailing} ${errors.password ? styles.isInvalid : ''}`}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (errors.password) setErrors({ ...errors, password: '' });
                                }}
                                required={false}
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
                        {errors.password && <span className={styles.errorText}>{errors.password}</span>}
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                        {isLoading ? 'Signing in...' : 'Sign In to Dashboard'}
                    </button>
                </form>

                <div className={styles.divider}>
                    <span className={styles.dividerText}>Demo credentials</span>
                </div>

                <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 10, padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#6B7280' }}>
                    <strong style={{ color: '#374151', display: 'block', marginBottom: 4 }}>Example — Jollibee owner:</strong>
                    <code style={{ background: '#E5E7EB', padding: '2px 6px', borderRadius: 4, color: '#374151' }}>
                        jollibee@tmcfoodhub.com / jollibee123
                    </code>
                </div>

                <p className={styles.switchAccount} style={{ marginTop: '1.25rem' }}>
                    Not a restaurant owner?&nbsp;
                    <Link to="/login" className={styles.switchAccountLink}>Customer Login</Link>
                </p>
            </div>
        </AuthLayout>
    );
}

export default OwnerLoginPage;
