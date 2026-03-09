import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, Banknote } from 'lucide-react';
import gcashLogo from '../../assets/imgs/gcash-logo.png';
import mayaLogo from '../../assets/imgs/maya-logo.jpg';
import { CartContext } from '../../components/ui/CartContext';
import { useOrders } from '../../context/OrderContext';
import Navbar from '../../components/sections/Navbar';
import Footer from '../../components/sections/Footer';
import BackToTop from '../../components/ui/BackToTop';
import styles from './CheckoutPage.module.css';

function CheckoutPage() {
    const { cartItems, cartSubtotal, clearCart } = useContext(CartContext);
    const { placeOrder } = useOrders();
    const navigate = useNavigate();

    const [contactNumber, setContactNumber] = useState('');
    const [deliveryType, setDeliveryType] = useState('asap');
    const [specialInstructions, setSpecialInstructions] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('gcash');

    useEffect(() => {
        window.scrollTo(0, 0);
        if (cartItems.length === 0) {
            navigate('/cart');
        }
    }, [cartItems.length, navigate]);

    const deliveryFee = 3.00;
    const discount = 5.00;
    const totalAmount = cartSubtotal + deliveryFee - discount;

    if (cartItems.length === 0) return null;

    return (
        <>
            <div className="site-wrap">
                <Navbar />

                <main className={styles.checkoutPage}>
                    <div className="container-lg">

                        {/* Header */}
                        <div className={styles.pageHeader} data-aos="fade-up">
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

                        <div className="row" data-aos="fade-up" data-aos-delay="100">

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
                                                <div className={styles.addressLabel}>Home Address</div>
                                                <div className={styles.addressText}>
                                                    123 Quezon Avenue, Unit 4B, Brgy. South Triangle,
                                                    Quezon City, Metro Manila
                                                </div>
                                            </div>
                                        </div>
                                        <button className={styles.changeBtn}>Change</button>
                                    </div>

                                    {/* Contact & Delivery Type */}
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Contact Number</label>
                                            <input
                                                type="tel"
                                                className={styles.formInput}
                                                placeholder="+63 000 000 0000"
                                                value={contactNumber}
                                                onChange={(e) => setContactNumber(e.target.value)}
                                            />
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
                                            <div key={item.id} className={styles.summaryItem}>
                                                <img src={item.image} alt={item.title} className={styles.summaryItemImg} />
                                                <div>
                                                    <div className={styles.summaryItemName}>{item.title}</div>
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

                                    <button className={styles.placeOrderBtn} onClick={() => {
                                        const storeName = cartItems[0]?.storeName || 'Restaurant';
                                        const order = placeOrder({
                                            items: cartItems.map(i => ({ id: i.id, name: i.title, quantity: i.quantity, price: i.price, image: i.image })),
                                            restaurant: storeName,
                                            subtotal: cartSubtotal,
                                            deliveryFee,
                                            discount,
                                            total: totalAmount,
                                            paymentMethod,
                                            deliveryAddress: '123 Quezon Avenue, Unit 4B, Brgy. South Triangle, Quezon City, Metro Manila',
                                            contactNumber,
                                            specialInstructions,
                                        });
                                        clearCart();
                                        navigate(`/order-tracking?id=${order.id}`);
                                    }}>Place Order</button>
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
        </>
    );
}

export default CheckoutPage;
