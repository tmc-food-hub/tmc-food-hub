import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Clock, Star, Plus, ChevronLeft, ChevronRight, PenLine, ThumbsUp, X, UploadCloud, CheckCircle2, ShoppingCart } from 'lucide-react';
import Navbar from '../../components/sections/Navbar';
import Footer from '../../components/sections/Footer';
import BackToTop from '../../components/ui/BackToTop';
import { CartContext } from '../../components/ui/CartContext';
import AddToCartModal from '../../components/ui/AddToCartModal';
import { getStores } from '../../data/storesData';
import styles from './RestaurantMenuPage.module.css';
import api from '../../api/axios';

function StarRow({ rating, size = 14 }) {
    return (
        <span style={{ display: 'inline-flex', gap: '2px', color: '#F5A623' }}>
            {[1, 2, 3, 4, 5].map(n => (
                <Star key={n} size={size}
                    fill={n <= Math.round(rating) ? '#F5A623' : 'none'}
                    color={n <= Math.round(rating) ? '#F5A623' : '#D1D5DB'}
                />
            ))}
        </span>
    );
}

function RestaurantMenuPage() {
    const { storeId } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);

    const [store, setStore] = useState(null);
    const [allStores, setAllStores] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Popular');
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeDietary, setActiveDietary] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [isReviewModalOpen, setReviewModalOpen] = useState(false);
    const [reviewRating, setReviewRating] = useState(0);

    // Modal state for Add To Cart Variations
    const [selectedItemForModal, setSelectedItemForModal] = useState(null);
    const [isCartModalOpen, setIsCartModalOpen] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchMenu();
    }, [storeId]);

    const fetchMenu = async () => {
        try {
            const [menuRes, storesRes] = await Promise.all([
                api.get(`/restaurants/${storeId}/menu`),
                getStores() // Still using local for other stores for now
            ]);

            const storeData = menuRes.data.restaurant;
            const groupedMenu = menuRes.data.menu;
            
            // Flatten menu items and add category field for matching
            const flattened = [];
            Object.keys(groupedMenu).forEach(catName => {
                groupedMenu[catName].forEach(item => {
                    flattened.push({ ...item, categoryName: catName });
                });
            });

            // Map backend store data to frontend structure if needed
            const formattedStore = {
                ...storeData,
                restaurant_id: storeData.id,
                name: storeData.restaurant_name || storeData.name,
                cuisine: storeData.cuisine || 'Fast Food • Filipino • Asian',
                deliveryTime: storeData.deliveryTime || '25-40 min',
                status: storeData.status || 'Operational',
                logo: storeData.restaurant_name === 'Jollibee' ? '/assets/images/service/resturant_logo/jollibee.svg' :
                      storeData.restaurant_name === "McDonald's" ? '/assets/images/service/resturant_logo/mcdonald-s-7.svg' :
                      storeData.restaurant_name === 'Sushi Nori' ? '/assets/images/service/resturant_logo/sushi nori.svg' :
                      storeData.restaurant_name === 'Mang Inasal' ? '/assets/images/service/resturant_logo/Mang_Inasal.svg' :
                      storeData.restaurant_name === 'KFC' ? '/assets/images/service/resturant_logo/KFC.svg' :
                      storeData.restaurant_name === 'Chowking' ? '/assets/images/service/resturant_logo/chowking.svg' :
                      '/assets/images/service/placeholder.svg',
                address: storeData.business_address || storeData.address,
                contact: storeData.business_contact_number || storeData.contact,
                available_items_count: flattened.length,
                menuItems: flattened,
                reviews: storeData.reviews || [],
                rating: storeData.rating || 4.5
            };

            setStore(formattedStore);
            setMenuItems(flattened);
            setAllStores(storesRes);
        } catch (error) {
            console.error('Failed to fetch menu:', error);
            navigate('/menu');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className={styles.loadingWrapper}>Loading Restaurant...</div>;
    if (!store) return null;

    // Extract categories
    const allCategories = ['All', ...new Set(menuItems.map(i => i.categoryName))];
    const tabs = ['Popular', 'Group Meals', 'Drinks', 'Desserts'];

    // Filter menu items
    const filteredItems = menuItems.filter(item => {
        const matchCat = activeCategory === 'All' || item.categoryName === activeCategory;
        const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchCat && matchSearch;
    });

    const handleAddToCartClick = (item) => {
        setSelectedItemForModal({ 
            ...item, 
            storeName: store.name,
            restaurantId: store.id 
        });
        setIsCartModalOpen(true);
    };

    const handleModalConfirm = (customizedItem) => {
        addToCart(customizedItem);
        setIsCartModalOpen(false);
        setSelectedItemForModal(null);
    };

    const avgRating = (store.reviews && store.reviews.length)
        ? (store.reviews.reduce((sum, r) => sum + r.rating, 0) / store.reviews.length).toFixed(1)
        : (store.rating || 4.5);

    const similarStores = allStores.filter(s => s.id !== store.id).slice(0, 4);

    return (
        <>
            <div className="site-wrap">
                <Navbar />

                <main className={styles.pageWrapper}>
                    <div className="container-lg">

                        {/* Breadcrumbs */}
                        <div className={styles.breadcrumbs}>
                            <Link to="/">Home</Link> <span className="mx-2">/</span>
                            <Link to="/menu">Restaurants</Link> <span className="mx-2">/</span>
                            <span className={styles.current}>{store.name}</span>
                        </div>

                        {/* Restaurant Header */}
                        <div className={styles.restaurantHeader}>
                            <img src={store.logo} alt={store.name} className={styles.restaurantLogo} />
                            <div className={styles.restaurantInfo}>
                                <div className={styles.restaurantCategory}>{store.cuisine}</div>
                                <h1 className={styles.restaurantName}>{store.name}</h1>
                                <div className={styles.restaurantMeta}>
                                    <span className={store.status === 'Operational' ? styles.statusBadgeOpen : styles.statusBadgeClosed}>
                                        ● {store.status}
                                    </span>
                                    <span><MapPin size={14} className="me-1" /> 2.5 km radius</span>
                                    <span><Clock size={14} className="me-1" /> {store.deliveryTime} delivery</span>
                                </div>
                            </div>
                        </div>

                        {/* Menu Navigation Tabs */}
                        <div className={styles.menuNav}>
                            <div className={styles.menuTabs}>
                                {tabs.map(tab => (
                                    <button
                                        key={tab}
                                        className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
                                        onClick={() => setActiveTab(tab)}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <div className={styles.menuSearch}>
                                <Search size={16} className={styles.menuSearchIcon} />
                                <input
                                    type="text"
                                    placeholder="Search in menu"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="row mt-4">
                            {/* Sidebar Options (Popular/Filters) */}
                            <div className="col-lg-3">
                                <h4 className="mb-4 fw-bold">Popular</h4>
                                <div className={styles.sidebar}>
                                    <div className={styles.filterGroupTitle}>Filters</div>

                                    <div className={styles.filterGroup}>
                                        <div className={styles.filterGroupTitle} style={{ fontSize: '0.65rem', marginBottom: '0.5rem', color: '#1a1a1a' }}>CATEGORY</div>
                                        {allCategories.map(cat => (
                                            <label key={cat} className={styles.radioLabel}>
                                                <input
                                                    type="radio"
                                                    name="category"
                                                    className={styles.radioInput}
                                                    checked={activeCategory === cat}
                                                    onChange={() => setActiveCategory(cat)}
                                                />
                                                {cat}
                                            </label>
                                        ))}
                                    </div>

                                    <div className={styles.filterGroup}>
                                        <div className={styles.filterGroupTitle} style={{ fontSize: '0.65rem', marginBottom: '0.5rem', color: '#1a1a1a' }}>DIETARY PREFERENCE</div>
                                        {['All', 'Vegan', 'Gluten-Free', 'Halal'].map(diet => (
                                            <label key={diet} className={styles.radioLabel}>
                                                <input
                                                    type="radio"
                                                    name="dietary"
                                                    className={styles.radioInput}
                                                    checked={activeDietary === diet}
                                                    onChange={() => setActiveDietary(diet)}
                                                />
                                                {diet}
                                            </label>
                                        ))}
                                    </div>

                                    <button
                                        className={styles.clearFiltersBtn}
                                        onClick={() => { setActiveCategory('All'); setActiveDietary('All'); setSearchQuery(''); }}
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            </div>

                            {/* Menu Items Grid */}
                            <div className="col-lg-9">
                                <div className={styles.menuGrid}>
                                    {filteredItems.map(item => {
                                        const isAvailable = !!item.available && (item.stock_level > 0 || !item.auto_toggle);
                                        
                                        return (
                                            <div 
                                                className={`${styles.menuCard} ${!isAvailable ? styles.outOfStockCard : ''}`} 
                                                key={item.id}
                                            >
                                                <div className={styles.menuCardImgWrap}>
                                                    <img
                                                        src={item.image}
                                                        alt={item.title}
                                                        className={`${styles.menuCardImg} ${item.title === 'Jolly Spaghetti' ? styles.spaghettiImg : ''}`}
                                                    />
                                                    {item.isBestSeller && <span className={styles.bestSellerBadge}>Best Seller</span>}
                                                    {!isAvailable && <span className={styles.outOfStockBadge}>Out of Stock</span>}
                                                </div>
                                                <div className={styles.menuCardBody}>
                                                    <div className={styles.menuCardHeaderRow}>
                                                        <h3 className={styles.menuCardTitle}>{item.title}</h3>
                                                        <span className={styles.menuCardPrice}>${Number(item.price).toFixed(2)}</span>
                                                    </div>
                                                    <p className={styles.menuCardDesc}>{item.description}</p>
                                                    <div className={styles.menuCardFooterRow}>
                                                        <div className={styles.menuCardRating}>
                                                            <Star size={14} fill="#F5A623" color="#F5A623" /> {item.rating || 4.8} <span>({item.reviews || 152})</span>
                                                        </div>
                                                        <button 
                                                            className={styles.addBtnIcon} 
                                                            onClick={() => isAvailable && handleAddToCartClick(item)}
                                                            disabled={!isAvailable}
                                                            style={!isAvailable ? { opacity: 0.5, cursor: 'not-allowed', background: '#9ca3af' } : {}}
                                                        >
                                                            <Plus size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className={styles.pagination}>
                                    <Link to="#" className={`${styles.pageBtn} ${styles.pageIconBtn}`}><ChevronLeft size={18} /></Link>
                                    <Link to="#" className={`${styles.pageBtn} ${styles.active}`}>1</Link>
                                    <Link to="#" className={styles.pageBtn}>2</Link>
                                    <Link to="#" className={styles.pageBtn}>3</Link>
                                    <Link to="#" className={`${styles.pageBtn} ${styles.pageIconBtn}`}><ChevronRight size={18} /></Link>
                                </div>
                            </div>
                        </div>

                        {/* Reviews & Feedbacks section */}
                        <div className={styles.reviewsSection}>
                            <div className={styles.sectionHeader}>
                                <div>
                                    <h2 className={styles.sectionTitle}>Reviews & Feedbacks</h2>
                                    <p className={styles.reviewsSubtitle}><strong>{store.name}</strong> • 1,240 verified reviews</p>
                                </div>
                                <button className={styles.writeReviewBtn} onClick={() => setReviewModalOpen(true)}>
                                    <PenLine size={16} /> Write a review
                                </button>
                            </div>

                            <div className={styles.reviewsGrid}>
                                {/* Review Summary Card */}
                                <div className={styles.reviewSummaryCard}>
                                    <div className={styles.reviewScore}>
                                        <div className={styles.reviewScoreBig}>{avgRating}</div>
                                        <div className={styles.reviewStars}>
                                            <StarRow rating={avgRating} size={16} />
                                        </div>
                                        <div className={styles.reviewBasedOn}>Based on 1,248 reviews</div>
                                    </div>
                                    <div className={styles.reviewBars} style={{ width: '100%' }}>
                                        {[
                                            { star: 5, count: 864, pct: 70 },
                                            { star: 4, count: 242, pct: 20 },
                                            { star: 3, count: 98, pct: 8 },
                                            { star: 2, count: 30, pct: 1 },
                                            { star: 1, count: 14, pct: 1 }
                                        ].map(bar => (
                                            <div key={bar.star} className={styles.reviewBarRow}>
                                                <span>{bar.star}</span>
                                                <div className={styles.reviewBarBg}>
                                                    <div className={styles.reviewBarFill} style={{ width: `${bar.pct}%` }}></div>
                                                </div>
                                                <span className={styles.reviewBarCount}>{bar.count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Review Comments List Column */}
                                <div className={styles.reviewsListColumn}>

                                    {/* Review Filters */}
                                    <div className={styles.reviewFilters}>
                                        <button className={`${styles.reviewFilterBtn} ${styles.reviewFilterBtnActive}`}>Most Recent</button>
                                        <button className={styles.reviewFilterBtn}>Highest Rated</button>
                                        <button className={styles.reviewFilterBtn}>With Photos</button>
                                        <button className={styles.reviewFilterBtn}>Verified Only</button>
                                    </div>

                                    {/* Review Comments List */}
                                    <div className={styles.reviewCardsListVertical}>
                                        {store.reviews.map(review => (
                                            <div key={review.id} className={styles.reviewCardItem}>
                                                <div className={styles.reviewUserRow}>
                                                    <div className={styles.reviewUser}>
                                                        <div className={styles.reviewAvatar}>
                                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontWeight: 'bold' }}>{review.avatar}</div>
                                                        </div>
                                                        <div>
                                                            <p className={styles.reviewUserName}>{review.name}</p>
                                                            <span className={styles.reviewTime}>{review.date}</span>
                                                        </div>
                                                    </div>
                                                    <div className={styles.reviewStars}>
                                                        <StarRow rating={review.rating} size={14} />
                                                    </div>
                                                </div>
                                                <p className={styles.reviewText}>{review.text}</p>

                                                {/* Dummy images for some reviews just to show layout */}
                                                {review.id === 1 && (
                                                    <div className={styles.reviewImages}>
                                                        <img src="https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?q=80&w=2070&auto=format&fit=crop" alt="Review Photo" className={styles.reviewImg} />
                                                    </div>
                                                )}

                                                <button className={styles.helpfulBtn}>
                                                    <ThumbsUp size={14} /> Helpful ({Math.floor(Math.random() * 30) + 1})
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Similar Restaurants */}
                        <div className={styles.similarSection}>
                            <h2 className={styles.sectionTitle} style={{ marginBottom: '1.5rem' }}>Similar Restaurants</h2>
                            <div className={styles.similarGrid}>
                                {similarStores.map(similar => (
                                    <Link to={`/menu/${similar.id}`} className={styles.productCard} key={similar.id}>
                                        <div className={styles.cardImageWrapper}>
                                            <img src={similar.cover} alt={similar.name} className={styles.cardImage} loading="lazy" />
                                        </div>
                                        <div className={styles.cardBody}>
                                            <div className={styles.badgesTopLeftSmall}>
                                                <span className={similar.status === 'Operational' ? styles.statusBadgeOpenSmall : styles.statusBadgeClosedSmall}>
                                                    <span style={{ fontSize: '1.2rem', lineHeight: '0.5' }}>•</span> {similar.status}
                                                </span>
                                            </div>
                                            <div className={styles.cardTitleRow}>
                                                <h3 className={styles.cardTitle}>{similar.name}</h3>
                                                <span className={styles.price}>
                                                    {similar.rating} <Star size={13} fill="#F5A623" color="#F5A623" /> <span style={{ color: '#888', fontWeight: '400', fontSize: '0.75rem' }}>(420)</span>
                                                </span>
                                            </div>
                                            <p className={styles.cardDesc}>{similar.cuisine.split(', ').join(' • ')}</p>
                                            <div className={styles.cardMeta}>
                                                <span className={styles.metaText} style={{ fontWeight: '700' }}>$5.00</span>
                                                <span className={styles.metaDot} style={{ color: '#ccc', margin: '0 4px' }}>•</span>
                                                <Clock size={12} className={styles.metaIcon} style={{ marginRight: '4px' }} />
                                                <span className={styles.metaText} style={{ fontWeight: '500' }}>{similar.deliveryTime}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Write a Review Modal */}
                        {isReviewModalOpen && (
                            <div className={styles.modalOverlay}>
                                <div className={styles.reviewModal}>
                                    <div className={styles.modalHeader}>
                                        <h3 className={styles.modalTitle}>Write a Review</h3>
                                        <button className={styles.closeModalBtn} onClick={() => setReviewModalOpen(false)}>
                                            <X size={20} />
                                        </button>
                                    </div>
                                    <p className={styles.modalSubtitle}>For <strong>{store.name}</strong></p>
                                    <div className={styles.verifiedOrderBadge}>
                                        <CheckCircle2 size={12} /> Verified Order
                                    </div>

                                    <div className={styles.modalBody}>
                                        <div className={styles.formGroup}>
                                            <label>Overall Rating</label>
                                            <div className={styles.ratingStarsInput}>
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <Star
                                                        key={star}
                                                        size={24}
                                                        fill={star <= reviewRating ? '#8B1F1C' : 'none'}
                                                        color={star <= reviewRating ? '#8B1F1C' : '#D1D5DB'}
                                                        onClick={() => setReviewRating(star)}
                                                        style={{ cursor: 'pointer' }}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Your Review</label>
                                            <textarea className={styles.reviewTextarea} placeholder="Share your experience with the food and delivery..."></textarea>
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Add Photos</label>
                                            <div className={styles.photoUploadArea}>
                                                <UploadCloud size={24} color="#888" className="mb-2" />
                                                <span>Add Photos</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.modalFooter}>
                                        <button className={styles.btnCancel} onClick={() => setReviewModalOpen(false)}>Cancel</button>
                                        <button className={styles.btnSubmit}>Submit Review</button>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </main>

                <Footer />
            </div>

            <AddToCartModal
                isOpen={isCartModalOpen}
                onClose={() => setIsCartModalOpen(false)}
                item={selectedItemForModal}
                onConfirm={handleModalConfirm}
            />

            {/* Success Modal */}
            <BackToTop />
        </>
    );
}

export default RestaurantMenuPage;
