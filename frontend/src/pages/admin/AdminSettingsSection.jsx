import React, { useState } from 'react';
import {
    Settings, CreditCard, Wallet, Bell, UserCog, Shield, FileText, Lock, Palette,
    Globe, Eye, EyeOff, Pencil, Trash2, CheckCircle2, X, Upload, TrendingUp
} from 'lucide-react';
import styles from './AdminSettingsSection.module.css';

const TABS = [
    { key: 'general', label: 'General', icon: <Settings size={15} /> },
    { key: 'commission', label: 'Commission & Fees', icon: <CreditCard size={15} /> },
    { key: 'payments', label: 'Payment Integrations', icon: <Wallet size={15} /> },
    { key: 'notifications', label: 'Notifications', icon: <Bell size={15} /> },
    { key: 'admin', label: 'Admin Management', icon: <UserCog size={15} /> },
    { key: 'roles', label: 'Roles & Permissions', icon: <Shield size={15} /> },
    { key: 'logs', label: 'Activity Logs', icon: <FileText size={15} /> },
    { key: 'security', label: 'Security', icon: <Lock size={15} /> },
    { key: 'appearance', label: 'Appearance', icon: <Palette size={15} /> },
];

/* ─── General Tab ───────────────────────────────────────────────────────────── */
function GeneralTab() {
    const [platformStatus, setPlatformStatus] = useState('live');
    return (<>
        <h2 className={styles.sectionTitle}>General Settings</h2>
        <p className={styles.sectionSub}>Configure your core platform identity and regional preferences.</p>

        {/* Platform Status */}
        <div className={styles.card}>
            <h3 className={styles.cardLabel}>Platform Status</h3>
            <div className={styles.statusToggle}>
                <button className={`${styles.statusBtn} ${platformStatus === 'live' ? styles.statusActive : ''}`} onClick={() => setPlatformStatus('live')}>Live</button>
                <button className={`${styles.statusBtn} ${platformStatus === 'maintenance' ? styles.statusActive : ''}`} onClick={() => setPlatformStatus('maintenance')}>Maintenance</button>
            </div>
        </div>

        <div className={styles.twoCol}>
            {/* Platform Identity */}
            <div className={styles.card}>
                <h3 className={styles.cardLabel}><Globe size={15} /> Platform Identity</h3>
                <div className={styles.fieldGrid}>
                    <div className={styles.field}><label>Platform Name</label><input defaultValue="TMC Foodhub" /></div>
                    <div className={styles.field}><label>Tagline</label><input defaultValue="Your Cravings, Delivered. Anytim..." /></div>
                    <div className={styles.field}><label>Support Email</label><input defaultValue="support@tmcfoodhub.com" /></div>
                    <div className={styles.field}><label>Phone Number</label><input defaultValue="+63 2 8123 4567" /></div>
                </div>
            </div>

            {/* Branding Assets */}
            <div className={styles.card}>
                <h3 className={styles.cardLabel}>🎨 Branding Assets</h3>
                <div className={styles.brandSection}>
                    <div className={styles.brandItem}>
                        <div className={styles.brandLabel}>Primary Logo</div>
                        <div className={styles.logoBox}>
                            <div className={styles.logoPlaceholder}>🍔</div>
                        </div>
                        <span className={styles.brandHint}>Recommended size: 512×128px. Transparent PNG.</span>
                    </div>
                    <div className={styles.brandItem}>
                        <div className={styles.brandLabel}>Favicon</div>
                        <div className={styles.faviconRow}>
                            <div className={styles.faviconBox}>🍔</div>
                            <button className={styles.replaceBtn}>Replace Icon</button>
                        </div>
                        <span className={styles.brandHint}>ICO, PNG (32×32px)</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Localization */}
        <div className={styles.card}>
            <h3 className={styles.cardLabel}><Globe size={15} /> Localization & Region</h3>
            <div className={styles.fieldGrid3}>
                <div className={styles.field}><label>Currency</label><select><option>PHP</option><option>USD</option></select></div>
                <div className={styles.field}><label>Language</label><select><option>English</option><option>Filipino</option></select></div>
                <div className={styles.field}><label>Timezone</label><select><option>Asia/Manila (GMT+8)</option></select></div>
            </div>
        </div>
    </>);
}

/* ─── Commission & Fees Tab ─────────────────────────────────────────────────── */
function CommissionTab() {
    const [commType, setCommType] = useState('Tiered');
    const [deliveryMode, setDeliveryMode] = useState('restaurant');
    return (<>
        <h2 className={styles.sectionTitle}>Commission Settings</h2>
        <p className={styles.sectionSub}>Configure how the platform generates revenue from transactions, delivery logistics, and administrative actions.</p>

        <div className={styles.twoColWide}>
            <div className={styles.leftCol}>
                {/* Commission Model */}
                <div className={styles.card}>
                    <h3 className={styles.cardLabel}>Commission Model</h3>
                    <p className={styles.cardHint}>Define the primary revenue structure for all partner restaurants.</p>
                    <div className={styles.fieldGrid}>
                        <div className={styles.field}><label>Default Commission Rate</label><div className={styles.inputSuffix}><input defaultValue="15.00" /><span>%</span></div></div>
                        <div className={styles.field}><label>Commission Type</label>
                            <div className={styles.typeToggle}>
                                {['Flat','Per Order','Tiered'].map(t => <button key={t} className={`${styles.typeBtn} ${commType === t ? styles.typeBtnActive : ''}`} onClick={() => setCommType(t)}>{t}</button>)}
                            </div>
                        </div>
                    </div>
                    <span className={styles.fieldNote}>Global fallback rate applied to new vendors.</span>

                    <div className={styles.tierHeader}><span className={styles.cardLabel} style={{ margin: 0 }}>Commission Type</span><button className={styles.addTier}>Add New Tier</button></div>
                    <table className={styles.tierTable}>
                        <thead><tr><th>Volume Range (Monthly)</th><th>Commission %</th><th>Actions</th></tr></thead>
                        <tbody>
                            <tr><td>₱0 - ₱50,000</td><td className={styles.greenVal}>18.00%</td><td><button className={styles.editIcon}><Pencil size={14} /></button></td></tr>
                            <tr><td>₱50,001 - ₱200,000</td><td className={styles.greenVal}>15.00%</td><td><button className={styles.editIcon}><Pencil size={14} /></button></td></tr>
                            <tr><td>₱200,001+</td><td className={styles.greenVal}>12.00%</td><td><button className={styles.editIcon}><Pencil size={14} /></button></td></tr>
                        </tbody>
                    </table>
                </div>

                {/* Delivery Structure + Admin Penalties */}
                <div className={styles.twoCol}>
                    <div className={styles.card}>
                        <h3 className={styles.cardLabel}>🚚 Delivery Structure</h3>
                        <div className={styles.deliveryItem}>
                            <div className={styles.deliveryRow}><div><div className={styles.deliveryName}>Platform-Managed</div><div className={styles.deliveryDesc}>Platform handles logistics. Fixed fee applied per order to the customer.</div></div>
                                <div className={`${styles.toggle} ${deliveryMode === 'platform' ? styles.toggleOn : ''}`} onClick={() => setDeliveryMode('platform')}><div className={styles.toggleDot} /></div>
                            </div>
                        </div>
                        <div className={styles.deliveryItem}>
                            <div className={styles.deliveryRow}><div><div className={styles.deliveryName}>Restaurant-Managed</div><div className={styles.deliveryDesc}>Restaurant uses own fleet. Platform takes no delivery fee portion.</div></div>
                                <div className={`${styles.toggle} ${deliveryMode === 'restaurant' ? styles.toggleOn : ''}`} onClick={() => setDeliveryMode('restaurant')}><div className={styles.toggleDot} /></div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.card}>
                        <h3 className={styles.cardLabel}>Admin Penalties</h3>
                        <div className={styles.field}><label>Review Removal Fee (₱)</label><input defaultValue="250.00" /></div>
                        <span className={styles.fieldNote}>Cost for merchants to appeal valid reviews.</span>
                        <div className={styles.field} style={{ marginTop: '.65rem' }}><label>Cancellation Penalty</label><input defaultValue="10% of Order Val" /></div>
                    </div>
                </div>
            </div>

            <div className={styles.rightCol}>
                {/* Customer Service Fee */}
                <div className={styles.card}>
                    <h3 className={styles.cardLabel}>Customer Service Fee</h3>
                    <div className={styles.bigFee}>₱ 15.00</div>
                    <p className={styles.fieldNote}>Flat administrative fee charged to the user per checkout to cover server maintenance and support.</p>
                </div>
                {/* Tax & Compliance */}
                <div className={styles.card}>
                    <h3 className={styles.cardLabel}>🏛 Tax & Compliance</h3>
                    <div className={styles.taxItem}><div><div className={styles.taxName}>Value Added Tax (VAT)</div><div className={styles.taxSub}>Standard PH Rate</div></div><span className={styles.taxVal}>12.0%</span></div>
                    <div className={styles.taxItem}><div><div className={styles.taxName}>Withholding Tax</div><div className={styles.taxSub}>BIR Regulation</div></div><span className={styles.taxVal}>1.0%</span></div>
                    <div className={styles.complianceBar}><span className={styles.complianceLabel}>Complaint</span><div className={styles.complianceFill} /></div>
                    <p className={styles.fieldNote}>Tax settings are aligned with local regional guidelines as of Q4 2026.</p>
                </div>
                {/* Revenue Card */}
                <div className={styles.revenueCard}>
                    <div className={styles.revenueLabel}>Estimated Daily Revenue</div>
                    <div className={styles.revenueValue}>₱ 142,500.25</div>
                    <div className={styles.revenueSub}><TrendingUp size={14} /> +4.2% from yesterday</div>
                </div>
            </div>
        </div>
    </>);
}

/* ─── Payment Integrations Tab ──────────────────────────────────────────────── */
function PaymentsTab() {
    const [gcash, setGcash] = useState(true);
    const [maya, setMaya] = useState(true);
    const [stripe, setStripe] = useState(false);
    const [cod, setCod] = useState(true);
    const [autoPayout, setAutoPayout] = useState(true);
    const [showKeys, setShowKeys] = useState({});
    const toggleKey = k => setShowKeys(p => ({ ...p, [k]: !p[k] }));

    return (<>
        <h2 className={styles.sectionTitle}>Payment Integrations</h2>
        <p className={styles.sectionSub}>Configure gateways, API credentials, and financial payout rules.</p>

        <div className={styles.twoColWide}>
            <div className={styles.leftCol}>
                {/* GCash */}
                <div className={`${styles.card} ${gcash ? styles.gatewayActive : ''}`}>
                    <div className={styles.gatewayHeader}>
                        <div className={styles.gatewayInfo}><div className={styles.gatewayLogo} style={{ background: '#0066FF' }}>G</div><div><div className={styles.gatewayName}>GCash</div><span className={styles.gatewayBadgeGreen}>• Active</span></div></div>
                        <div className={`${styles.toggle} ${gcash ? styles.toggleOn : ''}`} onClick={() => setGcash(!gcash)}><div className={styles.toggleDot} /></div>
                    </div>
                    <div className={styles.fieldGrid}>
                        <div className={styles.field}><label>Public API Key</label><div className={styles.keyField}><span>••••••••••••••••••••••••••••</span><button onClick={() => toggleKey('gcash-pub')}>{showKeys['gcash-pub'] ? <EyeOff size={14} /> : <Eye size={14} />}</button></div></div>
                        <div className={styles.field}><label>Secret Key</label><div className={styles.keyField}><span>••••••••••••••••••••••••••••</span><button onClick={() => toggleKey('gcash-sec')}>{showKeys['gcash-sec'] ? <EyeOff size={14} /> : <Eye size={14} />}</button></div></div>
                    </div>
                </div>
                {/* Maya */}
                <div className={`${styles.card} ${maya ? styles.gatewayActive : ''}`}>
                    <div className={styles.gatewayHeader}>
                        <div className={styles.gatewayInfo}><div className={styles.gatewayLogo} style={{ background: '#00B14F' }}>M</div><div><div className={styles.gatewayName}>Maya</div><span className={styles.gatewayBadgeGreen}>• Active</span></div></div>
                        <div className={`${styles.toggle} ${maya ? styles.toggleOn : ''}`} onClick={() => setMaya(!maya)}><div className={styles.toggleDot} /></div>
                    </div>
                    <div className={styles.fieldGrid}>
                        <div className={styles.field}><label>Merchant ID</label><span className={styles.keyDisplay}>MAYA_MERCH_9921</span></div>
                        <div className={styles.field}><label>Public API Key</label><div className={styles.keyField}><span>••••••••••••••••••••••••••••</span><button onClick={() => toggleKey('maya-pub')}>{showKeys['maya-pub'] ? <EyeOff size={14} /> : <Eye size={14} />}</button></div></div>
                    </div>
                </div>
                {/* Stripe */}
                <div className={styles.card}>
                    <div className={styles.gatewayHeader}>
                        <div className={styles.gatewayInfo}><div className={styles.gatewayLogo} style={{ background: '#635BFF' }}>S</div><div><div className={styles.gatewayName}>Stripe</div><span className={styles.gatewayBadgeGray}>• Disabled</span></div></div>
                        <div className={`${styles.toggle} ${stripe ? styles.toggleOn : ''}`} onClick={() => setStripe(!stripe)}><div className={styles.toggleDot} /></div>
                    </div>
                </div>
                {/* COD */}
                <div className={`${styles.card} ${cod ? styles.gatewayActive : ''}`}>
                    <div className={styles.gatewayHeader}>
                        <div className={styles.gatewayInfo}><div className={styles.gatewayLogo} style={{ background: '#DC2626' }}>₱</div><div><div className={styles.gatewayName}>Cash on Delivery</div><span className={styles.gatewayBadgeGreen}>• Active</span></div></div>
                        <div className={`${styles.toggle} ${cod ? styles.toggleOn : ''}`} onClick={() => setCod(!cod)}><div className={styles.toggleDot} /></div>
                    </div>
                    <p className={styles.fieldNote}>Limited to transactions under ₱5,000.00 for security purposes.</p>
                </div>
            </div>

            <div className={styles.rightCol}>
                <div className={styles.card}>
                    <h3 className={styles.cardLabel}>🏛 Payout Settings</h3>
                    <div className={styles.payoutRow}><span>Auto-payout</span><span className={styles.payoutSub}>Process automatically</span>
                        <div className={`${styles.toggle} ${autoPayout ? styles.toggleOn : ''}`} onClick={() => setAutoPayout(!autoPayout)}><div className={styles.toggleDot} /></div>
                    </div>
                    <div className={styles.field}><label>Payout Schedule</label><select><option>Weekly (Every Monday)</option></select></div>
                    <div className={styles.field}><label>Minimum Threshold (₱)</label><div className={styles.inputSuffix}><span>₱</span><input defaultValue="10000.00" /></div></div>
                    <div className={styles.field}><label>Payout Method</label><select><option>BPI Savings - Primary</option></select></div>
                    <div className={styles.bankCard}>
                        <div className={styles.bankIcon}>🏦</div>
                        <div>
                            <div className={styles.bankName}>BPI Savings</div>
                            <div className={styles.bankDetail}>Account Name: <strong>TMC LOGISTICS CORP.</strong></div>
                            <div className={styles.bankDetail}>Account Number: <strong>**** **** 9012</strong></div>
                            <button className={styles.changeBankBtn}>Change bank details</button>
                        </div>
                    </div>
                    <div className={styles.payoutInfo}><span>Next estimated payout</span><strong>Mar 23, 2026</strong></div>
                    <div className={styles.payoutInfo}><span>Current Balance</span><strong className={styles.greenVal}>₱42,500.20</strong></div>
                </div>
            </div>
        </div>
    </>);
}

/* ─── Notifications Tab ─────────────────────────────────────────────────────── */
function NotificationsTab() {
    const [toggles, setToggles] = useState({
        newApp_inapp: true, newApp_email: true, newApp_sms: false,
        dispute_inapp: true, dispute_email: true, dispute_sms: true,
        payout_inapp: true, payout_email: true, payout_sms: false,
        inventory_inapp: true, inventory_email: false, inventory_sms: false,
        delayed_inapp: true, delayed_email: false, delayed_sms: true,
        promo_inapp: true, promo_email: true, promo_sms: false,
    });
    const t = (k) => setToggles(p => ({ ...p, [k]: !p[k] }));

    const Toggle = ({ id }) => (
        <div className={`${styles.toggle} ${toggles[id] ? styles.toggleOn : ''}`} onClick={() => t(id)}><div className={styles.toggleDot} /></div>
    );

    return (<>
        <h2 className={styles.sectionTitle}>Notifications</h2>
        <p className={styles.sectionSub}>Configure automated triggers and channel routing across the platform ecosystem.</p>

        {/* Admin System Triggers */}
        <div className={styles.card}>
            <div className={styles.notifHeader}><div className={styles.notifIcon} style={{ background: '#FEF2F2', color: '#DC2626' }}>🔔</div><div><h3 className={styles.cardLabel} style={{ margin: 0 }}>Admin System Triggers</h3><span className={styles.fieldNote}>Internal alerts for system maintenance and oversight</span></div></div>
            <div className={styles.notifCols}><span /><span>In-app</span><span>Email</span><span>SMS</span></div>
            <div className={styles.notifRow}><div><div className={styles.notifName}>New Application</div><div className={styles.notifDesc}>Notify when a new restaurant applies to join the hub</div></div><Toggle id="newApp_inapp" /><Toggle id="newApp_email" /><Toggle id="newApp_sms" /></div>
            <div className={styles.notifRow}><div><div className={styles.notifName}>Payment Dispute</div><div className={styles.notifDesc}>Escalate active chargebacks and refund requests</div></div><Toggle id="dispute_inapp" /><Toggle id="dispute_email" /><Toggle id="dispute_sms" /></div>
        </div>

        {/* Restaurant Merchant Triggers */}
        <div className={styles.card}>
            <div className={styles.notifHeader}><div className={styles.notifIcon} style={{ background: '#FFF7ED', color: '#EA580C' }}>🏪</div><div><h3 className={styles.cardLabel} style={{ margin: 0 }}>Restaurant Merchant Triggers</h3><span className={styles.fieldNote}>Transactional alerts for vendor partners</span></div></div>
            <div className={styles.notifCols}><span /><span>In-app</span><span>Email</span><span>SMS</span></div>
            <div className={styles.notifRow}><div><div className={styles.notifName}>Payout Confirmation</div><div className={styles.notifDesc}>Sent when weekly earnings are transferred to bank</div></div><Toggle id="payout_inapp" /><Toggle id="payout_email" /><Toggle id="payout_sms" /></div>
            <div className={styles.notifRow}><div><div className={styles.notifName}>Low Inventory Alert</div><div className={styles.notifDesc}>Triggered when stock levels fall below threshold</div></div><Toggle id="inventory_inapp" /><Toggle id="inventory_email" /><Toggle id="inventory_sms" /></div>
        </div>

        {/* Customer Journey Triggers */}
        <div className={styles.card}>
            <div className={styles.notifHeader}><div className={styles.notifIcon} style={{ background: '#FEF2F2', color: '#DC2626' }}>🛒</div><div><h3 className={styles.cardLabel} style={{ margin: 0 }}>Customer Journey Triggers</h3><span className={styles.fieldNote}>Touchpoints for end-user engagement</span></div></div>
            <div className={styles.notifCols}><span /><span>In-app</span><span>Email</span><span>SMS</span></div>
            <div className={styles.notifRow}><div><div className={styles.notifName}>Order Delayed</div><div className={styles.notifDesc}>Apology message sent if prep time exceeds estimate</div></div><Toggle id="delayed_inapp" /><Toggle id="delayed_email" /><Toggle id="delayed_sms" /></div>
            <div className={styles.notifRow}><div><div className={styles.notifName}>Promotional Offer</div><div className={styles.notifDesc}>Marketing blasts for weekend specials</div></div><Toggle id="promo_inapp" /><Toggle id="promo_email" /><Toggle id="promo_sms" /></div>
        </div>
    </>);
}

/* ─── Admin Management Tab ──────────────────────────────────────────────────── */
function AdminManagementTab() {
    const admins = [
        { name: 'Jordan Smith', email: 'jordan.smith@email.com', role: 'Super Admin', roleClass: 'roleSuperAdmin', status: 'Active', statusClass: 'statusActive', lastActive: 'Just now' },
        { name: 'Alex Martinez', email: 'alex.martinez@email.com', role: 'Analyst', roleClass: 'roleAnalyst', status: 'Inactive', statusClass: 'statusInactive', lastActive: '2 hours ago' },
        { name: 'Elena Kostic', email: 'elena.kostic@email.com', role: 'Moderator', roleClass: 'roleModerator', status: 'Suspended', statusClass: 'statusSuspended', lastActive: '3 days ago' },
        { name: 'John Doe', email: 'john.doe@email.com', role: 'Admin', roleClass: 'roleAdmin', status: 'Active', statusClass: 'statusActive', lastActive: '14 mins ago' },
    ];

    return (<>
        <h2 className={styles.sectionTitle}>Admin Management</h2>
        <p className={styles.sectionSub}>Manage permissions and monitor activity for all platform administrators.</p>

        <div className={styles.card}>
            <table className={styles.adminTable}>
                <thead><tr><th>Admin</th><th>Role</th><th>Status</th><th>Last Active</th><th>Actions</th></tr></thead>
                <tbody>
                    {admins.map(a => (
                        <tr key={a.email}>
                            <td><div className={styles.adminCell}><div className={styles.adminAvatar}>{a.name.split(' ').map(x=>x[0]).join('')}</div><div><div className={styles.adminName}>{a.name}</div><div className={styles.adminEmail}>{a.email}</div></div></div></td>
                            <td><span className={`${styles.rolePill} ${styles[a.roleClass]}`}>{a.role}</span></td>
                            <td><span className={`${styles.statusDot} ${styles[a.statusClass]}`}>{a.status}</span></td>
                            <td className={styles.dateCol}>{a.lastActive}</td>
                            <td><div className={styles.adminActions}><button className={styles.editIcon}><Pencil size={14} /></button><button className={styles.deleteIcon}><Trash2 size={14} /></button></div></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div className={styles.twoCol}>
            <div className={styles.card}>
                <h3 className={styles.cardLabel}>🔴 Recent Permission Changes</h3>
                <div className={styles.logItem}><span className={styles.logDot} style={{ background: '#DC2626' }} /><div><div className={styles.logText}>Role "Analyst" assigned to Marcus Thorne</div><div className={styles.logMeta}>By Sarah Chen • 2 hours ago</div></div></div>
                <div className={styles.logItem}><span className={styles.logDot} style={{ background: '#D1D5DB' }} /><div><div className={styles.logText}>Password reset enforced for all Moderators</div><div className={styles.logMeta}>System Security • 5 hours ago</div></div></div>
            </div>
            <div className={styles.card}>
                <h3 className={styles.cardLabel}>🔒 Security Checklist</h3>
                <div className={styles.checkItem}><span>2FA Enabled for all Admins</span><CheckCircle2 size={18} className={styles.checkGreen} /></div>
                <div className={styles.checkItem}><span>IP Whitelisting Active</span><CheckCircle2 size={18} className={styles.checkGreen} /></div>
            </div>
        </div>
    </>);
}

/* ─── Placeholder Tabs ──────────────────────────────────────────────────────── */
function PlaceholderTab({ name }) {
    return <div className={styles.card}><h3 className={styles.cardLabel}>{name}</h3><p className={styles.fieldNote}>This section is under development.</p></div>;
}

/* ─── Main Settings Component ───────────────────────────────────────────────── */
export default function AdminSettingsSection() {
    const [activeTab, setActiveTab] = useState('general');
    const [toast, setToast] = useState(null);

    const handleSave = () => {
        setToast({ msg: 'Success', sub: 'Configuration saved successfully.' });
        setTimeout(() => setToast(null), 4000);
    };

    const renderTab = () => {
        switch (activeTab) {
            case 'general': return <GeneralTab />;
            case 'commission': return <CommissionTab />;
            case 'payments': return <PaymentsTab />;
            case 'notifications': return <NotificationsTab />;
            case 'admin': return <AdminManagementTab />;
            case 'roles': return <PlaceholderTab name="Roles & Permissions" />;
            case 'logs': return <PlaceholderTab name="Activity Logs" />;
            case 'security': return <PlaceholderTab name="Security" />;
            case 'appearance': return <PlaceholderTab name="Appearance" />;
            default: return null;
        }
    };

    return (
        <div className={styles.container}>
            {/* Toast */}
            {toast && (
                <div className={styles.toast}>
                    <CheckCircle2 size={20} className={styles.toastIcon} />
                    <div><div className={styles.toastTitle}>{toast.msg}</div><div className={styles.toastSub}>{toast.sub}</div></div>
                    <button className={styles.toastClose} onClick={() => setToast(null)}><X size={16} /></button>
                </div>
            )}

            <div className={styles.settingsLayout}>
                {/* Tabs sidebar */}
                <div className={styles.tabSidebar}>
                    {TABS.map(tab => (
                        <button key={tab.key} className={`${styles.tabBtn} ${activeTab === tab.key ? styles.tabBtnActive : ''}`} onClick={() => setActiveTab(tab.key)}>
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className={styles.tabContent}>
                    {renderTab()}
                </div>
            </div>

            {/* Footer */}
            <div className={styles.footer}>
                <div className={styles.footerInfo}>Last updated by <strong>Admin John Doe</strong><br />March 19, 2026 - 5:18 PM</div>
                <div className={styles.footerActions}>
                    <button className={styles.discardBtn}>Discard Changes</button>
                    <button className={styles.saveBtn} onClick={handleSave}>Save Configuration</button>
                </div>
            </div>
        </div>
    );
}
