import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../components/layout/AuthLayout';
import { useAuth } from '../context/AuthContext';
import styles from './AuthPages.module.css';

function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
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
        try {
            await login(email, password);
            navigate('/profile');
        } catch (err) {
            const message = err.response?.data?.message || 'Login failed. Please try again.';
            setErrors({ email: message, password: '' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className={styles.slideInRight}>
                <h2 className={styles.pageTitle}>Welcome back!</h2>
                <p className={styles.pageSubtitle}>Please enter your details to access your account.</p>

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Email</label>
                        <div className={styles.inputIconWrapper}>
                            <i className={`bi bi-envelope ${styles.inputIcon}`}></i>
                            <input
                                type="email"
                                className={`${styles.formControl} ${styles.hasIcon} ${errors.email ? styles.isInvalid : ''}`}
                                placeholder="e.g. you@example.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (errors.email) setErrors({ ...errors, email: '' });
                                }}
                                required={false} /* Disabled native validation to show custom error */
                            />
                        </div>
                        {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Password</label>
                        <div className={styles.inputIconWrapper}>
                            <i className={`bi bi-lock ${styles.inputIcon}`}></i>
                            <input
                                type={showPassword ? "text" : "password"}
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

                    <div className={styles.checkboxRow}>
                        <label className={styles.customCheckbox}>
                            <input type="checkbox" />
                            Remember Me
                        </label>
                        <Link to="/forgot-password" className={styles.forgotLink}>
                            Forgot Password
                        </Link>
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
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

                <p className={styles.switchAccount}>
                    Don't have an account?
                    <Link to="/signup" className={styles.switchAccountLink}>Sign up</Link>
                </p>
            </div>
        </AuthLayout>
    );
}

export default LoginPage;
