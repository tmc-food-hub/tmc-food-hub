import React, { useEffect, useContext, useState } from 'react';
import { X, Star, MapPin, Clock, Phone, ShoppingCart, Info, ChevronLeft, MessageSquare, Tag } from 'lucide-react';
import { CartContext } from './CartContext';
import styles from './StoreModal.module.css';
import { getStores, saveStores } from '../../data/storesData';

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

/* ── Item detail panel ── */
function ItemDetail({ item, onBack, onAddToCart }) {
    return (
        <div className={styles.itemDetail}>
            {/* Back button */}
            <button className={styles.backBtn} onClick={onBack}>
                <ChevronLeft size={16} /> Back to Menu
            </button>

            {/* Two-column layout */}
            <div className={styles.itemDetailLayout}>
                {/* Left: image */}
                <div className={styles.itemDetailImgWrap}>
                    <img src={item.image} alt={item.title} className={styles.itemDetailImg} />
                </div>

                {/* Right: info */}
                <div className={styles.itemDetailInfo}>
                    <div className={styles.itemDetailCatTag}>{item.category}</div>
                    <h3 className={styles.itemDetailName}>{item.title}</h3>
                    <p className={styles.itemDetailDesc}>{item.description}</p>

                    <div className={styles.itemDetailMeta}>
                        <span className={styles.itemDetailTag}><Clock size={12} /> 15–25 min prep</span>
                        <span className={styles.itemDetailTag}>🌿 Fresh daily</span>
                        <span className={styles.itemDetailTag}>⭐ Customer favourite</span>
                    </div>

                    <div className={styles.itemNutrition}>
                        <div className={styles.nutritionItem}><span>Cal</span><strong>480 kcal</strong></div>
                        <div className={styles.nutritionItem}><span>Protein</span><strong>24g</strong></div>
                        <div className={styles.nutritionItem}><span>Carbs</span><strong>35g</strong></div>
                        <div className={styles.nutritionItem}><span>Fat</span><strong>18g</strong></div>
                    </div>

                    <div className={styles.itemDetailFooter}>
                        <span className={styles.itemDetailPrice}>${Number(item.price).toFixed(2)}</span>
                        <button className={styles.itemAddBtn} onClick={() => onAddToCart(item)}>
                            <ShoppingCart size={15} /> Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StoreModal({ store, onClose }) {
    const { addToCart } = useContext(CartContext);
    const [activeTab, setActiveTab] = useState('menu');
    const [selectedItem, setSelectedItem] = useState(null);

    // Build unique category list from menu items
    const allCategories = ['All', ...new Set(store.menuItems.map(i => i.category))];
    const [activeMenuCat, setActiveMenuCat] = useState('All');

    // Review form state
    const [isWritingReview, setIsWritingReview] = useState(false);
    const [reviewForm, setReviewForm] = useState({ rating: 0, text: '', tags: [] });
    const REVIEW_TAGS = ['Great Food', 'Fast Delivery', 'Friendly Service', 'Good Value', 'Hot & Fresh', 'Nice Packaging'];
    const [localReviews, setLocalReviews] = useState(store.reviews);

    const handleTagToggle = (tag) => {
        setReviewForm(prev => ({
            ...prev,
            tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag]
        }));
    };

    const submitReview = (e) => {
        e.preventDefault();
        if (reviewForm.rating === 0) return alert('Please select a rating');
        if (!reviewForm.text.trim()) return alert('Please write a comment');

        const newReview = {
            id: Date.now(),
            name: 'Current User', // Mock user
            avatar: 'U',
            rating: reviewForm.rating,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            text: reviewForm.text,
            tags: reviewForm.tags
        };

        const updatedReviews = [newReview, ...localReviews];
        setLocalReviews(updatedReviews);

        // Save to global stores
        const allStores = getStores();
        const storeIndex = allStores.findIndex(s => s.id === store.id);
        if (storeIndex !== -1) {
            allStores[storeIndex].reviews = updatedReviews;
            // recalculate rating
            allStores[storeIndex].rating = Number((updatedReviews.reduce((s, r) => s + r.rating, 0) / updatedReviews.length).toFixed(1));
            saveStores(allStores);
        }

        setIsWritingReview(false);
        setReviewForm({ rating: 0, text: '', tags: [] });
    };

    const visibleItems = activeMenuCat === 'All'
        ? store.menuItems
        : store.menuItems.filter(i => i.category === activeMenuCat);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    useEffect(() => {
        const handler = (e) => {
            if (e.key === 'Escape') { selectedItem ? setSelectedItem(null) : onClose(); }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose, selectedItem]);

    const avgRating = localReviews.length
        ? (localReviews.reduce((s, r) => s + r.rating, 0) / localReviews.length).toFixed(1)
        : store.rating;

    const handleAddToCart = (item) => {
        addToCart({ ...item, storeName: store.name, restaurantId: store.id });
        setSelectedItem(null);
    };


    return (
        <div className={styles.backdrop} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>

                {/* ── Banner ── */}
                <div className={styles.banner} style={{ background: store.brandColor }}>
                    <div className={styles.bannerOverlay} />
                    <img src={store.logo} alt={store.name} className={styles.storeLogo} />
                    <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                        <X size={18} />
                    </button>
                </div>

                {/* ── Store identity ── */}
                <div className={styles.storeIdentity}>
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
                        <span className={styles.ratingCount}>({localReviews.length} reviews)</span>
                        <span className={store.status === 'Operational' ? styles.statusOpen : styles.statusClosed}>
                            ● {store.status}
                        </span>
                    </div>
                </div>

                {/* ── Main tabs ── */}
                <div className={styles.tabs}>
                    {['menu', 'reviews', 'info'].map(tab => (
                        <button
                            key={tab}
                            className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
                            onClick={() => { setActiveTab(tab); setSelectedItem(null); }}
                        >
                            {tab === 'info' ? <><Info size={13} /> Info</> : tab.charAt(0).toUpperCase() + tab.slice(1)}
                            {tab === 'reviews' && ` (${localReviews.length})`}
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
                            <>
                                {/* Menu category chips */}
                                <div className={styles.menuCatRow}>
                                    {allCategories.map(cat => (
                                        <button
                                            key={cat}
                                            className={`${styles.menuCatChip} ${activeMenuCat === cat ? styles.menuCatChipActive : ''}`}
                                            onClick={() => setActiveMenuCat(cat)}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>

                                {/* Section header */}
                                {activeMenuCat !== 'All' && (
                                    <h3 className={styles.menuCatTitle}>{activeMenuCat}</h3>
                                )}

                                {/* Items grid - group by category when viewing All */}
                                {activeMenuCat === 'All' ? (
                                    allCategories.slice(1).map(cat => {
                                        const catItems = store.menuItems.filter(i => i.category === cat);
                                        return (
                                            <div key={cat} className={styles.menuSection}>
                                                <h3 className={styles.menuCatTitle}>{cat}</h3>
                                                <div className={styles.menuGrid}>
                                                    {catItems.map(item => (
                                                        <MenuCard key={item.id} item={item} onSelect={setSelectedItem} onAdd={handleAddToCart} styles={styles} />
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className={styles.menuGrid}>
                                        {visibleItems.map(item => (
                                            <MenuCard key={item.id} item={item} onSelect={setSelectedItem} onAdd={handleAddToCart} styles={styles} />
                                        ))}
                                    </div>
                                )}
                            </>
                        )
                    )}

                    {/* ── REVIEWS TAB ── */}
                    {activeTab === 'reviews' && (
                        <div>
                            {!isWritingReview && (
                                <div className={styles.reviewHeaderActions}>
                                    <div className={styles.reviewSummary}>
                                        <div className={styles.reviewBigNum}>{avgRating}</div>
                                        <div>
                                            <StarRow rating={avgRating} size={20} />
                                            <p className={styles.reviewTotal}>Based on {localReviews.length} reviews</p>
                                        </div>
                                    </div>
                                    <button className={styles.leaveReviewBtn} onClick={() => setIsWritingReview(true)}>
                                        <MessageSquare size={16} /> Write a Review
                                    </button>
                                </div>
                            )}

                            {isWritingReview && (
                                <div className={styles.reviewFormCard}>
                                    <h3 className={styles.reviewFormTitle}>Rate your experience</h3>
                                    <div className={styles.starSelectRow}>
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button
                                                key={star}
                                                type="button"
                                                className={styles.starSelectBtn}
                                                onClick={() => setReviewForm(p => ({ ...p, rating: star }))}
                                                onMouseEnter={(e) => {
                                                    const btns = e.currentTarget.parentNode.children;
                                                    for (let i = 0; i < btns.length; i++) {
                                                        btns[i].querySelector('svg').style.fill = i < star ? '#F59E0B' : 'none';
                                                        btns[i].querySelector('svg').style.color = i < star ? '#F59E0B' : '#D1D5DB';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    const btns = e.currentTarget.parentNode.children;
                                                    for (let i = 0; i < btns.length; i++) {
                                                        btns[i].querySelector('svg').style.fill = i < reviewForm.rating ? '#F59E0B' : 'none';
                                                        btns[i].querySelector('svg').style.color = i < reviewForm.rating ? '#F59E0B' : '#D1D5DB';
                                                    }
                                                }}
                                            >
                                                <Star size={28} fill={star <= reviewForm.rating ? '#F59E0B' : 'none'} color={star <= reviewForm.rating ? '#F59E0B' : '#D1D5DB'} />
                                            </button>
                                        ))}
                                    </div>

                                    <h4 className={styles.reviewFormSubtitle}>What did you like? (Optional)</h4>
                                    <div className={styles.reviewTagsRow}>
                                        {REVIEW_TAGS.map(tag => (
                                            <button
                                                key={tag}
                                                type="button"
                                                className={`${styles.reviewTagBtn} ${reviewForm.tags.includes(tag) ? styles.reviewTagBtnActive : ''}`}
                                                onClick={() => handleTagToggle(tag)}
                                            >
                                                <Tag size={12} /> {tag}
                                            </button>
                                        ))}
                                    </div>

                                    <h4 className={styles.reviewFormSubtitle}>Add a comment</h4>
                                    <textarea
                                        className={styles.reviewTextarea}
                                        placeholder="Tell us about your order, the food quality, speed of delivery, etc."
                                        rows={4}
                                        value={reviewForm.text}
                                        onChange={e => setReviewForm(p => ({ ...p, text: e.target.value }))}
                                    />

                                    <div className={styles.reviewFormActions}>
                                        <button className={styles.reviewCancelBtn} onClick={() => setIsWritingReview(false)}>Cancel</button>
                                        <button className={styles.reviewSubmitBtn} onClick={submitReview}>Post Review</button>
                                    </div>
                                </div>
                            )}

                            <div className={styles.reviewList}>
                                {localReviews.map(r => (
                                    <div key={r.id} className={styles.reviewItem}>
                                        <div className={styles.reviewAvatar}>{r.avatar}</div>
                                        <div className={styles.reviewBody}>
                                            <div className={styles.reviewTop}>
                                                <span className={styles.reviewName}>{r.name}</span>
                                                <span className={styles.reviewDate}>{r.date}</span>
                                            </div>
                                            <StarRow rating={r.rating} size={12} />
                                            {r.tags && r.tags.length > 0 && (
                                                <div className={styles.reviewItemTags}>
                                                    {r.tags.map(t => <span key={t} className={styles.reviewItemTag}>{t}</span>)}
                                                </div>
                                            )}
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
                            {[
                                { label: 'Branch Name', value: store.branchName },
                                { label: 'Location', value: store.location },
                                { label: 'Status', value: store.status, isStatus: true },
                                { label: 'Operating Hours', value: store.hours },
                                { label: 'Contact', value: store.phone },
                                { label: 'Cuisine Type', value: store.cuisine },
                                { label: 'Delivery Time', value: store.deliveryTime },
                                { label: 'Min. Order', value: store.minOrder },
                            ].map(({ label, value, isStatus }) => (
                                <div key={label} className={styles.infoItem}>
                                    <strong>{label}</strong>
                                    <span className={isStatus ? (value === 'Operational' ? styles.statusOpen : styles.statusClosed) : ''}>
                                        {isStatus ? `● ${value}` : value}
                                    </span>
                                </div>
                            ))}
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

/* ── Reusable menu card ── */
function MenuCard({ item, onSelect, onAdd, styles }) {
    return (
        <div className={styles.menuCard} onClick={() => onSelect(item)}>
            <img src={item.image} alt={item.title} className={styles.menuCardImg} />
            <div className={styles.menuCardBody}>
                <h4 className={styles.menuCardTitle}>{item.title}</h4>
                <p className={styles.menuCardDesc}>{item.description}</p>
                <div className={styles.menuCardFooter}>
                    <span className={styles.menuCardPrice}>${Number(item.price).toFixed(2)}</span>
                    <button
                        className={styles.addBtn}
                        onClick={(e) => { e.stopPropagation(); onAdd(item); }}
                        aria-label="Add to cart"
                    >
                        <ShoppingCart size={13} /> Add
                    </button>
                </div>
            </div>
        </div>
    );
}

export default StoreModal;
