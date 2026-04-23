import React, { useState, useEffect } from 'react';
import { X, Minus, Plus } from 'lucide-react';
import styles from './AddToCartModal.module.css';



export default function AddToCartModal({ isOpen, onClose, item, onConfirm }) {
    if (!isOpen || !item) return null;

    const [qty, setQty] = useState(1);
    const [options, setOptions] = useState({ variations: [], addOns: [] });

    const [selectedVarId, setSelectedVarId] = useState('');
    const [selectedAddOns, setSelectedAddOns] = useState({});

    // Reset state when a new item is opened
    useEffect(() => {
        if (item) {
            const variations = item.variations || [];
            const addOns = item.add_ons || item.addOns || [];
            
            setOptions({ variations, addOns });

            const defaultVar = variations.find(v => v.is_default) || variations[0];
            setSelectedVarId(defaultVar?.id || '');

            const initAddOns = {};
            addOns.forEach(a => initAddOns[a.id] = false);
            setSelectedAddOns(initAddOns);

            setQty(1);
        }
    }, [item]);

    // Calculate total price
    const basePrice = Number(item.price) || 0;
    const activeVar = options.variations.find(v => v.id === selectedVarId);
    const varPrice = activeVar ? Number(activeVar.price_opt) : 0;

    let addOnsPrice = 0;
    options.addOns.forEach(a => {
        if (selectedAddOns[a.id]) addOnsPrice += Number(a.price_opt);
    });

    const totalItemPrice = (basePrice + varPrice + addOnsPrice) * qty;

    const handleAddClick = () => {
        const selectedVarObj = options.variations.find(v => v.id === selectedVarId);
        const selectedAddOnObjs = options.addOns.filter(a => selectedAddOns[a.id]);

        onConfirm({
            ...item,
            quantity: qty,
            price: basePrice + varPrice + addOnsPrice, // override price to represent unit final price
            originalPrice: basePrice,
            variation: selectedVarObj,
            addOns: selectedAddOnObjs,
        });
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContainer} onClick={e => e.stopPropagation()}>

                {/* Hero Image Section */}
                <div className={styles.modalHero}>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={20} />
                    </button>
                    <div className={styles.heroImgWrap}>
                        <img src={item.image} alt={item.title} className={styles.heroImg} />
                    </div>
                </div>

                {/* Content Area */}
                <div className={styles.modalContent}>
                    <div className={styles.headerInfo}>
                        <h2 className={styles.itemTitle}>{item.title}</h2>
                        <div className={styles.itemDesc}>{item.description}</div>
                        <div className={styles.basePrice}>Starting at ${Number(item.price).toFixed(2)}</div>
                    </div>

                    {/* Variations */}
                    {options.variations.length > 0 && (
                        <div className={styles.sectionBlock}>
                            <div className={styles.sectionHeader}>
                                <h3>Variations</h3>
                                <span className={styles.reqBadge}>Required • Choose 1</span>
                            </div>
                            <div className={styles.optionList}>
                                {options.variations.map(v => (
                                    <label key={v.id} className={styles.radioLabel}>
                                        <div className={styles.radioLeft}>
                                            <input
                                                type="radio"
                                                name="variation"
                                                className={styles.radioInput}
                                                checked={selectedVarId === v.id}
                                                onChange={() => setSelectedVarId(v.id)}
                                            />
                                            <span>{v.name}</span>
                                        </div>
                                        {Number(v.price_opt) > 0 && <span className={styles.extraPrice}>+${Number(v.price_opt).toFixed(2)}</span>}
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Add-ons */}
                    {options.addOns.length > 0 && (
                        <div className={styles.sectionBlock}>
                            <div className={styles.sectionHeader}>
                                <h3>Frequently Added</h3>
                                <span className={styles.optBadge}>Optional</span>
                            </div>
                            <div className={styles.optionList}>
                                {options.addOns.map(a => (
                                    <label key={a.id} className={styles.checkLabel}>
                                        <div className={styles.checkLeft}>
                                            <input
                                                type="checkbox"
                                                className={styles.checkInput}
                                                checked={selectedAddOns[a.id]}
                                                onChange={(e) => setSelectedAddOns({ ...selectedAddOns, [a.id]: e.target.checked })}
                                            />
                                            <span>{a.name}</span>
                                        </div>
                                        {Number(a.price_opt) > 0 && <span className={styles.extraPrice}>+${Number(a.price_opt).toFixed(2)}</span>}
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                </div>

                {/* Sticky Footer */}
                <div className={styles.modalFooter}>
                    <div className={styles.qtyControl}>
                        <button
                            className={styles.qtyBtn}
                            onClick={() => setQty(Math.max(1, qty - 1))}
                            disabled={qty <= 1}
                        >
                            <Minus size={18} />
                        </button>
                        <span className={styles.qtyValue}>{qty}</span>
                        <button
                            className={styles.qtyBtn}
                            onClick={() => setQty(qty + 1)}
                        >
                            <Plus size={18} />
                        </button>
                    </div>

                    <button className={styles.addToCartBtn} onClick={handleAddClick}>
                        <span className={styles.btnText}>Add to Cart</span>
                        <span className={styles.btnTotal}>${Number(totalItemPrice).toFixed(2)}</span>
                    </button>
                </div>

            </div>
        </div>
    );
}
