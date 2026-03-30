import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, AlertCircle, CheckCircle2, LayoutDashboard, Layers, Plus, Pencil, Trash2, Package, X, ChevronDown, Check } from 'lucide-react';
import { IMAGES } from './shared';
import styles from '../OwnerDashboard.module.css';
import api from '../../../api/axios';
import { resolveMediaUrl } from '../../../utils/media';
import { prepareImageUpload, revokeObjectUrl } from '../../../utils/imageUpload';
import CategoryCreateModal from './CategoryCreateModal';

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

function getFirstApiError(error, fallback) {
    const validationErrors = error?.response?.data?.errors;

    if (validationErrors && typeof validationErrors === 'object') {
        for (const value of Object.values(validationErrors)) {
            if (Array.isArray(value) && value[0]) {
                return value[0];
            }
            if (typeof value === 'string' && value) {
                return value;
            }
        }
    }

    return error?.response?.data?.message || fallback;
}

function CategoryDropdown({
    categories = [],
    value = '',
    onChange,
    placeholder = 'Select Category',
}) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedCategory = categories.find((category) => String(category.id) === String(value));

    useEffect(() => {
        function handlePointerDown(event) {
            if (!dropdownRef.current?.contains(event.target)) {
                setOpen(false);
            }
        }

        document.addEventListener('mousedown', handlePointerDown);
        return () => document.removeEventListener('mousedown', handlePointerDown);
    }, []);

    function handleSelect(categoryId) {
        onChange?.(categoryId);
        setOpen(false);
    }

    return (
        <div className={styles.menuCategoryDropdownWrap} ref={dropdownRef}>
            <button
                type="button"
                className={`${styles.menuCategoryTrigger} ${selectedCategory ? styles.menuCategoryTriggerFilled : ''} ${open ? styles.menuCategoryTriggerOpen : ''}`}
                onClick={() => setOpen((prev) => !prev)}
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                <div className={styles.menuCategoryTriggerCopy}>
                    <span className={styles.menuCategoryTriggerLabel}>
                        {selectedCategory?.name || placeholder}
                    </span>
                    <span className={styles.menuCategoryTriggerMeta}>
                        {selectedCategory ? 'Selected category' : `${categories.length} categories available`}
                    </span>
                </div>
                <ChevronDown
                    size={18}
                    className={`${styles.menuCategoryTriggerChevron} ${open ? styles.menuCategoryTriggerChevronOpen : ''}`}
                />
            </button>

            {open && (
                <div className={styles.menuCategoryDropdown} role="listbox">
                    {categories.length > 0 ? (
                        categories.map((category) => {
                            const isActive = String(category.id) === String(value);

                            return (
                                <button
                                    key={category.id}
                                    type="button"
                                    className={`${styles.menuCategoryOption} ${isActive ? styles.menuCategoryOptionActive : ''}`}
                                    onClick={() => handleSelect(category.id)}
                                    role="option"
                                    aria-selected={isActive}
                                >
                                    <div className={styles.menuCategoryOptionCopy}>
                                        <span className={styles.menuCategoryOptionName}>{category.name}</span>
                                        <span className={styles.menuCategoryOptionMeta}>Tap to assign this item</span>
                                    </div>
                                    {isActive && (
                                        <span className={styles.menuCategoryOptionCheck}>
                                            <Check size={15} />
                                        </span>
                                    )}
                                </button>
                            );
                        })
                    ) : (
                        <div className={styles.menuCategoryEmptyState}>
                            No categories yet. Use the plus button to create one.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}


export default function MenuSection({
    items = [],
    setItems,
    categories = [],
    setCategories,
    refreshInventory,
}) {
    const [addOpen, setAddOpen] = useState(false);
    const [form, setForm] = useState(BLANK);
    const [editId, setEditId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All Items');
    const [dialog, setDialog] = useState(null);
    const [viewMode, setViewMode] = useState('grid');
    const [categoryModalTarget, setCategoryModalTarget] = useState(null);
    const [isCategorySaving, setIsCategorySaving] = useState(false);
    useEffect(() => {
        return () => {
            revokeObjectUrl(form.preview);
            revokeObjectUrl(editForm.preview);
        };
    }, [form.preview, editForm.preview]);

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

    function handleCategorySelect(target, categoryId) {
        const selectedCategory = categories.find((category) => String(category.id) === String(categoryId));

        if (target === 'add') {
            setForm((prev) => ({
                ...prev,
                category_id: categoryId,
                category_name: selectedCategory?.name || '',
            }));
            return;
        }

        setEditForm((prev) => ({
            ...prev,
            category_id: categoryId,
            category_name: selectedCategory?.name || '',
        }));
    }

    async function handleCreateCategory({ name }) {
        setIsCategorySaving(true);

        try {
            const response = await api.post('/owner/inventory/categories', { name });
            const createdCategory = response.data;

            setCategories((prev) => [...prev, createdCategory]);

            if (categoryModalTarget === 'add') {
                setForm((prev) => ({
                    ...prev,
                    category_id: createdCategory.id,
                    category_name: createdCategory.name,
                }));
            }

            if (categoryModalTarget === 'edit') {
                setEditForm((prev) => ({
                    ...prev,
                    category_id: createdCategory.id,
                    category_name: createdCategory.name,
                }));
            }

            await refreshInventory?.();
            setCategoryModalTarget(null);
        } catch (err) {
            console.error(err);
            setDialog({
                type: 'error',
                title: 'Failed to Create Category',
                desc: getFirstApiError(err, `We couldn't create ${name}. Please try again.`),
            });
        } finally {
            setIsCategorySaving(false);
        }
    }

    async function handleAdd(e) {
        e.preventDefault();
        if (!form.title || !form.price || !form.category_id) {
            setError('Title, category and price are required.');
            return;
        }

        try {
            const cat = categories.find((category) => String(category.id) === String(form.category_id));
            if (!cat) {
                setError('Please select a valid category.');
                return;
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

            await api.post('/owner/inventory/items', formData);
            await refreshInventory?.();
            revokeObjectUrl(form.preview);
            setForm(createBlankForm());
            setAddOpen(false);
            setError('');
            setDialog({ type: 'success', title: 'Item Added Successfully', desc: `${form.title} has been added to your menu and is now live.` });
        } catch (err) {
            console.error(err);
            const message = getFirstApiError(err, `We couldn't add ${form.title} to your menu. Please try again.`);
            setError(message);
            setDialog({ type: 'error', title: 'Failed to Add Item', desc: message });
        }
    }

    async function handleDelete(id) {
        if (!window.confirm('Delete this item?')) return;

        const itemToDelete = items.find(item => item.id === id);

        try {
            await api.delete(`/owner/inventory/items/${id}`);
            setItems(prev => prev.filter(item => item.id !== id));
            await refreshInventory?.();
            if (editId === id) {
                revokeObjectUrl(editForm.preview);
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
            setItems(prev => prev.map(i => i.id === item.id ? { ...i, ...res.data } : i));
            await refreshInventory?.();
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

        if (!editForm.title || !editForm.price || !editForm.category_id) {
            setDialog({
                type: 'error',
                title: 'Failed to Update Item',
                desc: 'Title, category and price are required.',
            });
            return;
        }

        try {
            const cat = categories.find((category) => String(category.id) === String(editForm.category_id));
            if (!cat) {
                setDialog({
                    type: 'error',
                    title: 'Failed to Update Item',
                    desc: 'Please select a valid category.',
                });
                return;
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

            await api.post(`/owner/inventory/items/${editId}`, formData);
            await refreshInventory?.();
            revokeObjectUrl(editForm.preview);
            setEditId(null);
            setEditForm({});
            setDialog({ type: 'success', title: 'Item Updated Successfully', desc: `${editForm.title} has been updated.` });
        } catch (err) {
            console.error(err);
            setDialog({
                type: 'error',
                title: 'Failed to Update Item',
                desc: getFirstApiError(err, `We couldn't update ${editForm.title}.`),
            });
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
                    const stock = item.stock_level !== undefined ? item.stock_level : 0;
                    const minThreshold = item.min_threshold !== undefined ? item.min_threshold : 10;

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
                                <img src={resolveMediaUrl(item.image)} alt={item.title} className={styles.newMenuCardImg} loading="lazy" decoding="async" />
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
                                    revokeObjectUrl(form.preview);
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
                                        {form.preview ? <img src={form.preview} alt="Upload" /> : form.image ? <img src={resolveMediaUrl(form.image)} alt="Default" /> : <><Package size={24} /><div className={styles.menuPhotoText}>Add Photo</div></>}
                                        <input 
                                            id="itemPhotoAdd" 
                                            type="file" 
                                            hidden 
                                            accept="image/*" 
                                            onChange={async (e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const optimized = await prepareImageUpload(file);
                                                    setForm((prev) => {
                                                        revokeObjectUrl(prev.preview);

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
                                            <div className={styles.menuCategoryRow}>
                                                <CategoryDropdown
                                                    categories={categories}
                                                    value={form.category_id}
                                                    onChange={(categoryId) => handleCategorySelect('add', categoryId)}
                                                />
                                                <button
                                                    type="button"
                                                    className={styles.menuCategoryAddBtn}
                                                    onClick={() => setCategoryModalTarget('add')}
                                                    title="Add Category"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>
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
                                        revokeObjectUrl(form.preview);
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
                                    revokeObjectUrl(editForm.preview);
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
                                        {editForm.preview ? <img src={editForm.preview} alt="Upload" /> : <img src={resolveMediaUrl(editForm.image)} alt="Default" />}
                                        <input 
                                            id="itemPhotoEdit" 
                                            type="file" 
                                            hidden 
                                            accept="image/*" 
                                            onChange={async (e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const optimized = await prepareImageUpload(file);
                                                    setEditForm((prev) => {
                                                        revokeObjectUrl(prev.preview);

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
                                            <div className={styles.menuCategoryRow}>
                                                <CategoryDropdown
                                                    categories={categories}
                                                    value={editForm.category_id || ''}
                                                    onChange={(categoryId) => handleCategorySelect('edit', categoryId)}
                                                />
                                                <button
                                                    type="button"
                                                    className={styles.menuCategoryAddBtn}
                                                    onClick={() => setCategoryModalTarget('edit')}
                                                    title="Add Category"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>
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
                                        revokeObjectUrl(editForm.preview);
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

            {categoryModalTarget && (
                <CategoryCreateModal
                    onClose={() => setCategoryModalTarget(null)}
                    onSave={handleCreateCategory}
                    isSaving={isCategorySaving}
                />
            )}
        </div>
    );
}
