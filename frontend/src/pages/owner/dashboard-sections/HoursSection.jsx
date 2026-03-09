import React, { useState } from 'react';
import { Save, Check } from 'lucide-react';
import styles from '../OwnerDashboard.module.css';

export default function HoursSection({ store, onUpdate }) {
    const [hours, setHours] = useState(store.operatingHours);
    const [saved, setSaved] = useState(false);
    function setDay(idx, field, value) { setHours(h => h.map((d, i) => i === idx ? { ...d, [field]: value } : d)); setSaved(false); }
    function handleSave() { onUpdate({ ...store, operatingHours: hours }); setSaved(true); setTimeout(() => setSaved(false), 2500); }
    return (
        <div>
            <div className={styles.sectionHeader}><h2 className={styles.sectionTitle}>Operating Hours</h2><button className={saved ? styles.btnSaved : styles.btnSuccess} onClick={handleSave}>{saved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> Save Hours</>}</button></div>
            <div className={styles.hoursCard}>
                {hours.map((row, idx) => (
                    <div key={row.day} className={`${styles.hoursRow} ${!row.open ? styles.hoursRowClosed : ''}`}>
                        <span className={styles.dayName}>{row.day}</span>
                        <label className={styles.switch}><input type="checkbox" checked={row.open} onChange={e => setDay(idx, 'open', e.target.checked)} /><span className={styles.switchTrack} /><span className={styles.switchLabel}>{row.open ? 'Open' : 'Closed'}</span></label>
                        <input type="time" className={styles.timeInput} value={row.from} disabled={!row.open} onChange={e => setDay(idx, 'from', e.target.value)} />
                        <span className={styles.timeSep}>to</span>
                        <input type="time" className={styles.timeInput} value={row.to} disabled={!row.open} onChange={e => setDay(idx, 'to', e.target.value)} />
                    </div>
                ))}
            </div>
        </div>
    );
}
