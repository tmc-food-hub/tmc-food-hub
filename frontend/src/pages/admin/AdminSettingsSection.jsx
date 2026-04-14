import React, { useState, useEffect } from 'react';
import {
    Settings, CreditCard, Wallet, Bell, UserCog, Shield, FileText, Lock, Palette,
    Globe, Eye, EyeOff, Pencil, Trash2, CheckCircle2, X, Upload, TrendingUp, Loader, AlertCircle
} from 'lucide-react';
import api from '../../api/axios';
import styles from './AdminSettingsSection.module.css';

// Comprehensive timezone list
const TIMEZONES = [
    'UTC', 'Africa/Cairo', 'Africa/Johannesburg', 'Africa/Lagos', 'Africa/Nairobi', 'Africa/Casablanca',
    'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'America/Toronto',
    'America/Mexico_City', 'America/Sao_Paulo', 'America/Buenos_Aires', 'America/Bogota', 'America/Lima',
    'Asia/Dubai', 'Asia/Kolkata', 'Asia/Bangkok', 'Asia/Singapore', 'Asia/Hong_Kong', 'Asia/Tokyo',
    'Asia/Seoul', 'Asia/Manila', 'Asia/Jakarta', 'Asia/Yangon', 'Asia/Karachi', 'Asia/Tehran',
    'Asia/Jerusalem', 'Asia/Moscow', 'Australia/Sydney', 'Australia/Melbourne', 'Australia/Brisbane',
    'Australia/Perth', 'Australia/Adelaide', 'Europe/London', 'Europe/Paris', 'Europe/Berlin',
    'Europe/Madrid', 'Europe/Amsterdam', 'Europe/Rome', 'Europe/Vienna', 'Europe/Warsaw',
    'Europe/Istanbul', 'Europe/Athens', 'Europe/Helsinki', 'Europe/Dublin', 'Europe/Lisbon',
    'Europe/Zurich', 'Europe/Brussels', 'Europe/Budapest', 'Europe/Prague', 'Europe/Stockholm',
    'Europe/Copenhagen', 'Europe/Oslo', 'Europe/Bucharest', 'Europe/Sofia', 'Europe/Zagreb',
    'Europe/Belgrade', 'Europe/Skopje', 'Europe/Tirana', 'Europe/Nicosia', 'Europe/Riga',
    'Europe/Tallin', 'Europe/Vilnius', 'Europe/Minsk', 'Europe/Chisinau', 'Europe/Johannesburg',
    'Pacific/Auckland', 'Pacific/Fiji', 'Pacific/Tongatapu', 'Pacific/Port_Moresby', 'Pacific/Honolulu',
    'Indian/Mauritius', 'Indian/Maldives', 'Indian/Reunion', 'Indian/Cocos', 'Indian/Christmas'
].sort();

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
function GeneralTab({ onRegisterSave }) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [logoPreview, setLogoPreview] = useState(null);
    const [faviconPreview, setFaviconPreview] = useState(null);
    const [logoFile, setLogoFile] = useState(null);
    const [faviconFile, setFaviconFile] = useState(null);
    const [settings, setSettings] = useState({
        platform_status: 'live',
        platform_name: 'TMC Foodhub',
        tagline: 'Your Cravings, Delivered. Anytime.',
        support_email: 'support@tmcfoodhub.com',
        phone_number: '+63 2 8123 4567',
        currency: 'PHP',
        language: 'English',
        timezone: 'Asia/Manila',
        logo_url: null,
        favicon_url: null,
    });

    useEffect(() => {
        fetchSettings();
        // Register save handler with parent
        if (onRegisterSave) {
            onRegisterSave(handleSaveGeneral);
        }
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            setErrorMessage('');
            const response = await api.get('/admin/settings');
            const data = response.data.data;
            setSettings({
                platform_status: data.platform_status || 'live',
                platform_name: data.platform_name || 'TMC Foodhub',
                tagline: data.tagline || 'Your Cravings, Delivered. Anytime.',
                support_email: data.support_email || 'support@tmcfoodhub.com',
                phone_number: data.phone_number || '+63 2 8123 4567',
                currency: data.currency || 'PHP',
                language: data.language || 'English',
                timezone: data.timezone || 'Asia/Manila',
                logo_url: data.logo_url || null,
                favicon_url: data.favicon_url || null,
            });
            if (data.logo_url) setLogoPreview(data.logo_url);
            if (data.favicon_url) setFaviconPreview(data.favicon_url);
        } catch (err) {
            console.error('Error fetching settings:', err);
            setErrorMessage('Failed to load settings. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const errors = {};
        setFieldErrors({});
        
        if (!settings.platform_name?.trim()) errors.platform_name = 'Platform name is required';
        if (!settings.support_email?.trim()) errors.support_email = 'Support email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.support_email)) errors.support_email = 'Invalid email format';
        if (!settings.tagline?.trim()) errors.tagline = 'Tagline is required';
        if (!settings.phone_number?.trim()) errors.phone_number = 'Phone number is required';
        
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return false;
        }
        return true;
    };

    const handleFileSelect = (file, type) => {
        if (!file) return;
        
        const allowedMimes = [
            'image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml',
            'image/bmp', 'image/tiff', 'image/x-icon', 'image/vnd.microsoft.icon'
        ];
        if (!allowedMimes.includes(file.type)) {
            setFieldErrors(p => ({ ...p, [type]: 'Unsupported format. Use: PNG, JPEG, GIF, WebP, SVG, BMP, TIFF, or ICO (max 5MB)' }));
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setFieldErrors(p => ({ ...p, [type]: 'File size must be under 5MB' }));
            return;
        }
        
        setFieldErrors(p => ({ ...p, [type]: '' }));
        const reader = new FileReader();
        reader.onload = (e) => {
            if (type === 'logo') {
                setLogoPreview(e.target.result);
                setLogoFile(file);
            } else {
                setFaviconPreview(e.target.result);
                setFaviconFile(file);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleSaveGeneral = async () => {
        if (!validateForm()) return;
        
        try {
            setSaving(true);
            setErrorMessage('');
            const uploadPromises = [];
            
            // Upload logo if selected
            if (logoFile) {
                const logoForm = new FormData();
                logoForm.append('logo', logoFile);
                uploadPromises.push(
                    api.post('/admin/upload-logo', logoForm, { 
                        headers: { 'Content-Type': 'multipart/form-data' }
                    }).then(res => ({ type: 'logo', data: res.data }))
                );
            }
            
            // Upload favicon if selected
            if (faviconFile) {
                const faviconForm = new FormData();
                faviconForm.append('favicon', faviconFile);
                uploadPromises.push(
                    api.post('/admin/upload-favicon', faviconForm, { 
                        headers: { 'Content-Type': 'multipart/form-data' }
                    }).then(res => ({ type: 'favicon', data: res.data }))
                );
            }
            
            // Wait for uploads if any
            let updatedSettings = { ...settings };
            if (uploadPromises.length > 0) {
                const uploadResults = await Promise.all(uploadPromises);
                uploadResults.forEach(result => {
                    if (result.type === 'logo' && result.data?.logo_url) {
                        updatedSettings.logo_url = result.data.logo_url;
                        setLogoPreview(result.data.logo_url);
                    }
                    if (result.type === 'favicon' && result.data?.favicon_url) {
                        updatedSettings.favicon_url = result.data.favicon_url;
                        setFaviconPreview(result.data.favicon_url);
                    }
                });
                setLogoFile(null);
                setFaviconFile(null);
                setSettings(updatedSettings);
            }
            
            await api.put('/admin/settings/general', {
                platform_status: updatedSettings.platform_status,
                platform_name: updatedSettings.platform_name,
                tagline: updatedSettings.tagline,
                support_email: updatedSettings.support_email,
                phone_number: updatedSettings.phone_number,
                currency: updatedSettings.currency,
                language: updatedSettings.language,
                timezone: updatedSettings.timezone,
                logo_url: updatedSettings.logo_url,
                favicon_url: updatedSettings.favicon_url,
            });
            setSuccessMessage('General settings saved successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error('Error saving settings:', err);
            setErrorMessage(err.response?.data?.message || 'Failed to save settings. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleInputChange = (field, value) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const renderFieldError = (field) => fieldErrors[field] && (
        <div style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <AlertCircle size={12} /> {fieldErrors[field]}
        </div>
    );

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', gap: '12px' }}>
                <Loader size={20} className={styles.spinner} />
                <span>Loading settings...</span>
            </div>
        );
    }

    return (<>
        <h2 className={styles.sectionTitle}>General Settings</h2>
        <p className={styles.sectionSub}>Configure your core platform identity and regional preferences.</p>

        {successMessage && (
            <div style={{ padding: '12px 16px', background: '#DCFCE7', border: '1px solid #86EFAC', borderRadius: '6px', marginBottom: '20px', color: '#166534', fontSize: '13px', fontWeight: '500' }}>
                ✓ {successMessage}
            </div>
        )}
        {errorMessage && (
            <div style={{ padding: '12px 16px', background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '6px', marginBottom: '20px', color: '#991B1B', fontSize: '13px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} /> {errorMessage}
            </div>
        )}

        {/* Platform Status */}
        <div className={styles.card}>
            <h3 className={styles.cardLabel}>Platform Status</h3>
            <div className={styles.statusToggle}>
                <button 
                    className={`${styles.statusBtn} ${settings.platform_status === 'live' ? styles.statusActive : ''}`} 
                    onClick={() => handleInputChange('platform_status', 'live')}
                >
                    Live
                </button>
                <button 
                    className={`${styles.statusBtn} ${settings.platform_status === 'maintenance' ? styles.statusActive : ''}`} 
                    onClick={() => handleInputChange('platform_status', 'maintenance')}
                >
                    Maintenance
                </button>
            </div>
        </div>

        <div className={styles.twoCol}>
            {/* Platform Identity */}
            <div className={styles.card}>
                <h3 className={styles.cardLabel}><Globe size={15} /> Platform Identity</h3>
                <div className={styles.fieldGrid}>
                    <div className={styles.field}>
                        <label>Platform Name</label>
                        <input 
                            value={settings.platform_name} 
                            onChange={(e) => { handleInputChange('platform_name', e.target.value); setFieldErrors(p => ({ ...p, platform_name: '' })); }} 
                            style={{ borderColor: fieldErrors.platform_name ? '#DC2626' : 'inherit' }}
                        />
                        {renderFieldError('platform_name')}
                    </div>
                    <div className={styles.field}>
                        <label>Tagline</label>
                        <input 
                            value={settings.tagline} 
                            onChange={(e) => { handleInputChange('tagline', e.target.value); setFieldErrors(p => ({ ...p, tagline: '' })); }} 
                            style={{ borderColor: fieldErrors.tagline ? '#DC2626' : 'inherit' }}
                        />
                        {renderFieldError('tagline')}
                    </div>
                    <div className={styles.field}>
                        <label>Support Email</label>
                        <input 
                            type="email"
                            value={settings.support_email} 
                            onChange={(e) => { handleInputChange('support_email', e.target.value); setFieldErrors(p => ({ ...p, support_email: '' })); }} 
                            style={{ borderColor: fieldErrors.support_email ? '#DC2626' : 'inherit' }}
                        />
                        {renderFieldError('support_email')}
                    </div>
                    <div className={styles.field}>
                        <label>Phone Number</label>
                        <input 
                            value={settings.phone_number} 
                            onChange={(e) => { handleInputChange('phone_number', e.target.value); setFieldErrors(p => ({ ...p, phone_number: '' })); }} 
                            style={{ borderColor: fieldErrors.phone_number ? '#DC2626' : 'inherit' }}
                        />
                        {renderFieldError('phone_number')}
                    </div>
                </div>
            </div>

            {/* Branding Assets */}
            <div className={styles.card}>
                <h3 className={styles.cardLabel}>🎨 Branding Assets</h3>
                <div className={styles.brandSection}>
                    <div className={styles.brandItem}>
                        <div className={styles.brandLabel}>Primary Logo</div>
                        <div className={styles.logoBox}>
                            {logoPreview ? (
                                <img src={logoPreview} alt="Logo preview" style={{ maxWidth: '100%', maxHeight: '80px' }} />
                            ) : (
                                <div className={styles.logoPlaceholder}>🍔</div>
                            )}
                        </div>
                        <input 
                            type="file" 
                            accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml,image/bmp,image/tiff,image/x-icon"
                            onChange={(e) => handleFileSelect(e.target.files?.[0], 'logo')}
                            style={{ display: 'none' }}
                            id="logo-input"
                        />
                        <button 
                            onClick={() => document.getElementById('logo-input').click()}
                            className={styles.replaceBtn}
                            style={{ marginTop: '8px' }}
                        >
                            Upload Logo
                        </button>
                        {renderFieldError('logo')}
                        <span className={styles.brandHint}>Recommended size: 512×128px. PNG, JPEG, GIF (max 5MB)</span>
                    </div>
                    <div className={styles.brandItem}>
                        <div className={styles.brandLabel}>Favicon</div>
                        <div className={styles.faviconRow}>
                            {faviconPreview ? (
                                <img src={faviconPreview} alt="Favicon preview" style={{ maxWidth: '40px', maxHeight: '40px' }} />
                            ) : (
                                <div className={styles.faviconBox}>🍔</div>
                            )}
                            <input 
                                type="file" 
                                accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml,image/x-icon"
                                onChange={(e) => handleFileSelect(e.target.files?.[0], 'favicon')}
                                style={{ display: 'none' }}
                                id="favicon-input"
                            />
                            <button 
                                onClick={() => document.getElementById('favicon-input').click()}
                                className={styles.replaceBtn}
                            >
                                Replace Icon
                            </button>
                        </div>
                        {renderFieldError('favicon')}
                        <span className={styles.brandHint}>ICO, PNG (32×32px, max 5MB)</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Localization */}
        <div className={styles.card}>
            <h3 className={styles.cardLabel}><Globe size={15} /> Localization & Region</h3>
            <div className={styles.fieldGrid3}>
                <div className={styles.field}>
                    <label>Currency</label>
                    <select value={settings.currency} onChange={(e) => handleInputChange('currency', e.target.value)}>
                        <option>PHP</option>
                        <option>USD</option>
                        <option>EUR</option>
                        <option>GBP</option>
                        <option>JPY</option>
                        <option>AUD</option>
                    </select>
                </div>
                <div className={styles.field}>
                    <label>Language</label>
                    <select value={settings.language} onChange={(e) => handleInputChange('language', e.target.value)}>
                        <option>English</option>
                        <option>Filipino</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                    </select>
                </div>
                <div className={styles.field}>
                    <label>Timezone</label>
                    <select value={settings.timezone} onChange={(e) => handleInputChange('timezone', e.target.value)}>
                        {TIMEZONES.map(tz => (
                            <option key={tz} value={tz}>{tz}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-start' }}>
            <button 
                onClick={handleSaveGeneral}
                disabled={saving}
                style={{
                    padding: '10px 20px',
                    background: '#22c55e',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}
            >
                {saving ? <><Loader size={14} className={styles.spinner} /> Saving...</> : <> Save Changes</>}
            </button>
            <button 
                onClick={fetchSettings}
                disabled={saving}
                style={{
                    padding: '10px 20px',
                    background: '#f0f0f0',
                    color: '#333',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: saving ? 'not-allowed' : 'pointer',
                }}
            >
                Cancel
            </button>
        </div>
    </>);
}

/* ─── Commission & Fees Tab ─────────────────────────────────────────────────── */
function CommissionTab({ onRegisterSave }) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [commissionSettings, setCommissionSettings] = useState({
        default_commission_rate: 15.00,
        commission_type: 'flat',
        delivery_mode: 'restaurant',
        platform_delivery_fee: 50,
    });

    useEffect(() => {
        fetchCommissionSettings();
        if (onRegisterSave) {
            onRegisterSave(handleSaveCommission);
        }
    }, []);

    const fetchCommissionSettings = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/settings');
            const data = response.data.data;
            setCommissionSettings({
                default_commission_rate: data.default_commission_rate || 15.00,
                commission_type: data.commission_type || 'flat',
                delivery_mode: data.delivery_mode || 'restaurant',
                platform_delivery_fee: data.platform_delivery_fee || 50,
            });
        } catch (err) {
            console.error('Error fetching commission settings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveCommission = async () => {
        try {
            setSaving(true);
            await api.put('/admin/settings/commission', {
                default_commission_rate: commissionSettings.default_commission_rate,
                commission_type: commissionSettings.commission_type,
                delivery_mode: commissionSettings.delivery_mode,
                platform_delivery_fee: commissionSettings.platform_delivery_fee,
            });
            setSuccessMessage('Commission settings saved successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error('Error saving commission settings:', err);
            const errorMsg = err.response?.data?.errors 
                ? Object.values(err.response.data.errors).flat().join(', ')
                : err.response?.data?.message || 'Failed to save commission settings';
            alert(errorMsg);
        } finally {
            setSaving(false);
        }
    };

    const handleCommissionChange = (field, value) => {
        setCommissionSettings(prev => ({ ...prev, [field]: value }));
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', gap: '12px' }}>
                <Loader size={20} className={styles.spinner} />
                <span>Loading settings...</span>
            </div>
        );
    }

    let commType = commissionSettings.commission_type;
    let deliveryMode = commissionSettings.delivery_mode;

    return (<>
        <h2 className={styles.sectionTitle}>Commission Settings</h2>
        <p className={styles.sectionSub}>Configure how the platform generates revenue from transactions, delivery logistics, and administrative actions.</p>

        {successMessage && (
            <div style={{ padding: '12px 16px', background: '#DCFCE7', border: '1px solid #86EFAC', borderRadius: '6px', marginBottom: '20px', color: '#166534', fontSize: '13px', fontWeight: '500' }}>
                ✓ {successMessage}
            </div>
        )}

        <div className={styles.twoColWide}>
            <div className={styles.leftCol}>
                {/* Commission Model */}
                <div className={styles.card}>
                    <h3 className={styles.cardLabel}>Commission Model</h3>
                    <p className={styles.cardHint}>Define the primary revenue structure for all partner restaurants.</p>
                    <div className={styles.fieldGrid}>
                        <div className={styles.field}>
                            <label>Default Commission Rate</label>
                            <div className={styles.inputSuffix}>
                                <input 
                                    type="number" 
                                    value={commissionSettings.default_commission_rate} 
                                    onChange={(e) => handleCommissionChange('default_commission_rate', parseFloat(e.target.value))}
                                    step="0.01"
                                />
                                <span>%</span>
                            </div>
                        </div>
                        <div className={styles.field}>
                            <label>Commission Type</label>
                            <div className={styles.typeToggle}>
                                {['flat', 'per_order', 'tiered'].map(t => (
                                    <button 
                                        key={t} 
                                        className={`${styles.typeBtn} ${commissionSettings.commission_type === t ? styles.typeBtnActive : ''}`} 
                                        onClick={() => handleCommissionChange('commission_type', t)}
                                    >
                                        {t === 'flat' ? 'Flat' : t === 'per_order' ? 'Per Order' : 'Tiered'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <span className={styles.fieldNote}>Global fallback rate applied to new vendors.</span>
                </div>

                {/* Delivery Structure */}
                <div className={styles.twoCol}>
                    <div className={styles.card}>
                        <h3 className={styles.cardLabel}>🚚 Delivery Structure</h3>
                        <div className={styles.deliveryItem}>
                            <div className={styles.deliveryRow}>
                                <div>
                                    <div className={styles.deliveryName}>Platform-Managed</div>
                                    <div className={styles.deliveryDesc}>Platform handles logistics. Fixed fee applied per order to the customer.</div>
                                </div>
                                <div 
                                    className={`${styles.toggle} ${commissionSettings.delivery_mode === 'platform' ? styles.toggleOn : ''}`} 
                                    onClick={() => handleCommissionChange('delivery_mode', 'platform')}
                                >
                                    <div className={styles.toggleDot} />
                                </div>
                            </div>
                        </div>
                        <div className={styles.deliveryItem}>
                            <div className={styles.deliveryRow}>
                                <div>
                                    <div className={styles.deliveryName}>Restaurant-Managed</div>
                                    <div className={styles.deliveryDesc}>Restaurant uses own fleet. Platform takes no delivery fee portion.</div>
                                </div>
                                <div 
                                    className={`${styles.toggle} ${commissionSettings.delivery_mode === 'restaurant' ? styles.toggleOn : ''}`} 
                                    onClick={() => handleCommissionChange('delivery_mode', 'restaurant')}
                                >
                                    <div className={styles.toggleDot} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.rightCol}>
                {/* Platform Fees */}
                <div className={styles.card}>
                    <h3 className={styles.cardLabel}>Platform Delivery Fee</h3>
                    <div className={styles.field}>
                        <label>Fee Amount (₱)</label>
                        <div className={styles.inputSuffix}>
                            <span>₱</span>
                            <input 
                                type="number" 
                                value={commissionSettings.platform_delivery_fee} 
                                onChange={(e) => handleCommissionChange('platform_delivery_fee', parseFloat(e.target.value))}
                                step="0.01"
                            />
                        </div>
                    </div>
                    <p className={styles.fieldNote}>Applied per order for platform-managed deliveries.</p>
                </div>
            </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-start' }}>
            <button 
                onClick={handleSaveCommission}
                disabled={saving}
                style={{
                    padding: '10px 20px',
                    background: '#22c55e',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}
            >
                {saving ? <><Loader size={14} className={styles.spinner} /> Saving...</> : <> Save Changes</>}
            </button>
            <button 
                onClick={fetchCommissionSettings}
                disabled={saving}
                style={{
                    padding: '10px 20px',
                    background: '#f0f0f0',
                    color: '#333',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: saving ? 'not-allowed' : 'pointer',
                }}
            >
                Cancel
            </button>
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
function NotificationsTab({ onRegisterSave }) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [notificationSettings, setNotificationSettings] = useState({
        notify_new_orders: true,
        notify_disputes: true,
        notify_reviews: true,
        notify_promotions: false,
    });

    useEffect(() => {
        fetchNotificationSettings();
        if (onRegisterSave) {
            onRegisterSave(handleSaveNotifications);
        }
    }, []);

    const fetchNotificationSettings = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/settings');
            const data = response.data.data;
            setNotificationSettings({
                notify_new_orders: data.notify_new_orders !== false,
                notify_disputes: data.notify_disputes !== false,
                notify_reviews: data.notify_reviews !== false,
                notify_promotions: data.notify_promotions !== false,
            });
        } catch (err) {
            console.error('Error fetching notification settings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveNotifications = async () => {
        try {
            setSaving(true);
            await api.put('/admin/settings/notifications', {
                notify_new_orders: notificationSettings.notify_new_orders,
                notify_disputes: notificationSettings.notify_disputes,
                notify_reviews: notificationSettings.notify_reviews,
                notify_promotions: notificationSettings.notify_promotions,
            });
            setSuccessMessage('Notification settings saved successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error('Error saving notification settings:', err);
            alert('Failed to save notification settings');
        } finally {
            setSaving(false);
        }
    };

    const toggleNotification = (field) => {
        setNotificationSettings(prev => ({ ...prev, [field]: !prev[field] }));
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', gap: '12px' }}>
                <Loader size={20} className={styles.spinner} />
                <span>Loading settings...</span>
            </div>
        );
    }

    const Toggle = ({ id }) => (
        <div 
            className={`${styles.toggle} ${notificationSettings[id] ? styles.toggleOn : ''}`} 
            onClick={() => toggleNotification(id)}
        >
            <div className={styles.toggleDot} />
        </div>
    );

    return (<>
        <h2 className={styles.sectionTitle}>Notifications</h2>
        <p className={styles.sectionSub}>Configure automated triggers and channel routing across the platform ecosystem.</p>

        {successMessage && (
            <div style={{ padding: '12px 16px', background: '#DCFCE7', border: '1px solid #86EFAC', borderRadius: '6px', marginBottom: '20px', color: '#166534', fontSize: '13px', fontWeight: '500' }}>
                ✓ {successMessage}
            </div>
        )}

        {/* Admin System Triggers */}
        <div className={styles.card}>
            <div className={styles.notifHeader}>
                <div className={styles.notifIcon} style={{ background: '#FEF2F2', color: '#DC2626' }}>🔔</div>
                <div>
                    <h3 className={styles.cardLabel} style={{ margin: 0 }}>Admin System Triggers</h3>
                    <span className={styles.fieldNote}>Internal alerts for system maintenance and oversight</span>
                </div>
            </div>
            <div className={styles.notifCols}><span /><span>Enabled</span></div>
            <div className={styles.notifRow}>
                <div>
                    <div className={styles.notifName}>New Orders</div>
                    <div className={styles.notifDesc}>Notify admin when new orders are placed</div>
                </div>
                <Toggle id="notify_new_orders" />
            </div>
            <div className={styles.notifRow}>
                <div>
                    <div className={styles.notifName}>Disputes & Chargebacks</div>
                    <div className={styles.notifDesc}>Alert on payment disputes and refund requests</div>
                </div>
                <Toggle id="notify_disputes" />
            </div>
        </div>

        {/* Customer & Review Triggers */}
        <div className={styles.card}>
            <div className={styles.notifHeader}>
                <div className={styles.notifIcon} style={{ background: '#FFF7ED', color: '#EA580C' }}>⭐</div>
                <div>
                    <h3 className={styles.cardLabel} style={{ margin: 0 }}>Review & Rating Triggers</h3>
                    <span className={styles.fieldNote}>Notifications for customer feedback and ratings</span>
                </div>
            </div>
            <div className={styles.notifCols}><span /><span>Enabled</span></div>
            <div className={styles.notifRow}>
                <div>
                    <div className={styles.notifName}>New Reviews & Ratings</div>
                    <div className={styles.notifDesc}>Alert when customers leave restaurant reviews</div>
                </div>
                <Toggle id="notify_reviews" />
            </div>
            <div className={styles.notifRow}>
                <div>
                    <div className={styles.notifName}>Promotional Blasts</div>
                    <div className={styles.notifDesc}>Enable marketing notifications for special offers</div>
                </div>
                <Toggle id="notify_promotions" />
            </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-start' }}>
            <button 
                onClick={handleSaveNotifications}
                disabled={saving}
                style={{
                    padding: '10px 20px',
                    background: '#22c55e',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}
            >
                {saving ? <><Loader size={14} className={styles.spinner} /> Saving...</> : <> Save Changes</>}
            </button>
            <button 
                onClick={fetchNotificationSettings}
                disabled={saving}
                style={{
                    padding: '10px 20px',
                    background: '#f0f0f0',
                    color: '#333',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: saving ? 'not-allowed' : 'pointer',
                }}
            >
                Cancel
            </button>
        </div>
    </>);
}

/* ─── Admin Management Tab ──────────────────────────────────────────────────── */
function AdminManagementTab() {
    const [loading, setLoading] = useState(true);
    const [admins, setAdmins] = useState([]);
    const [editingAdmin, setEditingAdmin] = useState(null);
    const [deletingAdmin, setDeletingAdmin] = useState(null);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', role: 'admin', status: 'Active' });

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/admins');
            setAdmins(response.data.data || []);
        } catch (err) {
            console.error('Error fetching admins:', err);
        } finally {
            setLoading(false);
        }
    };

    const normalizeRoleValue = (role) => {
        const roleMap = {
            'super admin': 'super_admin',
            super_admin: 'super_admin',
            admin: 'admin',
            moderator: 'moderator',
            analyst: 'analyst',
            viewer: 'viewer',
        };
        return roleMap[String(role || '').trim().toLowerCase()] || 'admin';
    };

    const normalizeStatusValue = (status) => {
        const statusMap = {
            active: 'Active',
            inactive: 'Inactive',
            suspended: 'Suspended',
        };
        return statusMap[String(status || '').trim().toLowerCase()] || 'Active';
    };

    const handleEditClick = (admin) => {
        setEditingAdmin(admin);
        setFormData({
            name: admin.name,
            email: admin.email,
            role: normalizeRoleValue(admin.role),
            status: normalizeStatusValue(admin.status),
        });
    };

    const handleSaveEdit = async () => {
        try {
            setSaving(true);
            await api.put(`/admin/admins/${editingAdmin.id}`, formData);
            setEditingAdmin(null);
            fetchAdmins();
        } catch (err) {
            console.error('Error updating admin:', err);
            alert(err.response?.data?.message || 'Error updating admin');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            setSaving(true);
            await api.delete(`/admin/admins/${deletingAdmin.id}`);
            setDeletingAdmin(null);
            fetchAdmins();
        } catch (err) {
            console.error('Error deleting admin:', err);
            alert(err.response?.data?.message || 'Error deleting admin');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', gap: '12px' }}>
                <Loader size={20} className={styles.spinner} />
                <span>Loading admins...</span>
            </div>
        );
    }

    return (<>
        <h2 className={styles.sectionTitle}>Admin Management</h2>
        <p className={styles.sectionSub}>Manage permissions and monitor activity for all platform administrators.</p>

        <div className={styles.card}>
            <table className={styles.adminTable}>
                <thead><tr><th>Admin</th><th>Role</th><th>Status</th><th>Last Active</th><th>Actions</th></tr></thead>
                <tbody>
                    {admins.map(a => (
                        <tr key={a.id}>
                            <td><div className={styles.adminCell}><div className={styles.adminAvatar}>{a.name.split(' ').map(x=>x[0]).join('')}</div><div><div className={styles.adminName}>{a.name}</div><div className={styles.adminEmail}>{a.email}</div></div></div></td>
                            <td><span className={`${styles.rolePill} ${styles[a.roleClass]}`}>{a.role}</span></td>
                            <td><span className={`${styles.statusDot} ${styles[a.statusClass]}`}>{a.status}</span></td>
                            <td className={styles.dateCol}>{a.lastActive}</td>
                            <td><div className={styles.adminActions}><button className={styles.editIcon} onClick={() => handleEditClick(a)} title="Edit"><Pencil size={14} /></button><button className={styles.deleteIcon} onClick={() => setDeletingAdmin(a)} title="Delete"><Trash2 size={14} /></button></div></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Edit Admin Modal */}
        {editingAdmin && (
            <>
                <div className={styles.modalOverlay} onClick={() => setEditingAdmin(null)} />
                <div className={styles.modal} style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#fff', borderRadius: '8px', padding: '24px', maxWidth: '500px', width: '90%', zIndex: 1000, boxShadow: '0 20px 25px rgba(0,0,0,0.2)' }}>
                    <h3 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: '700' }}>Edit Admin</h3>
                    <div style={{ display: 'grid', gap: '16px', marginBottom: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>Name *</label>
                            <input 
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>Email *</label>
                            <input 
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>Role</label>
                            <select 
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
                            >
                                <option value="super_admin">Super Admin</option>
                                <option value="admin">Admin</option>
                                <option value="moderator">Moderator</option>
                                <option value="analyst">Analyst</option>
                                <option value="viewer">Viewer</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>Status</label>
                            <select 
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Suspended">Suspended</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                        <button 
                            onClick={() => setEditingAdmin(null)}
                            disabled={saving}
                            style={{ padding: '8px 16px', border: '1px solid #E5E7EB', borderRadius: '6px', background: '#fff', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSaveEdit}
                            disabled={saving}
                            style={{ padding: '8px 16px', border: 'none', borderRadius: '6px', background: '#22c55e', color: '#fff', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '14px', opacity: saving ? 0.7 : 1 }}
                        >
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>
            </>
        )}

        {/* Delete Confirmation Modal */}
        {deletingAdmin && (
            <>
                <div className={styles.modalOverlay} onClick={() => setDeletingAdmin(null)} />
                <div className={styles.modal} style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#fff', borderRadius: '8px', padding: '24px', maxWidth: '400px', width: '90%', zIndex: 1000, boxShadow: '0 20px 25px rgba(0,0,0,0.2)' }}>
                    <h3 style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: '700', color: '#DC2626' }}>Delete Admin</h3>
                    <p style={{ margin: '0 0 24px', color: '#6B7280', fontSize: '14px' }}>
                        Are you sure you want to delete <strong>{deletingAdmin.name}</strong>? This action cannot be undone.
                    </p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                        <button 
                            onClick={() => setDeletingAdmin(null)}
                            disabled={saving}
                            style={{ padding: '8px 16px', border: '1px solid #E5E7EB', borderRadius: '6px', background: '#fff', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleDeleteConfirm}
                            disabled={saving}
                            style={{ padding: '8px 16px', border: 'none', borderRadius: '6px', background: '#DC2626', color: '#fff', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '14px', opacity: saving ? 0.7 : 1 }}
                        >
                            {saving ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </div>
            </>
        )}
    </>);
}

/* ─── Roles & Permissions Tab ───────────────────────────────────────────────── */
function RolesPermissionsTab({ onRegisterSave }) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [permissions, setPermissions] = useState([]);
    const [roles, setRoles] = useState([]);
    const [permState, setPermState] = useState({});

    useEffect(() => {
        fetchPermissionsAndRoles();
        if (onRegisterSave) {
            onRegisterSave(handleSavePermissions);
        }
    }, []);

    const fetchPermissionsAndRoles = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/permissions-roles');
            const { permissions: permsData, roles: rolesData } = response.data;
            
            setPermissions(permsData);
            setRoles(rolesData);

            // Build permState from fetched data
            const newPermState = {};
            permsData.forEach(cat => {
                cat.items.forEach(item => {
                    rolesData.forEach((role, roleIdx) => {
                        newPermState[`${item.id}_${roleIdx}`] = item.roleIds.includes(role.id);
                    });
                });
            });
            setPermState(newPermState);
        } catch (err) {
            console.error('Error fetching permissions and roles:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSavePermissions = async () => {
        try {
            setSaving(true);
            
            // Build the update payload
            const updates = [];
            permissions.forEach(cat => {
                cat.items.forEach(item => {
                    const roleIds = [];
                    roles.forEach((role, roleIdx) => {
                        if (permState[`${item.id}_${roleIdx}`]) {
                            roleIds.push(role.id);
                        }
                    });
                    updates.push({
                        permission_id: item.permissionId,
                        role_ids: roleIds,
                    });
                });
            });

            await api.put('/admin/permissions-roles', { permissions: updates });
            setSuccessMessage('Permissions updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error('Error saving permissions:', err);
            alert('Failed to save permissions');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', gap: '12px' }}>
                <Loader size={20} className={styles.spinner} />
                <span>Loading permissions and roles...</span>
            </div>
        );
    }

    return (<>
        <h2 className={styles.sectionTitle}>Roles & Permissions</h2>
        <p className={styles.sectionSub}>Configure platform access levels by defining granular permissions for each user role. Ensure administrative security through the principle of least privilege.</p>

        {successMessage && (
            <div style={{ padding: '12px 16px', background: '#DCFCE7', border: '1px solid #86EFAC', borderRadius: '6px', marginBottom: '20px', color: '#166534', fontSize: '13px', fontWeight: '500' }}>
                ✓ {successMessage}
            </div>
        )}

        <div className={styles.card}>
            <table className={styles.permTable}>
                <thead><tr><th>Permission Category & Action</th>{roles.map(r => <th key={r.id}>{r.name.toUpperCase()}</th>)}</tr></thead>
                <tbody>
                    {permissions.map(cat => (
                        <React.Fragment key={cat.category}>
                            <tr><td colSpan={roles.length + 1} className={styles.permCategory}>{cat.category}</td></tr>
                            {cat.items.map(item => (
                                <tr key={item.id}>
                                    <td><div className={styles.permName}>{item.label}</div><div className={styles.permDesc}>{item.desc}</div></td>
                                    {roles.map((role, roleIdx) => (
                                        <td key={role.id} className={styles.permCheckCell}>
                                            <label className={styles.permCheckbox}>
                                                <input 
                                                    type="checkbox" 
                                                    checked={permState[`${item.id}_${roleIdx}`] || false} 
                                                    onChange={() => setPermState(p => ({ ...p, [`${item.id}_${roleIdx}`]: !p[`${item.id}_${roleIdx}`] }))} 
                                                />
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
            {roles.map(r => (
                <div key={r.id} className={styles.roleCard}>
                    <div className={styles.roleCardHeader}><span className={styles.roleCardIcon}>{r.icon}</span><strong>{r.name}</strong></div>
                    <span className={`${styles.roleCardBadge} ${styles[r.badgeClass]}`}>{r.badge}</span>
                    <p className={styles.roleCardDesc}>{r.desc}</p>
                </div>
            ))}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-start' }}>
            <button 
                onClick={handleSavePermissions}
                disabled={saving}
                style={{
                    padding: '10px 20px',
                    background: '#22c55e',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}
            >
                {saving ? <><Loader size={14} className={styles.spinner} /> Saving...</> : <> Save Permissions</>}
            </button>
            <button 
                onClick={fetchPermissionsAndRoles}
                disabled={saving}
                style={{
                    padding: '10px 20px',
                    background: '#f0f0f0',
                    color: '#333',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: saving ? 'not-allowed' : 'pointer',
                }}
            >
                Cancel
            </button>
        </div>
    </>);
}

/* ─── Activity Logs Tab ─────────────────────────────────────────────────────── */
function ActivityLogsTab() {
    const [loading, setLoading] = useState(true);
    const [logs, setLogs] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [filters, setFilters] = useState({
        search: '',
        role: 'all',
        action: 'all',
        category: 'all',
    });

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setFilters(prev => ({ ...prev, search: searchInput.trim() }));
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchInput]);

    useEffect(() => {
        fetchActivityLogs();
    }, [filters.search, filters.role, filters.action, filters.category]);

    const fetchActivityLogs = async () => {
        try {
            setLoading(true);
            const params = {};
            if (filters.search) params.search = filters.search;
            if (filters.role !== 'all') params.role = filters.role;
            if (filters.action !== 'all') params.action = filters.action;
            if (filters.category !== 'all') params.category = filters.category;

            const response = await api.get('/admin/activity-logs', { params });
            setLogs(response.data.data || []);
        } catch (err) {
            console.error('Error fetching activity logs:', err);
            setLogs([]);
        } finally {
            setLoading(false);
        }
    };

    const formatRole = (role) => {
        if (!role) return 'Unknown';
        return String(role)
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', gap: '12px' }}>
                <Loader size={20} className={styles.spinner} />
                <span>Loading activity logs...</span>
            </div>
        );
    }

    return (<>
        <h2 className={styles.sectionTitle}>Activity Logs</h2>
        <p className={styles.sectionSub}>Monitor all administrative actions across the platform. This log is read-only for security and compliance purposes.</p>

        <div className={styles.logsFilters}>
            <div className={styles.logsSearch}>
                <span className={styles.logsSearchIcon}>🔍</span>
                <input
                    placeholder="Search admin, page, action..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
            </div>
            <select
                className={styles.logsSelect}
                value={filters.role}
                onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
            >
                <option value="all">All Roles</option>
                <option value="super_admin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
                <option value="analyst">Analyst</option>
                <option value="viewer">Viewer</option>
            </select>
            <select
                className={styles.logsSelect}
                value={filters.action}
                onChange={(e) => setFilters(prev => ({ ...prev, action: e.target.value }))}
            >
                <option value="all">All Actions</option>
                <option value="Access">Access</option>
                <option value="Update">Update</option>
                <option value="Delete">Delete</option>
                <option value="Auth">Auth</option>
            </select>
            <select
                className={styles.logsSelect}
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            >
                <option value="all">All Categories</option>
                <option value="admin_action">Admin Actions</option>
                <option value="auth_session">Login / Logout</option>
            </select>
            <button className={styles.logsExportBtn}><span>↓</span> Export</button>
        </div>

        <div className={styles.card}>
            <table className={styles.logsTable}>
                <thead><tr><th>Admin</th><th>Action Description</th><th>Page/Module</th><th>Masked IP</th><th>Device</th><th>Timestamp</th></tr></thead>
                <tbody>
                    {logs.length === 0 ? (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: '#6B7280', fontSize: '13px' }}>
                                No activity logs matched your current filters.
                            </td>
                        </tr>
                    ) : (
                        logs.map((l) => (
                            <tr key={l.id}>
                                <td>
                                    <div className={styles.adminCell}>
                                        <div className={styles.adminAvatar}>{l.name?.split(' ').map(x => x[0]).join('') || 'A'}</div>
                                        <div>
                                            <div className={styles.adminName}>{l.name}</div>
                                            <div className={styles.adminEmail}>{l.roleLabel || formatRole(l.role)}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className={`${styles.actionBadge} ${styles[l.actionClass]}`}>{l.action}</span>
                                    <div className={styles.logActionDesc}>{l.desc}</div>
                                    <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>
                                        {(l.categoryLabel || 'Admin Actions')} • {(l.eventType || l.action)}
                                    </div>
                                </td>
                                <td className={styles.logModule}>{l.page}</td>
                                <td className={styles.logIp}>{l.ip}</td>
                                <td className={styles.logDevice}>{l.device}</td>
                                <td className={styles.logTime}>{l.time}</td>
                            </tr>
                        ))
                    )}
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
function SecurityTab({ onRegisterSave }) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [securitySettings, setSecuritySettings] = useState({
        two_factor_auth: true,
        email_alerts: true,
        sms_emergency: true,
        session_timeout: '30 minutes',
        max_login_attempts: 5,
    });

    useEffect(() => {
        fetchSecuritySettings();
        if (onRegisterSave) {
            onRegisterSave(handleSaveSecuritySettings);
        }
    }, []);

    const fetchSecuritySettings = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/security-settings');
            const data = response.data.data;
            setSecuritySettings({
                two_factor_auth: data.two_factor_auth ?? true,
                email_alerts: data.email_alerts ?? true,
                sms_emergency: data.sms_emergency ?? true,
                session_timeout: data.session_timeout || '30 minutes',
                max_login_attempts: data.max_login_attempts || 5,
            });
        } catch (err) {
            console.error('Error fetching security settings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSecuritySettings = async () => {
        try {
            setSaving(true);
            await api.put('/admin/security-settings', {
                two_factor_auth: securitySettings.two_factor_auth,
                email_alerts: securitySettings.email_alerts,
                sms_emergency: securitySettings.sms_emergency,
                session_timeout: securitySettings.session_timeout,
                max_login_attempts: securitySettings.max_login_attempts,
            });
            setSuccessMessage('Security settings saved successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error('Error saving security settings:', err);
            alert('Failed to save security settings');
        } finally {
            setSaving(false);
        }
    };

    const handleSecurityChange = (field, value) => {
        setSecuritySettings(prev => ({ ...prev, [field]: value }));
    };

    const toggleSecuritySwitch = (field) => {
        setSecuritySettings(prev => ({ ...prev, [field]: !prev[field] }));
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', gap: '12px' }}>
                <Loader size={20} className={styles.spinner} />
                <span>Loading security settings...</span>
            </div>
        );
    }

    return (<>
        <h2 className={styles.sectionTitle}>Security Settings</h2>
        <p className={styles.sectionSub}>Configure platform-wide security protocols, authentication policies, and access controls for the TMC Foodhub administrative interface.</p>

        {successMessage && (
            <div style={{ padding: '12px 16px', background: '#DCFCE7', border: '1px solid #86EFAC', borderRadius: '6px', marginBottom: '20px', color: '#166534', fontSize: '13px', fontWeight: '500' }}>
                ✓ {successMessage}
            </div>
        )}

        <div className={styles.twoColWide}>
            <div className={styles.leftCol}>
                <div className={styles.card}>
                    <h3 className={styles.cardLabel}>🔒 Authentication & Access</h3>
                    <div className={styles.securityToggleRow}>
                        <div className={`${styles.toggle} ${securitySettings.two_factor_auth ? styles.toggleOn : ''}`} onClick={() => toggleSecuritySwitch('two_factor_auth')}><div className={styles.toggleDot} /></div>
                        <div><div className={styles.deliveryName}>Force Two-Factor Authentication</div><div className={styles.deliveryDesc}>Require all admin users to authenticate via mobile app or SMS.</div></div>
                    </div>
                    <div className={styles.fieldGrid} style={{ marginTop: '1rem' }}>
                        <div className={styles.field}>
                            <label>Session Timeout</label>
                            <select value={securitySettings.session_timeout} onChange={(e) => handleSecurityChange('session_timeout', e.target.value)}>
                                <option>30 minutes</option>
                                <option>15 minutes</option>
                                <option>1 hour</option>
                            </select>
                        </div>
                        <div className={styles.field}>
                            <label>Max Login Attempts</label>
                            <select value={securitySettings.max_login_attempts} onChange={(e) => handleSecurityChange('max_login_attempts', parseInt(e.target.value))}>
                                <option value="3">3 attempts</option>
                                <option value="5">5 attempts</option>
                                <option value="10">10 attempts</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className={styles.card}>
                    <h3 className={styles.cardLabel}>🔔 Security Notifications</h3>
                    <div className={styles.secNotifRow}>
                        <div className={`${styles.toggle} ${securitySettings.email_alerts ? styles.toggleOn : ''}`} onClick={() => toggleSecuritySwitch('email_alerts')}><div className={styles.toggleDot} /></div>
                        <span className={styles.secNotifLabel}>Email Alerts</span>
                    </div>
                    <div className={styles.secNotifRow}>
                        <div className={`${styles.toggle} ${securitySettings.sms_emergency ? styles.toggleOn : ''}`} onClick={() => toggleSecuritySwitch('sms_emergency')}><div className={styles.toggleDot} /></div>
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

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-start' }}>
            <button 
                onClick={handleSaveSecuritySettings}
                disabled={saving}
                style={{
                    padding: '10px 20px',
                    background: '#22c55e',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}
            >
                {saving ? <><Loader size={14} className={styles.spinner} /> Saving...</> : <> Update Security Policy</>}
            </button>
            <button 
                onClick={fetchSecuritySettings}
                disabled={saving}
                style={{
                    padding: '10px 20px',
                    background: '#f0f0f0',
                    color: '#333',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: saving ? 'not-allowed' : 'pointer',
                }}
            >
                Cancel
            </button>
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
    const tabSaveHandlers = React.useRef({});

    const handleSave = () => {
        const handler = tabSaveHandlers.current[activeTab];
        if (handler) {
            handler();
        } else {
            setToast({ msg: 'Success', sub: 'Configuration saved successfully.' });
            setTimeout(() => setToast(null), 4000);
        }
    };

    const registerSaveHandler = (tabKey, handler) => {
        tabSaveHandlers.current[tabKey] = handler;
    };

    /* Each tab can have a custom footer text & button */
    const footerConfig = {
        security: { note: 'System changes will be logged in Activity Logs audit trail.', btnLabel: 'Update Security Policy' },
        appearance: { note: 'All changes are drafted. Click Save to apply.', btnLabel: 'Save Appearance Settings', discardLabel: 'Reset to Default' },
    };
    const fc = footerConfig[activeTab];

    const renderTab = () => {
        switch (activeTab) {
            case 'general': return <GeneralTab onRegisterSave={(handler) => registerSaveHandler('general', handler)} />;
            case 'commission': return <CommissionTab onRegisterSave={(handler) => registerSaveHandler('commission', handler)} />;
            case 'payments': return <PaymentsTab />;
            case 'notifications': return <NotificationsTab onRegisterSave={(handler) => registerSaveHandler('notifications', handler)} />;
            case 'admin': return <AdminManagementTab />;
            case 'roles': return <RolesPermissionsTab onRegisterSave={(handler) => registerSaveHandler('roles', handler)} />;
            case 'logs': return <ActivityLogsTab />;
            case 'security': return <SecurityTab onRegisterSave={(handler) => registerSaveHandler('security', handler)} />;
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
