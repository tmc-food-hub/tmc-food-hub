import React, { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import {
    Check, Clock, Circle, Phone, PhoneOff,
    Star, X, MessageCircle, ChevronRight, Package,
    Upload, ImageIcon, Smartphone, CreditCard
} from 'lucide-react';
import api from '../../api/axios';
import { useOrders } from '../../context/OrderContext';
import { CartContext } from '../../components/ui/CartContext';
import { useContext } from 'react';
import Navbar from '../../components/sections/Navbar';
import Footer from '../../components/sections/Footer';
import BackToTop from '../../components/ui/BackToTop';
import styles from './OrderTrackingPage.module.css';
import Swal from 'sweetalert2';

/* ------------------------------------------------
   Fix Leaflet default marker icons in bundlers
   ------------------------------------------------ */
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

/* ------------------------------------------------
   Custom map markers
   ------------------------------------------------ */
const restaurantIcon = new L.DivIcon({
    className: styles.customMarker,
    html: `<div style="background:#8B1F1C;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
});

const riderIcon = new L.DivIcon({
    className: styles.customMarker,
    html: `<div style="background:#F59E0B;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>
           </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
});

const destinationIcon = new L.DivIcon({
    className: styles.customMarker,
    html: `<div style="background:#16a34a;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
});

/* ------------------------------------------------
   Mock Data
   ------------------------------------------------ */
const ORDER_DATA = {
    id: 'TMC-88291',
    estimatedArrival: 8,
    restaurant: {
        name: "Mama Sita's Kitchen",
        coords: [14.5547, 121.0244],   // Makati area, Manila
    },
    rider: {
        coords: [14.5640, 121.0350],   // rider en route
    },
    destination: {
        coords: [14.5800, 121.0500],   // Palo Alto area
    },
    items: [
        {
            id: 1,
            name: 'Grilled Steak',
            quantity: 1,
            price: 12.00,
            image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=120&h=120&fit=crop',
        },
        {
            id: 2,
            name: 'Black Iced Coffee',
            quantity: 1,
            price: 3.00,
            image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=120&h=120&fit=crop',
        },
    ],
    subtotal: 15.00,
    deliveryFee: 3.00,
    discount: 5.00,
    promoCode: 'PROMO5',
    totalAmount: 13.00,
    rider_info: {
        name: 'Ricardo Gomez',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop',
        vehicle: 'Honda PCX',
        plate: 'NY-8291',
        rating: 4.8,
        phone: '+63 912 345 6789'
    },
    statuses: [
        {
            label: 'Order Placed',
            time: '',
            description: 'Waiting for restaurant confirmation',
            state: 'active',
        },
        {
            label: 'Order Confirmed',
            time: '',
            description: 'Kitchen is preparing your food',
            state: 'pending',
        },
        {
            label: 'Out for Delivery',
            time: '',
            description: 'Your rider is on the way',
            state: 'pending',
        },
        {
            label: 'Delivered',
            time: '',
            description: 'Order will be delivered soon',
            state: 'pending',
        },
    ],
};

/* Route polyline points (simplified path between restaurant → rider → destination) */
const ROUTE_POINTS = [
    ORDER_DATA.restaurant.coords,
    [14.5570, 121.0280],
    [14.5600, 121.0320],
    ORDER_DATA.rider.coords,
    [14.5680, 121.0400],
    [14.5730, 121.0450],
    ORDER_DATA.destination.coords,
];

/* Split route into completed (restaurant→rider) and remaining (rider→destination) */
const riderIdx = ROUTE_POINTS.findIndex(
    (p) => p[0] === ORDER_DATA.rider.coords[0] && p[1] === ORDER_DATA.rider.coords[1]
);
const COMPLETED_ROUTE = ROUTE_POINTS.slice(0, riderIdx + 1);
const REMAINING_ROUTE = ROUTE_POINTS.slice(riderIdx);

/* ------------------------------------------------
   Component
   ------------------------------------------------ */
function OrderTrackingPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const orderId = searchParams.get('id');
    const { orders, cancelOrder, loading } = useOrders();
    const { reorder } = useContext(CartContext);

    // Find order from context
    const contextOrder = orders.find(o =>
        String(o.id) === String(orderId) ||
        String(o.orderNumber) === String(orderId)
    );

    // Build display data merging context order with mock map coords
    const order = contextOrder ? {
        id: contextOrder.id,
        orderNumber: contextOrder.orderNumber,
        estimatedArrival: contextOrder.estimatedArrival || 8,
        restaurant: {
            name: contextOrder.restaurant,
            coords: ORDER_DATA.restaurant.coords,
        },
        rider: { coords: ORDER_DATA.rider.coords },
        destination: { coords: ORDER_DATA.destination.coords },
        items: contextOrder.items.map(i => ({ id: i.id, name: i.name, quantity: i.quantity, price: i.price, image: i.image })),
        subtotal: contextOrder.subtotal,
        deliveryFee: contextOrder.deliveryFee,
        discount: contextOrder.discount || 0,
        promoCode: 'PROMO5',
        totalAmount: contextOrder.total,
        rider_info: contextOrder.rider || ORDER_DATA.rider_info,
        statuses: contextOrder.timeline || ORDER_DATA.statuses,
        status: contextOrder.status,
        deliveryAddress: contextOrder.deliveryAddress,
        restaurantId: contextOrder.restaurantId,
        paymentMethod: contextOrder.paymentMethod || 'cod',
        paymentStatus: contextOrder.paymentStatus || 'paid',
        paymentReceipt: contextOrder.paymentReceipt || null,
    } : null;

    const [cancelTimer, setCancelTimer] = useState(120);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const timerRef = useRef(null);
    const prevPaymentStatusRef = useRef(order?.paymentStatus);

    // New receipt upload states
    const [receiptFile, setReceiptFile] = useState(null);
    const [receiptPreview, setReceiptPreview] = useState(null);
    const [uploadingReceipt, setUploadingReceipt] = useState(false);
    const [paymentSenderName, setPaymentSenderName] = useState('');
    const [restaurantPaymentInfo, setRestaurantPaymentInfo] = useState({});

    // Fetch restaurant payment info if order is online payment
    useEffect(() => {
        if (order && order.paymentMethod !== 'cod' && !order.paymentReceipt) {
            const fetchPaymentInfo = async () => {
                try {
                    const res = await api.get(`/restaurants/${order.restaurantId}/payment-methods`);
                    setRestaurantPaymentInfo(res.data);
                } catch (err) {
                    console.error("Failed to load payment info", err);
                }
            };
            fetchPaymentInfo();
        }
    }, [order?.id, order?.paymentMethod, order?.paymentReceipt, order?.restaurantId]);

    // Watch for payment confirmation updates
    useEffect(() => {
        if (!order) return;
        if (prevPaymentStatusRef.current === 'pending_verification' && order.paymentStatus === 'paid') {
            Swal.fire({
                title: 'Payment Confirmed!',
                text: 'The restaurant has verified your payment. Your order is now processing.',
                icon: 'success',
                confirmButtonText: 'Great',
                confirmButtonColor: '#B91C1C'
            }).then(() => {
                window.location.reload();
            });
        }
        prevPaymentStatusRef.current = order.paymentStatus;
    }, [order?.paymentStatus]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setCancelTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, []);

    const formatTimer = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };


    const renderStatusIcon = (state) => {
        if (state === 'completed') {
            return (
                <div className={`${styles.statusCircle} ${styles.statusCompleted}`}>
                    <Check size={14} strokeWidth={3} />
                </div>
            );
        }
        if (state === 'active') {
            return (
                <div className={`${styles.statusCircle} ${styles.statusActive}`}>
                    <Circle size={10} fill="white" strokeWidth={0} />
                </div>
            );
        }
        return (
            <div className={`${styles.statusCircle} ${styles.statusPending}`}>
                <Clock size={12} />
            </div>
        );
    };

    if (loading && !contextOrder) {
        return (
            <div className="site-wrap">
                <Navbar />
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                    <div className="text-center">
                        <div className="spinner-border text-primary mb-3" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="text-muted">Fetching your order status...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!loading && !order) {
        return (
            <div className="site-wrap">
                <Navbar />
                <div className="container py-5 text-center" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div className="mb-4">
                        <Package size={64} className="text-muted opacity-25" />
                    </div>
                    <h2 className="fw-bold mb-3">Order Not Found</h2>
                    <p className="text-muted mb-4">We couldn't find the order with ID: <span className="fw-bold text-dark">{orderId}</span></p>
                    <div className="d-flex gap-3 justify-content-center">
                        <button className="btn btn-primary px-4 py-2" style={{ backgroundColor: '#B91C1C', border: 'none' }} onClick={() => navigate('/my-orders')}>
                            View My Orders
                        </button>
                        <button className="btn btn-outline-secondary px-4 py-2" onClick={() => navigate('/')}>
                            Back to Home
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const mapCenter = order.rider.coords;

    return (
        <>
            <div className="site-wrap">
                <Navbar />

                <main className={styles.orderTrackingPage}>
                    <div className="container-lg">

                        {/* Page Header */}
                        <div className={styles.pageHeader} data-aos="fade-up">
                            <div className={styles.breadcrumbs}>
                                <Link to="/">Home</Link>
                                <span className="mx-2">/</span>
                                <span className={styles.current}>Order Tracking</span>
                            </div>
                            <h1 className={styles.title}>Order Tracking</h1>
                            <p className={styles.subtitle}>
                                Track your order in real time from kitchen to doorstep.
                            </p>
                        </div>

                        {/* Map + Order Summary Row */}
                        <div className="row" data-aos="fade-up" data-aos-delay="100">

                            {/* Left Column — Map */}
                            <div className="col-lg-7 mb-4 mb-lg-0">
                                <div className={styles.mapCard}>
                                    {/* Arrival Badge */}
                                    <div className={styles.arrivalBadge}>
                                        <div className={styles.arrivalDot}></div>
                                        <div>
                                            <span className={styles.arrivalTitle}>
                                                {order.status === 'Delivered' ? 'Order Delivered' : `Arriving in ${order.estimatedArrival} mins`}
                                            </span>
                                            <span className={styles.arrivalSub}>
                                                Order #{order.orderNumber || order.id} • {order.status}
                                            </span>
                                        </div>
                                    </div>

                                    <MapContainer
                                        center={mapCenter}
                                        zoom={13}
                                        scrollWheelZoom={false}
                                        className={styles.mapContainer}
                                        zoomControl={true}
                                    >
                                        <TileLayer
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />

                                        {/* Restaurant marker */}
                                        <Marker position={order.restaurant.coords} icon={restaurantIcon}>
                                            <Popup>{order.restaurant.name}</Popup>
                                        </Marker>

                                        {/* Rider marker */}
                                        <Marker position={order.rider.coords} icon={riderIcon}>
                                            <Popup>Rider: {order.rider_info.name}</Popup>
                                        </Marker>

                                        {/* Destination marker */}
                                        <Marker position={order.destination.coords} icon={destinationIcon}>
                                            <Popup>Your Location</Popup>
                                        </Marker>

                                        {/* Completed route (solid) */}
                                        <Polyline
                                            positions={COMPLETED_ROUTE}
                                            pathOptions={{ color: '#8B1F1C', weight: 4, opacity: 0.8 }}
                                        />

                                        {/* Remaining route (dashed) */}
                                        <Polyline
                                            positions={REMAINING_ROUTE}
                                            pathOptions={{ color: '#8B1F1C', weight: 3, dashArray: '8 8', opacity: 0.5 }}
                                        />
                                    </MapContainer>
                                </div>
                            </div>

                            {/* Right Column — Order Summary */}
                            <div className="col-lg-5">
                                <div className={styles.summaryCard}>
                                    <h2 className={styles.summaryTitle}>Order Summary</h2>

                                    {/* Items */}
                                    <div className={styles.summaryItems}>
                                        {order.items.map((item) => (
                                            <div key={item.id} className={styles.summaryItem}>
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className={styles.summaryItemImg}
                                                />
                                                <div>
                                                    <div className={styles.summaryItemName}>{item.name}</div>
                                                    <div className={styles.summaryItemMeta}>
                                                        x{item.quantity} • ${Number(item.price).toFixed(2)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Restaurant Name */}
                                    <div className={styles.summaryBreakdown}>
                                        <div className={styles.summaryRow}>
                                            <span>Restaurant Name</span>
                                            <span className={styles.restaurantName}>
                                                {order.restaurant.name}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Breakdown */}
                                    <div className={styles.summaryBreakdown}>
                                        <div className={styles.summaryRow}>
                                            <span>Subtotal</span>
                                            <span>${Number(order.subtotal).toFixed(2)}</span>
                                        </div>
                                        <div className={styles.summaryRow}>
                                            <span>Delivery Fee</span>
                                            <span>${Number(order.deliveryFee).toFixed(2)}</span>
                                        </div>
                                        {order.discount > 0 && (
                                            <div className={styles.summaryRow}>
                                                <span>Discount ({order.promoCode})</span>
                                                <span className={styles.discountValue}>
                                                    -${Number(order.discount).toFixed(2)}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Total */}
                                    <div className={styles.totalRow}>
                                        <span className={styles.totalLabel}>Total Amount</span>
                                        <span className={styles.totalValue}>
                                            ${Number(order.totalAmount).toFixed(2)}
                                        </span>
                                    </div>

                                    {/* Payment Status / Upload Receipt */}
                                    {order.paymentMethod && order.paymentMethod !== 'cod' && (
                                        <div style={{ marginTop: '1rem', padding: '1rem', background: '#F9FAFB', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: order.paymentReceipt ? '0.75rem' : '1rem' }}>
                                                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111827' }}>
                                                    Payment: {order.paymentMethod === 'gcash' ? 'GCash' : order.paymentMethod === 'maya' ? 'Maya' : 'Bank Transfer'}
                                                </span>
                                                {order.paymentReceipt && (
                                                    <span style={{
                                                        fontSize: '0.75rem', fontWeight: 700, padding: '4px 12px', borderRadius: '99px',
                                                        background: order.paymentStatus === 'paid' ? '#D1FAE5' : order.paymentStatus === 'rejected' ? '#FEE2E2' : '#FEF3C7',
                                                        color: order.paymentStatus === 'paid' ? '#065F46' : order.paymentStatus === 'rejected' ? '#991B1B' : '#92400E',
                                                    }}>
                                                        {order.paymentStatus === 'paid' ? '✓ Confirmed' : order.paymentStatus === 'rejected' ? '✗ Rejected' : '⏳ Awaiting Confirmation'}
                                                    </span>
                                                )}
                                            </div>

                                            {order.paymentReceipt ? (
                                                <div style={{ textAlign: 'center' }}>
                                                    <img src={order.paymentReceipt} alt="Payment receipt" style={{ maxHeight: '160px', borderRadius: '8px', objectFit: 'contain', cursor: 'pointer', border: '1px solid #E5E7EB' }} onClick={() => window.open(order.paymentReceipt, '_blank')} />
                                                    <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '8px', fontWeight: 500 }}>Click to view full receipt</p>
                                                </div>
                                            ) : (
                                                <div style={{ padding: '1rem 0', textAlign: 'center' }}>
                                                    <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '1rem' }}>
                                                        Please upload your proof of payment to proceed with your order.
                                                    </p>
                                                    <button
                                                        className="btn btn-primary"
                                                        style={{ backgroundColor: '#B91C1C', border: 'none', borderRadius: '8px', padding: '0.75rem 1.5rem', fontSize: '0.95rem', fontWeight: 600 }}
                                                        onClick={() => navigate(`/payment-upload?orderId=${order.id}`)}
                                                    >
                                                        Upload Payment Receipt
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Order Status + Rider Info Row */}
                        <div className="row mt-4" data-aos="fade-up" data-aos-delay="200">

                            {/* Left Column — Order Status */}
                            <div className="col-lg-7 mb-4 mb-lg-0">
                                <div className={styles.statusCard}>
                                    <h2 className={styles.statusCardTitle}>Order Status</h2>

                                    <div className={styles.timeline}>
                                        {order.statuses.map((status, index) => (
                                            <div
                                                key={index}
                                                className={`${styles.timelineStep} ${styles[`timeline${status.state.charAt(0).toUpperCase() + status.state.slice(1)}`]}`}
                                            >
                                                {renderStatusIcon(status.state)}
                                                <div className={styles.timelineContent}>
                                                    <div className={styles.timelineLabel}>
                                                        {status.label}
                                                    </div>
                                                    <div className={styles.timelineDesc}>
                                                        {status.time && (
                                                            <span className={styles.timelineTime}>
                                                                {status.time}
                                                            </span>
                                                        )}
                                                        {status.time && ' • '}
                                                        {status.description}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column — Rider Info */}
                            <div className="col-lg-5">
                                <div className={styles.riderCard}>
                                    <div className={styles.riderHeader}>
                                        <img
                                            src={order.rider_info.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop'}
                                            alt={order.rider_info.name}
                                            className={styles.riderAvatar}
                                        />
                                        <div className={styles.riderDetails}>
                                            <div className={styles.riderNameRow}>
                                                <span className={styles.riderName}>
                                                    {order.rider_info.name}
                                                </span>
                                                <span className={styles.riderRating}>
                                                    <Star size={12} fill="#F59E0B" stroke="#F59E0B" />
                                                    {order.rider_info.rating}
                                                </span>
                                            </div>
                                            <div className={styles.riderMeta}>
                                                {order.rider_info.vehicle} •{' '}
                                                {order.rider_info.plate}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons - Hide if delivered */}
                                    {order.status !== 'Delivered' && order.rider_info?.phone && (
                                        <div className={styles.riderContactInfo} style={{ marginBottom: '1.25rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4B5563', fontSize: '0.9rem', padding: '12px', backgroundColor: '#F3F4F6', borderRadius: '8px', outline: '1px solid #E5E7EB' }}>
                                                <Phone size={16} color="#B91C1C" />
                                                <span>Contact Rider: <strong style={{color: '#1a1a1a'}}>{order.rider_info.phone}</strong></span>
                                            </div>
                                        </div>
                                    )}

                                    <div className={styles.riderDivider}></div>

                                    {/* Footer Actions */}
                                    {order.status === 'Delivered' ? (
                                        <button 
                                            className={styles.reorderBtn}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                backgroundColor: '#B91C1C',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                fontWeight: '600',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px',
                                                marginBottom: '1rem'
                                            }}
                                            onClick={() => {
                                                reorder(order.items, order.restaurant.name, order.restaurantId);
                                                navigate(`/checkout?restaurant=${encodeURIComponent(order.restaurant.name)}&restaurantId=${order.restaurantId}`);
                                            }}
                                        >
                                            <Package size={16} />
                                            Order Again
                                        </button>
                                    ) : (
                                        <button
                                            className={styles.cancelBtn}
                                            disabled={cancelTimer === 0 || order.status === 'Cancelled' || order.status === 'Out for Delivery'}
                                            onClick={() => setShowCancelModal(true)}
                                        >
                                            <X size={16} />
                                            Cancel Order
                                            {cancelTimer > 0 && order.status === 'Pending' && (
                                                <span className={styles.cancelTimer}>
                                                    {formatTimer(cancelTimer)}
                                                </span>
                                            )}
                                        </button>
                                    )}

                                    <p className={styles.supportText}>
                                        {order.status === 'Delivered' ? 'How was your meal?' : 'Need help with your order?'}
                                        {' '}
                                        <Link to="/support" className={styles.supportLink}>
                                            {order.status === 'Delivered' ? 'Leave Feedback' : 'Contact Support'}
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </main>

                <Footer />
            </div>
            <BackToTop />

            {/* Cancel Order Confirmation Modal */}
            {showCancelModal && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 1060,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
                    animation: 'fadeIn 0.2s ease'
                }} onClick={() => setShowCancelModal(false)}>
                    <div style={{
                        background: '#fff', borderRadius: '20px', padding: '2rem',
                        maxWidth: '400px', width: '90%', textAlign: 'center',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                        animation: 'scaleIn 0.2s ease'
                    }} onClick={e => e.stopPropagation()}>
                        <div style={{
                            width: '56px', height: '56px', borderRadius: '50%',
                            background: '#FEE2E2', color: '#DC2626',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 1rem'
                        }}>
                            <X size={28} />
                        </div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111827', margin: '0 0 0.4rem' }}>
                            Cancel This Order?
                        </h3>
                        <p style={{ fontSize: '0.9rem', color: '#6B7280', margin: '0 0 1.5rem' }}>
                            This action cannot be undone. Your order will be cancelled and any charges will be refunded.
                        </p>
                        <div style={{ display: 'flex', gap: '0.65rem' }}>
                            <button
                                onClick={() => setShowCancelModal(false)}
                                style={{
                                    flex: 1, padding: '0.7rem', borderRadius: '10px',
                                    border: '1.5px solid #D1D5DB', background: '#fff',
                                    color: '#374151', fontSize: '0.88rem', fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                Keep Order
                            </button>
                            <button
                                onClick={async () => {
                                    setShowCancelModal(false);
                                    if (contextOrder && cancelTimer > 0) {
                                        await cancelOrder(contextOrder.id);
                                        navigate('/my-orders');
                                    }
                                }}
                                style={{
                                    flex: 1, padding: '0.7rem', borderRadius: '10px',
                                    border: 'none', background: '#991B1B',
                                    color: '#fff', fontSize: '0.88rem', fontWeight: 600,
                                    cursor: 'pointer', boxShadow: '0 2px 6px rgba(153,27,27,0.3)'
                                }}
                            >
                                Yes, Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default OrderTrackingPage;
