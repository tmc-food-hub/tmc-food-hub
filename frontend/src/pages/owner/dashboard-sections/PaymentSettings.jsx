import React, { useState } from 'react';
import { Download, Plus, AlertCircle, RefreshCcw, CreditCard, Landmark, Check, ShieldCheck, X, Building2, Wallet, Smartphone } from 'lucide-react';
import styles from '../OwnerDashboard.module.css';

function PaymentSettings() {
    const [payoutMethod, setPayoutMethod] = useState(null); // null, 'bank', 'ewallet'
    const [showMethodModal, setShowMethodModal] = useState(false);

    // Modal states
    const [activeStep, setActiveStep] = useState(1); // 1: Select/Details, 2: Verification, 3: Verifying/Done
    const [selectedBank, setSelectedBank] = useState('');
    const [accountName, setAccountName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');

    // OTP states
    const [otp, setOtp] = useState(['', '', '', '', '', '']);

    // Verification spinner state
    const [isVerifying, setIsVerifying] = useState(false);

    const handleOtpChange = (index, value) => {
        if (value.length > 1) value = value.slice(0, 1); // Only 1 char
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleVerify = () => {
        const otpString = otp.join('');
        if (otpString === '123456' || otpString === '12345') { // Simple test check
            setActiveStep(3);
            setIsVerifying(true);

            // Simulate network verification
            setTimeout(() => {
                setIsVerifying(false);
                setPayoutMethod('bank'); // Successfully added
            }, 2000);
        } else {
            alert("Invalid OTP for testing. Please use 12345.");
        }
    };

    const closeModals = () => {
        setShowMethodModal(false);
        setActiveStep(1);
        setOtp(['', '', '', '', '', '']);
    };

    return (
        <div className={styles.paymentSettingsContainer}>
            <div className={styles.psHeader}>
                <h2 className={styles.psTitle}>Payment Settings</h2>
                <p className={styles.psSub}>Manage how you receive payments and configure your tax compliance details.</p>
            </div>

            <div className={styles.psMainBox}>
                <h3 className={styles.psSectionTitle}>Payment Method</h3>

                {!payoutMethod ? (
                    <div className={styles.psEmptyState}>
                        <div className={styles.psEmptyIcon}>
                            <CreditCard size={24} color="#991B1B" />
                        </div>
                        <h4 className={styles.psEmptyTitle}>No payout method connected</h4>
                        <p className={styles.psEmptySub}>Connect a bank account or e-wallet to start receiving your automatic payouts.<br />It only takes a few minutes to set up.</p>
                        <button className={styles.btnPrimary} style={{ marginTop: '1rem' }} onClick={() => setShowMethodModal(true)}>
                            <Plus size={16} /> Add Payment Method
                        </button>
                    </div>
                ) : (
                    <div className={styles.psConnectedState}>
                        <div className={styles.psVerifiedCard}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ background: '#0F2C82', color: 'white', padding: '6px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold' }}>BDO</div>
                                <div style={{ textAlign: 'left' }}>
                                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827' }}>Patty Shack</div>
                                    <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>BDO **** **** 8821</div>
                                </div>
                            </div>
                            <div className={styles.pillGreen} style={{ fontSize: '0.7rem' }}><Check size={12} /> Verified</div>
                        </div>
                    </div>
                )}
            </div>

            <div className={styles.psBottomCards}>
                <div className={styles.psCardHalf}>
                    <h3 className={styles.psSectionTitle}>Tax Information</h3>
                    <p className={styles.psCardText}>Federal regulations require us to collect tax information from all partners. Your payouts will be paused until this is completed.</p>
                    <div className={styles.psWarningBox}>
                        <span style={{ fontWeight: 700, color: '#92400E' }}>Status:</span> Action Required
                    </div>
                    <button className={styles.btnGhost} style={{ width: '100%', justifyContent: 'center' }}>Complete Tax Interview</button>
                </div>

                <div className={styles.psCardHalf}>
                    <h3 className={styles.psSectionTitle}>Payout Schedule</h3>
                    <p className={styles.psCardText}>By default, your earnings are settled every Monday. You can change your frequency once your first payout is processed.</p>

                    <div className={styles.psRowSpaceBetween} style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
                        <span className={styles.psLabelGray}>Current Cycle</span>
                        <span className={styles.psValueBold}>Weekly (Mondays)</span>
                    </div>
                    <div className={styles.psRowSpaceBetween} style={{ marginBottom: '1.5rem' }}>
                        <span className={styles.psLabelGray}>Next Payout</span>
                        <span className={styles.psValueBold} style={{ color: '#6B7280' }}>Pending setup</span>
                    </div>

                    <button className={styles.btnPrimary} style={{ width: '100%', justifyContent: 'center' }}>Modify Schedule</button>
                </div>
            </div>

            {/* --- MODALS --- */}

            {/* Modal 1: Select Payout Method */}
            {showMethodModal && activeStep === 1 && (
                <div className={styles.editOverlay}>
                    <div className={styles.editModal} style={{ maxWidth: '600px' }}>
                        <div className={styles.editModalHead}>
                            <h3>Select payout method</h3>
                            <button className={styles.iconBtn} onClick={closeModals}><X size={20} /></button>
                        </div>
                        <div className={styles.editModalBody} style={{ flexDirection: 'column' }}>
                            <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: '1rem', marginTop: 0 }}>Choose how you want to receive your earnings from TMC Foodhub.</p>

                            <div className={styles.psMethodGrid}>
                                <div className={`${styles.psMethodCard} ${styles.psMethodCardActive} `}>
                                    <div className={styles.psMethodIconBoxActive}><Landmark size={24} color="#991B1B" /></div>
                                    <div className={styles.psMethodTitle}>Bank Transfer</div>
                                    <div className={styles.psMethodDesc}>Secure direct deposits to any major bank. Standard processing times apply (1-3 business days).</div>
                                </div>
                                <div className={styles.psMethodCard}>
                                    <div className={styles.psMethodIconBox}><Wallet size={24} color="#6B7280" /></div>
                                    <div className={styles.psMethodTitle}>E-Wallet</div>
                                    <div className={styles.psMethodDesc}>Instant payouts to GCash or Maya. Funds are available immediately after processing.</div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.editModalFooter}>
                            <button className={styles.btnPrimary} onClick={() => setActiveStep(2)}>Continue</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal 2: Add Bank Details (Step 1 of Wizard) */}
            {showMethodModal && activeStep === 2 && (
                <div className={styles.editOverlay}>
                    <div className={styles.editModal} style={{ maxWidth: '600px' }}>
                        <div className={styles.editModalHead}>
                            <div>
                                <span style={{ color: '#991B1B', fontSize: '0.75rem', fontWeight: 700 }}>Step 1 of 3</span>
                                <h3>Add Bank Account Details</h3>
                            </div>
                            <button className={styles.iconBtn} onClick={closeModals}><X size={20} /></button>
                        </div>
                        <div className={styles.editModalBody} style={{ flexDirection: 'column', maxHeight: '70vh', overflowY: 'auto' }}>
                            <p style={{ color: '#6B7280', fontSize: '0.85rem', marginTop: 0 }}>Set up your settlement account to start receiving payments.</p>

                            <div className={styles.psWizardStepper}>
                                <div className={styles.psWizardStep}>
                                    <div className={styles.psWizardIconActive}><Landmark size={16} /></div>
                                    <div className={styles.psWizardLabelActive}>Bank Details</div>
                                    <div className={styles.psWizardLineActive}></div>
                                </div>
                                <div className={styles.psWizardStep}>
                                    <div className={styles.psWizardIcon}><ShieldCheck size={16} /></div>
                                    <div className={styles.psWizardLabel}>Verification</div>
                                    <div className={styles.psWizardLine}></div>
                                </div>
                                <div className={styles.psWizardStep}>
                                    <div className={styles.psWizardIcon}><Check size={16} /></div>
                                    <div className={styles.psWizardLabel}>Confirmation</div>
                                </div>
                            </div>

                            <div className={styles.field}>
                                <label>Select your bank</label>
                                <div className={styles.psBankSelectGrid}>
                                    <div className={`${styles.psBankOption} ${selectedBank === 'bdo' ? styles.psBankOptionActive : ''} `} onClick={() => setSelectedBank('bdo')}>
                                        <div className={styles.psRadioCol}>
                                            <div className={selectedBank === 'bdo' ? styles.psRadioActive : styles.psRadio}></div>
                                        </div>
                                        <div style={{ background: '#0F2C82', color: 'white', padding: '2px 4px', fontSize: '10px', fontWeight: 'bold', borderRadius: '2px' }}>BDO</div>
                                        <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>BDO</span>
                                    </div>
                                    <div className={styles.psBankOption} onClick={() => setSelectedBank('bpi')}>
                                        <div className={styles.psRadioCol}><div className={styles.psRadio}></div></div>
                                        <span style={{ color: '#B91C1C', fontWeight: 800, fontSize: '0.9rem' }}>BPI</span>
                                        <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>BPI</span>
                                    </div>
                                    <div className={styles.psBankOption} onClick={() => setSelectedBank('metrobank')}>
                                        <div className={styles.psRadioCol}><div className={styles.psRadio}></div></div>
                                        <div style={{ background: '#0C4A9A', color: 'white', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', fontSize: '10px' }}>M</div>
                                        <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Metrobank</span>
                                    </div>
                                    <div className={styles.psBankOption} onClick={() => setSelectedBank('unionbank')}>
                                        <div className={styles.psRadioCol}><div className={styles.psRadio}></div></div>
                                        <span style={{ color: '#EA580C', fontWeight: 800, fontSize: '0.9rem' }}>UB</span>
                                        <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Union Bank</span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.field}>
                                <label>Account Name</label>
                                <input type="text" placeholder="e.g. Juan Dela Cruz" value={accountName} onChange={e => setAccountName(e.target.value)} />
                                <span style={{ fontSize: '0.7rem', color: '#6B7280' }}>Must exactly match the name on your bank records.</span>
                            </div>

                            <div className={styles.field}>
                                <label>Account Number</label>
                                <input type="text" placeholder="0000 0000 0000" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} />
                                <span style={{ fontSize: '0.7rem', color: '#6B7280' }}>Contains only numbers</span>
                            </div>

                            <div className={styles.instructionsBlock} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                <AlertCircle size={16} color="#991B1B" style={{ flexShrink: 0, marginTop: '2px' }} />
                                <div><strong style={{ color: '#991B1B' }}>Why we need this:</strong> We use these details to process your earnings. Please double-check for accuracy to avoid payment delays.</div>
                            </div>

                        </div>
                        <div className={styles.editModalFooter} style={{ justifyContent: 'space-between' }}>
                            <button className={styles.btnGhost} onClick={() => setActiveStep(1)}>Back</button>
                            <button className={styles.btnPrimary} onClick={() => setActiveStep(3)}>Continue</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal 3: Bank Verification (Step 2 of Wizard) - OTP OR Verifying */}
            {showMethodModal && activeStep === 3 && (
                <div className={styles.editOverlay}>
                    <div className={styles.editModal} style={{ maxWidth: '600px' }}>
                        <div className={styles.editModalHead}>
                            <div>
                                <span style={{ color: '#991B1B', fontSize: '0.75rem', fontWeight: 700 }}>Step 2 of 3</span>
                                <h3>Bank Verification</h3>
                            </div>
                            <button className={styles.iconBtn} onClick={closeModals}><X size={20} /></button>
                        </div>

                        <div className={styles.editModalBody} style={{ flexDirection: 'column' }}>
                            <p style={{ color: '#6B7280', fontSize: '0.85rem', marginTop: 0 }}>Verify your bank account to securely receive payouts and prevent payment errors.</p>

                            <div className={styles.psWizardStepper}>
                                <div className={styles.psWizardStep}>
                                    <div className={styles.psWizardIconActive}><Landmark size={16} /></div>
                                    <div className={styles.psWizardLabelActive}>Bank Details</div>
                                    <div className={styles.psWizardLineActive}></div>
                                </div>
                                <div className={styles.psWizardStep}>
                                    <div className={styles.psWizardIconActive}><ShieldCheck size={16} /></div>
                                    <div className={styles.psWizardLabelActive}>Verification</div>
                                    <div className={styles.psWizardLine}></div>
                                </div>
                                <div className={styles.psWizardStep}>
                                    <div className={styles.psWizardIcon}><Check size={16} /></div>
                                    <div className={styles.psWizardLabel}>Confirmation</div>
                                </div>
                            </div>

                            {!isVerifying ? (
                                <div className={styles.psOtpCard}>
                                    <div className={styles.psOtpIcon}><Smartphone size={20} color="#991B1B" /></div>
                                    <h4 style={{ margin: '0.5rem 0', fontSize: '1.1rem' }}>Verify it's you</h4>
                                    <p style={{ fontSize: '0.85rem', color: '#6B7280', textAlign: 'center', marginBottom: '1.5rem', maxWidth: '350px' }}>
                                        For security reasons, please verify this change. We've sent a 6-digit code to your registered mobile number ending in **** 4829.
                                    </p>

                                    <div className={styles.psOtpContainer}>
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                id={`otp-${index}`}
                                                type="text"
                                                maxLength="1"
                                                className={styles.psOtpInput}
                                                value={digit}
                                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                            />
                                        ))}
                                    </div>

                                    <button className={styles.btnPrimary} style={{ width: '100%', justifyContent: 'center', marginTop: '1.5rem', padding: '0.75rem' }} onClick={handleVerify}>
                                        Verify & Connect Account
                                    </button>

                                    <div style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: '1rem' }}>
                                        Didn't receive the code? <span style={{ color: '#991B1B', fontWeight: 600, cursor: 'pointer' }}>Resend OTP (1:59s)</span>
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.psOtpCard} style={{ padding: '3rem 2rem' }}>
                                    <div className={styles.psSpinnerIcon}><RefreshCcw size={24} color="#991B1B" className={styles.spinning} /></div>
                                    <h4 style={{ margin: '1rem 0 0.5rem', fontSize: '1.1rem' }}>Verifying your first account...</h4>
                                    <p style={{ fontSize: '0.85rem', color: '#6B7280', textAlign: 'center', marginBottom: '1.5rem', maxWidth: '300px' }}>
                                        We are confirming your ownership with the bank network. This usually takes a few seconds.
                                    </p>

                                    <div className={styles.psVerifiedCard}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ background: '#0F2C82', color: 'white', padding: '6px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold' }}>BDO</div>
                                            <div style={{ textAlign: 'left' }}>
                                                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827' }}>Patty Shack</div>
                                                <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>BDO **** **** 8821</div>
                                            </div>
                                        </div>
                                        <div className={styles.pillGreen} style={{ fontSize: '0.7rem' }}><Check size={12} /> Verified</div>
                                    </div>

                                    <div className={styles.instructionsBlock} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginTop: '1rem', textAlign: 'left', width: '100%' }}>
                                        <AlertCircle size={16} color="#991B1B" style={{ flexShrink: 0, marginTop: '2px' }} />
                                        <div style={{ color: '#111827' }}>Once verification is complete, your first settlement will be processed on the next Tuesday. Click Finish to continue.</div>
                                    </div>
                                </div>
                            )}

                        </div>
                        <div className={styles.editModalFooter} style={{ justifyContent: 'space-between' }}>
                            <button className={styles.btnGhost} onClick={() => setActiveStep(2)} disabled={isVerifying}>Back</button>
                            <button className={styles.btnPrimary} disabled={!isVerifying} onClick={closeModals}>Finish</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PaymentSettings;
