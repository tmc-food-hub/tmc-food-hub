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

/* ─── Roles & Permissions Tab ───────────────────────────────────────────────── */
function RolesPermissionsTab() {
    const PERMS = [
        { category: 'Platform Management', items: [
            { label: 'System Configuration', desc: 'Edit core platform settings & integrations', perms: [true, false, false, false] },
            { label: 'User Role Management', desc: 'User Role Management', perms: [true, true, false, false] },
        ]},
        { category: 'Order Operations', items: [
            { label: 'Cancel & Refund Orders', desc: 'Ability to override active orders and issue credits', perms: [true, true, true, false] },
            { label: 'View Transaction Data', desc: 'Access to detailed payment and fee breakdown', perms: [true, true, true, true] },
        ]},
        { category: 'Marketing & Growth', items: [
            { label: 'Create Promotions', desc: 'Manage coupon codes and delivery fee waivers', perms: [true, true, false, false] },
        ]},
    ];
    const ROLES = ['SUPER ADMIN', 'ADMIN', 'MODERATOR', 'ANALYST'];
    const ROLE_CARDS = [
        { icon: '🎯', name: 'Super Admin', badge: 'Unlimited Power', badgeClass: 'badgeRed', desc: 'Unrestricted access to all modules, financial settings, and API integrations. Primary account owner role.' },
        { icon: '👤', name: 'Admin', badge: 'Operational Lead', badgeClass: 'badgeGray', desc: 'Full operational control over orders, merchants, and users. Cannot modify global system billing logic.' },
        { icon: '🛡', name: 'Moderator', badge: 'Support Level', badgeClass: 'badgeGray', desc: 'Focused on order support and merchant menu management. Limited access to financial data.' },
        { icon: '📊', name: 'Analyst', badge: 'Data Only', badgeClass: 'badgeGray', desc: 'Read-only access to dashboards and transaction logs. Can export data but cannot modify records.' },
    ];

    const [permState, setPermState] = useState(() => {
        const s = {};
        PERMS.forEach(cat => cat.items.forEach(item => { item.perms.forEach((v, i) => { s[`${item.label}_${i}`] = v; }); }));
        return s;
    });

    return (<>
        <h2 className={styles.sectionTitle}>Roles & Permissions</h2>
        <p className={styles.sectionSub}>Configure platform access levels by defining granular permissions for each user role. Ensure administrative security through the principle of least privilege.</p>

        <div className={styles.card}>
            <table className={styles.permTable}>
                <thead><tr><th>Permission Category & Action</th>{ROLES.map(r => <th key={r}>{r}</th>)}</tr></thead>
                <tbody>
                    {PERMS.map(cat => (
                        <React.Fragment key={cat.category}>
                            <tr><td colSpan={5} className={styles.permCategory}>{cat.category}</td></tr>
                            {cat.items.map(item => (
                                <tr key={item.label}>
                                    <td><div className={styles.permName}>{item.label}</div><div className={styles.permDesc}>{item.desc}</div></td>
                                    {ROLES.map((_, ri) => (
                                        <td key={ri} className={styles.permCheckCell}>
                                            <label className={styles.permCheckbox}>
                                                <input type="checkbox" checked={permState[`${item.label}_${ri}`] || false} onChange={() => setPermState(p => ({ ...p, [`${item.label}_${ri}`]: !p[`${item.label}_${ri}`] }))} />
                                                <span className={styles.permCheck}><CheckCircle2 size={14} /></span>
                                            </label>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>

        <div className={styles.roleCardsGrid}>
            {ROLE_CARDS.map(r => (
                <div key={r.name} className={styles.roleCard}>
                    <div className={styles.roleCardHeader}><span className={styles.roleCardIcon}>{r.icon}</span><strong>{r.name}</strong></div>
                    <span className={`${styles.roleCardBadge} ${styles[r.badgeClass]}`}>{r.badge}</span>
                    <p className={styles.roleCardDesc}>{r.desc}</p>
                </div>
            ))}
        </div>
    </>);
}

/* ─── Activity Logs Tab ─────────────────────────────────────────────────────── */
function ActivityLogsTab() {
    const LOGS = [
        { name: 'Jordan Smith', role: 'Super Admin', action: 'Delete', actionClass: 'actionDelete', desc: "Deleted inactive vendor 'Spicy Hut #42'", page: 'Restaurant Management', ip: '192.168.····.···', device: 'macOS (Chrome)', time: 'Mar 23, 2026. 3:03:11' },
        { name: 'Alex Martinez', role: 'Analyst', action: 'Update', actionClass: 'actionUpdate', desc: 'Adjusted delivery radius to 15km for zone B2', page: 'Delivery Rules', ip: '172.16.····.···', device: 'Windows 11 (Edge)', time: 'Mar 23, 2026. 3:03:11' },
        { name: 'Jordan Smith', role: 'Moderator', action: 'Access', actionClass: 'actionAccess', desc: "Downloaded 'Weekly Settlement Report'", page: 'Financials', ip: '10.0.····.···', device: 'Windows 10 (Chrome)', time: 'Mar 23, 2026. 3:03:11' },
        { name: 'Jordan Smith', role: 'Admin', action: 'Auth', actionClass: 'actionAuth', desc: 'Modified login attempts policy to 5 retries', page: 'Security Settings', ip: '45.72.····.···', device: 'Windows 10 (Chrome)', time: 'Mar 23, 2026. 3:03:11' },
        { name: 'Jordan Smith', role: 'Super Admin', action: 'Update', actionClass: 'actionUpdate', desc: 'Flagged order #9942 for manual review', page: 'Orders', ip: '24.112.····.···', device: 'Windows 10 (Chrome)', time: 'Mar 23, 2026. 3:03:11' },
    ];

    return (<>
        <h2 className={styles.sectionTitle}>Activity Logs</h2>
        <p className={styles.sectionSub}>Monitor all administrative actions across the platform. This log is read-only for security and compliance purposes.</p>

        <div className={styles.logsFilters}>
            <div className={styles.logsSearch}><span className={styles.logsSearchIcon}>🔍</span><input placeholder="Search admin..." /></div>
            <select className={styles.logsSelect}><option>All Roles</option></select>
            <select className={styles.logsSelect}><option>All Actions</option></select>
            <button className={styles.logsExportBtn}><span>↓</span> Export</button>
        </div>

        <div className={styles.card}>
            <table className={styles.logsTable}>
                <thead><tr><th>Admin</th><th>Action Description</th><th>Page/Module</th><th>Masked IP</th><th>Device</th><th>Timestamp</th></tr></thead>
                <tbody>
                    {LOGS.map((l, i) => (
                        <tr key={i}>
                            <td><div className={styles.adminCell}><div className={styles.adminAvatar}>{l.name.split(' ').map(x => x[0]).join('')}</div><div><div className={styles.adminName}>{l.name}</div><div className={styles.adminEmail}>{l.role}</div></div></div></td>
                            <td><span className={`${styles.actionBadge} ${styles[l.actionClass]}`}>{l.action}</span><div className={styles.logActionDesc}>{l.desc}</div></td>
                            <td className={styles.logModule}>{l.page}</td>
                            <td className={styles.logIp}>{l.ip}</td>
                            <td className={styles.logDevice}>{l.device}</td>
                            <td className={styles.logTime}>{l.time}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div className={styles.complianceNote}>
            <span>ℹ</span>
            <div>
                <strong>Compliance & Transparency Policy</strong>
                <p>In accordance with the FoodHub Platform Integrity standards, all administrative logs are immutable for a period of 24 months. These logs are encrypted at rest and can only be exported by users with "Audit Auditor" privileges. Attempting to bypass or alter these logs is a violation of the system governance protocol.</p>
            </div>
        </div>
    </>);
}

/* ─── Security Tab ──────────────────────────────────────────────────────────── */
function SecurityTab() {
    const [twoFA, setTwoFA] = useState(true);
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [smsEmergency, setSmsEmergency] = useState(true);

    return (<>
        <h2 className={styles.sectionTitle}>Security Settings</h2>
        <p className={styles.sectionSub}>Configure platform-wide security protocols, authentication policies, and access controls for the TMC Foodhub administrative interface.</p>

        <div className={styles.twoColWide}>
            <div className={styles.leftCol}>
                <div className={styles.card}>
                    <h3 className={styles.cardLabel}>🔒 Authentication & Access</h3>
                    <div className={styles.securityToggleRow}>
                        <div className={`${styles.toggle} ${twoFA ? styles.toggleOn : ''}`} onClick={() => setTwoFA(!twoFA)}><div className={styles.toggleDot} /></div>
                        <div><div className={styles.deliveryName}>Force Two-Factor Authentication</div><div className={styles.deliveryDesc}>Require all admin users to authenticate via mobile app or SMS.</div></div>
                    </div>
                    <div className={styles.fieldGrid} style={{ marginTop: '1rem' }}>
                        <div className={styles.field}><label>Session Timeout</label><select><option>30 minutes</option><option>15 minutes</option><option>1 hour</option></select></div>
                        <div className={styles.field}><label>Max Login Attempts</label><select><option>5 attempts</option><option>3 attempts</option><option>10 attempts</option></select></div>
                    </div>
                </div>

                <div className={styles.card}>
                    <h3 className={styles.cardLabel}>🔔 Security Notifications</h3>
                    <div className={styles.secNotifRow}>
                        <div className={`${styles.toggle} ${emailAlerts ? styles.toggleOn : ''}`} onClick={() => setEmailAlerts(!emailAlerts)}><div className={styles.toggleDot} /></div>
                        <span className={styles.secNotifLabel}>Email Alerts</span>
                    </div>
                    <div className={styles.secNotifRow}>
                        <div className={`${styles.toggle} ${smsEmergency ? styles.toggleOn : ''}`} onClick={() => setSmsEmergency(!smsEmergency)}><div className={styles.toggleDot} /></div>
                        <span className={styles.secNotifLabel}>SMS (Emergency)</span>
                    </div>
                </div>
            </div>
            <div className={styles.rightCol}>
                <div className={styles.card}>
                    <h3 className={styles.cardLabel}>🔑 Password Policy</h3>
                    <div className={styles.pwPolicyItem}><span>Require Uppercase</span><CheckCircle2 size={16} className={styles.pwCheck} /></div>
                    <div className={styles.pwPolicyItem}><span>Require Numbers</span><CheckCircle2 size={16} className={styles.pwCheck} /></div>
                    <div className={styles.pwPolicyItem}><span>Require Special Character</span><CheckCircle2 size={16} className={styles.pwCheck} /></div>
                    <div className={styles.pwExpiry}>
                        <div className={styles.pwExpiryHeader}><span>PASSWORD EXPIRY</span><span>90 days</span></div>
                        <div className={styles.pwExpiryBar}><div className={styles.pwExpiryFill} /></div>
                    </div>
                </div>
            </div>
        </div>

        <div className={styles.secFooterNote}>
            <span className={styles.secFooterDot} /> System changes will be logged in Activity Logs audit trail.
        </div>
    </>);
}

/* ─── Appearance Tab ────────────────────────────────────────────────────────── */
function AppearanceTab() {
    const [theme, setTheme] = useState('light');
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const [timeFormat, setTimeFormat] = useState('12');

    return (<>
        <h2 className={styles.sectionTitle}>Appearance</h2>
        <p className={styles.sectionSub}>Customize the visual identity and interface behavior of your administration dashboard. These settings apply to all administrator accounts.</p>

        <div className={styles.twoColWide}>
            <div className={styles.leftCol}>
                <div className={styles.card}>
                    <h3 className={styles.cardLabel}>🎨 Interface Theme</h3>
                    <div className={styles.themeGrid}>
                        {[{ key: 'light', label: 'Light Mode' }, { key: 'dark', label: 'Dark Mode' }, { key: 'system', label: 'System' }].map(t => (
                            <label key={t.key} className={`${styles.themeOption} ${theme === t.key ? styles.themeActive : ''}`} onClick={() => setTheme(t.key)}>
                                <div className={`${styles.themePreview} ${styles[`theme_${t.key}`]}`}>
                                    <div className={styles.themeBar} /><div className={styles.themeLines}><div /><div /><div /></div>
                                </div>
                                <div className={styles.themeLabel}>
                                    <span>{t.label}</span>
                                    <input type="radio" name="theme" checked={theme === t.key} readOnly />
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                <div className={styles.card}>
                    <h3 className={styles.cardLabel}>🌐 Region Formats</h3>
                    <div className={styles.fieldGrid}>
                        <div className={styles.field}><label>Date Format</label><select><option>mm/dd/yyyy</option><option>dd/mm/yyyy</option><option>yyyy-mm-dd</option></select></div>
                        <div className={styles.field}><label>Time Format</label>
                            <div className={styles.statusToggle}>
                                <button className={`${styles.statusBtn} ${timeFormat === '12' ? styles.statusActive : ''}`} onClick={() => setTimeFormat('12')}>12-hour</button>
                                <button className={`${styles.statusBtn} ${timeFormat === '24' ? styles.statusActive : ''}`} onClick={() => setTimeFormat('24')}>24-hour</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.rightCol}>
                <div className={styles.card}>
                    <h3 className={styles.cardLabel}>📐 Navigation Layout</h3>
                    <div className={styles.securityToggleRow}>
                        <div className={`${styles.toggle} ${sidebarExpanded ? styles.toggleOn : ''}`} onClick={() => setSidebarExpanded(!sidebarExpanded)}><div className={styles.toggleDot} /></div>
                        <div><div className={styles.deliveryName}>Default Sidebar State</div><div className={styles.deliveryDesc}>Expanded by default</div></div>
                    </div>
                    <div className={styles.field} style={{ marginTop: '.85rem' }}><label>Default Landing Page</label><select><option>System Overview Dashboard</option></select></div>
                </div>
            </div>
        </div>

        <div className={styles.secFooterNote}>
            <CheckCircle2 size={14} className={styles.checkGreen} /> All changes are drafted. Click Save to apply.
        </div>
    </>);
}

/* ─── Main Settings Component ───────────────────────────────────────────────── */
export default function AdminSettingsSection() {
    const [activeTab, setActiveTab] = useState('general');
    const [toast, setToast] = useState(null);

    const handleSave = () => {
        setToast({ msg: 'Success', sub: 'Configuration saved successfully.' });
        setTimeout(() => setToast(null), 4000);
    };

    /* Each tab can have a custom footer text & button */
    const footerConfig = {
        security: { note: 'System changes will be logged in Activity Logs audit trail.', btnLabel: 'Update Security Policy' },
        appearance: { note: 'All changes are drafted. Click Save to apply.', btnLabel: 'Save Appearance Settings', discardLabel: 'Reset to Default' },
    };
    const fc = footerConfig[activeTab];

    const renderTab = () => {
        switch (activeTab) {
            case 'general': return <GeneralTab />;
            case 'commission': return <CommissionTab />;
            case 'payments': return <PaymentsTab />;
            case 'notifications': return <NotificationsTab />;
            case 'admin': return <AdminManagementTab />;
            case 'roles': return <RolesPermissionsTab />;
            case 'logs': return <ActivityLogsTab />;
            case 'security': return <SecurityTab />;
            case 'appearance': return <AppearanceTab />;
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
                    <button className={styles.discardBtn}>{fc?.discardLabel || 'Discard Changes'}</button>
                    <button className={styles.saveBtn} onClick={handleSave}>{fc?.btnLabel || 'Save Configuration'}</button>
                </div>
            </div>
        </div>
    );
}
