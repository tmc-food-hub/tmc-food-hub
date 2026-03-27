import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useOrders } from '../../context/OrderContext';
import api from '../../api/axios';
import { Upload, Smartphone, CreditCard, ChevronLeft, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import Navbar from '../../components/sections/Navbar';
import Footer from '../../components/sections/Footer';

const PaymentUploadPage = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const navigate = useNavigate();
    const { orders, loading: ordersLoading } = useOrders();

    const [order, setOrder] = useState(null);
    const [restaurantPaymentInfo, setRestaurantPaymentInfo] = useState({});
    
    // Form state
    const [receiptFile, setReceiptFile] = useState(null);
    const [receiptPreview, setReceiptPreview] = useState(null);
    const [paymentSenderName, setPaymentSenderName] = useState('');
    const [paymentTransactionId, setPaymentTransactionId] = useState('');
    const [uploadingReceipt, setUploadingReceipt] = useState(false);

    // Find the order
    useEffect(() => {
        if (!ordersLoading && orders.length > 0) {
            const foundOrder = orders.find(o => o.id.toString() === orderId);
            if (foundOrder) {
                setOrder(foundOrder);
                // If it's COD or already has a receipt attached, they shouldn't be here
                if (foundOrder.paymentMethod === 'cod') {
                    navigate(`/order-tracking?id=${foundOrder.id}`, { replace: true });
                } else if (foundOrder.paymentReceipt) {
                    navigate(`/order-tracking?id=${foundOrder.id}`, { replace: true });
                }
            } else {
                // Not found
                Swal.fire('Error', 'Order not found', 'error').then(() => navigate('/my-orders'));
            }
        }
    }, [orderId, orders, ordersLoading, navigate]);

    // Fetch restaurant payment info
    useEffect(() => {
        if (order && order.restaurantId) {
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
    }, [order]);

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            setReceiptFile(file);
            setReceiptPreview(URL.createObjectURL(file));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setReceiptFile(file);
            setReceiptPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!receiptFile || !paymentSenderName.trim() || !paymentTransactionId.trim()) return;

        setUploadingReceipt(true);
        try {
            const formData = new FormData();
            formData.append('receipt', receiptFile);
            formData.append('payment_sender_name', paymentSenderName);
            formData.append('payment_transaction_id', paymentTransactionId);

            await api.post(`/orders/${order.id}/upload-receipt`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            Swal.fire({
                title: 'Receipt Uploaded!',
                text: 'Waiting for the restaurant to confirm your payment.',
                icon: 'success',
                confirmButtonColor: '#B91C1C'
            }).then(() => {
                navigate(`/order-tracking?id=${order.id}`);
            });
        } catch (err) {
            console.error(err);
            Swal.fire({
                title: 'Upload Failed',
                text: 'There was a problem uploading your receipt. Please try again.',
                icon: 'error',
                confirmButtonColor: '#B91C1C'
            });
        } finally {
            setUploadingReceipt(false);
        }
    };

    if (ordersLoading || !order) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F3F4F6' }}>
                <Navbar />
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="spinner-border text-danger" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F3F4F6' }}>
            <Navbar />
            
            <main style={{ flex: 1, padding: '2rem 1rem', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
                <Link to={`/order-tracking?id=${order.id}`} style={{ display: 'inline-flex', alignItems: 'center', color: '#4B5563', textDecoration: 'none', marginBottom: '1rem', fontWeight: 500 }}>
                    <ChevronLeft size={20} style={{ marginRight: '4px' }} />
                    Back to Order Tracking
                </Link>

                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                    
                    {/* Header */}
                    <div style={{ backgroundColor: '#B91C1C', color: 'white', padding: '1.5rem', textAlign: 'center' }}>
                        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Upload Payment Receipt</h1>
                        <p style={{ margin: '0.5rem 0 0', opacity: 0.9, fontSize: '0.9rem' }}>
                            Order #{order.id} • ₱{Number(order.total).toFixed(2)}
                        </p>
                    </div>

                    <div style={{ padding: '1.5rem' }}>
                        
                        {/* Payment Instructions Box */}
                        <div style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1rem', color: '#111827', margin: '0 0 1rem 0', fontWeight: 600 }}>
                                Send Payment To:
                            </h3>
                            
                            {order.paymentMethod === 'gcash' && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Smartphone size={24} color="#0066FF" />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>GCash Number</div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827' }}>
                                            {restaurantPaymentInfo.gcash_number || 'Loading...'}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {order.paymentMethod === 'maya' && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <CreditCard size={24} color="#00B900" />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>Maya Number</div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827' }}>
                                            {restaurantPaymentInfo.maya_number || 'Loading...'}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {order.paymentMethod === 'bank_transfer' && (
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <CreditCard size={24} color="#4B5563" />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>
                                            {restaurantPaymentInfo.bank_name || 'Loading Bank Name...'}
                                        </div>
                                        <div style={{ fontSize: '0.9rem', color: '#4B5563', marginBottom: '2px' }}>
                                            <strong>Acct Name:</strong> {restaurantPaymentInfo.bank_account_name || '—'}
                                        </div>
                                        <div style={{ fontSize: '0.9rem', color: '#4B5563' }}>
                                            <strong>Acct No:</strong> {restaurantPaymentInfo.bank_account_number || '—'}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Upload Form */}
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                                    Sender Name / Account Name <span style={{ color: '#B91C1C' }}>*</span>
                                </label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Juan Dela Cruz"
                                    value={paymentSenderName}
                                    onChange={e => setPaymentSenderName(e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.95rem' }}
                                    required
                                />
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                                    Transaction ID / Reference No. <span style={{ color: '#B91C1C' }}>*</span>
                                </label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. 1234567890123"
                                    value={paymentTransactionId}
                                    onChange={e => setPaymentTransactionId(e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.95rem' }}
                                    required
                                />
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginTop: '6px', color: '#6B7280', fontSize: '0.75rem' }}>
                                    <AlertCircle size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                                    <span>Please double-check the reference number on your receipt.</span>
                                </div>
                            </div>

                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                                    Upload Receipt <span style={{ color: '#B91C1C' }}>*</span>
                                </label>
                                <label
                                    style={{
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                        border: '2px dashed #D1D5DB', borderRadius: '12px', padding: '2rem', cursor: 'pointer',
                                        background: receiptPreview ? '#F9FAFB' : '#FFFFFF', transition: 'all 0.2s',
                                        minHeight: '200px'
                                    }}
                                    onDragOver={e => e.preventDefault()}
                                    onDrop={handleDrop}
                                >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={handleFileChange}
                                        required
                                    />
                                    {receiptPreview ? (
                                        <div style={{ position: 'relative', width: '100%', textAlign: 'center' }}>
                                            <img src={receiptPreview} alt="Receipt Preview" style={{ maxHeight: '250px', maxWidth: '100%', borderRadius: '8px', objectFit: 'contain', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                                            <div style={{ marginTop: '1rem', color: '#4F46E5', fontSize: '0.85rem', fontWeight: 500 }}>
                                                Click or drag to change image
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                                                <Upload size={32} color="#9CA3AF" />
                                            </div>
                                            <p style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: '#4B5563', fontWeight: 500 }}>
                                                Click to upload or drag and drop
                                            </p>
                                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#9CA3AF' }}>
                                                PNG, JPG or JPEG (max. 5MB)
                                            </p>
                                        </div>
                                    )}
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={!receiptFile || !paymentSenderName.trim() || !paymentTransactionId.trim() || uploadingReceipt}
                                style={{
                                    width: '100%',
                                    backgroundColor: (!receiptFile || !paymentSenderName.trim() || !paymentTransactionId.trim() || uploadingReceipt) ? '#E5E7EB' : '#B91C1C',
                                    color: (!receiptFile || !paymentSenderName.trim() || !paymentTransactionId.trim() || uploadingReceipt) ? '#9CA3AF' : 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    padding: '1rem',
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    cursor: (!receiptFile || !paymentSenderName.trim() || !paymentTransactionId.trim() || uploadingReceipt) ? 'not-allowed' : 'pointer',
                                    transition: 'background-color 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}
                            >
                                {uploadingReceipt ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        Submit Payment Proof
                                    </>
                                )}
                            </button>
                        </form>

                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PaymentUploadPage;
