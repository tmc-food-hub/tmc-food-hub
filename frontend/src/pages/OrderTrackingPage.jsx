import React, { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import {
    Check, Clock, Circle, Phone, PhoneOff,
    Star, X, MessageCircle, ChevronRight
} from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import Navbar from '../components/sections/Navbar';
import Footer from '../components/sections/Footer';
import BackToTop from '../components/ui/BackToTop';
import styles from './OrderTrackingPage.module.css';

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
    },
    statuses: [
        {
            label: 'Order Placed',
            time: '12:30 PM',
            description: 'Waiting for restaurant confirmation',
            state: 'completed',
        },
        {
            label: 'Order Confirmed',
            time: '12:35 PM',
            description: 'Restaurant is preparing your food',
            state: 'completed',
        },
        {
            label: 'Being Prepared',
            time: '12:43 PM',
            description: 'Your meal is being cooked',
            state: 'completed',
        },
        {
            label: 'Picked Up',
            time: '',
            description: 'Your rider is on the way',
            state: 'active',
        },
        {
            label: 'Delivered',
            time: '',
            description: 'Pending',
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
    const { orders, cancelOrder } = useOrders();

    // Find order from context or fall back to mock
    const contextOrder = orders.find(o => o.id === orderId);

    // Build display data merging context order with mock map coords
    const order = contextOrder ? {
        id: contextOrder.id,
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
    } : ORDER_DATA;

    const [cancelTimer, setCancelTimer] = useState(120);
    const timerRef = useRef(null);

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

    const mapCenter = order.rider.coords;

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
                                                Arriving in {order.estimatedArrival} mins
                                            </span>
                                            <span className={styles.arrivalSub}>
                                                Order #{order.id} • On the way
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
                                                        x{item.quantity} • ${item.price.toFixed(2)}
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
                                            <span>${order.subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className={styles.summaryRow}>
                                            <span>Delivery Fee</span>
                                            <span>${order.deliveryFee.toFixed(2)}</span>
                                        </div>
                                        {order.discount > 0 && (
                                            <div className={styles.summaryRow}>
                                                <span>Discount ({order.promoCode})</span>
                                                <span className={styles.discountValue}>
                                                    -${order.discount.toFixed(2)}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Total */}
                                    <div className={styles.totalRow}>
                                        <span className={styles.totalLabel}>Total Amount</span>
                                        <span className={styles.totalValue}>
                                            ${order.totalAmount.toFixed(2)}
                                        </span>
                                    </div>
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

                                    {/* Action Buttons */}
                                    <div className={styles.riderActions}>
                                        <button className={styles.callBtn}>
                                            <Phone size={16} />
                                            Call Rider
                                        </button>
                                        <button className={styles.callBtnOutline}>
                                            <MessageCircle size={16} />
                                            Message
                                        </button>
                                    </div>

                                    <div className={styles.riderDivider}></div>

                                    {/* Cancel Order */}
                                    <button
                                        className={styles.cancelBtn}
                                        disabled={cancelTimer === 0 || order.status === 'Cancelled'}
                                        onClick={() => {
                                            if (contextOrder && cancelTimer > 0) {
                                                cancelOrder(contextOrder.id);
                                                navigate('/my-orders');
                                            }
                                        }}
                                    >
                                        <X size={16} />
                                        Cancel Order
                                        {cancelTimer > 0 && (
                                            <span className={styles.cancelTimer}>
                                                {formatTimer(cancelTimer)}
                                            </span>
                                        )}
                                    </button>

                                    <p className={styles.supportText}>
                                        Need help with your order?{' '}
                                        <Link to="/support" className={styles.supportLink}>
                                            Contact Support
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
        </>
    );
}

export default OrderTrackingPage;
