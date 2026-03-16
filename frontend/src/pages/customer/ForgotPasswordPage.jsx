import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout';
import { useAuth } from '../../context/AuthContext';
import styles from './AuthPages.module.css';

function ForgotPasswordPage() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
    const [resetToken, setResetToken] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    const otpInputRefs = useRef([]);
    const navigate = useNavigate();
    const { forgotPassword, verifyResetOtp, resetPassword } = useAuth();

    const maskEmail = (email) => {
        const [local, domain] = email.split('@');
        if (local.length <= 2) return `${local[0]}***@${domain}`;
        return `${local[0]}${local[1]}***@${domain}`;
    };

    // Resend cooldown timer
    useEffect(() => {
        if (resendCooldown <= 0) return;
        const timer = setInterval(() => {
            setResendCooldown(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [resendCooldown]);

    // Step 1: Send reset OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!email || !email.includes('@')) {
            setErrors({ email: 'Please enter a valid email address.' });
            return;
        }
        setIsLoading(true);
        setErrors({});
        try {
            await forgotPassword(email);
            setResendCooldown(60);
            setStep(2);
        } catch (err) {
            const message = err.response?.data?.message
                || err.response?.data?.errors?.email?.[0]
                || 'Something went wrong. Please try again.';
            setErrors({ email: message });
        } finally {
            setIsLoading(false);
        }
    };

    // OTP input handlers
    const handleOtpChange = useCallback((index, value) => {
        if (value && !/^\d$/.test(value)) return;
        setOtpValues(prev => {
            const next = [...prev];
            next[index] = value;
            return next;
        });
        if (value && index < 5) {
            otpInputRefs.current[index + 1]?.focus();
        }
    }, []);

    const handleOtpKeyDown = useCallback((index, e) => {
        if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
            otpInputRefs.current[index - 1]?.focus();
        }
    }, [otpValues]);

    const handleOtpPaste = useCallback((e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (!pasted) return;
        const newValues = [...otpValues];
        for (let i = 0; i < 6; i++) {
            newValues[i] = pasted[i] || '';
        }
        setOtpValues(newValues);
        const focusIndex = Math.min(pasted.length, 5);
        otpInputRefs.current[focusIndex]?.focus();
    }, [otpValues]);

    const handleResendOtp = async () => {
        setIsLoading(true);
        setErrors({});
        try {
            await forgotPassword(email);
            setResendCooldown(60);
            setOtpValues(['', '', '', '', '', '']);
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to resend code.';
            setErrors({ otp: message });
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2: Verify reset OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        const otpCode = otpValues.join('');
        if (otpCode.length !== 6) {
            setErrors({ otp: 'Please enter the complete 6-digit code.' });
            return;
        }
        setIsLoading(true);
        setErrors({});
        try {
            const data = await verifyResetOtp(email, otpCode);
            setResetToken(data.reset_token);
            setStep(3);
        } catch (err) {
            const message = err.response?.data?.errors?.otp?.[0]
                || err.response?.data?.message
                || 'Verification failed. Please try again.';
            setErrors({ otp: message });
        } finally {
            setIsLoading(false);
        }
    };

    // Step 3: Reset password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!password || password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters.';
        }
        if (password !== passwordConfirmation) {
            newErrors.password_confirmation = 'Passwords do not match.';
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setIsLoading(true);
        setErrors({});
        try {
            await resetPassword(resetToken, password, passwordConfirmation);
            navigate('/login', { state: { passwordReset: true } });
        } catch (err) {
            const data = err.response?.data;
            const message = data?.errors?.reset_token?.[0]
                || data?.errors?.password?.[0]
                || data?.message
                || 'Password reset failed. Please try again.';
            setErrors({ password: message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            {/* Step 1: Enter email */}
            {step === 1 && (
                <div className={styles.slideInRight}>
                    <h2 className={styles.pageTitle}>Forgot password?</h2>
                    <p className={styles.pageSubtitle}>Enter your email address and we'll send you a code to reset your password.</p>

                    <form onSubmit={handleSendOtp} style={{ marginTop: '2rem' }}>
                        <div className={styles.formGroup} style={{ marginBottom: '2rem' }}>
                            <label className={styles.formLabel}>Email</label>
                            <div className={styles.inputIconWrapper}>
                                <i className={`bi bi-envelope ${styles.inputIcon}`}></i>
                                <input
                                    type="email"
                                    className={`${styles.formControl} ${styles.hasIcon} ${errors.email ? styles.isInvalid : ''}`}
                                    placeholder="e.g. you@example.com"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({}); }}
                                    required={false}
                                />
                            </div>
                            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                        </div>

                        <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                            {isLoading ? 'Sending...' : 'Send Reset Code'}
                        </button>

                        <div className="text-center mt-3">
                            <Link to="/login" className={styles.switchAccountLink} style={{ marginLeft: 0 }}>
                                Back to login
                            </Link>
                        </div>
                    </form>
                </div>
            )}

            {/* Step 2: Enter OTP */}
            {step === 2 && (
                <div className={styles.slideInRight}>
                    <h2 className={styles.pageTitle}>Verify your identity</h2>
                    <p className={styles.pageSubtitle}>Enter the 6-digit code we sent to your email.</p>

                    <form onSubmit={handleVerifyOtp}>
                        <div className={styles.otpSection}>
                            <p className={styles.otpEmailDisplay}>
                                Code sent to <strong>{maskEmail(email)}</strong>
                            </p>

                            <div className={styles.otpContainer}>
                                {otpValues.map((val, i) => (
                                    <input
                                        key={i}
                                        ref={el => otpInputRefs.current[i] = el}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        className={`${styles.otpInput} ${errors.otp ? styles.isInvalid : ''}`}
                                        value={val}
                                        onChange={e => handleOtpChange(i, e.target.value)}
                                        onKeyDown={e => handleOtpKeyDown(i, e)}
                                        onPaste={i === 0 ? handleOtpPaste : undefined}
                                        autoComplete="one-time-code"
                                    />
                                ))}
                            </div>

                            {errors.otp && <span className={styles.errorText} style={{ display: 'block', textAlign: 'center', marginBottom: '1rem' }}>{errors.otp}</span>}

                            <div className={styles.resendRow}>
                                <span>Didn't receive the code?</span>
                                <button
                                    type="button"
                                    className={styles.resendBtn}
                                    onClick={handleResendOtp}
                                    disabled={resendCooldown > 0 || isLoading}
                                >
                                    {isLoading ? 'Sending...'
                                        : resendCooldown > 0 ? `Resend in ${resendCooldown}s`
                                        : 'Resend Code'}
                                </button>
                            </div>

                            <button
                                type="submit"
                                className={styles.otpVerifyBtn}
                                disabled={isLoading || otpValues.join('').length !== 6}
                            >
                                {isLoading ? 'Verifying...' : 'Verify & Continue'}
                            </button>
                        </div>

                        <div className="text-center mt-3">
                            <button
                                type="button"
                                className={styles.switchAccountLink}
                                style={{ marginLeft: 0, background: 'none', border: 'none', cursor: 'pointer' }}
                                onClick={() => { setStep(1); setOtpValues(['', '', '', '', '', '']); setErrors({}); }}
                            >
                                Use a different email
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Step 3: New password */}
            {step === 3 && (
                <div className={styles.slideInRight}>
                    <h2 className={styles.pageTitle}>Set new password</h2>
                    <p className={styles.pageSubtitle}>Create a strong password for your account.</p>

                    <form onSubmit={handleResetPassword} style={{ marginTop: '2rem' }}>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>New Password</label>
                            <div className={styles.inputIconWrapper}>
                                <i className={`bi bi-lock ${styles.inputIcon}`}></i>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className={`${styles.formControl} ${styles.hasIcon} ${styles.hasTrailing} ${errors.password ? styles.isInvalid : ''}`}
                                    placeholder="At least 8 characters"
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors(prev => ({ ...prev, password: '' })); }}
                                    required={false}
                                />
                                <button
                                    type="button"
                                    className={styles.inputTrailingIcon}
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && <span className={styles.errorText}>{errors.password}</span>}
                        </div>

                        <div className={styles.formGroup} style={{ marginBottom: '2rem' }}>
                            <label className={styles.formLabel}>Confirm Password</label>
                            <div className={styles.inputIconWrapper}>
                                <i className={`bi bi-lock ${styles.inputIcon}`}></i>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    className={`${styles.formControl} ${styles.hasIcon} ${styles.hasTrailing} ${errors.password_confirmation ? styles.isInvalid : ''}`}
                                    placeholder="Repeat your password"
                                    value={passwordConfirmation}
                                    onChange={(e) => { setPasswordConfirmation(e.target.value); if (errors.password_confirmation) setErrors(prev => ({ ...prev, password_confirmation: '' })); }}
                                    required={false}
                                />
                                <button
                                    type="button"
                                    className={styles.inputTrailingIcon}
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    aria-label="Toggle password visibility"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password_confirmation && <span className={styles.errorText}>{errors.password_confirmation}</span>}
                        </div>

                        <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </button>

                        <div className="text-center mt-3">
                            <Link to="/login" className={styles.switchAccountLink} style={{ marginLeft: 0 }}>
                                Back to login
                            </Link>
                        </div>
                    </form>
                </div>
            )}
        </AuthLayout>
    );
}

export default ForgotPasswordPage;
