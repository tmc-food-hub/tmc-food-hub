import React, { useState } from 'react';
import { Tag, MapPin, Hash, Truck, DollarSign, Layers, FileText, Check, Save } from 'lucide-react';
import styles from '../OwnerDashboard.module.css';

export default function SettingsSection({ store, onUpdate }) {
    const [form, setForm] = useState({ branchName: store.branchName, location: store.location, phone: store.phone, about: store.about, deliveryTime: store.deliveryTime, minOrder: store.minOrder, status: store.status });
    const [saved, setSaved] = useState(false);
    function handleSave(e) { e.preventDefault(); onUpdate({ ...store, ...form }); setSaved(true); setTimeout(() => setSaved(false), 2500); }
    const f = (key, label, icon) => (<div className={styles.field} key={key}><label>{icon} {label}</label><input value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} /></div>);
    return (
        <div>
            <h2 className={styles.sectionTitle}>Branch Settings</h2>
            <div className={styles.formCard}>
                <form onSubmit={handleSave}>
                    <div className={styles.formGrid2}>
                        {f('branchName', 'Branch Name', <Tag size={12} />)}
                        {f('location', 'Location / Address', <MapPin size={12} />)}
                        {f('phone', 'Contact Number', <Hash size={12} />)}
                        {f('deliveryTime', 'Delivery Time', <Truck size={12} />)}
                        {f('minOrder', 'Minimum Order', <DollarSign size={12} />)}
                        <div className={styles.field}><label><Layers size={12} /> Status</label><select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}><option value="Operational">Operational</option><option value="Temporarily Closed">Temporarily Closed</option><option value="Closed">Closed</option></select></div>
                        <div className={`${styles.field} ${styles.fieldFull}`}><label><FileText size={12} /> About</label><textarea rows={3} value={form.about} onChange={e => setForm(p => ({ ...p, about: e.target.value }))} /></div>
                    </div>
                    <div className={styles.formActions}><button type="submit" className={saved ? styles.btnSaved : styles.btnSuccess}>{saved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> Save Changes</>}</button></div>
                </form>
            </div>
        </div>
    );
}
