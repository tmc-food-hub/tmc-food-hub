import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../components/layout/AuthLayout';
import styles from './AuthPages.module.css';

function SignupPage() {
    const [step, setStep] = useState(1);
    const [role, setRole] = useState('Customer'); // 'Customer' or 'Partner'
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    const handleCheckboxChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.checked });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const togglePassword = () => setShowPassword(!showPassword);
    const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    const handleNextStep = (e) => {
        e.preventDefault();
        setStep(step + 1);
    };

    const handlePrevStep = () => {
        setStep(step - 1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Final Signup attempt:', { role, ...formData });
        // Handle actual registration logic here
    };

    // Dynamic subtext for left banner based on Role & Step
    let customHeroSubtitle = role === 'Customer'
        ? "Browse menus, place orders, track deliveries, earn rewards"
        : "List your restaurant, manage your menu, receive and track orders";

    if (step === 2 || step === 3) {
        customHeroSubtitle = role === 'Customer' ? "Create Account as a Customer" : "Create Account as a Restaurant Partner";
    }

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
                    {step === 2 && (role === 'Customer' ? "Set Your Delivery Information" : "Restaurant Information")}
                    {step === 3 && "Almost there!"}
                </h2>
                <p className={styles.pageSubtitle} style={{ marginBottom: '2rem' }}>
                    {step === 1 && (
                        <>Already have an account? <Link to="/login" className={styles.switchAccountLink}>Log in</Link></>
                    )}
                    {step === 2 && (role === 'Customer' ? "Enter your address and contact information." : "Please provide the official details of your establishment for verification.")}
                    {step === 3 && (role === 'Customer' ? "Please review and accept our legal agreements to complete your registration and start ordering." : "You're almost there! Please review and accept the following agreements to activate your restaurant partnership.")}
                </p>

                {step > 1 && (
                    <div className={styles.progressContainer}>
                        <div className={styles.progressHeader}>
                            <span>Step {step} of 3: {step === 2 ? (role === 'Customer' ? 'Delivery Information' : 'Restaurant Info') : 'Confirmation'}</span>
                            <span>{step === 2 ? '66%' : '100%'} Complete</span>
                        </div>
                        <div className={styles.progressBar}>
                            <div
                                className={styles.progressFill}
                                style={{ width: step === 2 ? '66%' : '100%' }}
                            ></div>
                        </div>
                    </div>
                )}

                <form onSubmit={step === 3 ? handleSubmit : handleNextStep}>
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

                            <button type="submit" className={styles.submitBtn}>
                                Next Step
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

                    {step === 2 && role === 'Customer' && (
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
                                    className={styles.formControl}
                                    placeholder="+63 000 000 0000"
                                    value={formData.contactNumber}
                                    onChange={handleChange}
                                    required
                                />
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

                    {step === 2 && role === 'Partner' && (
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
                                    className={styles.formControl}
                                    placeholder="+63 000 000 0000"
                                    value={formData.businessContactNumber}
                                    onChange={handleChange}
                                    required
                                />
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

                    {step === 3 && role === 'Customer' && (
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
                                <button type="submit" className={styles.btnNext}>
                                    Finish Registration
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && role === 'Partner' && (
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

                            {/* Using privacyAccepted state but rendering as Privacy Policy to correct the likely mockup copy-paste error */}
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
                                <button type="submit" className={styles.btnNext}>
                                    Finish Registration
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
