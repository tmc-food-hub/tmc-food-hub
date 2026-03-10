import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout';
import { useAuth } from '../../context/AuthContext';
import styles from './AuthPages.module.css';

function SignupPage() {
    const [step, setStep] = useState(1);
    const [role, setRole] = useState('Customer');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // OTP state
    const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
    const [otpSending, setOtpSending] = useState(false);
    const [otpVerifying, setOtpVerifying] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [emailVerificationToken, setEmailVerificationToken] = useState('');
    const [verifiedEmail, setVerifiedEmail] = useState('');
    const otpInputRefs = useRef([]);

    const { register, sendOtp, verifyOtp } = useAuth();
    const navigate = useNavigate();

    // Form fields
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        address: '',
        contactNumber: '',
        deliveryInstructions: '',
        restaurantName: '',
        businessAddress: '',
        businessContactNumber: '',
        businessPermit: '',
        termsAccepted: false,
        privacyAccepted: false,
        marketingAccepted: false,
        merchantAgreementAccepted: false
    });

    // Resend cooldown timer
    useEffect(() => {
        if (resendCooldown <= 0) return;
        const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
        return () => clearTimeout(timer);
    }, [resendCooldown]);

    const handleCheckboxChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.checked });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const togglePassword = () => setShowPassword(!showPassword);
    const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    const maskEmail = (email) => {
        const [local, domain] = email.split('@');
        if (local.length <= 2) return `${local[0]}***@${domain}`;
        return `${local[0]}${local[1]}***@${domain}`;
    };

    // Step 1 → Send OTP and move to Step 2
    const handleStep1Submit = async (e) => {
        e.preventDefault();
        setErrors({});

        if (formData.password !== formData.confirmPassword) {
            setErrors({ password: ['Passwords do not match.'] });
            return;
        }

        setOtpSending(true);

        try {
            await sendOtp(formData.email);
            setResendCooldown(60);
            setOtpValues(['', '', '', '', '', '']);
            setStep(2);
            // Auto-focus first OTP input after render
            setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                setErrors({ general: [err.response?.data?.message || 'Failed to send verification code. Please try again.'] });
            }
        } finally {
            setOtpSending(false);
        }
    };

    // Resend OTP
    const handleResendOtp = async () => {
        if (resendCooldown > 0) return;
        setErrors({});
        setOtpSending(true);

        try {
            await sendOtp(formData.email);
            setResendCooldown(60);
            setOtpValues(['', '', '', '', '', '']);
            setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
        } catch (err) {
            setErrors({ general: [err.response?.data?.message || 'Failed to resend code. Please try again.'] });
        } finally {
            setOtpSending(false);
        }
    };

    // OTP input handlers
    const handleOtpChange = useCallback((index, value) => {
        // Only allow single digits
        if (value && !/^\d$/.test(value)) return;

        setOtpValues(prev => {
            const next = [...prev];
            next[index] = value;
            return next;
        });

        // Auto-advance to next input
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

        // Focus last filled input or last input
        const focusIndex = Math.min(pasted.length, 5);
        otpInputRefs.current[focusIndex]?.focus();
    }, [otpValues]);

    // Verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        const otpCode = otpValues.join('');
        if (otpCode.length !== 6) {
            setErrors({ otp: ['Please enter the complete 6-digit code.'] });
            return;
        }

        setErrors({});
        setOtpVerifying(true);

        try {
            const data = await verifyOtp(formData.email, otpCode);
            setEmailVerificationToken(data.email_verification_token);
            setVerifiedEmail(formData.email);
            setStep(3);
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                setErrors({ general: [err.response?.data?.message || 'Verification failed. Please try again.'] });
            }
        } finally {
            setOtpVerifying(false);
        }
    };

    // Steps 3 & 4 navigation
    const handleNextStep = (e) => {
        e.preventDefault();
        setErrors({});

        if (step === 3) {
            const phone = role === 'Customer' ? formData.contactNumber : formData.businessContactNumber;
            const phoneDigits = phone.replace(/\D/g, '');
            if (phoneDigits.length !== 11 || !phoneDigits.startsWith('09')) {
                const field = role === 'Customer' ? 'contactNumber' : 'businessContactNumber';
                setErrors({ [field]: ['Please enter a valid 11-digit Philippine mobile number (e.g. 09XX XXX XXXX).'] });
                return;
            }
        }

        setStep(step + 1);
    };

    const handlePrevStep = () => {
        if (step === 2) {
            // Going back to Step 1 — keep form data, reset OTP
            setOtpValues(['', '', '', '', '', '']);
            setErrors({});
        }
        if (step === 3 && verifiedEmail !== formData.email) {
            // Email changed, must re-verify — go to step 1
            setEmailVerificationToken('');
            setVerifiedEmail('');
            setStep(1);
            return;
        }
        setStep(step - 1);
    };

    // Final registration submit (Step 4)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setIsLoading(true);

        const payload = {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            password: formData.password,
            password_confirmation: formData.confirmPassword,
            role: role.toLowerCase(),
            terms_accepted: formData.termsAccepted,
            privacy_accepted: formData.privacyAccepted,
            email_verification_token: emailVerificationToken,
        };

        if (role === 'Customer') {
            payload.address = formData.address;
            payload.phone = formData.contactNumber;
            payload.delivery_instructions = formData.deliveryInstructions;
        }

        if (role === 'Partner') {
            payload.restaurant_name = formData.restaurantName;
            payload.business_address = formData.businessAddress;
            payload.business_contact_number = formData.businessContactNumber;
            payload.business_permit = formData.businessPermit;
            payload.merchant_agreement_accepted = formData.merchantAgreementAccepted;
        }

        try {
            await register(payload);
            navigate('/login', { state: { signupSuccess: true } });
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
                const errorKeys = Object.keys(err.response.data.errors);
                const step1Fields = ['first_name', 'last_name', 'email', 'password'];
                if (errorKeys.some(k => step1Fields.includes(k))) {
                    setStep(1);
                }
            } else {
                setErrors({ general: [err.response?.data?.message || 'Registration failed. Please try again.'] });
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Dynamic subtext for left banner
    let customHeroSubtitle = role === 'Customer'
        ? "Browse menus, place orders, track deliveries, earn rewards"
        : "List your restaurant, manage your menu, receive and track orders";

    if (step >= 2) {
        customHeroSubtitle = role === 'Customer' ? "Create Account as a Customer" : "Create Account as a Restaurant Partner";
    }

    // Progress bar helpers
    const totalSteps = 4;
    const getProgressLabel = () => {
        switch (step) {
            case 2: return 'Email Verification';
            case 3: return role === 'Customer' ? 'Delivery Information' : 'Restaurant Info';
            case 4: return 'Confirmation';
            default: return '';
        }
    };
    const getProgressPercent = () => {
        switch (step) {
            case 2: return '50%';
            case 3: return '75%';
            case 4: return '100%';
            default: return '0%';
        }
    };

    // Determine which handler to use for the form
    const getFormHandler = () => {
        if (step === 1) return handleStep1Submit;
        if (step === 2) return handleVerifyOtp;
        if (step === 4) return handleSubmit;
        return handleNextStep;
    };

    return (
        <AuthLayout heroSubtitle={customHeroSubtitle}>
            <div className={styles.slideInLeft}>
                <h2 className={styles.pageTitle} style={{ fontSize: step === 1 ? '1.75rem' : '1.5rem', marginBottom: '0.25rem' }}>
                    {step === 1 && (
                        <>
                            Sign up as a Customer or
                            <br />
                            Restaurant Partner
                        </>
                    )}
                    {step === 2 && "Verify Your Email"}
                    {step === 3 && (role === 'Customer' ? "Set Your Delivery Information" : "Restaurant Information")}
                    {step === 4 && "Almost there!"}
                </h2>
                <p className={styles.pageSubtitle} style={{ marginBottom: '2rem' }}>
                    {step === 1 && (
                        <>Already have an account? <Link to="/login" className={styles.switchAccountLink}>Log in</Link></>
                    )}
                    {step === 2 && `We sent a 6-digit verification code to your email.`}
                    {step === 3 && (role === 'Customer' ? "Enter your address and contact information." : "Please provide the official details of your establishment for verification.")}
                    {step === 4 && (role === 'Customer' ? "Please review and accept our legal agreements to complete your registration and start ordering." : "You're almost there! Please review and accept the following agreements to activate your restaurant partnership.")}
                </p>

                {step > 1 && (
                    <div className={styles.progressContainer}>
                        <div className={styles.progressHeader}>
                            <span>Step {step} of {totalSteps}: {getProgressLabel()}</span>
                            <span>{getProgressPercent()} Complete</span>
                        </div>
                        <div className={styles.progressBar}>
                            <div
                                className={styles.progressFill}
                                style={{ width: getProgressPercent() }}
                            ></div>
                        </div>
                    </div>
                )}

                <form onSubmit={getFormHandler()}>
                    {Object.keys(errors).length > 0 && (
                        <div className="alert alert-danger py-2 mb-3" style={{ fontSize: '0.85rem', borderRadius: '8px' }}>
                            {errors.general
                                ? errors.general[0]
                                : errors.otp
                                    ? errors.otp[0]
                                    : 'Please fix the errors below and try again.'}
                        </div>
                    )}
                    {step === 1 && (
                        <>
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
                                        className={`${styles.formControl} ${errors.first_name ? styles.isInvalid : ''}`}
                                        placeholder="First Name"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.first_name && <span className={styles.errorText}>{errors.first_name[0]}</span>}
                                </div>
                                <div className="col-12 col-sm-6">
                                    <input
                                        type="text"
                                        name="lastName"
                                        className={`${styles.formControl} ${errors.last_name ? styles.isInvalid : ''}`}
                                        placeholder="Last Name"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.last_name && <span className={styles.errorText}>{errors.last_name[0]}</span>}
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>
                                    {role === 'Customer' ? 'Email' : 'Work/Business Email'}
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    className={`${styles.formControl} ${errors.email ? styles.isInvalid : ''}`}
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.email && <span className={styles.errorText}>{errors.email[0]}</span>}
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
                            {errors.password && <span className={styles.errorText}>{errors.password[0]}</span>}
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

                            <button type="submit" className={styles.submitBtn} disabled={otpSending}>
                                {otpSending ? 'Sending Code...' : 'Next Step'}
                            </button>

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
                        </>
                    )}

                    {step === 2 && (
                        <div className={styles.slideInRight}>
                            <div className={styles.otpSection}>
                                <p className={styles.otpEmailDisplay}>
                                    Code sent to <strong>{maskEmail(formData.email)}</strong>
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

                                <div className={styles.resendRow}>
                                    <span>Didn't receive the code?</span>
                                    <button
                                        type="button"
                                        className={styles.resendBtn}
                                        onClick={handleResendOtp}
                                        disabled={resendCooldown > 0 || otpSending}
                                    >
                                        {otpSending
                                            ? 'Sending...'
                                            : resendCooldown > 0
                                                ? `Resend in ${resendCooldown}s`
                                                : 'Resend Code'}
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    className={styles.otpVerifyBtn}
                                    disabled={otpVerifying || otpValues.join('').length !== 6}
                                >
                                    {otpVerifying ? 'Verifying...' : 'Verify & Continue'}
                                </button>
                            </div>

                            <div className={styles.actionRow}>
                                <button type="button" className={styles.btnBack} onClick={handlePrevStep}>
                                    &larr; Back
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && role === 'Customer' && (
                        <div className={styles.slideInRight}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Default Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    className={styles.formControl}
                                    placeholder="Enter full unit/building number, street, and barangay"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Contact Number</label>
                                <input
                                    type="tel"
                                    name="contactNumber"
                                    className={`${styles.formControl} ${errors.contactNumber ? styles.isInvalid : ''}`}
                                    placeholder="09XX XXX XXXX"
                                    maxLength={11}
                                    value={formData.contactNumber}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.contactNumber && <span className={styles.errorText}>{errors.contactNumber[0]}</span>}
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Delivery Instructions</label>
                                <textarea
                                    name="deliveryInstructions"
                                    className={styles.formControl}
                                    placeholder="Gate codes, drop-off preferences, or landmarks..."
                                    value={formData.deliveryInstructions}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className={styles.actionRow}>
                                <button type="button" className={styles.btnBack} onClick={handlePrevStep}>
                                    &larr; Back
                                </button>
                                <button type="submit" className={styles.btnNext}>
                                    Next Step &rarr;
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && role === 'Partner' && (
                        <div className={styles.slideInRight}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Restaurant Name</label>
                                <input
                                    type="text"
                                    name="restaurantName"
                                    className={styles.formControl}
                                    placeholder="e.g. Mama Sita's Kitchen"
                                    value={formData.restaurantName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Official Business Address</label>
                                <input
                                    type="text"
                                    name="businessAddress"
                                    className={styles.formControl}
                                    placeholder="Enter full unit/building number, street, and barangay"
                                    value={formData.businessAddress}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Business Contact Number</label>
                                <input
                                    type="tel"
                                    name="businessContactNumber"
                                    className={`${styles.formControl} ${errors.businessContactNumber ? styles.isInvalid : ''}`}
                                    placeholder="09XX XXX XXXX"
                                    maxLength={11}
                                    value={formData.businessContactNumber}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.businessContactNumber && <span className={styles.errorText}>{errors.businessContactNumber[0]}</span>}
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Business Permit/BIR Permit</label>
                                <input
                                    type="text"
                                    name="businessPermit"
                                    className={styles.formControl}
                                    placeholder="Enter 12-digit BIR TIN or Permit No."
                                    value={formData.businessPermit}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className={styles.actionRow}>
                                <button type="button" className={styles.btnBack} onClick={handlePrevStep}>
                                    &larr; Back
                                </button>
                                <button type="submit" className={styles.btnNext}>
                                    Next Step &rarr;
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 4 && role === 'Customer' && (
                        <div className={styles.slideInRight}>
                            <label className={`${styles.checkboxCard} ${formData.termsAccepted ? styles.selected : ''}`}>
                                <input
                                    type="checkbox"
                                    name="termsAccepted"
                                    checked={formData.termsAccepted}
                                    onChange={handleCheckboxChange}
                                    required
                                />
                                <div className={styles.checkboxCardContent}>
                                    <strong>Accept Terms &amp; Conditions</strong>
                                    <p>I have read and agree to the <Link to="/terms" className={styles.termsText}>Terms of Service</Link> and usage guidelines.</p>
                                </div>
                            </label>

                            <label className={`${styles.checkboxCard} ${formData.privacyAccepted ? styles.selected : ''}`}>
                                <input
                                    type="checkbox"
                                    name="privacyAccepted"
                                    checked={formData.privacyAccepted}
                                    onChange={handleCheckboxChange}
                                    required
                                />
                                <div className={styles.checkboxCardContent}>
                                    <strong>Accept Privacy Policy</strong>
                                    <p>I agree to the processing of my personal data as described in the <Link to="/privacy" className={styles.termsText}>Privacy Policy</Link>.</p>
                                </div>
                            </label>

                            <label className={styles.checkboxInline}>
                                <input
                                    type="checkbox"
                                    name="marketingAccepted"
                                    checked={formData.marketingAccepted}
                                    onChange={handleCheckboxChange}
                                    style={{ borderRadius: '50%' }}
                                />
                                <span>Keep me updated with exclusive offers and food news (optional)</span>
                            </label>

                            <div className={styles.actionRow}>
                                <button type="button" className={styles.btnBack} onClick={handlePrevStep}>
                                    &larr; Back
                                </button>
                                <button type="submit" className={styles.btnNext} disabled={isLoading}>
                                    {isLoading ? 'Registering...' : 'Finish Registration'}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 4 && role === 'Partner' && (
                        <div className={styles.slideInRight}>
                            <label className={`${styles.checkboxCard} ${formData.termsAccepted ? styles.selected : ''}`}>
                                <input
                                    type="checkbox"
                                    name="termsAccepted"
                                    checked={formData.termsAccepted}
                                    onChange={handleCheckboxChange}
                                    required
                                />
                                <div className={styles.checkboxCardContent}>
                                    <strong>Accept Terms &amp; Conditions</strong>
                                    <p>I have read and agree to the <Link to="/terms" className={styles.termsText}>Terms of Service</Link> and usage guidelines.</p>
                                </div>
                            </label>

                            <label className={`${styles.checkboxCard} ${formData.privacyAccepted ? styles.selected : ''}`}>
                                <input
                                    type="checkbox"
                                    name="privacyAccepted"
                                    checked={formData.privacyAccepted}
                                    onChange={handleCheckboxChange}
                                    required
                                />
                                <div className={styles.checkboxCardContent}>
                                    <strong>Accept Privacy Policy</strong>
                                    <p>I agree to the processing of my personal data as described in the <Link to="/privacy" className={styles.termsText}>Privacy Policy</Link>.</p>
                                </div>
                            </label>

                            <label className={`${styles.checkboxCard} ${formData.merchantAgreementAccepted ? styles.selected : ''}`}>
                                <input
                                    type="checkbox"
                                    name="merchantAgreementAccepted"
                                    checked={formData.merchantAgreementAccepted}
                                    onChange={handleCheckboxChange}
                                    required
                                />
                                <div className={styles.checkboxCardContent}>
                                    <strong>Agree to Merchant Agreement</strong>
                                    <p>Commercial terms for restaurant partners</p>
                                </div>
                            </label>

                            <div className={styles.actionRow}>
                                <button type="button" className={styles.btnBack} onClick={handlePrevStep}>
                                    &larr; Back
                                </button>
                                <button type="submit" className={styles.btnNext} disabled={isLoading}>
                                    {isLoading ? 'Registering...' : 'Finish Registration'}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </AuthLayout>
    );
}

export default SignupPage;
