import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartContext } from '../../components/ui/CartContext';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/sections/Navbar';
import Footer from '../../components/sections/Footer';
import BackToTop from '../../components/ui/BackToTop';
import styles from './CartPage.module.css';

function CartPage() {
    const { cartItems, cartCount, cartSubtotal, increment, decrement, removeFromCart } = useContext(CartContext);
    const { isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();
    const [promoCode, setPromoCode] = useState('');
    const [appliedPromo, setAppliedPromo] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!loading && !isAuthenticated) {
            navigate('/login', { state: { from: '/cart' } });
        }
    }, [isAuthenticated, loading, navigate]);

    if (loading || !isAuthenticated) return null;

    const deliveryFee = cartItems.length > 0 ? 3.00 : 0;
    const discount = appliedPromo ? 5.00 : 0;
    const totalAmount = cartSubtotal + deliveryFee - discount;

    const handleApplyPromo = () => {
        if (promoCode.trim().toUpperCase() === 'PROMO5') {
            setAppliedPromo('PROMO5');
        }
    };

    return (
        <>
            <div className="site-wrap">
                <Navbar />

                <main className={styles.cartPage}>
                    <div className="container-lg">

                        {/* Breadcrumbs */}
                        <div className={styles.pageHeader}>
                            <div className={styles.breadcrumbs}>
                                <Link to="/">Home</Link>
                                <span className="mx-2">/</span>
                                <Link to="/menu">Explore Our Menu</Link>
                                <span className="mx-2">/</span>
                                <span className={styles.current}>Your Cart</span>
                            </div>
                            <h1 className={styles.title}>Your Cart</h1>
                            <p className={styles.subtitle}>
                                {cartCount > 0
                                    ? `You have ${cartCount} item${cartCount !== 1 ? 's' : ''} in your cart.`
                                    : 'Your cart is empty.'}
                            </p>
                        </div>

                        {cartItems.length === 0 ? (
                            <div className={styles.emptyCart}>
                                <p>You haven't added any items yet.</p>
                                <Link to="/menu" className={styles.browseBtn}>Browse Menu</Link>
                            </div>
                        ) : (
                            <div className="row">

                                {/* Left Column — Cart Items */}
                                <div className="col-lg-7 mb-4 mb-lg-0">
                                    <div className={styles.cartItemsCard}>
                                        {cartItems.map((item, index) => (
                                            <div key={item.cartItemId} className={`${styles.cartItem} ${index < cartItems.length - 1 ? styles.cartItemBorder : ''}`}>
                                                <div className={styles.itemLeft}>
                                                    <img src={item.image} alt={item.title} className={styles.itemImage} />
                                                    <div>
                                                        <h3 className={styles.itemName}>{item.title}</h3>
                                                        {(item.variation || (item.addOns && item.addOns.length > 0)) && (
                                                            <div style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: '2px' }}>
                                                                {item.variation && <span style={{ display: 'block' }}>{item.variation.name}</span>}
                                                                {item.addOns && item.addOns.length > 0 && <span style={{ display: 'block' }}>+ {item.addOns.map(a => a.name).join(', ')}</span>}
                                                            </div>
                                                        )}
                                                        <span className={styles.itemPrice}>${Number(item.price).toFixed(2)}</span>
                                                    </div>
                                                </div>
                                                <div className={styles.itemRight}>
                                                    <div className={styles.qtyControl}>
                                                        <button className={styles.qtyBtn} onClick={() => decrement(item.cartItemId)} aria-label="Decrease quantity">
                                                            <Minus size={14} />
                                                        </button>
                                                        <span className={styles.qtyValue}>{item.quantity}</span>
                                                        <button className={styles.qtyBtn} onClick={() => increment(item.cartItemId)} aria-label="Increase quantity">
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>
                                                    <button className={styles.deleteBtn} onClick={() => removeFromCart(item.cartItemId)} aria-label="Remove item">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Right Column — Order Summary */}
                                <div className="col-lg-5">
                                    <div className={styles.summaryCard}>
                                        <h2 className={styles.summaryTitle}>Order Summary</h2>

                                        {/* Item thumbnails */}
                                        <div className={styles.summaryItems}>
                                            {cartItems.map(item => (
                                                <div key={item.cartItemId} className={styles.summaryItem}>
                                                    <img src={item.image} alt={item.title} className={styles.summaryItemImg} />
                                                    <div>
                                                        <div className={styles.summaryItemName}>{item.title}</div>
                                                        {(item.variation || (item.addOns && item.addOns.length > 0)) && (
                                                            <div style={{ fontSize: '0.75rem', color: '#6B7280', margin: '2px 0' }}>
                                                                {item.variation && <span>{item.variation.name}</span>}
                                                                {item.addOns && item.addOns.length > 0 && <span> • {item.addOns.length} add-ons</span>}
                                                            </div>
                                                        )}
                                                        <div className={styles.summaryItemMeta}>x{item.quantity} • ${Number(item.price).toFixed(2)}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Breakdown */}
                                        <div className={styles.summaryBreakdown}>
                                            <div className={styles.summaryRow}>
                                                <span>Subtotal</span>
                                                <span>${Number(cartSubtotal).toFixed(2)}</span>
                                            </div>
                                            <div className={styles.summaryRow}>
                                                <span>Delivery Fee</span>
                                                <span>${Number(deliveryFee).toFixed(2)}</span>
                                            </div>
                                            {appliedPromo && (
                                                <div className={styles.summaryRow}>
                                                    <span>Discount ({appliedPromo})</span>
                                                    <span className={styles.discountValue}>-${Number(discount).toFixed(2)}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Total */}
                                        <div className={styles.totalRow}>
                                            <span className={styles.totalLabel}>Total Amount</span>
                                            <span className={styles.totalValue}>${Number(totalAmount).toFixed(2)}</span>
                                        </div>

                                        {/* Checkout Button */}
                                        <button className={styles.checkoutBtn} onClick={() => navigate('/checkout')}>Checkout</button>
                                        <p className={styles.termsText}>
                                            By placing an order, you agree to TMC Foodhub's Terms and Conditions.
                                        </p>

                                        {/* Promo Code */}
                                        <div className={styles.promoSection}>
                                            <div className={styles.promoInputWrapper}>
                                                <input
                                                    type="text"
                                                    className={styles.promoInput}
                                                    placeholder="Promo Code"
                                                    value={promoCode}
                                                    onChange={(e) => setPromoCode(e.target.value)}
                                                />
                                                <button className={styles.promoBtn} onClick={handleApplyPromo}>Apply</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        )}
                    </div>
                </main>

                <Footer />
            </div>
            <BackToTop />
        </>
    );
}

export default CartPage;
