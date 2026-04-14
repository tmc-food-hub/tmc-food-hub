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
    const [verificationCode, setVerificationCode] = useState('');
    const [twoFactorRequired, setTwoFactorRequired] = useState(false);
    const [infoMessage, setInfoMessage] = useState('');
    const [errors, setErrors] = useState({ email: '', password: '', code: '' });
    const [isLoading, setIsLoading] = useState(false);
    const { login, verifyTwoFactor } = useAdminAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        const nextErrors = { email: '', password: '', code: '' };
        let hasError = false;

        if (!email || !email.includes('@')) {
            nextErrors.email = 'Please enter a valid admin email address.';
            hasError = true;
        }

        if (!twoFactorRequired && !password) {
            nextErrors.password = 'Please enter your password.';
            hasError = true;
        }

        if (twoFactorRequired && verificationCode.trim().length !== 6) {
            nextErrors.code = 'Please enter the 6-digit verification code.';
            hasError = true;
        }

        setErrors(nextErrors);
        if (hasError) return;

        setIsLoading(true);
        const result = twoFactorRequired
            ? await verifyTwoFactor(email, verificationCode.trim())
            : await login(email, password);
        setIsLoading(false);

        if (result.success) {
            navigate('/admin-dashboard');
        } else if (result.requiresTwoFactor) {
            setTwoFactorRequired(true);
            setInfoMessage(result.message || 'Enter the 6-digit verification code sent to your email.');
            setErrors({ email: '', password: '', code: '' });
        } else {
            setErrors((prev) => ({
                ...prev,
                [twoFactorRequired ? 'code' : 'email']: result.message,
            }));
        }
    }

    return (
        <AuthLayout>
            <div className={styles.slideInRight}>
                <h2 className={styles.pageTitle}>Admin Portal</h2>
                <p className={styles.pageSubtitle}>Sign in to manage restaurants, customers, orders, and platform activity.</p>

                {twoFactorRequired && infoMessage && (
                    <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 10, padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#1D4ED8', marginBottom: '1rem' }}>
                        {infoMessage}
                    </div>
                )}

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

                    {!twoFactorRequired ? (
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
                    ) : (
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Verification Code</label>
                            <div className={styles.inputIconWrapper}>
                                <i className={`bi bi-shield-lock ${styles.inputIcon}`}></i>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    className={`${styles.formControl} ${styles.hasIcon} ${errors.code ? styles.isInvalid : ''}`}
                                    placeholder="Enter 6-digit code"
                                    value={verificationCode}
                                    onChange={(e) => {
                                        const nextValue = e.target.value.replace(/\D/g, '').slice(0, 6);
                                        setVerificationCode(nextValue);
                                        if (errors.code) setErrors({ ...errors, code: '' });
                                    }}
                                />
                            </div>
                            {errors.code && <span className={styles.errorText}>{errors.code}</span>}

                            <button
                                type="button"
                                style={{ marginTop: '0.6rem', background: 'none', border: 'none', color: '#4B5563', fontSize: '0.8rem', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
                                onClick={() => {
                                    setTwoFactorRequired(false);
                                    setVerificationCode('');
                                    setPassword('');
                                    setInfoMessage('');
                                    setErrors({ email: '', password: '', code: '' });
                                }}
                            >
                                Use a different account or password
                            </button>
                        </div>
                    )}

                    <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                        {isLoading ? (twoFactorRequired ? 'Verifying...' : 'Signing in...') : (twoFactorRequired ? 'Verify Code' : 'Sign In as Admin')}
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
