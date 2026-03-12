import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Clock, Star, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import Navbar from '../../components/sections/Navbar';
import Footer from '../../components/sections/Footer';
import BackToTop from '../../components/ui/BackToTop';
import { getStores } from '../../data/storesData';
import styles from './MenuPage.module.css';

import { Pizza, Utensils, Coffee, Cake, IceCream, Soup, Drumstick } from 'lucide-react';

const CUISINE_CATEGORIES = [
    { name: 'Pizza', icon: <Pizza size={28} strokeWidth={1.5} /> },
    { name: 'Burgers', icon: <Utensils size={28} strokeWidth={1.5} /> },
    { name: 'Coffee', icon: <Coffee size={28} strokeWidth={1.5} /> },
    { name: 'Cakes', icon: <Cake size={28} strokeWidth={1.5} /> },
    { name: 'Ice Cream', icon: <IceCream size={28} strokeWidth={1.5} /> },
    { name: 'Ramen', icon: <Soup size={28} strokeWidth={1.5} /> },
    { name: 'Chicken', icon: <Drumstick size={28} strokeWidth={1.5} /> },
];

function MenuPage() {
    const [stores, setStores] = useState(() => getStores());
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCuisines, setActiveCuisines] = useState([]);
    const [activeDietary, setActiveDietary] = useState([]);
    const [sortBy, setSortBy] = useState('Relevance');

    useEffect(() => {
        const refresh = () => setStores(getStores());
        window.scrollTo(0, 0);
        refresh();
        window.addEventListener('focus', refresh);
        return () => window.removeEventListener('focus', refresh);
    }, []);

    const toggleCuisine = (cuisine) => {
        setActiveCuisines(prev =>
            prev.includes(cuisine) ? prev.filter(c => c !== cuisine) : [...prev, cuisine]
        );
    };

    const toggleDietary = (diet) => {
        setActiveDietary(prev =>
            prev.includes(diet) ? prev.filter(d => d !== diet) : [...prev, diet]
        );
    };

    const clearFilters = () => {
        setActiveCuisines([]);
        setActiveDietary([]);
        setSortBy('Relevance');
    };

    const filtered = stores.filter(s => {
        const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.cuisine.toLowerCase().includes(searchQuery.toLowerCase());

        let matchCuisine = true;
        if (activeCuisines.length > 0) {
            matchCuisine = activeCuisines.some(c => s.cuisine.toLowerCase().includes(c.toLowerCase()));
        }

        let matchDiet = true;
        if (activeDietary.length > 0) {
            matchDiet = activeDietary.includes(s.dietary);
        }

        return matchSearch && matchCuisine && matchDiet;
    }).sort((a, b) => {
        if (sortBy === 'Top Rated') return b.rating - a.rating;
        // Mock distance/time sort logic
        if (sortBy === 'Fastest Delivery') return parseInt(a.deliveryTime) - parseInt(b.deliveryTime);
        return 0; // standard order
    });

    return (
        <>
            <div className="site-wrap">
                <Navbar />

                <main className={styles.menuPage}>
                    <div className="container-lg">

                        {/* Breadcrumbs */}
                        <div className={styles.breadcrumbs}>
                            <Link to="/">Home</Link> <span className="mx-2">/</span>
                            <span className={styles.current}>Restaurants</span>
                        </div>

                        {/* Top Search Bar */}
                        <div className={styles.topSearchBarWrapper}>
                            <div className={styles.topSearchInputFull}>
                                <Search className={styles.searchIcon} size={18} />
                                <input
                                    type="text"
                                    className={styles.searchInputBig}
                                    placeholder="Search for restaurants, cuisines, or dishes..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="row mt-4">

                            {/* ── Sidebar filters ── */}
                            <div className="col-lg-3 mb-4 mb-lg-0">
                                <div className={styles.sidebar}>
                                    <div className={styles.filterHeader}>
                                        <span>Filters</span>
                                    </div>

                                    {/* Sort By */}
                                    <div className={styles.filterGroup}>
                                        <div className={styles.filterGroupTitle}>Sort By</div>
                                        {['Relevance', 'Fastest Delivery', 'Distance', 'Top Rated'].map(sortOption => (
                                            <label key={sortOption} className={styles.radioLabel}>
                                                <input
                                                    type="radio"
                                                    name="sortby"
                                                    className={styles.radioInput}
                                                    checked={sortBy === sortOption}
                                                    onChange={() => setSortBy(sortOption)}
                                                />
                                                {sortOption}
                                            </label>
                                        ))}
                                    </div>

                                    {/* Cuisines Checkboxes */}
                                    <div className={styles.filterGroup}>
                                        <div className={styles.filterGroupTitle}>Cuisines</div>
                                        <div className={styles.sidebarSearchWrap}>
                                            <Search size={14} className={styles.sidebarSearchIcon} />
                                            <input type="text" placeholder="Search for cuisines" className={styles.sidebarSearchInput} />
                                        </div>
                                        {['Alcoholic Drinks', 'American', 'Asian', 'BBQ', 'Beverages', 'Biryani'].map(cuisine => (
                                            <label key={cuisine} className={styles.checkboxLabel}>
                                                <input
                                                    type="checkbox"
                                                    className={styles.checkboxInput}
                                                    checked={activeCuisines.includes(cuisine)}
                                                    onChange={() => toggleCuisine(cuisine)}
                                                />
                                                {cuisine}
                                            </label>
                                        ))}
                                        <button className={styles.showMoreBtn}>Show More ∨</button>
                                    </div>

                                    {/* Dietary Preference */}
                                    <div className={styles.filterGroup}>
                                        <div className={styles.filterGroupTitle}>Dietary</div>
                                        {['Vegan', 'Gluten-Free', 'Halal'].map(diet => (
                                            <label key={diet} className={styles.checkboxLabel}>
                                                <input
                                                    type="checkbox"
                                                    className={styles.checkboxInput}
                                                    checked={activeDietary.includes(diet)}
                                                    onChange={() => toggleDietary(diet)}
                                                />
                                                {diet}
                                            </label>
                                        ))}
                                    </div>

                                    <button className={styles.clearFiltersBtn} onClick={clearFilters}>
                                        Clear all filters
                                    </button>
                                </div>
                            </div>

                            {/* ── Main Content ── */}
                            <div className="col-lg-9">

                                {/* Cuisines Carousel */}
                                <h3 className={styles.sectionTitleMain}>Cuisines</h3>
                                <div className={styles.cuisinesCarousel}>
                                    {CUISINE_CATEGORIES.map(cat => (
                                        <div
                                            key={cat.name}
                                            className={`${styles.cuisineItem} ${activeCuisines.includes(cat.name) ? styles.cuisineItemActive : ''}`}
                                            onClick={() => toggleCuisine(cat.name)}
                                        >
                                            <div className={styles.cuisineIconBox}>{cat.icon}</div>
                                            <span className={styles.cuisineName}>{cat.name}</span>
                                        </div>
                                    ))}
                                </div>

                                <h3 className={styles.sectionTitleMain}>All Restaurants</h3>

                                {/* Restaurant Grid */}
                                <div className={styles.menuGrid}>
                                    {filtered.map(store => (
                                        <Link to={`/menu/${store.id}`} className={styles.productCard} key={store.id}>
                                            <div className={styles.cardImageWrapper}>
                                                <img src={store.cover} alt={store.name} className={styles.cardImage} loading="lazy" />
                                            </div>
                                            <div className={styles.cardBody}>
                                                <div className={styles.badgesTopLeft}>
                                                    <span className={store.status === 'Operational' ? styles.statusBadgeOpen : styles.statusBadgeClosed}>
                                                        <span style={{ fontSize: '1.2rem', lineHeight: '0.5' }}>•</span> {store.status}
                                                    </span>
                                                </div>
                                                <div className={styles.cardTitleRow}>
                                                    <h3 className={styles.cardTitle}>{store.name}</h3>
                                                    <span className={styles.price}>
                                                        {store.rating} <Star size={13} fill="#F5A623" color="#F5A623" /> <span style={{ color: '#888', fontWeight: '400', fontSize: '0.75rem' }}>(420)</span>
                                                    </span>
                                                </div>
                                                <p className={styles.cardDesc}>{store.cuisine.split(', ').join(' • ')}</p>
                                                <div className={styles.cardMeta}>
                                                    <span className={styles.metaText} style={{ fontWeight: '700' }}>$5.00</span>
                                                    <span className={styles.metaDot}>•</span>
                                                    <Clock size={12} className={styles.metaIcon} />
                                                    <span className={styles.metaText}>{store.deliveryTime}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
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
                    </div>
                </main>

                <Footer />
            </div>

            <BackToTop />
        </>
    );
}

export default MenuPage;
