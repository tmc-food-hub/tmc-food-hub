import React, { useEffect, useContext } from 'react';
import { X, Star, ShoppingCart, Clock, Tag, ChevronRight } from 'lucide-react';
import { CartContext } from './CartContext';
import styles from './MenuItemModal.module.css';

/* ── Mock reviews per item ── */
const mockReviews = {
    1: [
        { id: 1, name: 'Maria S.', avatar: 'MS', rating: 5, date: 'Feb 12, 2026', text: 'Best fries I have ever had! Perfectly crispy and the seasoning is just right.' },
        { id: 2, name: 'John R.', avatar: 'JR', rating: 5, date: 'Jan 29, 2026', text: 'Addictive! I always order extras. They stay crispy even after 20 minutes.' },
        { id: 3, name: 'Carla D.', avatar: 'CD', rating: 4, date: 'Jan 15, 2026', text: 'Really good fries, great portion size. Would love a spicy variant!' },
    ],
    2: [
        { id: 1, name: 'Liza M.', avatar: 'LM', rating: 4, date: 'Feb 20, 2026', text: 'Rich and meaty sauce. A real comfort dish. Could use a bit more cheese though.' },
        { id: 2, name: 'Ben C.', avatar: 'BC', rating: 4, date: 'Feb 1, 2026', text: 'Tastes like home-cooked spaghetti. Very filling for the price.' },
    ],
    3: [
        { id: 1, name: 'Alex T.', avatar: 'AT', rating: 5, date: 'Mar 2, 2026', text: 'Absolutely the best burger in town. That patty is perfectly juicy!' },
        { id: 2, name: 'Nina V.', avatar: 'NV', rating: 5, date: 'Feb 18, 2026', text: 'Huge and satisfying. Fresh veggies, melted cheese — 10/10 would order again.' },
        { id: 3, name: 'Ray P.', avatar: 'RP', rating: 5, date: 'Feb 5, 2026', text: 'Incredible burger. The bun is soft and the beef is seasoned to perfection.' },
    ],
    4: [
        { id: 1, name: 'Sara K.', avatar: 'SK', rating: 4, date: 'Mar 1, 2026', text: 'Smooth, strong, and refreshing. Perfect afternoon pick-me-up.' },
        { id: 2, name: 'Tom H.', avatar: 'TH', rating: 5, date: 'Feb 22, 2026', text: 'Not too bitter, not too sweet. Great quality cold brew.' },
    ],
    5: [
        { id: 1, name: 'Yuki L.', avatar: 'YL', rating: 4, date: 'Feb 28, 2026', text: 'Fresh and beautifully presented. The fish is very high quality.' },
        { id: 2, name: 'Park J.', avatar: 'PJ', rating: 4, date: 'Feb 10, 2026', text: 'Really enjoyed the variety in one platter. Great for sharing!' },
    ],
    6: [
        { id: 1, name: 'Chris B.', avatar: 'CB', rating: 5, date: 'Mar 3, 2026', text: 'Perfectly cooked medium-rare. The spice rub is outstanding.' },
        { id: 2, name: 'Dana F.', avatar: 'DF', rating: 5, date: 'Feb 26, 2026', text: 'Worth every peso. Tender, smoky, and full of flavour.' },
        { id: 3, name: 'Mike A.', avatar: 'MA', rating: 4, date: 'Feb 14, 2026', text: 'Best steak I have had at this price point. Highly recommend the medium doneness.' },
    ],
};

function StarRow({ rating, size = 16 }) {
    return (
        <span className={styles.starRow}>
            {[1, 2, 3, 4, 5].map(n => (
                <Star
                    key={n}
                    size={size}
                    fill={n <= Math.round(rating) ? '#F59E0B' : 'none'}
                    color={n <= Math.round(rating) ? '#F59E0B' : '#D1D5DB'}
                />
            ))}
        </span>
    );
}

function MenuItemModal({ item, onClose }) {
    const { addToCart } = useContext(CartContext);
    const reviews = mockReviews[item.id] || [];
    const avgRating = reviews.length
        ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
        : item.rating;

    /* lock body scroll while open */
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    /* close on Escape key */
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    const handleAddToCart = () => {
        addToCart(item);
        onClose();
    };

    return (
        <div className={styles.backdrop} onClick={onClose} aria-modal="true" role="dialog">
            <div className={styles.modal} onClick={e => e.stopPropagation()}>

                {/* Close button */}
                <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                    <X size={20} />
                </button>

                {/* ── Top: image + summary ── */}
                <div className={styles.hero}>
                    <img
                        src={item.image}
                        alt={item.title}
                        className={styles.heroImage}
                        loading="lazy"
                    />
                    {item.isBestSeller && (
                        <span className={styles.heroBadge}>⭐ Best Seller</span>
                    )}
                </div>

                {/* ── Scrollable body ── */}
                <div className={styles.body}>

                    {/* Product header */}
                    <div className={styles.productHeader}>
                        <div>
                            <h2 className={styles.productName}>{item.title}</h2>
                            <div className={styles.ratingRow}>
                                <StarRow rating={avgRating} size={15} />
                                <span className={styles.ratingNum}>{avgRating}</span>
                                <span className={styles.ratingCount}>({reviews.length} reviews)</span>
                            </div>
                        </div>
                        <div className={styles.priceTag}>${item.price.toFixed(2)}</div>
                    </div>

                    <p className={styles.description}>{item.description}</p>

                    {/* Tags */}
                    <div className={styles.tagRow}>
                        <span className={styles.tag}><Tag size={12} /> Fresh</span>
                        <span className={styles.tag}><Clock size={12} /> 15–25 min</span>
                        {item.isBestSeller && <span className={`${styles.tag} ${styles.tagRed}`}><Star size={12} /> Best Seller</span>}
                    </div>

                    {/* Divider */}
                    <div className={styles.divider} />

                    {/* Reviews */}
                    <h3 className={styles.reviewsTitle}>
                        Customer Reviews
                        <span className={styles.reviewsBadge}>{reviews.length}</span>
                    </h3>

                    {reviews.length === 0 ? (
                        <p className={styles.noReviews}>No reviews yet. Be the first to try it!</p>
                    ) : (
                        <div className={styles.reviewList}>
                            {reviews.map(r => (
                                <div key={r.id} className={styles.reviewItem}>
                                    <div className={styles.reviewAvatar}>{r.avatar}</div>
                                    <div className={styles.reviewContent}>
                                        <div className={styles.reviewTop}>
                                            <span className={styles.reviewName}>{r.name}</span>
                                            <span className={styles.reviewDate}>{r.date}</span>
                                        </div>
                                        <StarRow rating={r.rating} size={13} />
                                        <p className={styles.reviewText}>{r.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Footer action bar ── */}
                <div className={styles.footer}>
                    <div className={styles.footerPrice}>${item.price.toFixed(2)}</div>
                    <button className={styles.addBtn} onClick={handleAddToCart}>
                        <ShoppingCart size={16} /> Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MenuItemModal;
