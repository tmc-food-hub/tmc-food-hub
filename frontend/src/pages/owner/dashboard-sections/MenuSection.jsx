import React, { useState, useEffect } from 'react';
import { Search, Bell, AlertCircle, CheckCircle2, LayoutDashboard, Layers, Plus, Pencil, Trash2, Package, X } from 'lucide-react';
import { IMAGES } from './shared';
import styles from '../OwnerDashboard.module.css';
import api from '../../../api/axios';

const MAX_IMAGE_DIMENSION = 1600;
const IMAGE_QUALITY = 0.82;

const createBlankForm = () => ({
    title: '',
    description: '',
    price: '',
    category_name: '',
    category_id: '',
    available: true,
    image: IMAGES[0],
    image_file: null,
    preview: '',
});

const BLANK = createBlankForm();

function revokePreviewUrl(url) {
    if (url && typeof url === 'string' && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
    }
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = src;
    });
}

async function optimizeImageUpload(file) {
    if (!file) return null;

    const optimizableTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!optimizableTypes.includes(file.type)) {
        return {
            uploadFile: file,
            previewUrl: URL.createObjectURL(file),
        };
    }

    const sourceUrl = URL.createObjectURL(file);

    try {
        const image = await loadImage(sourceUrl);
        const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(image.width, image.height));
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));
        const canvas = document.createElement('canvas');

        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext('2d');
        if (!context) {
            throw new Error('Could not optimize image.');
        }

        context.drawImage(image, 0, 0, width, height);

        const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const blob = await new Promise((resolve, reject) => {
            canvas.toBlob(
                (result) => {
                    if (!result) {
                        reject(new Error('Could not create optimized image.'));
                        return;
                    }

                    resolve(result);
                },
                outputType,
                outputType === 'image/png' ? undefined : IMAGE_QUALITY
            );
        });

        const extension = outputType === 'image/png' ? 'png' : 'jpg';
        const baseName = (file.name || 'menu-item-image').replace(/\.[^.]+$/, '');
        const optimizedFile = new File([blob], `${baseName}.${extension}`, {
            type: outputType,
            lastModified: Date.now(),
        });

        return {
            uploadFile: optimizedFile,
            previewUrl: URL.createObjectURL(blob),
        };
    } finally {
        URL.revokeObjectURL(sourceUrl);
    }
}

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
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        return () => {
            revokePreviewUrl(form.preview);
            revokePreviewUrl(editForm.preview);
        };
    }, [form.preview, editForm.preview]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [itemsRes, catsRes] = await Promise.all([
                api.get('/owner/inventory/items'),
                api.get('/owner/inventory/categories')
            ]);
            setItems(itemsRes.data);
            setCategories(catsRes.data);
        } catch (err) {
            console.error('Failed to fetch menu data:', err);
        } finally {
            setLoading(false);
        }
    };

    // Derived Categories with Counts
    const catsData = [{ name: 'All Items', count: items.length }];
    categories.forEach(c => {
        catsData.push({ name: c.name, count: items.filter(i => i.category_id === c.id).length });
    });

    const filteredItems = items.filter(i => {
        const matchesSearch = (i.title || '').toLowerCase().includes(searchQuery.toLowerCase());
        const catName = i.category?.name || 'Uncategorized';
        const matchesCategory = activeCategory === 'All Items' || catName === activeCategory;
        return matchesSearch && matchesCategory;
    });

    async function handleAdd(e) {
        e.preventDefault();
        if (!form.title || !form.price || !form.category_name) {
            setError('Title, category and price are required.');
            return;
        }

        try {
            let cat = categories.find(c => c.name === form.category_name);
            if (!cat) {
                const newCatRes = await api.post('/owner/inventory/categories', { name: form.category_name });
                cat = newCatRes.data;
                setCategories(prev => [...prev, cat]);
            }

            const formData = new FormData();
            formData.append('title', form.title);
            formData.append('description', form.description || '');
            formData.append('price', parseFloat(form.price));
            formData.append('category_id', cat.id);
            formData.append('stock_level', 50);
            formData.append('min_threshold', 10);
            formData.append('unit', 'units');
            formData.append('auto_toggle', 1);
            formData.append('available', form.available ? 1 : 0);
            
            if (form.image_file) {
                formData.append('image_file', form.image_file);
            } else if (form.image) {
                formData.append('image', form.image);
            }

            const res = await api.post('/owner/inventory/items', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            await fetchData();
            revokePreviewUrl(form.preview);
            setForm(createBlankForm());
            setAddOpen(false);
            setError('');
            setDialog({ type: 'success', title: 'Item Added Successfully', desc: `${form.title} has been added to your menu and is now live.` });
        } catch (err) {
            console.error(err);
            setDialog({ type: 'error', title: 'Failed to Add Item', desc: `We couldn't add ${form.title} to your menu. Please try again.` });
        }
    }

    async function handleDelete(id) {
        if (!window.confirm('Delete this item?')) return;

        const itemToDelete = items.find(item => item.id === id);

        try {
            await api.delete(`/owner/inventory/items/${id}`);
            setItems(prev => prev.filter(item => item.id !== id));
            if (editId === id) {
                revokePreviewUrl(editForm.preview);
                setEditId(null);
                setEditForm({});
            }
            setDialog({
                type: 'success',
                title: 'Item Deleted',
                desc: `${itemToDelete?.title || 'The menu item'} has been removed from your menu.`,
            });
        } catch (err) {
            console.error(err);
            setDialog({
                type: 'error',
                title: 'Failed to Delete Item',
                desc: `We couldn't delete ${itemToDelete?.title || 'this item'}. Please try again.`,
            });
        }
    }

    async function toggle(item) {
        try {
            const res = await api.patch(`/owner/inventory/items/${item.id}/availability`, { available: !item.available });
            setItems(prev => prev.map(i => i.id === item.id ? res.data : i));
        } catch (err) {
            console.error(err);
        }
    }

    function startEdit(item) {
        setEditId(item.id);
        setEditForm({ 
            title: item.title, 
            description: item.description, 
            price: item.price, 
            category_name: item.category?.name || 'Uncategorized', 
            category_id: item.category_id,
            image: item.image || IMAGES[0], 
            available: item.available !== false 
        });
    }

    async function saveEdit(e) {
        e.preventDefault();
        try {
            let cat = categories.find(c => c.name === editForm.category_name);
            if (!cat) {
                const newCatRes = await api.post('/owner/inventory/categories', { name: editForm.category_name });
                cat = newCatRes.data;
                setCategories(prev => [...prev, cat]);
            }

            const formData = new FormData();
            formData.append('_method', 'PUT'); // For Laravel multipart PUT
            formData.append('title', editForm.title);
            formData.append('description', editForm.description || '');
            formData.append('price', parseFloat(editForm.price));
            formData.append('category_id', cat.id);
            formData.append('available', editForm.available ? 1 : 0);
            
            if (editForm.image_file) {
                formData.append('image_file', editForm.image_file);
            } else if (editForm.image) {
                formData.append('image', editForm.image);
            }

            const res = await api.post(`/owner/inventory/items/${editId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            await fetchData();
            revokePreviewUrl(editForm.preview);
            setEditId(null);
            setEditForm({});
            setDialog({ type: 'success', title: 'Item Updated Successfully', desc: `${editForm.title} has been updated.` });
        } catch (err) {
            console.error(err);
            setDialog({ type: 'error', title: 'Failed to Update Item', desc: `We couldn't update ${editForm.title}.` });
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
                                    <span className={styles.newMenuCardPrice}>${Number(item.price).toFixed(2)}</span>
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
                            <button
                                type="button"
                                className={styles.iconBtn}
                                onClick={() => {
                                    revokePreviewUrl(form.preview);
                                    setAddOpen(false);
                                    setForm(createBlankForm());
                                    setError('');
                                }}
                                style={{ background: 'transparent' }}
                            >
                                <X size={20} color="#6B7280" />
                            </button>
                        </div>
                        <form onSubmit={handleAdd}>
                            <div className={styles.menuModalBody}>
                                {error && <div className={styles.formError} style={{ marginBottom: 15 }}><AlertCircle size={13} /> {error}</div>}
                                <div className={styles.menuFormTop}>
                                    <div className={styles.menuPhotoUpload} onClick={() => document.getElementById('itemPhotoAdd').click()}>
                                        {form.preview ? <img src={form.preview} alt="Upload" /> : form.image ? <img src={form.image} alt="Default" /> : <><Package size={24} /><div className={styles.menuPhotoText}>Add Photo</div></>}
                                        <input 
                                            id="itemPhotoAdd" 
                                            type="file" 
                                            hidden 
                                            accept="image/*" 
                                            onChange={async (e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const optimized = await optimizeImageUpload(file);
                                                    setForm((prev) => {
                                                        revokePreviewUrl(prev.preview);

                                                        return {
                                                            ...prev,
                                                            image: '',
                                                            image_file: optimized.uploadFile,
                                                            preview: optimized.previewUrl,
                                                        };
                                                    });
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className={styles.menuFormFieldsRight}>
                                        <div className={styles.menuFormGroup}>
                                            <label className={styles.menuFormLabel}>Item Name</label>
                                            <input required className={styles.menuFormInput} placeholder="Item Name" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                                        </div>
                                        <div className={styles.menuFormGroup}>
                                            <label className={styles.menuFormLabel}>Category</label>
                                            <input required list="catsAdd" className={styles.menuFormInput} placeholder="Select Category" value={form.category_name} onChange={e => setForm({ ...form, category_name: e.target.value })} />
                                            <datalist id="catsAdd">{categories.map(c => <option key={c.id} value={c.name} />)}</datalist>
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
                                <button
                                    type="button"
                                    className={styles.menuBtnCancel}
                                    onClick={() => {
                                        revokePreviewUrl(form.preview);
                                        setAddOpen(false);
                                        setForm(createBlankForm());
                                        setError('');
                                    }}
                                >
                                    Cancel
                                </button>
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
                            <button
                                type="button"
                                className={styles.iconBtn}
                                onClick={() => {
                                    revokePreviewUrl(editForm.preview);
                                    setEditId(null);
                                    setEditForm({});
                                }}
                                style={{ background: 'transparent' }}
                            >
                                <X size={20} color="#6B7280" />
                            </button>
                        </div>
                        <form onSubmit={saveEdit}>
                            <div className={styles.menuModalBody}>
                                <div className={styles.menuFormTop}>
                                    <div className={styles.menuPhotoUpload} onClick={() => document.getElementById('itemPhotoEdit').click()}>
                                        {editForm.preview ? <img src={editForm.preview} alt="Upload" /> : <img src={editForm.image} alt="Default" />}
                                        <input 
                                            id="itemPhotoEdit" 
                                            type="file" 
                                            hidden 
                                            accept="image/*" 
                                            onChange={async (e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const optimized = await optimizeImageUpload(file);
                                                    setEditForm((prev) => {
                                                        revokePreviewUrl(prev.preview);

                                                        return {
                                                            ...prev,
                                                            image_file: optimized.uploadFile,
                                                            preview: optimized.previewUrl,
                                                        };
                                                    });
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className={styles.menuFormFieldsRight}>
                                        <div className={styles.menuFormGroup}>
                                            <label className={styles.menuFormLabel}>Item Name</label>
                                            <input required className={styles.menuFormInput} value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} />
                                        </div>
                                        <div className={styles.menuFormGroup}>
                                            <label className={styles.menuFormLabel}>Category</label>
                                            <input required list="catsEdit" className={styles.menuFormInput} value={editForm.category_name} onChange={e => setEditForm({ ...editForm, category_name: e.target.value })} />
                                            <datalist id="catsEdit">{categories.map(c => <option key={c.id} value={c.name} />)}</datalist>
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
                                <button
                                    type="button"
                                    className={styles.menuBtnCancel}
                                    onClick={() => {
                                        revokePreviewUrl(editForm.preview);
                                        setEditId(null);
                                        setEditForm({});
                                    }}
                                >
                                    Cancel
                                </button>
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
