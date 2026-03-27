import React, { useContext, useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { MapPin, Banknote, CalendarDays, Clock, Smartphone, Building2, Upload, Image as ImageIcon, CreditCard } from 'lucide-react';
import api from '../../api/axios';
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
    const { user, isAuthenticated, loading, setShowLoginPrompt } = useAuth();
    const { showNotification } = useNotification();
    const { placeOrder } = useOrders();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const urlRestaurantId = searchParams.get('restaurantId');

    const [contactNumber, setContactNumber] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [deliveryType, setDeliveryType] = useState('asap');
    const [specialInstructions, setSpecialInstructions] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [scheduledDate, setScheduledDate] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');

    const [error, setError] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [placedOrderId, setPlacedOrderId] = useState(null);

    // Payment methods from restaurant
    const [acceptedMethods, setAcceptedMethods] = useState(['cod']);
    const [restaurantPaymentInfo, setRestaurantPaymentInfo] = useState({});
    const [loadingMethods, setLoadingMethods] = useState(true);

    // Receipt upload modal
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [receiptFile, setReceiptFile] = useState(null);
    const [receiptPreview, setReceiptPreview] = useState(null);
    const [uploadingReceipt, setUploadingReceipt] = useState(false);
    const [receiptUploaded, setReceiptUploaded] = useState(false);
    const [paymentSenderName, setPaymentSenderName] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);
        if (cartItems.length === 0 && !showSuccessModal && !showReceiptModal) {
            navigate('/cart');
        }
        if (!loading) {
            if (!isAuthenticated) {
                navigate('/');
                setShowLoginPrompt(true);
                return;
            } else if (user) {
                setContactNumber(user.phone || '');
                setDeliveryAddress(user.address || '');
                if (user.delivery_instructions) {
                    setSpecialInstructions(user.delivery_instructions);
                }
            }
        }
    }, [cartItems.length, isAuthenticated, loading, navigate, showSuccessModal, showReceiptModal, user, setShowLoginPrompt]);

    // Fetch accepted payment methods from restaurant
    useEffect(() => {
        const restaurantId = cartItems[0]?.restaurantId || urlRestaurantId;
        if (restaurantId) {
            api.get(`/restaurants/${restaurantId}/payment-methods`)
                .then(res => {
                    const data = res.data;
                    setAcceptedMethods(data.accepted_payment_methods || ['cod']);
                    setRestaurantPaymentInfo(data);
                    // Default to first accepted method
                    setPaymentMethod((data.accepted_payment_methods || ['cod'])[0]);
                })
                .catch(() => {})
                .finally(() => setLoadingMethods(false));
        } else {
            setLoadingMethods(false);
        }
    }, [cartItems, urlRestaurantId]);

    const deliveryFee = 3.00;
    const totalAmount = cartSubtotal + deliveryFee;

    // Compute min/max dates for the schedule picker (today to +7 days)
    const { minDate, maxDate } = useMemo(() => {
        const today = new Date();
        const max = new Date();
        max.setDate(today.getDate() + 7);
        const fmt = d => d.toISOString().split('T')[0];
        return { minDate: fmt(today), maxDate: fmt(max) };
    }, []);

    const handlePlaceOrder = async () => {
        if (!contactNumber.trim()) {
            setError('Contact number is required.');
            return;
        }
        if (deliveryType === 'scheduled') {
            if (!scheduledDate) {
                setError('Please select a delivery date.');
                return;
            }
            if (!scheduledTime) {
                setError('Please select a delivery time.');
                return;
            }
        }

        try {
            const storeName = cartItems[0]?.storeName || 'Restaurant';
            const restaurantId = cartItems[0]?.restaurantId || urlRestaurantId;

            if (!restaurantId) {
                showNotification('Unable to identify the restaurant. Please clear your cart and try again.', 'error');
                return;
            }

            const order = await placeOrder({
                items: cartItems.map(i => ({ 
                    id: i.id,
                    name: i.title, 
                    quantity: i.quantity, 
                    price: i.price, 
                    image: i.image,
                    variations: i.variation ? { name: i.variation.name, addOns: i.addOns || [] } : null
                })),
                restaurant: storeName,
                restaurantId,
                subtotal: cartSubtotal,
                deliveryFee,
                discount: 0,
                total: totalAmount,
                paymentMethod,
                deliveryAddress,
                contactNumber,
                specialInstructions,
                deliveryType,
                ...(deliveryType === 'scheduled' && {
                    scheduledDate,
                    scheduledTime,
                }),
            });

            setPlacedOrderId(order.id);
            clearCart();
            showNotification('Order placed successfully!', 'success');

            // For online payments, show receipt upload modal
            if (paymentMethod !== 'cod') {
                setShowReceiptModal(true);
            } else {
                setShowSuccessModal(true);
            }
        } catch (error) {
            showNotification('Failed to place order. Please try again.', 'error');
        }
    };

    if (loading || !isAuthenticated || (cartItems.length === 0 && !showSuccessModal && !showReceiptModal)) return null;

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
                                                <div className={styles.addressLabel}>Home Address</div>
                                                <div className={styles.addressText}>
                                                    {deliveryAddress || 'No address set. Add one in your profile for faster checkout.'}
                                                </div>
                                            </div>
                                        </div>
                                        <button className={styles.changeBtn} onClick={() => navigate('/profile')}>Change</button>
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
                                                    setContactNumber(e.target.value.replace(/\D/g, ''));
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
                                                    onClick={() => {
                                                        setDeliveryType('asap');
                                                        setScheduledDate('');
                                                        setScheduledTime('');
                                                        if (error) setError('');
                                                    }}
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

                                    {/* Scheduled Delivery Date & Time */}
                                    <div className={`${styles.scheduleSection} ${deliveryType === 'scheduled' ? styles.scheduleSectionOpen : ''}`}>
                                        <div className={styles.formRow}>
                                            <div className={styles.formGroup}>
                                                <label className={styles.formLabel}>
                                                    <CalendarDays size={14} style={{ marginRight: 6, verticalAlign: 'text-bottom' }} />
                                                    Delivery Date <span style={{ color: '#DC2626' }}>*</span>
                                                </label>
                                                <input
                                                    type="date"
                                                    className={`${styles.formInput} ${error && !scheduledDate && deliveryType === 'scheduled' ? styles.inputError : ''}`}
                                                    value={scheduledDate}
                                                    min={minDate}
                                                    max={maxDate}
                                                    onChange={(e) => {
                                                        setScheduledDate(e.target.value);
                                                        if (error) setError('');
                                                    }}
                                                />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label className={styles.formLabel}>
                                                    <Clock size={14} style={{ marginRight: 6, verticalAlign: 'text-bottom' }} />
                                                    Delivery Time <span style={{ color: '#DC2626' }}>*</span>
                                                </label>
                                                <input
                                                    type="time"
                                                    className={`${styles.formInput} ${error && !scheduledTime && deliveryType === 'scheduled' ? styles.inputError : ''}`}
                                                    value={scheduledTime}
                                                    min="08:00"
                                                    max="22:00"
                                                    onChange={(e) => {
                                                        setScheduledTime(e.target.value);
                                                        if (error) setError('');
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <p className={styles.scheduleNote}>
                                            You can schedule up to 7 days ahead. Delivery hours: 8:00 AM – 10:00 PM.
                                        </p>
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
                                        {acceptedMethods.includes('cod') && (
                                            <label className={`${styles.paymentOption} ${paymentMethod === 'cod' ? styles.paymentActive : ''}`} onClick={() => setPaymentMethod('cod')}>
                                                <input type="radio" name="payment" className={styles.paymentRadio} checked={paymentMethod === 'cod'} readOnly />
                                                <span className={styles.paymentIcon}><Banknote size={18} /></span>
                                                <span className={styles.paymentLabelText}>Cash on Delivery</span>
                                            </label>
                                        )}
                                        {acceptedMethods.includes('gcash') && (
                                            <label className={`${styles.paymentOption} ${paymentMethod === 'gcash' ? styles.paymentActive : ''}`} onClick={() => setPaymentMethod('gcash')}>
                                                <input type="radio" name="payment" className={styles.paymentRadio} checked={paymentMethod === 'gcash'} readOnly />
                                                <span className={styles.paymentIcon}><Smartphone size={18} /></span>
                                                <span className={styles.paymentLabelText}>GCash</span>
                                            </label>
                                        )}
                                        {acceptedMethods.includes('maya') && (
                                            <label className={`${styles.paymentOption} ${paymentMethod === 'maya' ? styles.paymentActive : ''}`} onClick={() => setPaymentMethod('maya')}>
                                                <input type="radio" name="payment" className={styles.paymentRadio} checked={paymentMethod === 'maya'} readOnly />
                                                <span className={styles.paymentIcon}><CreditCard size={18} /></span>
                                                <span className={styles.paymentLabelText}>Maya</span>
                                            </label>
                                        )}
                                        {acceptedMethods.includes('bank_transfer') && (
                                            <label className={`${styles.paymentOption} ${paymentMethod === 'bank_transfer' ? styles.paymentActive : ''}`} onClick={() => setPaymentMethod('bank_transfer')}>
                                                <input type="radio" name="payment" className={styles.paymentRadio} checked={paymentMethod === 'bank_transfer'} readOnly />
                                                <span className={styles.paymentIcon}><Building2 size={18} /></span>
                                                <span className={styles.paymentLabelText}>Bank Transfer</span>
                                            </label>
                                        )}
                                    </div>
                                    {paymentMethod !== 'cod' && (
                                        <p style={{ fontSize: '0.78rem', color: '#6B7280', marginTop: '0.75rem', background: '#FEF2F2', padding: '0.6rem 0.85rem', borderRadius: '8px' }}>
                                            After placing your order, you’ll see the payment details and can upload your payment screenshot.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Right Column — Order Summary */}
                            <div className="col-lg-5">
                                <div className={styles.summaryCard}>
                                    <h2 className={styles.summaryTitle}>Order Summary</h2>

                                    <div className={styles.summaryItems}>
                                        {cartItems.map(item => (
                                            <div key={item.cartItemId} className={styles.summaryItem}>
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className={styles.summaryItemImg}
                                                    onError={e => {
                                                        e.target.onerror = null;
                                                        e.target.style.background = '#F3F4F6';
                                                        e.target.style.objectFit = 'contain';
                                                        e.target.style.padding = '4px';
                                                        e.target.src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%239CA3AF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>');
                                                    }}
                                                />
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

                                    <div className={styles.summaryBreakdown}>
                                        <div className={styles.summaryRow}>
                                            <span>Subtotal</span>
                                            <span>${Number(cartSubtotal).toFixed(2)}</span>
                                        </div>
                                        <div className={styles.summaryRow}>
                                            <span>Delivery Fee</span>
                                            <span>${Number(deliveryFee).toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className={styles.totalRow}>
                                        <span className={styles.totalLabel}>Total Amount</span>
                                        <span className={styles.totalValue}>${Number(totalAmount).toFixed(2)}</span>
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
            {/* Receipt Upload Modal — shown after order with online payment */}
            {showReceiptModal && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1060 }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content" style={{ borderRadius: '16px', border: 'none', overflow: 'hidden' }}>
                            <div className="modal-body p-0">
                                <div style={{ backgroundColor: '#B91C1C', padding: '2rem', textAlign: 'center', color: 'white' }}>
                                    <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                                        <Upload size={28} />
                                    </div>
                                    <h3 className="fw-bold mb-1">Upload Payment Receipt</h3>
                                    <p className="mb-0 opacity-75" style={{ fontSize: '0.85rem' }}>Send your payment and upload the screenshot</p>
                                </div>
                                <div style={{ padding: '1.5rem' }}>
                                    {/* Payment Details */}
                                    <div style={{ background: '#F9FAFB', borderRadius: '12px', padding: '1rem', marginBottom: '1.25rem' }}>
                                        <p style={{ fontWeight: 700, fontSize: '0.9rem', margin: '0 0 0.5rem', color: '#111827' }}>Send payment to:</p>
                                        {paymentMethod === 'gcash' && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <Smartphone size={16} color="#0066FF" />
                                                <span style={{ fontWeight: 600, color: '#111827' }}>GCash: {restaurantPaymentInfo.gcash_number || 'Not set'}</span>
                                            </div>
                                        )}
                                        {paymentMethod === 'maya' && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <CreditCard size={16} color="#00B900" />
                                                <span style={{ fontWeight: 600, color: '#111827' }}>Maya: {restaurantPaymentInfo.maya_number || 'Not set'}</span>
                                            </div>
                                        )}
                                        {paymentMethod === 'bank_transfer' && (
                                            <div style={{ fontSize: '0.85rem', color: '#374151' }}>
                                                <div><strong>Bank:</strong> {restaurantPaymentInfo.bank_name || '—'}</div>
                                                <div><strong>Account Name:</strong> {restaurantPaymentInfo.bank_account_name || '—'}</div>
                                                <div><strong>Account No:</strong> {restaurantPaymentInfo.bank_account_number || '—'}</div>
                                            </div>
                                        )}
                                        <p style={{ fontSize: '0.78rem', color: '#6B7280', margin: '0.5rem 0 0' }}>Amount: <strong>${Number(totalAmount).toFixed(2)}</strong></p>
                                    </div>

                                    {/* Upload Area */}
                                    {!receiptUploaded ? (
                                        <>
                                            <label
                                                style={{
                                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                                    border: '2px dashed #D1D5DB', borderRadius: '12px', padding: '2rem', cursor: 'pointer',
                                                    background: receiptPreview ? '#F9FAFB' : 'white', transition: 'border-color 0.2s',
                                                }}
                                                onDragOver={e => e.preventDefault()}
                                                onDrop={e => {
                                                    e.preventDefault();
                                                    const file = e.dataTransfer.files[0];
                                                    if (file && file.type.startsWith('image/')) {
                                                        setReceiptFile(file);
                                                        setReceiptPreview(URL.createObjectURL(file));
                                                    }
                                                }}
                                            >
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    style={{ display: 'none' }}
                                                    onChange={e => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            setReceiptFile(file);
                                                            setReceiptPreview(URL.createObjectURL(file));
                                                        }
                                                    }}
                                                />
                                                {receiptPreview ? (
                                                    <img src={receiptPreview} alt="Receipt" style={{ maxHeight: '200px', borderRadius: '8px', objectFit: 'contain' }} />
                                                ) : (
                                                    <>
                                                        <ImageIcon size={32} color="#9CA3AF" />
                                                        <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: '#6B7280' }}>Click or drag to upload receipt</p>
                                                    </>
                                                )}
                                            </label>

                                            <div className="mt-3">
                                                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem', display: 'block' }}>
                                                    Sender Name / Account Name
                                                </label>
                                                <input 
                                                    type="text" 
                                                    placeholder="Enter exact name used for payment"
                                                    value={paymentSenderName}
                                                    onChange={e => setPaymentSenderName(e.target.value)}
                                                    className="form-control"
                                                    style={{ borderRadius: '8px', padding: '0.6rem 0.8rem', fontSize: '0.9rem' }}
                                                />
                                            </div>

                                            <div className="d-grid gap-2 mt-4">
                                                <button
                                                    className="btn btn-primary py-2 fw-bold"
                                                    style={{ backgroundColor: '#B91C1C', border: 'none', borderRadius: '12px' }}
                                                    disabled={!receiptFile || uploadingReceipt || !paymentSenderName.trim()}
                                                    onClick={async () => {
                                                        setUploadingReceipt(true);
                                                        try {
                                                            const formData = new FormData();
                                                            formData.append('receipt', receiptFile);
                                                            formData.append('payment_sender_name', paymentSenderName);
                                                            await api.post(`/orders/${placedOrderId}/upload-receipt`, formData, {
                                                                headers: { 'Content-Type': 'multipart/form-data' }
                                                            });
                                                            setReceiptUploaded(true);
                                                            showNotification('Receipt uploaded! Waiting for confirmation.', 'success');
                                                        } catch (err) {
                                                            showNotification('Failed to upload receipt. Try again.', 'error');
                                                        } finally {
                                                            setUploadingReceipt(false);
                                                        }
                                                    }}
                                                >
                                                    {uploadingReceipt ? 'Uploading...' : 'Upload Receipt'}
                                                </button>
                                                <button
                                                    className="btn btn-outline-secondary py-2"
                                                    style={{ borderRadius: '12px' }}
                                                    onClick={() => {
                                                        setShowReceiptModal(false);
                                                        setShowSuccessModal(true);
                                                    }}
                                                >
                                                    Upload Later
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                                            <div style={{ background: '#D1FAE5', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                                                <ShoppingBag size={28} color="#059669" />
                                            </div>
                                            <h5 className="fw-bold">Receipt Uploaded!</h5>
                                            <p style={{ color: '#6B7280', fontSize: '0.85rem' }}>Waiting for the restaurant to confirm your payment.</p>
                                            <div className="d-grid gap-2 mt-3">
                                                <button
                                                    className="btn btn-primary py-2 fw-bold"
                                                    style={{ backgroundColor: '#B91C1C', border: 'none', borderRadius: '12px' }}
                                                    onClick={() => navigate(`/order-tracking?id=${placedOrderId}`)}
                                                >
                                                    Track My Order
                                                </button>
                                            </div>
                                        </div>
                                    )}
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
