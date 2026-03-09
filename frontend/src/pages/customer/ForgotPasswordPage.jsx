import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import styles from './AuthPages.module.css';

function ForgotPasswordPage() {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Reset password for:', email);
    };

    return (
        <AuthLayout>
            <div className={styles.slideInRight}>
                <h2 className={styles.pageTitle}>Forgot password?</h2>
                <p className={styles.pageSubtitle}>Enter your email address and we'll send you a link to reset your password.</p>

                <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
                    <div className={styles.formGroup} style={{ marginBottom: '2rem' }}>
                        <label className={styles.formLabel}>Email</label>
                        <div className={styles.inputIconWrapper}>
                            <i className={`bi bi-envelope ${styles.inputIcon}`}></i>
                            <input
                                type="email"
                                className={`${styles.formControl} ${styles.hasIcon}`}
                                placeholder="e.g. you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className={styles.submitBtn}>
                        Send Reset Link
                    </button>

                    <div className="text-center mt-3">
                        <Link to="/login" className={styles.switchAccountLink} style={{ marginLeft: 0 }}>
                            Back to login
                        </Link>
                    </div>
                </form>
            </div>
        </AuthLayout>
    );
}

export default ForgotPasswordPage;
