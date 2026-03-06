import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, Clock, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import StoreModal from '../components/ui/StoreModal';
import Navbar from '../components/sections/Navbar';
import Footer from '../components/sections/Footer';
import BackToTop from '../components/ui/BackToTop';
import { getStores } from '../data/storesData';
import styles from './MenuPage.module.css';

function MenuPage() {
    const [stores, setStores] = useState(() => getStores());
    const [selectedStore, setSelectedStore] = useState(null);
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeDietary, setActiveDietary] = useState('All');

    // Re-read from localStorage on mount and whenever window gets focus
    // (so owner dashboard edits show up immediately)
    useEffect(() => {
        const refresh = () => setStores(getStores());
        window.scrollTo(0, 0);
        refresh();
        window.addEventListener('focus', refresh);
        return () => window.removeEventListener('focus', refresh);
    }, []);

    // Keep open modal in sync when owner updates data
    useEffect(() => {
        if (selectedStore) {
            const updated = stores.find(s => s.id === selectedStore.id);
            if (updated) setSelectedStore(updated);
        }
    }, [stores]); // eslint-disable-line

    const filtered = stores.filter(s => {
        const matchCat = activeCategory === 'All' || s.category === activeCategory;
        const matchDiet = activeDietary === 'All' || s.dietary === activeDietary;
        return matchCat && matchDiet;
    });

    return (
        <>
            <div className="site-wrap">
                <Navbar />

                <main className={styles.menuPage}>
                    <div className="container-lg">

                        {/* Page header */}
                        <div className={styles.pageHeader} data-aos="fade-up">
                            <div className={styles.breadcrumbs}>
                                <Link to="/">Home</Link> <span className="mx-2">/</span>
                                <span className={styles.current}>Restaurants</span>
                            </div>
                            <h1 className={styles.title}>Explore Restaurants</h1>
                            <p className={styles.subtitle}>Browse local branches, check their menus, and order with ease.</p>
                        </div>

                        {/* Search + sort bar */}
                        <div className={styles.searchBarContainer} data-aos="fade-up" data-aos-delay="100">
                            <div className={styles.searchInputWrapper}>
                                <Search className={styles.searchIcon} size={18} />
                                <input type="text" className={styles.searchInput} placeholder="Search for a restaurant or cuisine..." />
                            </div>
                            <div className={styles.searchMeta}>
                                <div>
                                    <span className={styles.recipeCount}>{filtered.length}</span> restaurants found
                                </div>
                                <div>
                                    <span style={{ color: '#555', marginRight: '5px' }}>Sort by:</span>
                                    <select className={styles.sortSelect} defaultValue="Popularity">
                                        <option value="Popularity">Popularity</option>
                                        <option value="Rating">Rating</option>
                                        <option value="DeliveryTime">Delivery Time</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="row">

                            {/* ── Sidebar filters ── */}
                            <div className="col-lg-3 mb-4 mb-lg-0" data-aos="fade-right" data-aos-delay="200">
                                <div className={styles.sidebar}>
                                    <div className={styles.filterHeader}>
                                        <Filter size={20} color="#888" />
                                        <span>Filters</span>
                                    </div>

                                    <div className={styles.filterGroup}>
                                        <div className={styles.filterGroupTitle}>CATEGORY</div>
                                        {['All', 'Fast Food', 'Filipino', 'Japanese', 'Grills', 'Drinks'].map(cat => (
                                            <label key={cat} className={styles.radioLabel}>
                                                <input type="radio" name="category" className={styles.radioInput}
                                                    checked={activeCategory === cat}
                                                    onChange={() => setActiveCategory(cat)} />
                                                {cat}
                                            </label>
                                        ))}
                                    </div>

                                    <div className={styles.filterGroup}>
                                        <div className={styles.filterGroupTitle}>DIETARY PREFERENCE</div>
                                        {['All', 'Vegetarian', 'Halal'].map(diet => (
                                            <label key={diet} className={styles.radioLabel}>
                                                <input type="radio" name="dietary" className={styles.radioInput}
                                                    checked={activeDietary === diet}
                                                    onChange={() => setActiveDietary(diet)} />
                                                {diet}
                                            </label>
                                        ))}
                                    </div>

                                    <button className={styles.clearFiltersBtn}
                                        onClick={() => { setActiveCategory('All'); setActiveDietary('All'); }}>
                                        Clear all filters
                                    </button>
                                </div>
                            </div>

                            {/* ── Restaurant cards ── */}
                            <div className="col-lg-9" data-aos="fade-up" data-aos-delay="300">
                                <div className="row g-4">
                                    {filtered.map(store => (
                                        <div className="col-md-6 col-lg-4" key={store.id}>
                                            <div className={styles.productCard}
                                                onClick={() => setSelectedStore(store)}
                                                style={{ cursor: 'pointer' }}>
                                                <div className={styles.cardImageWrapper}>
                                                    <img src={store.cover} alt={store.name} className={styles.cardImage} loading="lazy" />
                                                    <span className={styles.deliveryBadge}><Clock size={11} /> {store.deliveryTime}</span>
                                                    <span className={store.status === 'Operational' ? styles.statusBadgeOpen : styles.statusBadgeClosed}>
                                                        ● {store.status}
                                                    </span>
                                                </div>
                                                <div className={styles.cardBody}>
                                                    <h3 className={styles.cardTitle}>{store.name}</h3>
                                                    <p className={styles.cardBranch}>{store.branchName}</p>
                                                    <p className={styles.cardDesc}>{store.cuisine}</p>
                                                    <div className={styles.cardMeta}>
                                                        <MapPin size={12} className={styles.metaIcon} />
                                                        <span className={styles.cardLocation}>{store.location}</span>
                                                    </div>
                                                    <div className={styles.cardFooter}>
                                                        <span className={styles.price}>
                                                            <Star size={13} fill="#F5A623" color="#F5A623" /> {store.rating}
                                                        </span>
                                                        <button className={styles.addBtn}>View Menu</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
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

            {selectedStore && (
                <StoreModal store={selectedStore} onClose={() => setSelectedStore(null)} />
            )}
        </>
    );
}

export default MenuPage;
