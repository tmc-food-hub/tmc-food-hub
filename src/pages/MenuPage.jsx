import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { CartContext } from '../components/ui/CartContext';
import Navbar from '../components/sections/Navbar';
import Footer from '../components/sections/Footer';
import BackToTop from '../components/ui/BackToTop';
import styles from './MenuPage.module.css';

// Mock Data for Menu Items
const menuItems = [
    {
        id: 1,
        title: 'French Fries',
        description: 'Crispy golden potato fries, lightly salted and perfect for a quick snack.',
        image: '/assets/images/service/fries.png',
        price: 4.00,
        rating: 4.8,
        isBestSeller: true
    },
    {
        id: 2,
        title: 'Spaghetti',
        description: 'Al dente pasta tossed in a rich, slow-cooked meat sauce.',
        image: '/assets/images/service/spag.png',
        price: 6.50,
        rating: 3.9,
        isBestSeller: false
    },
    {
        id: 3,
        title: 'Burger',
        description: 'A classic juicy beef patty layered with cheese and fresh veggies.',
        image: '/assets/images/service/burger.png',
        price: 7.00,
        rating: 4.9,
        isBestSeller: false
    },
    {
        id: 4,
        title: 'Black Iced Coffee',
        description: 'Bold, smooth brewed coffee served ice-cold for a refreshing boost.',
        image: '/assets/images/service/juice.png',
        price: 3.00,
        rating: 4.4,
        isBestSeller: false
    },
    {
        id: 5,
        title: 'Sushi',
        description: 'Freshly prepared rolls with seasoned rice and premium ingredients.',
        image: '/assets/images/service/sushi.png',
        price: 8.00,
        rating: 4.1,
        isBestSeller: false
    },
    {
        id: 6,
        title: 'Grilled Steak',
        description: 'Juicy, flame-grilled steak cooked to perfection with savory spices.',
        image: '/assets/images/service/steak.png',
        price: 12.00,
        rating: 4.5,
        isBestSeller: false
    }
];

function MenuPage() {
    const { addToCart } = useContext(CartContext);
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeDietary, setActiveDietary] = useState('All');

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <div className="site-wrap">
                <Navbar />

                <main className={styles.menuPage}>
                    <div className="container-lg">

                        {/* Header */}
                        <div className={styles.pageHeader} data-aos="fade-up">
                            <div className={styles.breadcrumbs}>
                                <Link to="/">Home</Link> <span className="mx-2">/</span> <span className={styles.current}>Restaurants</span>
                            </div>
                            <h1 className={styles.title}>Explore Our Menu</h1>
                            <p className={styles.subtitle}>Browse dishes, customize your order, and add to cart with ease.</p>
                        </div>

                        {/* Search and Sort (Full Width) */}
                        <div className={styles.searchBarContainer} data-aos="fade-up" data-aos-delay="100">
                            <div className={styles.searchInputWrapper}>
                                <Search className={styles.searchIcon} size={18} />
                                <input
                                    type="text"
                                    className={styles.searchInput}
                                    placeholder="Search for a dish or category..."
                                />
                            </div>

                            <div className={styles.searchMeta}>
                                <div>
                                    <span className={styles.recipeCount}>1,248</span> Recipes found
                                </div>
                                <div>
                                    <span style={{ color: '#555', marginRight: '5px' }}>Sort by:</span>
                                    <select className={styles.sortSelect} defaultValue="Popularity">
                                        <option value="Popularity">Popularity</option>
                                        <option value="PriceLowToHigh">Price: Low to High</option>
                                        <option value="PriceHighToLow">Price: High to Low</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="row">

                            {/* Sidebar */}
                            <div className="col-lg-3 mb-4 mb-lg-0" data-aos="fade-right" data-aos-delay="200">
                                <div className={styles.sidebar}>
                                    <div className={styles.filterHeader}>
                                        <Filter size={20} color="#888" />
                                        <span>Filters</span>
                                    </div>

                                    {/* Category Filter */}
                                    <div className={styles.filterGroup}>
                                        <div className={styles.filterGroupTitle}>CATEGORY</div>
                                        {['All', 'Rice Meals', 'Pasta', 'Grills', 'Drinks', 'Desserts', 'Java', 'Analytics', 'Cloud'].map(cat => (
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

                                    {/* Dietary Preference Filter */}
                                    <div className={styles.filterGroup}>
                                        <div className={styles.filterGroupTitle}>DIETARY PREFERENCE</div>
                                        {['All', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Halal'].map(diet => (
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
                                        onClick={() => { setActiveCategory('All'); setActiveDietary('All'); }}
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            </div>

                            {/* Main Content Grid */}
                            <div className="col-lg-9" data-aos="fade-up" data-aos-delay="300">
                                {/* Grid */}
                                <div className="row g-4">
                                    {menuItems.map(item => (
                                        <div className="col-md-6 col-lg-4" key={item.id}>
                                            <div className={styles.productCard}>
                                                <div className={styles.cardImageWrapper}>
                                                    <img src={item.image} alt={item.title} className={styles.cardImage} />
                                                    {item.isBestSeller && (
                                                        <span className={styles.badgeOverlay}>Best Seller</span>
                                                    )}
                                                </div>
                                                <div className={styles.cardBody}>
                                                    <h3 className={styles.cardTitle}>{item.title}</h3>
                                                    <p className={styles.cardDesc}>{item.description}</p>
                                                    <div className={styles.cardMeta}>
                                                        <Star className={styles.starIcon} size={14} fill="currentColor" />
                                                        <span><span className={styles.ratingScore}>{item.rating}</span> reviews</span>
                                                    </div>
                                                    <div className={styles.cardFooter}>
                                                        <span className={styles.price}>${item.price.toFixed(2)}</span>
                                                        <button className={styles.addBtn} aria-label="Add to cart" onClick={() => addToCart(item)}>
                                                            <ShoppingCart size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                <div className={styles.pagination}>
                                    <Link to="#" className={`${styles.pageBtn} ${styles.pageIconBtn}`}><ChevronLeft size={18} /></Link>
                                    <Link to="#" className={`${styles.pageBtn} ${styles.active}`}>1</Link>
                                    <Link to="#" className={styles.pageBtn}>2</Link>
                                    <Link to="#" className={styles.pageBtn}>3</Link>
                                    <Link to="#" className={styles.pageBtn}>4</Link>
                                    <Link to="#" className={styles.pageBtn}>5</Link>
                                    <Link to="#" className={`${styles.pageBtn} ${styles.pageIconBtn}`}><ChevronRight size={18} /></Link>
                                </div>

                            </div>
                        </div>

                    </div>
                </main>

                <Footer />
            </div>

            <BackToTop />
        </>
    );
}

export default MenuPage;
