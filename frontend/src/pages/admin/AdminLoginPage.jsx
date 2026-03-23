import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout';
import styles from '../customer/AuthPages.module.css';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminLoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAdminAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        const nextErrors = { email: '', password: '' };
        let hasError = false;

        if (!email || !email.includes('@')) {
            nextErrors.email = 'Please enter a valid admin email address.';
            hasError = true;
        }

        if (!password) {
            nextErrors.password = 'Please enter your password.';
            hasError = true;
        }

        setErrors(nextErrors);
        if (hasError) return;

        setIsLoading(true);
        const result = await login(email, password);
        setIsLoading(false);

        if (result.success) {
            navigate('/admin-dashboard');
        } else {
            setErrors({ email: result.message, password: '' });
        }
    }

    return (
        <AuthLayout>
            <div className={styles.slideInRight}>
                <h2 className={styles.pageTitle}>Admin Portal</h2>
                <p className={styles.pageSubtitle}>Sign in to manage restaurants, customers, orders, and platform activity.</p>

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Email</label>
                        <div className={styles.inputIconWrapper}>
                            <i className={`bi bi-envelope ${styles.inputIcon}`}></i>
                            <input
                                type="email"
                                className={`${styles.formControl} ${styles.hasIcon} ${errors.email ? styles.isInvalid : ''}`}
                                placeholder="admin@tmcfoodhub.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (errors.email) setErrors({ ...errors, email: '' });
                                }}
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
                                placeholder="Enter your admin password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (errors.password) setErrors({ ...errors, password: '' });
                                }}
                            />
                            <button type="button" className={styles.inputTrailingIcon} onClick={() => setShowPassword((prev) => !prev)}>
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && <span className={styles.errorText}>{errors.password}</span>}
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                        {isLoading ? 'Signing in...' : 'Sign In as Admin'}
                    </button>
                </form>

                <div className={styles.divider}>
                    <span className={styles.dividerText}>Demo credentials</span>
                </div>

                <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 10, padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#6B7280' }}>
                    <strong style={{ color: '#374151', display: 'block', marginBottom: 4 }}>Platform admin:</strong>
                    <code style={{ background: '#E5E7EB', padding: '2px 6px', borderRadius: 4, color: '#374151' }}>
                        admin@tmcfoodhub.com / admin12345
                    </code>
                </div>

                <p className={styles.switchAccount} style={{ marginTop: '1.25rem' }}>
                    Need the restaurant side instead? <Link to="/owner-login" className={styles.switchAccountLink}>Restaurant Owner Login</Link>
                </p>
            </div>
        </AuthLayout>
    );
}
