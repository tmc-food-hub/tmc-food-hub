import React, { useState, useEffect } from 'react';
import { Plus, AlertCircle, CreditCard, Landmark, Check, X, Wallet, Smartphone, Trash2, RefreshCcw } from 'lucide-react';
import api from '../../../api/axios';
import styles from '../OwnerDashboard.module.css';

function PaymentSettings() {
    const [loading, setLoading] = useState(true);
    const [paymentData, setPaymentData] = useState(null);
    const [showMethodModal, setShowMethodModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Modal wizard states
    const [modalStep, setModalStep] = useState(1); // 1: select type, 2: select wallet / enter bank, 3: enter details, 4: success
    const [methodType, setMethodType] = useState(''); // 'bank', 'ewallet'
    const [selectedWallet, setSelectedWallet] = useState(''); // 'gcash', 'maya'
    const [selectedBank, setSelectedBank] = useState('');
    const [accountName, setAccountName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [saving, setSaving] = useState(false);
    const [isLinking, setIsLinking] = useState(false);

    const getApiErrorMessage = (error, fallback) => (
        error?.response?.data?.message
        || error?.message
        || fallback
    );

    // Fetch current payment settings
    useEffect(() => {
        api.get('/owner/payment-settings')
            .then(res => {
                setPaymentData(res.data);
                setErrorMessage('');
            })
            .catch((error) => {
                setErrorMessage(getApiErrorMessage(error, 'Unable to load payment settings right now.'));
            })
            .finally(() => setLoading(false));
    }, []);

    // Determine connected methods
    const connectedMethods = [];
    if (paymentData) {
        const methods = paymentData.accepted_payment_methods || [];
        if (methods.includes('gcash') && paymentData.gcash_number) {
            connectedMethods.push({
                type: 'gcash',
                label: 'GCash',
                icon: 'G',
                iconBg: '#0066FF',
                detail: `GCash ●●●●●● ${paymentData.gcash_number.slice(-4)}`,
            });
        }
        if (methods.includes('maya') && paymentData.maya_number) {
            connectedMethods.push({
                type: 'maya',
                label: 'Maya',
                icon: 'M',
                iconBg: '#00B900',
                detail: `Maya ●●●●●● ${paymentData.maya_number.slice(-4)}`,
            });
        }
        if (methods.includes('bank_transfer') && paymentData.bank_account_number) {
            connectedMethods.push({
                type: 'bank_transfer',
                label: paymentData.bank_name || 'Bank',
                icon: paymentData.bank_name?.substring(0, 3)?.toUpperCase() || 'BNK',
                iconBg: '#0F2C82',
                detail: `${paymentData.bank_name || 'Bank'} ●●●● ${paymentData.bank_account_number.slice(-4)}`,
                accountName: paymentData.bank_account_name,
            });
        }
    }

    const resetModal = () => {
        setShowMethodModal(false);
        setModalStep(1);
        setMethodType('');
        setSelectedWallet('');
        setSelectedBank('');
        setAccountName('');
        setAccountNumber('');
        setMobileNumber('');
    };

    const handleLinkMethod = async () => {
        setSaving(true);
        setIsLinking(true);
        setErrorMessage('');

        const currentMethods = paymentData?.accepted_payment_methods || ['cod'];
        let updates = {};

        if (methodType === 'ewallet') {
            const walletKey = selectedWallet; // 'gcash' or 'maya'
            if (!currentMethods.includes(walletKey)) {
                updates.accepted_payment_methods = [...currentMethods, walletKey];
            } else {
                updates.accepted_payment_methods = currentMethods;
            }
            if (walletKey === 'gcash') {
                updates.gcash_number = mobileNumber;
            } else {
                updates.maya_number = mobileNumber;
            }
        } else {
            // bank
            if (!currentMethods.includes('bank_transfer')) {
                updates.accepted_payment_methods = [...currentMethods, 'bank_transfer'];
            } else {
                updates.accepted_payment_methods = currentMethods;
            }
            updates.bank_name = selectedBank;
            updates.bank_account_name = accountName;
            updates.bank_account_number = accountNumber;
        }

        try {
            await api.put('/owner/payment-settings', updates);

            // Simulate a brief linking animation
            setTimeout(async () => {
                setIsLinking(false);
                setModalStep(4); // success step
                // Refresh data
                const res = await api.get('/owner/payment-settings');
                setPaymentData(res.data);
                setErrorMessage('');
                setSaving(false);
            }, 1500);
        } catch (err) {
            console.error(err);
            setErrorMessage(getApiErrorMessage(err, 'We could not save your payment method.'));
            setSaving(false);
            setIsLinking(false);
        }
    };

    const handleRemoveMethod = async (type) => {
        setErrorMessage('');
        const currentMethods = paymentData?.accepted_payment_methods || ['cod'];
        const updates = {
            accepted_payment_methods: currentMethods.filter(m => m !== type),
        };
        if (type === 'gcash') updates.gcash_number = null;
        if (type === 'maya') updates.maya_number = null;
        if (type === 'bank_transfer') {
            updates.bank_name = null;
            updates.bank_account_name = null;
            updates.bank_account_number = null;
        }
        // Ensure at least COD remains
        if (!updates.accepted_payment_methods.includes('cod')) {
            updates.accepted_payment_methods.push('cod');
        }

        try {
            await api.put('/owner/payment-settings', updates);
            const res = await api.get('/owner/payment-settings');
            setPaymentData(res.data);
            setErrorMessage('');
        } catch (err) {
            console.error(err);
            setErrorMessage(getApiErrorMessage(err, 'We could not remove that payment method.'));
        }
    };

    // Linked display helper
    const getLinkedLabel = () => {
        if (methodType === 'ewallet') {
            return selectedWallet === 'gcash' ? 'GCash' : 'Maya';
        }
        return selectedBank || 'Bank';
    };
    const getLinkedNumber = () => {
        if (methodType === 'ewallet') return mobileNumber;
        return accountNumber;
    };

    if (loading) {
        return (
            <div className={styles.paymentSettingsContainer}>
                <div style={{ textAlign: 'center', padding: '4rem', color: '#9CA3AF' }}>Loading payment settings...</div>
            </div>
        );
    }

    return (
        <div className={styles.paymentSettingsContainer}>
            <div className={styles.psHeader}>
                <h2 className={styles.psTitle}>Payment Settings</h2>
                <p className={styles.psSub}>Manage how you receive payments and configure your tax compliance details.</p>
            </div>

            {errorMessage && (
                <div style={{
                    marginBottom: '1rem',
                    background: '#FEF2F2',
                    border: '1px solid #FECACA',
                    color: '#991B1B',
                    borderRadius: '12px',
                    padding: '0.9rem 1rem',
                    fontSize: '0.88rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.6rem',
                }}>
                    <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>{errorMessage}</div>
                </div>
            )}

            <div className={styles.psMainBox}>
                <h3 className={styles.psSectionTitle}>Payment Method</h3>

                {connectedMethods.length === 0 ? (
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {connectedMethods.map(m => (
                            <div key={m.type} className={styles.psVerifiedCard}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ background: m.iconBg, color: 'white', padding: '6px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', minWidth: '36px', textAlign: 'center' }}>
                                        {m.icon}
                                    </div>
                                    <div style={{ textAlign: 'left' }}>
                                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827' }}>{m.accountName || m.label} Account</div>
                                        <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>{m.detail}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div className={styles.pillGreen} style={{ fontSize: '0.7rem' }}><Check size={12} /> Active</div>
                                    <button
                                        onClick={() => handleRemoveMethod(m.type)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: '4px' }}
                                        title="Remove method"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Next scheduled payout info */}
                        <div style={{ padding: '0.75rem 1rem', background: '#F9FAFB', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
                            <span style={{ fontSize: '1rem' }}>📅</span>
                            <div>
                                <div style={{ fontSize: '0.78rem', color: '#6B7280' }}>Next scheduled payout</div>
                                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111827' }}>
                                    {new Date(Date.now() + 7 * 86400000).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                                </div>
                                <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>Estimated arrival: 1-3 business days</div>
                            </div>
                        </div>

                        <button className={styles.btnGhost} style={{ marginTop: '0.5rem' }} onClick={() => setShowMethodModal(true)}>
                            <Plus size={14} /> Add Another Payment Method
                        </button>
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
                        <span className={styles.psValueBold} style={{ color: connectedMethods.length > 0 ? '#111827' : '#6B7280' }}>
                            {connectedMethods.length > 0
                                ? new Date(Date.now() + 7 * 86400000).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
                                : 'Pending setup'}
                        </span>
                    </div>

                    <button className={styles.btnPrimary} style={{ width: '100%', justifyContent: 'center' }}>Modify Schedule</button>
                </div>
            </div>

            {/* ─── MODALS ─── */}

            {/* Step 1: Select method type (Bank Transfer or E-Wallet) */}
            {showMethodModal && modalStep === 1 && (
                <div className={styles.editOverlay}>
                    <div className={styles.editModal} style={{ maxWidth: '600px' }}>
                        <div className={styles.editModalHead}>
                            <h3>Select payout method</h3>
                            <button className={styles.iconBtn} onClick={resetModal}><X size={20} /></button>
                        </div>
                        <div className={styles.editModalBody} style={{ flexDirection: 'column' }}>
                            <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: '1rem', marginTop: 0 }}>Choose how you want to receive your earnings from TMC Foodhub.</p>

                            <div className={styles.psMethodGrid}>
                                <div
                                    className={`${styles.psMethodCard} ${methodType === 'bank' ? styles.psMethodCardActive : ''}`}
                                    onClick={() => setMethodType('bank')}
                                >
                                    <div className={methodType === 'bank' ? styles.psMethodIconBoxActive : styles.psMethodIconBox}><Landmark size={24} color={methodType === 'bank' ? '#991B1B' : '#6B7280'} /></div>
                                    <div className={styles.psMethodTitle}>Bank Transfer</div>
                                    <div className={styles.psMethodDesc}>Secure direct deposits to any major bank. Standard processing times apply (1-3 business days).</div>
                                </div>
                                <div
                                    className={`${styles.psMethodCard} ${methodType === 'ewallet' ? styles.psMethodCardActive : ''}`}
                                    onClick={() => setMethodType('ewallet')}
                                >
                                    <div className={methodType === 'ewallet' ? styles.psMethodIconBoxActive : styles.psMethodIconBox}><Wallet size={24} color={methodType === 'ewallet' ? '#991B1B' : '#6B7280'} /></div>
                                    <div className={styles.psMethodTitle}>E-Wallet</div>
                                    <div className={styles.psMethodDesc}>Instant payouts to GCash or Maya. Funds are available immediately after processing.</div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.editModalFooter}>
                            <button className={styles.btnPrimary} disabled={!methodType} onClick={() => setModalStep(2)}>Continue</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Step 2: E-Wallet selection or Bank details */}
            {showMethodModal && modalStep === 2 && methodType === 'ewallet' && (
                <div className={styles.editOverlay}>
                    <div className={styles.editModal} style={{ maxWidth: '600px' }}>
                        <div className={styles.editModalHead}>
                            <div>
                                <span style={{ color: '#991B1B', fontSize: '0.75rem', fontWeight: 700 }}>Step 1 of 2</span>
                                <h3>Choose E-Wallet</h3>
                            </div>
                            <button className={styles.iconBtn} onClick={resetModal}><X size={20} /></button>
                        </div>
                        <div className={styles.editModalBody} style={{ flexDirection: 'column', maxHeight: '70vh', overflowY: 'auto' }}>
                            <p style={{ color: '#6B7280', fontSize: '0.85rem', marginTop: 0 }}>Select your preferred account for instant payouts. TMC Foodhub partners enjoy zero-fee settlements.</p>

                            <div className={styles.psWizardStepper}>
                                <div className={styles.psWizardStep}>
                                    <div className={styles.psWizardIconActive}><Wallet size={16} /></div>
                                    <div className={styles.psWizardLabelActive}>Select E-Wallet</div>
                                    <div className={styles.psWizardLineActive}></div>
                                </div>
                                <div className={styles.psWizardStep}>
                                    <div className={styles.psWizardIcon}><Smartphone size={16} /></div>
                                    <div className={styles.psWizardLabel}>E-Wallet Details</div>
                                    <div className={styles.psWizardLine}></div>
                                </div>
                                <div className={styles.psWizardStep}>
                                    <div className={styles.psWizardIcon}><Check size={16} /></div>
                                    <div className={styles.psWizardLabel}>Confirmation</div>
                                </div>
                            </div>

                            <div className={styles.field}>
                                <label>Select your e-wallet</label>
                                <div className={styles.psBankSelectGrid}>
                                    <div
                                        className={`${styles.psBankOption} ${selectedWallet === 'gcash' ? styles.psBankOptionActive : ''}`}
                                        onClick={() => setSelectedWallet('gcash')}
                                    >
                                        <div className={styles.psRadioCol}>
                                            <div className={selectedWallet === 'gcash' ? styles.psRadioActive : styles.psRadio}></div>
                                        </div>
                                        <div style={{ background: '#0066FF', color: 'white', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' }}>G</div>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>GCash</div>
                                            <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Instant transfers to your GCash mobile wallet.</div>
                                        </div>
                                    </div>
                                    <div
                                        className={`${styles.psBankOption} ${selectedWallet === 'maya' ? styles.psBankOptionActive : ''}`}
                                        onClick={() => setSelectedWallet('maya')}
                                    >
                                        <div className={styles.psRadioCol}>
                                            <div className={selectedWallet === 'maya' ? styles.psRadioActive : styles.psRadio}></div>
                                        </div>
                                        <div style={{ background: '#00B900', color: 'white', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' }}>M</div>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Maya</div>
                                            <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Receive payouts to your Maya Business account.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.editModalFooter} style={{ justifyContent: 'space-between' }}>
                            <button className={styles.btnGhost} onClick={() => setModalStep(1)}>Back</button>
                            <button className={styles.btnPrimary} disabled={!selectedWallet} onClick={() => setModalStep(3)}>Continue</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Step 2 for Bank: enter bank details */}
            {showMethodModal && modalStep === 2 && methodType === 'bank' && (
                <div className={styles.editOverlay}>
                    <div className={styles.editModal} style={{ maxWidth: '600px' }}>
                        <div className={styles.editModalHead}>
                            <div>
                                <span style={{ color: '#991B1B', fontSize: '0.75rem', fontWeight: 700 }}>Step 1 of 2</span>
                                <h3>Add Bank Account Details</h3>
                            </div>
                            <button className={styles.iconBtn} onClick={resetModal}><X size={20} /></button>
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
                                    <div className={styles.psWizardIcon}><Check size={16} /></div>
                                    <div className={styles.psWizardLabel}>Confirmation</div>
                                </div>
                            </div>

                            <div className={styles.field}>
                                <label>Select your bank</label>
                                <div className={styles.psBankSelectGrid}>
                                    {['BDO', 'BPI', 'Metrobank', 'UnionBank', 'Landbank', 'PNB'].map(bank => (
                                        <div
                                            key={bank}
                                            className={`${styles.psBankOption} ${selectedBank === bank ? styles.psBankOptionActive : ''}`}
                                            onClick={() => setSelectedBank(bank)}
                                        >
                                            <div className={styles.psRadioCol}>
                                                <div className={selectedBank === bank ? styles.psRadioActive : styles.psRadio}></div>
                                            </div>
                                            <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{bank}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.field}>
                                <label>Account Name</label>
                                <input type="text" placeholder="e.g. Juan Dela Cruz" value={accountName} onChange={e => setAccountName(e.target.value)} />
                                <span style={{ fontSize: '0.7rem', color: '#6B7280' }}>● Must exactly match the name on your bank records.</span>
                            </div>

                            <div className={styles.field}>
                                <label>Account Number</label>
                                <input type="text" placeholder="0000 0000 0000" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} />
                            </div>

                            <div className={styles.instructionsBlock} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                <AlertCircle size={16} color="#991B1B" style={{ flexShrink: 0, marginTop: '2px' }} />
                                <div><strong style={{ color: '#991B1B' }}>Why we need this:</strong> We use these details to process your earnings. Please double-check for accuracy to avoid payment delays.</div>
                            </div>
                        </div>
                        <div className={styles.editModalFooter} style={{ justifyContent: 'space-between' }}>
                            <button className={styles.btnGhost} onClick={() => setModalStep(1)}>Back</button>
                            <button className={styles.btnPrimary} disabled={!selectedBank || !accountName || !accountNumber} onClick={handleLinkMethod}>
                                {saving ? 'Linking...' : 'Link Account'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Step 3 for E-Wallet: enter mobile number */}
            {showMethodModal && modalStep === 3 && methodType === 'ewallet' && (
                <div className={styles.editOverlay}>
                    <div className={styles.editModal} style={{ maxWidth: '600px' }}>
                        <div className={styles.editModalHead}>
                            <div>
                                <span style={{ color: '#991B1B', fontSize: '0.75rem', fontWeight: 700 }}>Step 2 of 2</span>
                                <h3>Link {selectedWallet === 'gcash' ? 'GCash' : 'Maya'} Wallet</h3>
                            </div>
                            <button className={styles.iconBtn} onClick={resetModal}><X size={20} /></button>
                        </div>
                        <div className={styles.editModalBody} style={{ flexDirection: 'column' }}>
                            <p style={{ color: '#6B7280', fontSize: '0.85rem', marginTop: 0 }}>Secure payout connection for TMC Foodhub</p>

                            <div className={styles.psWizardStepper}>
                                <div className={styles.psWizardStep}>
                                    <div className={styles.psWizardIconActive}><Wallet size={16} /></div>
                                    <div className={styles.psWizardLabelActive}>Select E-Wallet</div>
                                    <div className={styles.psWizardLineActive}></div>
                                </div>
                                <div className={styles.psWizardStep}>
                                    <div className={styles.psWizardIconActive}><Smartphone size={16} /></div>
                                    <div className={styles.psWizardLabelActive}>E-Wallet Details</div>
                                    <div className={styles.psWizardLine}></div>
                                </div>
                                <div className={styles.psWizardStep}>
                                    <div className={styles.psWizardIcon}><Check size={16} /></div>
                                    <div className={styles.psWizardLabel}>Confirmation</div>
                                </div>
                            </div>

                            <div style={{ background: '#FEF2F2', borderRadius: '10px', padding: '0.75rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
                                <AlertCircle size={14} color="#991B1B" />
                                <span style={{ fontSize: '0.82rem', color: '#991B1B' }}>Enter your registered mobile number to link your {selectedWallet === 'gcash' ? 'GCash' : 'Maya'} account.</span>
                            </div>

                            <div className={styles.field}>
                                <label>Mobile Number</label>
                                <input
                                    type="tel"
                                    placeholder="+63 9XX XXX XXXX"
                                    value={mobileNumber}
                                    onChange={e => setMobileNumber(e.target.value)}
                                />
                                <span style={{ fontSize: '0.7rem', color: '#6B7280' }}>● Must exactly match the name on your bank records.</span>
                            </div>

                            <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', fontSize: '0.82rem', color: '#374151', marginTop: '0.5rem', cursor: 'pointer' }}>
                                <input type="checkbox" defaultChecked style={{ accentColor: '#991B1B', marginTop: '3px' }} />
                                <span>I authorize TMC Foodhub to facilitate automated payouts to my {selectedWallet === 'gcash' ? 'GCash' : 'Maya'} account and agree to the <span style={{ color: '#991B1B', fontWeight: 600 }}>Terms of Service</span>.</span>
                            </label>
                        </div>
                        <div className={styles.editModalFooter} style={{ justifyContent: 'space-between' }}>
                            <button className={styles.btnGhost} onClick={() => setModalStep(2)}>Back</button>
                            <button className={styles.btnPrimary} disabled={!mobileNumber || saving} onClick={handleLinkMethod}>
                                {saving ? 'Linking...' : 'Continue'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Step 4: Success / Linked Successfully */}
            {showMethodModal && modalStep === 4 && (
                <div className={styles.editOverlay}>
                    <div className={styles.editModal} style={{ maxWidth: '480px' }}>
                        <div className={styles.editModalBody} style={{ flexDirection: 'column', textAlign: 'center', padding: '2.5rem 2rem' }}>
                            <div style={{ background: '#D1FAE5', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                                <Check size={32} color="#059669" />
                            </div>
                            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem' }}>Linked Successfully</h3>
                            <p style={{ color: '#6B7280', fontSize: '0.88rem', margin: '0 0 1.5rem' }}>Your account is now ready for seamless payouts and faster transactions.</p>

                            <div className={styles.psVerifiedCard} style={{ justifyContent: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{
                                        background: methodType === 'ewallet'
                                            ? (selectedWallet === 'gcash' ? '#0066FF' : '#00B900')
                                            : '#0F2C82',
                                        color: 'white', padding: '6px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold'
                                    }}>
                                        {methodType === 'ewallet' ? (selectedWallet === 'gcash' ? 'G' : 'M') : selectedBank?.substring(0, 3)?.toUpperCase()}
                                    </div>
                                    <div style={{ textAlign: 'left' }}>
                                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#111827' }}>{getLinkedLabel()} Account</div>
                                        <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>●●●●●● {getLinkedNumber()?.slice(-4)}</div>
                                    </div>
                                </div>
                                <div className={styles.pillGreen} style={{ fontSize: '0.7rem' }}><Check size={12} /> Active</div>
                            </div>

                            <div style={{ padding: '0.75rem 1rem', background: '#F9FAFB', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1rem', textAlign: 'left' }}>
                                <span style={{ fontSize: '1rem' }}>📅</span>
                                <div>
                                    <div style={{ fontSize: '0.78rem', color: '#6B7280' }}>Next scheduled payout</div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111827' }}>
                                        {new Date(Date.now() + 7 * 86400000).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                                    </div>
                                    <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>Estimated arrival: 1-3 business days</div>
                                </div>
                            </div>

                            <button className={styles.btnPrimary} style={{ width: '100%', justifyContent: 'center', marginTop: '1.5rem' }} onClick={resetModal}>
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Linking spinner overlay */}
            {isLinking && (
                <div className={styles.editOverlay} style={{ zIndex: 1070 }}>
                    <div style={{ background: 'white', borderRadius: '16px', padding: '3rem', textAlign: 'center', maxWidth: '360px' }}>
                        <RefreshCcw size={32} color="#991B1B" className={styles.spinning} />
                        <h4 style={{ margin: '1rem 0 0.5rem' }}>Linking your account...</h4>
                        <p style={{ color: '#6B7280', fontSize: '0.85rem' }}>This usually takes a few seconds.</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PaymentSettings;
