import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, Banknote } from 'lucide-react';
import gcashLogo from '../../assets/imgs/gcash-logo.png';
import mayaLogo from '../../assets/imgs/maya-logo.jpg';
import { CartContext } from '../../components/ui/CartContext';
import { useOrders } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { ShoppingBag, X } from 'lucide-react';
import Navbar from '../../components/sections/Navbar';
import Footer from '../../components/sections/Footer';
import BackToTop from '../../components/ui/BackToTop';
import styles from './CheckoutPage.module.css';

function CheckoutPage() {
    const { cartItems, cartSubtotal, clearCart } = useContext(CartContext);
    const { user, isAuthenticated, loading } = useAuth();
    const { showNotification } = useNotification();
    const { placeOrder } = useOrders();
    const navigate = useNavigate();

    const [contactNumber, setContactNumber] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [deliveryType, setDeliveryType] = useState('asap');
    const [specialInstructions, setSpecialInstructions] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('gcash');

    const [error, setError] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [placedOrderId, setPlacedOrderId] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (cartItems.length === 0 && !showSuccessModal) {
            navigate('/cart');
        }
        if (!loading) {
            if (!isAuthenticated) {
                navigate('/login', { state: { from: '/checkout' } });
            } else if (user) {
                setContactNumber(user.phone || '');
                setDeliveryAddress(user.address || '');
                if (user.delivery_instructions) {
                    setSpecialInstructions(user.delivery_instructions);
                }
            }
        }
    }, [cartItems.length, isAuthenticated, loading, navigate, showSuccessModal, user]);

    const deliveryFee = 3.00;
    const discount = 5.00;
    const totalAmount = cartSubtotal + deliveryFee - discount;

    const handlePlaceOrder = async () => {
        if (!contactNumber.trim()) {
            setError('Contact number is required.');
            return;
        }

        try {
            const storeName = cartItems[0]?.storeName || 'Restaurant';
            const order = await placeOrder({
                items: cartItems.map(i => ({ 
                    name: i.title, 
                    quantity: i.quantity, 
                    price: i.price, 
                    image: i.image,
                    variations: i.variation ? { name: i.variation.name, addOns: i.addOns || [] } : null
                })),
                restaurant: storeName,
                subtotal: cartSubtotal,
                deliveryFee,
                discount,
                total: totalAmount,
                paymentMethod,
                deliveryAddress,
                contactNumber,
                specialInstructions,
            });

            setPlacedOrderId(order.id);
            clearCart();
            showNotification('Order placed successfully!', 'success');
            setShowSuccessModal(true);
        } catch (error) {
            showNotification('Failed to place order. Please try again.', 'error');
        }
    };

    if (loading || !isAuthenticated || (cartItems.length === 0 && !showSuccessModal)) return null;

    return (
        <>
            <div className="site-wrap">
                <Navbar />

                <main className={styles.checkoutPage}>
                    <div className="container-lg">

                        {/* Header */}
                        <div className={styles.pageHeader}>
                            <div className={styles.breadcrumbs}>
                                <Link to="/">Home</Link>
                                <span className="mx-2">/</span>
                                <Link to="/cart">Your Cart</Link>
                                <span className="mx-2">/</span>
                                <span className={styles.current}>Checkout</span>
                            </div>
                            <h1 className={styles.title}>Complete Your Order</h1>
                            <p className={styles.subtitle}>Review your details and finalize payment.</p>
                        </div>

                        <div className="row">

                            {/* Left Column */}
                            <div className="col-lg-7 mb-4 mb-lg-0">

                                {/* Delivery Details */}
                                <div className={styles.card}>
                                    <h2 className={styles.cardTitle}>Delivery Details</h2>

                                    {/* Address */}
                                    <div className={styles.addressBox}>
                                        <div className={styles.addressLeft}>
                                            <div className={styles.addressIcon}>
                                                <MapPin size={20} />
                                            </div>
                                            <div>
                                                <div className={styles.addressLabel}>Delivery Address</div>
                                                <div className={styles.addressText}>
                                                    {deliveryAddress || 'No address set. Please update your profile.'}
                                                </div>
                                            </div>
                                        </div>
                                        <button className={styles.changeBtn}>Change</button>
                                    </div>

                                    {/* Contact & Delivery Type */}
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Contact Number <span style={{ color: '#DC2626' }}>*</span></label>
                                            <input
                                                type="tel"
                                                className={`${styles.formInput} ${error ? styles.inputError : ''}`}
                                                placeholder="+63 000 000 0000"
                                                value={contactNumber}
                                                onChange={(e) => {
                                                    setContactNumber(e.target.value);
                                                    if (error) setError('');
                                                }}
                                            />
                                            {error && <p className={styles.errorText} style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{error}</p>}
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Delivery Type</label>
                                            <div className={styles.deliveryToggle}>
                                                <button
                                                    className={`${styles.toggleBtn} ${deliveryType === 'asap' ? styles.toggleActive : ''}`}
                                                    onClick={() => setDeliveryType('asap')}
                                                >
                                                    ASAP Delivery
                                                </button>
                                                <button
                                                    className={`${styles.toggleBtn} ${deliveryType === 'scheduled' ? styles.toggleActive : ''}`}
                                                    onClick={() => setDeliveryType('scheduled')}
                                                >
                                                    Schedule Delivery
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Special Instructions */}
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Special Instructions</label>
                                        <textarea
                                            className={styles.formTextarea}
                                            placeholder="e.g. Gate code is 1234, leave at the lobby table..."
                                            rows={3}
                                            value={specialInstructions}
                                            onChange={(e) => setSpecialInstructions(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className={styles.card}>
                                    <h2 className={styles.cardTitle}>Payment Method</h2>
                                    <div className={styles.paymentGrid}>
                                        {[
                                            { id: 'gcash', label: 'GCash', logo: gcashLogo },
                                            { id: 'maya', label: 'Maya', logo: mayaLogo },
                                            { id: 'card', label: 'Credit / Debit Card', icon: 'card' },
                                            { id: 'cod', label: 'Cash on Delivery', icon: 'cod' },
                                        ].map(opt => (
                                            <label
                                                key={opt.id}
                                                className={`${styles.paymentOption} ${paymentMethod === opt.id ? styles.paymentActive : ''}`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    className={styles.paymentRadio}
                                                    checked={paymentMethod === opt.id}
                                                    onChange={() => setPaymentMethod(opt.id)}
                                                />
                                                <span className={styles.paymentIcon}>
                                                    {opt.logo && (
                                                        <img src={opt.logo} alt={opt.label} className={styles.paymentLogo} />
                                                    )}
                                                    {opt.icon === 'card' && <CreditCard size={18} />}
                                                    {opt.icon === 'cod' && <Banknote size={18} />}
                                                </span>
                                                <span className={styles.paymentLabelText}>{opt.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column — Order Summary */}
                            <div className="col-lg-5">
                                <div className={styles.summaryCard}>
                                    <h2 className={styles.summaryTitle}>Order Summary</h2>

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
                                                    <div className={styles.summaryItemMeta}>x{item.quantity} • ${item.price.toFixed(2)}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className={styles.summaryBreakdown}>
                                        <div className={styles.summaryRow}>
                                            <span>Subtotal</span>
                                            <span>${cartSubtotal.toFixed(2)}</span>
                                        </div>
                                        <div className={styles.summaryRow}>
                                            <span>Delivery Fee</span>
                                            <span>${deliveryFee.toFixed(2)}</span>
                                        </div>
                                        <div className={styles.summaryRow}>
                                            <span>Discount (PROMO5)</span>
                                            <span className={styles.discountValue}>-${discount.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className={styles.totalRow}>
                                        <span className={styles.totalLabel}>Total Amount</span>
                                        <span className={styles.totalValue}>${totalAmount.toFixed(2)}</span>
                                    </div>

                                    <button className={styles.placeOrderBtn} onClick={handlePlaceOrder}>Place Order</button>
                                    <p className={styles.termsText}>
                                        By placing an order, you agree to TMC Foodhub's Terms and Conditions.
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </main>

                <Footer />
            </div>
            <BackToTop />

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1060 }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content" style={{ borderRadius: '16px', border: 'none', overflow: 'hidden' }}>
                            <div className="modal-body p-0">
                                <div style={{ backgroundColor: '#10B981', padding: '3rem 2rem', textAlign: 'center', color: 'white' }}>
                                    <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                                        <ShoppingBag size={40} />
                                    </div>
                                    <h2 className="fw-bold mb-2">Order Placed!</h2>
                                    <p className="mb-0 opacity-75">Your delicious meal is being prepared.</p>
                                </div>
                                <div className="p-4 text-center">
                                    <p className="mb-4 text-muted">What would you like to do next?</p>
                                    <div className="d-grid gap-3">
                                        <button
                                            className="btn btn-primary py-3 fw-bold"
                                            style={{ backgroundColor: '#B91C1C', border: 'none', borderRadius: '12px' }}
                                            onClick={() => navigate(`/order-tracking?id=${placedOrderId}`)}
                                        >
                                            Track My Order
                                        </button>
                                        <button
                                            className="btn btn-outline-secondary py-3 fw-bold"
                                            style={{ borderRadius: '12px' }}
                                            onClick={() => navigate('/menu')}
                                        >
                                            Browse More Menu
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default CheckoutPage;
