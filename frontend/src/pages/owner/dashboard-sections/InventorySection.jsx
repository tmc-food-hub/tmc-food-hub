import React, { useState, useEffect } from 'react';
import { 
    Package, 
    TrendingDown, 
    Layers, 
    LogOut, 
    Plus, 
    CheckCircle2, 
    Pencil, 
    X, 
    AlertCircle,
    FileText
} from 'lucide-react';
import styles from '../OwnerDashboard.module.css';
import api from '../../../api/axios';

export default function InventorySection({ onUpdate }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search] = useState('');
    const [editItem, setEditItem] = useState(null);
    const [refillItem, setRefillItem] = useState(null);

    // Modal Edit Form State
    const [editForm, setEditForm] = useState({ stockLevel: 0, minThreshold: 10, unit: 'Units', autoToggle: true });

    // Modal Refill Form State
    const [addQty, setAddQty] = useState(0);

    // Success/Error Dialog State
    const [dialog, setDialog] = useState(null); // { type: 'success' | 'error', title: string, desc: string }

    // Fetch items on mount
    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const res = await api.get('/owner/inventory/items');
            setItems(res.data);
        } catch (error) {
            console.error('Failed to fetch inventory:', error);
        } finally {
            setLoading(false);
        }
    };

    // Top Metric stats
    const totalItems = items.length;
    const lowStockItems = items.filter(i => i.stock_level > 0 && i.stock_level <= (i.min_threshold || 10)).length;
    const outOfStockItems = items.filter(i => i.stock_level === 0).length;
    const availableItems = items.filter(i => i.stock_level > (i.min_threshold || 10)).length;
    const coverage = totalItems > 0 ? Math.round(((totalItems - outOfStockItems) / totalItems) * 100) : 0;

    const filteredItems = items.filter(i => i.title.toLowerCase().includes(search.toLowerCase()));

    // Handlers
    const openEdit = (item) => {
        setEditItem(item);
        setEditForm({
            stockLevel: item.stock_level !== undefined ? item.stock_level : 0,
            minThreshold: item.min_threshold !== undefined ? item.min_threshold : 10,
            unit: item.unit || 'units',
            autoToggle: item.auto_toggle !== undefined ? !!item.auto_toggle : true
        });
    };

    const saveEdit = async () => {
        try {
            const payload = {
                title: editItem.title,
                price: editItem.price,
                stock_level: parseInt(editForm.stockLevel, 10) || 0,
                min_threshold: parseInt(editForm.minThreshold, 10) || 10,
                unit: editForm.unit,
                auto_toggle: editForm.autoToggle
            };

            const res = await api.put(`/owner/inventory/items/${editItem.id}`, payload);
            
            setItems(items.map(i => i.id === editItem.id ? res.data : i));
            setEditItem(null);
            setDialog({ type: 'success', title: 'Inventory Updated', desc: `Stock levels for ${editItem.title} have been successfully saved.` });
        } catch (error) {
            console.error('Update failed:', error);
            setDialog({ type: 'error', title: 'Update Failed', desc: `We couldn't save the changes to ${editItem.title}. Please try again.` });
        }
    };

    const openRefill = (item) => {
        setRefillItem(item);
        setAddQty(0);
    };

    const saveRefill = async () => {
        try {
            const newStock = (refillItem.stock_level || 0) + addQty;
            const res = await api.patch(`/owner/inventory/items/${refillItem.id}/stock`, { stock_level: newStock });
            
            setItems(items.map(i => i.id === refillItem.id ? res.data : i));
            setRefillItem(null);
            setDialog({ type: 'success', title: 'Inventory Updated', desc: `Stock levels for ${refillItem.title} have been successfully saved.` });
        } catch (error) {
            console.error('Refill failed:', error);
            setDialog({ type: 'error', title: 'Update Failed', desc: `We couldn't save the changes to ${refillItem.title}. Please try again.` });
        }
    };

    const handleToggleAvailable = async (id, currentVal) => {
        try {
            const res = await api.patch(`/owner/inventory/items/${id}/availability`, { available: !currentVal });
            setItems(items.map(i => i.id === id ? res.data : i));
        } catch (error) {
            console.error('Toggle failed:', error);
        }
    };

    if (loading) return <div className={styles.loadingContainer}>Loading Inventory...</div>;

    return (
        <div className={styles.inventoryContainer}>
            {/* Top Metrics Cards */}
            <div className={styles.inventoryMetricsGrid}>
                {/* Total Items */}
                <div className={styles.inventoryMetricCard}>
                    <div className={styles.inventoryMetricHeader}>
                        <div className={styles.inventoryIconBoxGray}>
                            <FileText size={18} color="#4B5563" />
                        </div>
                        <span className={styles.inventoryMetricLabel}>Total Items</span>
                    </div>
                    <div className={styles.inventoryMetricValue}>{totalItems}</div>
                    <div className={styles.inventoryMetricSub}>+4 This week</div>
                </div>

                {/* Low Stock Alert */}
                <div className={styles.inventoryMetricCard}>
                    <div className={styles.inventoryMetricHeader}>
                        <div className={`${styles.inventoryIconBoxRed} ${styles.bgLightRed}`}>
                            <AlertCircle size={18} color="#DC2626" />
                        </div>
                        <span className={styles.inventoryMetricLabel}>Low Stock Alert</span>
                    </div>
                    <div className={styles.inventoryMetricValue}>{lowStockItems}</div>
                    <div className={styles.inventoryMetricSub}>Needs replenishment</div>
                </div>

                {/* Out of Stock */}
                <div className={styles.inventoryMetricCard}>
                    <div className={styles.inventoryMetricHeader}>
                        <div className={styles.inventoryIconBoxGray}>
                            <LogOut size={18} color="#4B5563" style={{ transform: 'rotate(180deg)' }} />
                        </div>
                        <span className={styles.inventoryMetricLabel}>Out of Stock</span>
                    </div>
                    <div className={styles.inventoryMetricValue}>{outOfStockItems}</div>
                    <div className={styles.inventoryMetricSub}>Hidden from menu</div>
                </div>

                {/* Available Now */}
                <div className={styles.inventoryMetricCard}>
                    <div className={styles.inventoryMetricHeader}>
                        <div className={`${styles.inventoryIconBoxGreen} ${styles.bgLightGreen}`}>
                            <CheckCircle2 size={18} color="#059669" />
                        </div>
                        <span className={styles.inventoryMetricLabel}>Available Now</span>
                    </div>
                    <div className={styles.inventoryMetricValue}>{availableItems}</div>
                    <div className={styles.inventoryMetricSub}>{coverage}% Coverage</div>
                </div>
            </div>

            {/* Controls Row */}
            <div className={styles.inventoryControlsRow}>
                <div className={styles.inventoryFilters}>
                    <button className={styles.inventoryFilterBtn}>
                        All Categories <TrendingDown size={14} style={{ marginLeft: 4 }} />
                    </button>
                    <button className={styles.inventoryFilterBtn}>
                        Status: All <TrendingDown size={14} style={{ marginLeft: 4 }} />
                    </button>
                    <button className={styles.inventoryFilterBtn}>
                        <Layers size={14} /> Sort by
                    </button>
                </div>
                <div className={styles.inventoryActionsRight}>
                    <button className={styles.inventoryExportBtn}>
                        <span style={{ transform: 'rotate(90deg)' }}><LogOut size={14} /></span> Export
                    </button>
                </div>
            </div>

            {/* Main Content Area (Table or Empty State) */}
            <div className={styles.infoCardDesktop} style={{ padding: 0, overflow: 'hidden' }}>
                {items.length === 0 ? (
                    <div className={styles.emptyStateContainer}>
                        <div className={styles.emptyStateIconWrapper}>
                            <Package size={32} color="#991B1B" />
                        </div>
                        <h3 className={styles.emptyStateTitle}>No inventory items yet</h3>
                        <p className={styles.emptyStateSub}>Add items from your menu to track their stock levels and availability in real-time.</p>
                        <button className={styles.btnPrimary} onClick={() => {
                            // This would ideally switch the tab to Menu, depending on how external navigation is handled. For now just standard button.
                            alert('Switch to Menu tab to add items.');
                        }}>
                            <Plus size={16} style={{ marginRight: 6 }} /> Add Your First Item
                        </button>
                    </div>
                ) : (
                    <div className={styles.inventoryTableContainer}>
                        <table className={styles.inventoryMainTable}>
                            <thead>
                                <tr>
                                    <th>Item Name</th>
                                    <th>Category</th>
                                    <th>Stock Level</th>
                                    <th>Status</th>
                                    <th>Quick Toggle</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map(item => {
                                    const stock = item.stock_level !== undefined ? item.stock_level : 0;
                                    const minThreshold = item.min_threshold !== undefined ? item.min_threshold : 10;
                                    const unit = item.unit || 'units';

                                    let statusType = 'Normal';
                                    let statusPillClass = styles.statusAvailable;
                                    let statusText = 'Available';

                                    if (stock === 0) {
                                        statusType = 'Out';
                                        statusPillClass = styles.statusOutOfStock;
                                        statusText = 'Out of Stock';
                                    } else if (stock <= minThreshold) {
                                        statusType = 'Low';
                                        statusPillClass = styles.statusLowStock;
                                        statusText = 'Low Stock';
                                    }

                                    return (
                                        <tr key={item.id} className={styles.inventoryTableRow}>
                                            <td>
                                                <div className={styles.inventoryItemCell}>
                                                    <div className={styles.inventoryItemImgBadge}>
                                                        <img src={item.image} alt={item.title} />
                                                    </div>
                                                    <span className={styles.itemName}>{item.title}</span>
                                                </div>
                                            </td>
                                            <td><span className={styles.itemCategory}>{item.category?.name || 'Uncategorized'}</span></td>
                                            <td>
                                                <span className={
                                                    statusType === 'Out' ? styles.stockLevelOut :
                                                        statusType === 'Low' ? styles.stockLevelLow : styles.stockLevelNormal
                                                }>
                                                    {stock} {unit}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`${styles.statusPillInv} ${statusPillClass}`}>
                                                    {statusText}
                                                </span>
                                            </td>
                                            <td>
                                                {statusType === 'Out' ? (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                        <label className={styles.toggleSwitch}>
                                                            <input type="checkbox" checked={!!item.available} disabled />
                                                            <span className={styles.toggleSlider}></span>
                                                        </label>
                                                        <button className={styles.btnRefillNow} onClick={() => openRefill(item)}>Refill Now</button>
                                                    </div>
                                                ) : (
                                                    <label className={styles.toggleSwitch}>
                                                        <input
                                                            type="checkbox"
                                                            checked={!!item.available}
                                                            onChange={() => handleToggleAvailable(item.id, item.available)}
                                                        />
                                                        <span className={styles.toggleSlider}></span>
                                                    </label>
                                                )}
                                            </td>
                                            <td>
                                                <button className={styles.rowBtn} style={{ border: '1px solid #E5E7EB', background: '#fff' }} onClick={() => openEdit(item)}>
                                                    <Pencil size={14} color="#6B7280" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {editItem && (
                <div className={styles.invModalOverlay}>
                    <div className={styles.invModal}>
                        <div className={styles.invModalHead}>
                            <div>
                                <h3 className={styles.invModalTitle}>Edit Inventory</h3>
                                <p className={styles.invModalSub}>{editItem.title}</p>
                            </div>
                            <button className={styles.iconBtn} onClick={() => setEditItem(null)} style={{ background: 'transparent' }}><X size={20} color="#6B7280" /></button>
                        </div>
                        <div className={styles.invModalBody}>
                            <div className={styles.formGroup}>
                                <label className={styles.invLabel}>Current Stock Level</label>
                                <div className={styles.invInputRightIcon}>
                                    <input type="number" className={styles.invInput} value={editForm.stockLevel} onChange={e => setEditForm({ ...editForm, stockLevel: e.target.value })} min={0} />
                                    <span className={styles.invInputRightText}>{editForm.unit}</span>
                                </div>
                            </div>
                            <div className={styles.formGroupRow}>
                                <div className={styles.formGroup}>
                                    <label className={styles.invLabel}>Min. Threshold</label>
                                    <input type="number" className={styles.invInput} value={editForm.minThreshold} onChange={e => setEditForm({ ...editForm, minThreshold: e.target.value })} min={0} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.invLabel}>Unit of Measure</label>
                                    <select className={styles.invSelect} value={editForm.unit} onChange={e => setEditForm({ ...editForm, unit: e.target.value })}>
                                        <option value="units">Units</option>
                                        <option value="kg">kg</option>
                                        <option value="g">g</option>
                                        <option value="Liters">Liters</option>
                                        <option value="ml">ml</option>
                                    </select>
                                </div>
                            </div>
                            <div className={styles.invToggleRow}>
                                <div className={styles.invToggleText}>
                                    <div className={styles.invToggleTitle}>Auto-toggle 'Out of Stock'</div>
                                    <div className={styles.invToggleDesc}>Automatically hide from digital menu when stock reaches zero.</div>
                                </div>
                                <label className={styles.toggleSwitch}>
                                    <input type="checkbox" checked={editForm.autoToggle} onChange={e => setEditForm({ ...editForm, autoToggle: e.target.checked })} />
                                    <span className={styles.toggleSlider}></span>
                                </label>
                            </div>
                        </div>
                        <div className={styles.invModalFooter}>
                            <button className={styles.invBtnCancel} onClick={() => setEditItem(null)}>Cancel</button>
                            <button className={styles.invBtnSubmit} onClick={saveEdit}>Save Changes</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Refill Modal */}
            {refillItem && (
                <div className={styles.invModalOverlay}>
                    <div className={styles.invModal}>
                        <div className={styles.invModalHead}>
                            <div>
                                <h3 className={styles.invModalTitle}>Refill Stock</h3>
                                <p className={styles.invModalSub}>{refillItem.title}</p>
                            </div>
                            <button className={styles.iconBtn} onClick={() => setRefillItem(null)} style={{ background: 'transparent' }}><X size={20} color="#6B7280" /></button>
                        </div>
                        <div className={styles.invModalBody}>
                            <div className={styles.formGroup}>
                                <label className={styles.invLabel}>Current Stock</label>
                                <div className={styles.invInputRightIcon}>
                                    <input type="number" className={styles.invInput} value={refillItem.stock_level !== undefined ? refillItem.stock_level : 0} disabled />
                                    <span className={styles.invInputRightText}>{refillItem.unit || 'units'}</span>
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.invLabel}>Add Quantity</label>
                                <div className={styles.refillCounter}>
                                    <button className={styles.refillBtn} onClick={() => setAddQty(Math.max(0, addQty - 1))}><TrendingDown style={{ transform: 'none' }} size={16} /></button>
                                    <input type="number" className={styles.refillInput} value={addQty} onChange={e => setAddQty(Math.max(0, parseInt(e.target.value) || 0))} min={0} />
                                    <button className={styles.refillBtn} onClick={() => setAddQty(addQty + 1)}><Plus size={16} /></button>
                                </div>
                                <div className={styles.quickAddRow}>
                                    <button className={`${styles.quickAddBtn} ${addQty === 5 ? styles.quickAddBtnActive : ''}`} onClick={() => setAddQty(5)}>+5</button>
                                    <button className={`${styles.quickAddBtn} ${addQty === 10 ? styles.quickAddBtnActive : ''}`} onClick={() => setAddQty(10)}>+10</button>
                                    <button className={`${styles.quickAddBtn} ${addQty === 20 ? styles.quickAddBtnActive : ''}`} onClick={() => setAddQty(20)}>+20</button>
                                </div>
                            </div>
                            <div className={styles.totalRefillRow}>
                                <span className={styles.totalAfterLabel}>Total After Refill</span>
                                <span className={styles.totalAfterValue}>New Stock: {(refillItem.stock_level !== undefined ? refillItem.stock_level : 0) + addQty} {refillItem.unit || 'units'}</span>
                            </div>
                        </div>
                        <div className={styles.invModalFooter}>
                            <button className={styles.invBtnCancel} onClick={() => setRefillItem(null)}>Cancel</button>
                            <button className={styles.invBtnSubmit} onClick={saveRefill}>Update Stock</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success/Error Dialog */}
            {dialog && (
                <div className={styles.invModalOverlay} style={{ zIndex: 10000 }}>
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
