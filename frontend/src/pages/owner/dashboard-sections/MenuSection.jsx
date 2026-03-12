import React, { useState } from 'react';
import { Search, Bell, AlertCircle, CheckCircle2, LayoutDashboard, Layers, Plus, Pencil, Trash2, Package, X } from 'lucide-react';
import { IMAGES } from './shared';
import styles from '../OwnerDashboard.module.css';

const BLANK = { title: '', description: '', price: '', category: '', available: true, image: IMAGES[0] };

export default function MenuSection({ store, onUpdate }) {
    const [addOpen, setAddOpen] = useState(false);
    const [form, setForm] = useState(BLANK);
    const [editId, setEditId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All Items');
    const [dialog, setDialog] = useState(null);
    const [viewMode, setViewMode] = useState('grid');

    const items = store.menuItems || [];

    // Derived Categories with Counts
    const catsData = [{ name: 'All Items', count: items.length }];
    const uniqueCats = [...new Set(items.map(i => i.category))];
    uniqueCats.forEach(c => {
        catsData.push({ name: c, count: items.filter(i => i.category === c).length });
    });

    const filteredItems = items.filter(i => {
        const matchesSearch = i.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'All Items' || i.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    function handleAdd(e) {
        e.preventDefault();
        if (!form.title || !form.price || !form.category) {
            setError('Title, category and price are required.');
            return;
        }
        try {
            onUpdate({ ...store, menuItems: [...store.menuItems, { ...form, id: Date.now(), price: parseFloat(form.price), available: form.available }] });
            setForm(BLANK);
            setAddOpen(false);
            setError('');
            setDialog({ type: 'success', title: 'Item Added Successfully', desc: `${form.title} has been added to your menu and is now live.` });
        } catch {
            setDialog({ type: 'error', title: 'Failed to Add Item', desc: `We couldn't add ${form.title} to your menu due to a technical error. Please check your connection and try again.` });
        }
    }

    function handleDelete(id) {
        if (!window.confirm('Delete this item?')) return;
        onUpdate({ ...store, menuItems: store.menuItems.filter(i => i.id !== id) });
    }

    function toggle(item) {
        onUpdate({ ...store, menuItems: store.menuItems.map(i => i.id === item.id ? { ...i, available: !i.available } : i) });
    }

    function startEdit(item) {
        setEditId(item.id);
        setEditForm({ title: item.title, description: item.description, price: item.price, category: item.category, image: item.image || IMAGES[0], available: item.available !== false });
    }

    function saveEdit(e) {
        e.preventDefault();
        try {
            onUpdate({ ...store, menuItems: store.menuItems.map(i => i.id === editId ? { ...i, ...editForm, price: parseFloat(editForm.price) } : i) });
            const updatedTitle = editForm.title;
            setEditId(null);
            setDialog({ type: 'success', title: 'Item Updated Successfully', desc: `${updatedTitle} has been updated.` });
        } catch {
            setDialog({ type: 'error', title: 'Failed to Update Item', desc: `We couldn't update ${editForm.title} due to a technical error.` });
        }
    }

    return (
        <div>
            {/* Header */}
            <div className={styles.menuTopRow}>
                <div className={styles.menuHeaderLeft}>
                    <h2>Menu Management</h2>
                    <p>Add, edit, or remove dishes and update descriptions, prices, and availability.</p>
                </div>
                <div className={styles.menuHeaderRight}>
                    <div className={styles.menuSearchBox}>
                        <Search className={styles.menuSearchIcon} size={15} />
                        <input
                            type="text"
                            placeholder="Search items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className={styles.menuNotifyBtn}>
                        <Bell size={18} />
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className={styles.menuFiltersRow}>
                <div className={styles.menuCategories}>
                    {catsData.map(c => (
                        <button
                            key={c.name}
                            onClick={() => setActiveCategory(c.name)}
                            className={`${styles.menuCatBtn} ${activeCategory === c.name ? styles.menuCatBtnActive : ''}`}
                        >
                            {c.name} <span className={styles.menuCatBadge}>{c.count}</span>
                        </button>
                    ))}
                </div>
                <div className={styles.menuActionsRight}>
                    <select className={styles.menuSortSelect}>
                        <option>Popularity</option>
                        <option>Name (A-Z)</option>
                        <option>Price (Low to High)</option>
                        <option>Price (High to Low)</option>
                    </select>
                    <div className={styles.menuViewToggles}>
                        <button className={`${styles.menuViewBtn} ${viewMode === 'grid' ? styles.menuViewBtnActive : ''}`} onClick={() => setViewMode('grid')}><LayoutDashboard size={16} /></button>
                        <button className={`${styles.menuViewBtn} ${viewMode === 'list' ? styles.menuViewBtnActive : ''}`} onClick={() => setViewMode('list')}><Layers size={16} /></button>
                    </div>
                    <button className={styles.addMenuBtn} onClick={() => setAddOpen(true)}>
                        <Plus size={16} /> Add New Item
                    </button>
                </div>
            </div>

            {/* Menu Grid */}
            <div className={styles.newMenuGrid}>
                {filteredItems.map(item => {
                    const stock = item.stockLevel !== undefined ? item.stockLevel : 100;
                    const minThreshold = item.minThreshold !== undefined ? item.minThreshold : 10;

                    let statusType = 'Available';
                    let statusPillClass = styles.statusAvailable;

                    if (!item.available || stock === 0) {
                        statusType = 'Out of Stock';
                        statusPillClass = styles.statusOutOfStock;
                    } else if (stock <= minThreshold) {
                        statusType = 'Low Stock';
                        statusPillClass = styles.statusLowStock;
                    }

                    return (
                        <div key={item.id} className={`${styles.newMenuCard} ${(!item.available || stock === 0) ? styles.newMenuCardDim : ''}`}>
                            <div className={styles.newMenuCardImgWrap}>
                                <img src={item.image} alt={item.title} className={styles.newMenuCardImg} />
                                {item.title.toLowerCase().includes('burger') && <span className={styles.bestSellerBadge}>Best Seller</span>}
                                <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 5 }}>
                                    <button className={`${styles.rowBtn} ${styles.rowBtnBlue}`} onClick={() => startEdit(item)}><Pencil size={12} /></button>
                                    <button className={`${styles.rowBtn} ${styles.rowBtnRed}`} onClick={() => handleDelete(item.id)}><Trash2 size={12} /></button>
                                </div>
                            </div>
                            <div className={styles.newMenuCardBody}>
                                <div className={styles.newMenuCardTitleRow}>
                                    <span className={styles.newMenuCardTitle}>{item.title}</span>
                                    <span className={styles.newMenuCardPrice}>${item.price.toFixed(2)}</span>
                                </div>
                                <div className={styles.newMenuCardDesc}>{item.description}</div>
                                <div className={styles.newMenuCardFooter}>
                                    <span className={`${styles.statusPillInv} ${statusPillClass}`}>{statusType}</span>
                                    <label className={styles.redToggleSwitch}>
                                        <input
                                            type="checkbox"
                                            checked={item.available && stock > 0}
                                            onChange={() => toggle(item)}
                                            disabled={stock === 0}
                                        />
                                        <span className={styles.redToggleSlider}></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Add Modal */}
            {addOpen && (
                <div className={styles.menuModalOverlay}>
                    <div className={styles.menuModal}>
                        <div className={styles.menuModalHead}>
                            <h3 className={styles.menuModalTitle}>Add New Item</h3>
                            <button type="button" className={styles.iconBtn} onClick={() => { setAddOpen(false); setError(''); }} style={{ background: 'transparent' }}><X size={20} color="#6B7280" /></button>
                        </div>
                        <form onSubmit={handleAdd}>
                            <div className={styles.menuModalBody}>
                                {error && <div className={styles.formError} style={{ marginBottom: 15 }}><AlertCircle size={13} /> {error}</div>}
                                <div className={styles.menuFormTop}>
                                    <div className={styles.menuPhotoUpload}>
                                        {form.image ? <img src={form.image} alt="Upload" /> : <><Package size={24} /><div className={styles.menuPhotoText}>Add Photo</div></>}
                                        <div style={{ position: 'absolute', inset: 0 }} onClick={() => {
                                            const nextIdx = (IMAGES.indexOf(form.image) + 1) % IMAGES.length;
                                            setForm({ ...form, image: IMAGES[nextIdx] });
                                        }}></div>
                                    </div>
                                    <div className={styles.menuFormFieldsRight}>
                                        <div className={styles.menuFormGroup}>
                                            <label className={styles.menuFormLabel}>Item Name</label>
                                            <input required className={styles.menuFormInput} placeholder="Item Name" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                                        </div>
                                        <div className={styles.menuFormGroup}>
                                            <label className={styles.menuFormLabel}>Category</label>
                                            <input required list="catsAdd" className={styles.menuFormInput} placeholder="Select Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
                                            <datalist id="catsAdd">{uniqueCats.map(c => <option key={c} value={c} />)}</datalist>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.menuFormGroup}>
                                    <label className={styles.menuFormLabel}>Description</label>
                                    <textarea className={styles.menuFormDesc} placeholder="Write the description..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}></textarea>
                                </div>
                                <div className={styles.menuFormRow2}>
                                    <div className={styles.menuFormGroup}>
                                        <label className={styles.menuFormLabel}>Price</label>
                                        <input required type="number" step="0.01" min="0" className={styles.menuFormInput} placeholder="$ 0.00" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                                    </div>
                                    <div className={styles.menuFormGroup}>
                                        <label className={styles.menuFormLabel}>Estimated Prep Time (mins)</label>
                                        <input type="number" className={styles.menuFormInput} placeholder="0" />
                                    </div>
                                </div>
                                <div className={styles.menuAvailBox}>
                                    <div className={styles.menuAvailText}>
                                        <h4>Item Availability</h4>
                                        <p>Enable this to show the item in the customer menu</p>
                                    </div>
                                    <label className={styles.redToggleSwitch}>
                                        <input type="checkbox" checked={form.available} onChange={e => setForm({ ...form, available: e.target.checked })} />
                                        <span className={styles.redToggleSlider}></span>
                                    </label>
                                </div>
                            </div>
                            <div className={styles.menuModalFooter}>
                                <button type="button" className={styles.menuBtnCancel} onClick={() => { setAddOpen(false); setError(''); }}>Cancel</button>
                                <button type="submit" className={styles.menuBtnSubmit}>Save Item</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editId && (
                <div className={styles.menuModalOverlay}>
                    <div className={styles.menuModal}>
                        <div className={styles.menuModalHead}>
                            <h3 className={styles.menuModalTitle}>Edit Item</h3>
                            <button type="button" className={styles.iconBtn} onClick={() => setEditId(null)} style={{ background: 'transparent' }}><X size={20} color="#6B7280" /></button>
                        </div>
                        <form onSubmit={saveEdit}>
                            <div className={styles.menuModalBody}>
                                <div className={styles.menuFormTop}>
                                    <div className={styles.menuPhotoUpload}>
                                        <img src={editForm.image} alt="Upload" />
                                        <div style={{ position: 'absolute', inset: 0 }} onClick={() => {
                                            const nextIdx = (IMAGES.indexOf(editForm.image) + 1) % IMAGES.length;
                                            setEditForm({ ...editForm, image: IMAGES[nextIdx] });
                                        }}></div>
                                    </div>
                                    <div className={styles.menuFormFieldsRight}>
                                        <div className={styles.menuFormGroup}>
                                            <label className={styles.menuFormLabel}>Item Name</label>
                                            <input required className={styles.menuFormInput} value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} />
                                        </div>
                                        <div className={styles.menuFormGroup}>
                                            <label className={styles.menuFormLabel}>Category</label>
                                            <input required list="catsEdit" className={styles.menuFormInput} value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })} />
                                            <datalist id="catsEdit">{uniqueCats.map(c => <option key={c} value={c} />)}</datalist>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.menuFormGroup}>
                                    <label className={styles.menuFormLabel}>Description</label>
                                    <textarea className={styles.menuFormDesc} value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })}></textarea>
                                </div>
                                <div className={styles.menuFormRow2}>
                                    <div className={styles.menuFormGroup}>
                                        <label className={styles.menuFormLabel}>Price</label>
                                        <input required type="number" step="0.01" min="0" className={styles.menuFormInput} value={editForm.price} onChange={e => setEditForm({ ...editForm, price: e.target.value })} />
                                    </div>
                                    <div className={styles.menuFormGroup}>
                                        <label className={styles.menuFormLabel}>Estimated Prep Time (mins)</label>
                                        <input type="number" className={styles.menuFormInput} placeholder="0" />
                                    </div>
                                </div>
                                <div className={styles.menuAvailBox}>
                                    <div className={styles.menuAvailText}>
                                        <h4>Item Availability</h4>
                                        <p>Enable this to show the item in the customer menu</p>
                                    </div>
                                    <label className={styles.redToggleSwitch}>
                                        <input type="checkbox" checked={editForm.available} onChange={e => setEditForm({ ...editForm, available: e.target.checked })} />
                                        <span className={styles.redToggleSlider}></span>
                                    </label>
                                </div>
                            </div>
                            <div className={styles.menuModalFooter}>
                                <button type="button" className={styles.menuBtnCancel} onClick={() => setEditId(null)}>Cancel</button>
                                <button type="submit" className={styles.menuBtnSubmit}>Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Success/Error Dialog */}
            {dialog && (
                <div className={styles.menuModalOverlay} style={{ zIndex: 10000 }}>
                    <div className={styles.dialogModal}>
                        <div className={`${styles.dialogIconWrap} ${dialog.type === 'success' ? styles.dialogIconSuccess : styles.dialogIconError}`}>
                            {dialog.type === 'success' ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
                        </div>
                        <h3 className={styles.dialogTitle}>{dialog.title}</h3>
                        <p className={styles.dialogDesc}>{dialog.desc}</p>
                        {dialog.type === 'success' ? (
                            <button className={styles.dialogBtn} onClick={() => setDialog(null)}>Done</button>
                        ) : (
                            <>
                                <button className={styles.dialogBtn} onClick={() => setDialog(null)}>Try Again</button>
                                <button className={styles.dialogLinkBtn} onClick={() => setDialog(null)}>Cancel</button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
