import React, { useEffect, useContext, useState } from 'react';
import { X, Star, MapPin, Clock, Phone, ShoppingCart, Info, ChevronLeft } from 'lucide-react';
import { CartContext } from './CartContext';
import styles from './StoreModal.module.css';

function StarRow({ rating, size = 14 }) {
    return (
        <span className={styles.starRow}>
            {[1, 2, 3, 4, 5].map(n => (
                <Star key={n} size={size}
                    fill={n <= Math.round(rating) ? '#F59E0B' : 'none'}
                    color={n <= Math.round(rating) ? '#F59E0B' : '#D1D5DB'}
                />
            ))}
        </span>
    );
}

/* ── Item detail panel shown when a menu card is clicked ── */
function ItemDetail({ item, onBack, onAddToCart }) {
    return (
        <div className={styles.itemDetail}>
            <button className={styles.backBtn} onClick={onBack}>
                <ChevronLeft size={16} /> Back to Menu
            </button>
            <img src={item.image} alt={item.title} className={styles.itemDetailImg} />
            <div className={styles.itemDetailBody}>
                <h3 className={styles.itemDetailName}>{item.title}</h3>
                <p className={styles.itemDetailDesc}>{item.description}</p>
                <div className={styles.itemDetailMeta}>
                    <span className={styles.itemDetailTag}><Clock size={12} /> 15–25 min prep</span>
                    <span className={styles.itemDetailTag}>🌿 Fresh daily</span>
                </div>
                <div className={styles.itemDetailFooter}>
                    <span className={styles.itemDetailPrice}>${item.price.toFixed(2)}</span>
                    <button className={styles.itemAddBtn} onClick={() => onAddToCart(item)}>
                        <ShoppingCart size={15} /> Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}

function StoreModal({ store, onClose }) {
    const { addToCart } = useContext(CartContext);
    const [activeTab, setActiveTab] = useState('menu');
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') { selectedItem ? setSelectedItem(null) : onClose(); } };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose, selectedItem]);

    const avgRating = store.reviews.length
        ? (store.reviews.reduce((s, r) => s + r.rating, 0) / store.reviews.length).toFixed(1)
        : store.rating;

    const handleAddToCart = (item) => {
        addToCart({ ...item, storeName: store.name });
        setSelectedItem(null);
    };

    return (
        <div className={styles.backdrop} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>

                {/* ── Brand banner ── */}
                <div className={styles.banner} style={{ background: store.brandColor }}>
                    <div className={styles.bannerOverlay} />
                    <img src={store.logo} alt={store.name} className={styles.storeLogo} />
                    <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                        <X size={18} />
                    </button>
                </div>

                {/* ── Store identity ── */}
                <div className={styles.storeIdentity}>
                    <div style={{ flex: 1 }}>
                        <h2 className={styles.storeName}>{store.name}</h2>
                        <p className={styles.storeBranch}>{store.branchName}</p>
                        <p className={styles.storeCuisine}>{store.cuisine}</p>
                        <div className={styles.metaRow}>
                            <span className={styles.metaChip}><MapPin size={12} /> {store.location}</span>
                            <span className={styles.metaChip}><Clock size={12} /> {store.hours}</span>
                            <span className={styles.metaChip}><Phone size={12} /> {store.phone}</span>
                        </div>
                        <div className={styles.ratingRow}>
                            <StarRow rating={avgRating} size={14} />
                            <span className={styles.ratingNum}>{avgRating}</span>
                            <span className={styles.ratingCount}>({store.reviews.length} reviews)</span>
                            <span className={store.status === 'Operational' ? styles.statusOpen : styles.statusClosed}>
                                ● {store.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Tabs ── */}
                <div className={styles.tabs}>
                    {['menu', 'reviews', 'info'].map(tab => (
                        <button
                            key={tab}
                            className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
                            onClick={() => { setActiveTab(tab); setSelectedItem(null); }}
                        >
                            {tab === 'info' ? <><Info size={13} /> Info</> : tab.charAt(0).toUpperCase() + tab.slice(1)}
                            {tab === 'reviews' && ` (${store.reviews.length})`}
                        </button>
                    ))}
                </div>

                {/* ── Tab content ── */}
                <div className={styles.tabContent}>

                    {/* ── MENU TAB ── */}
                    {activeTab === 'menu' && (
                        selectedItem ? (
                            <ItemDetail
                                item={selectedItem}
                                onBack={() => setSelectedItem(null)}
                                onAddToCart={handleAddToCart}
                            />
                        ) : (
                            <div className={styles.menuGrid}>
                                {store.menuItems.map(item => (
                                    <div
                                        key={item.id}
                                        className={styles.menuCard}
                                        onClick={() => setSelectedItem(item)}
                                    >
                                        <img src={item.image} alt={item.title} className={styles.menuCardImg} />
                                        <div className={styles.menuCardBody}>
                                            <h4 className={styles.menuCardTitle}>{item.title}</h4>
                                            <p className={styles.menuCardDesc}>{item.description}</p>
                                            <div className={styles.menuCardFooter}>
                                                <span className={styles.menuCardPrice}>${item.price.toFixed(2)}</span>
                                                <button
                                                    className={styles.addBtn}
                                                    onClick={(e) => { e.stopPropagation(); handleAddToCart(item); }}
                                                    aria-label="Add to cart"
                                                >
                                                    <ShoppingCart size={13} /> Add
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    )}

                    {/* ── REVIEWS TAB ── */}
                    {activeTab === 'reviews' && (
                        <div>
                            <div className={styles.reviewSummary}>
                                <div className={styles.reviewBigNum}>{avgRating}</div>
                                <div>
                                    <StarRow rating={avgRating} size={20} />
                                    <p className={styles.reviewTotal}>Based on {store.reviews.length} reviews</p>
                                </div>
                            </div>
                            <div className={styles.reviewList}>
                                {store.reviews.map(r => (
                                    <div key={r.id} className={styles.reviewItem}>
                                        <div className={styles.reviewAvatar}>{r.avatar}</div>
                                        <div className={styles.reviewBody}>
                                            <div className={styles.reviewTop}>
                                                <span className={styles.reviewName}>{r.name}</span>
                                                <span className={styles.reviewDate}>{r.date}</span>
                                            </div>
                                            <StarRow rating={r.rating} size={12} />
                                            <p className={styles.reviewText}>{r.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── INFO TAB ── */}
                    {activeTab === 'info' && (
                        <div className={styles.infoGrid}>
                            <div className={styles.infoItem}>
                                <strong>Branch Name</strong>
                                <span>{store.branchName}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <strong>Location</strong>
                                <span>{store.location}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <strong>Status</strong>
                                <span className={store.status === 'Operational' ? styles.statusOpen : styles.statusClosed}>
                                    ● {store.status}
                                </span>
                            </div>
                            <div className={styles.infoItem}>
                                <strong>Operating Hours</strong>
                                <span>{store.hours}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <strong>Contact</strong>
                                <span>{store.phone}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <strong>Cuisine Type</strong>
                                <span>{store.cuisine}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <strong>Delivery Time</strong>
                                <span>{store.deliveryTime}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <strong>Min. Order</strong>
                                <span>{store.minOrder}</span>
                            </div>
                            <div className={`${styles.infoItem} ${styles.infoFull}`}>
                                <strong>About</strong>
                                <span>{store.about}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default StoreModal;
