import React, { useState, useEffect } from 'react';
import { MapPin, Layers, X, AlertCircle, Check, Bell, RefreshCw, Eye } from 'lucide-react';
import { jsPDF } from 'jspdf';
import api from '../../../api/axios';
import { STATUS_ORDER, statusMeta } from './shared';
import { useOrders } from '../../../context/OrderContext';
import styles from '../OwnerDashboard.module.css';

function formatCurrency(amount) {
    return `PHP ${Number(amount || 0).toFixed(2)}`;
}

function getPaymentMethodLabel(method) {
    if (method === 'cod') return 'Cash on Delivery';
    if (method === 'gcash') return 'GCash';
    if (method === 'maya') return 'Maya';
    if (method === 'bank_transfer') return 'Bank Transfer';
    return 'Unknown';
}

function getPaymentStatusLabel(status) {
    if (status === 'paid') return 'Confirmed';
    if (status === 'rejected') return 'Rejected';
    if (status === 'awaiting_confirmation') return 'Awaiting Confirmation';
    return status || 'N/A';
}

async function loadImageAsDataUrl(url) {
    const response = await fetch(url);
    const blob = await response.blob();

    return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

async function getImageDimensions(dataUrl) {
    return await new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve({ width: image.width, height: image.height });
        image.onerror = reject;
        image.src = dataUrl;
    });
}

export default function OrdersSection({ store }) {
    const { orders: allOrders, loading, fetchOrders, updateStatus } = useOrders();
    const [orders, setOrders] = useState([]);
    
    // Backend already filters orders by this owner's restaurant_owner_id.
    // No client-side filtering needed.
    useEffect(() => {
        setOrders(allOrders || []);
    }, [allOrders]);

    const [filt, setFilt] = useState('All');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [detailTab, setDetailTab] = useState('order'); // 'order' or 'payment'

    const STATUS_TABS = [
        { key: 'All', label: 'All' },
        { key: 'Pending', label: 'Pending' },
        { key: 'Order Confirmed', label: 'Confirmed' },
        { key: 'Out for Delivery', label: 'Out for Delivery' },
        { key: 'Delivered', label: 'Complete' }
    ];

    const counts = { All: orders.length };
    STATUS_ORDER.forEach(s => { counts[s] = orders.filter(o => o.status === s).length; });

    const displayed = filt === 'All' ? orders : orders.filter(o => o.status === filt);

    const getInitials = (name) => {
        if (!name) return '??';
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    const hasProofOfPaymentTab = Boolean(selectedOrder?.paymentMethod && selectedOrder.paymentMethod !== 'cod');

    useEffect(() => {
        if (!selectedOrder) {
            setDetailTab('order');
            return;
        }

        if (selectedOrder.paymentMethod === 'cod' && detailTab !== 'order') {
            setDetailTab('order');
        }
    }, [selectedOrder, detailTab]);

    function openOrderDetails(order) {
        setSelectedOrder(order);
        setDetailTab('order');
    }

    async function handlePrintReceipt() {
        if (!selectedOrder) return;

        const doc = new jsPDF({ unit: 'pt', format: 'a4' });
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 40;
        const contentWidth = pageWidth - margin * 2;
        let y = 46;

        const ensureSpace = (height = 24) => {
            if (y + height > pageHeight - 50) {
                doc.addPage();
                y = 46;
            }
        };

        const addDivider = () => {
            ensureSpace(20);
            doc.setDrawColor(229, 231, 235);
            doc.line(margin, y, pageWidth - margin, y);
            y += 18;
        };

        const addSectionTitle = (title) => {
            ensureSpace(24);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(11);
            doc.setTextColor(17, 24, 39);
            doc.text(title.toUpperCase(), margin, y);
            y += 16;
        };

        const addKeyValue = (label, value) => {
            ensureSpace(18);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(107, 114, 128);
            doc.text(label, margin, y);
            doc.setTextColor(17, 24, 39);
            doc.text(String(value || 'N/A'), pageWidth - margin, y, { align: 'right' });
            y += 16;
        };

        const addParagraph = (label, value) => {
            const lines = doc.splitTextToSize(String(value || 'N/A'), contentWidth);
            ensureSpace(18 + lines.length * 12);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.setTextColor(17, 24, 39);
            doc.text(label, margin, y);
            y += 14;
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(75, 85, 99);
            doc.text(lines, margin, y);
            y += lines.length * 12 + 8;
        };

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.setTextColor(17, 24, 39);
        doc.text(store?.name || selectedOrder.restaurant || 'Restaurant Receipt', margin, y);
        y += 18;

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(107, 114, 128);
        doc.text(`Order Receipt • ${selectedOrder.orderNumber}`, margin, y);
        y += 24;

        addDivider();

        addSectionTitle('Order Summary');
        addKeyValue('Order ID', selectedOrder.orderNumber);
        addKeyValue('Status', selectedOrder.status);
        addKeyValue('Placed', selectedOrder.placedAt ? new Date(selectedOrder.placedAt).toLocaleString() : selectedOrder.time);
        addKeyValue('Payment Method', getPaymentMethodLabel(selectedOrder.paymentMethod));
        addKeyValue('Payment Status', getPaymentStatusLabel(selectedOrder.paymentStatus));

        addDivider();

        addSectionTitle('Customer');
        addKeyValue('Name', selectedOrder.customerName || selectedOrder.customer);
        addKeyValue('Phone', selectedOrder.contactNumber || selectedOrder.customerPhone || 'N/A');
        addParagraph('Delivery Address', selectedOrder.deliveryAddress || selectedOrder.customerAddress || 'N/A');

        if (selectedOrder.specialInstructions || selectedOrder.note) {
            addParagraph('Special Instructions', selectedOrder.specialInstructions || selectedOrder.note);
        }

        addDivider();

        addSectionTitle(`Items (${selectedOrder.items.reduce((sum, item) => sum + item.quantity, 0)})`);
        selectedOrder.items.forEach((item) => {
            const itemLines = doc.splitTextToSize(
                `${item.quantity} x ${item.name}${item.variations?.name ? ` • ${item.variations.name}` : ''}`,
                contentWidth - 90
            );

            ensureSpace(24 + itemLines.length * 12);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.setTextColor(17, 24, 39);
            doc.text(itemLines, margin, y);
            doc.text(formatCurrency(item.quantity * item.price), pageWidth - margin, y, { align: 'right' });
            y += itemLines.length * 12;

            if (item.variations?.addOns?.length) {
                const addOnLines = doc.splitTextToSize(
                    `Add-ons: ${item.variations.addOns.map((addOn) => addOn.name).join(', ')}`,
                    contentWidth - 20
                );
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(9);
                doc.setTextColor(107, 114, 128);
                doc.text(addOnLines, margin + 12, y);
                y += addOnLines.length * 11;
            }

            y += 8;
        });

        addDivider();

        addSectionTitle('Totals');
        addKeyValue('Subtotal', formatCurrency(selectedOrder.subtotal));
        addKeyValue('Delivery Fee', formatCurrency(selectedOrder.deliveryFee));
        if (Number(selectedOrder.discount) > 0) {
            addKeyValue('Discount', `- ${formatCurrency(selectedOrder.discount)}`);
        }

        ensureSpace(22);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(17, 24, 39);
        doc.text('Total Amount', margin, y);
        doc.text(formatCurrency(selectedOrder.total), pageWidth - margin, y, { align: 'right' });
        y += 20;

        if (hasProofOfPaymentTab) {
            addDivider();
            addSectionTitle('Online Payment');
            addKeyValue('Method', getPaymentMethodLabel(selectedOrder.paymentMethod));
            addKeyValue('Status', getPaymentStatusLabel(selectedOrder.paymentStatus));

            if (selectedOrder.paymentSenderName) {
                addKeyValue('Sender Name', selectedOrder.paymentSenderName);
            }

            if (selectedOrder.paymentTransactionId) {
                addParagraph('Reference Number', selectedOrder.paymentTransactionId);
            }

            if (selectedOrder.paymentReceipt) {
                try {
                    const imageDataUrl = await loadImageAsDataUrl(selectedOrder.paymentReceipt);
                    const imageDimensions = await getImageDimensions(imageDataUrl);
                    const imageFormat = imageDataUrl.startsWith('data:image/png') ? 'PNG' : 'JPEG';
                    doc.addPage();
                    y = 46;

                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(16);
                    doc.setTextColor(17, 24, 39);
                    doc.text('Proof of Payment', margin, y);
                    y += 24;

                    const imageMaxWidth = contentWidth;
                    const imageMaxHeight = pageHeight - y - 60;
                    const scale = Math.min(
                        imageMaxWidth / imageDimensions.width,
                        imageMaxHeight / imageDimensions.height
                    );
                    const renderWidth = imageDimensions.width * scale;
                    const renderHeight = imageDimensions.height * scale;
                    const imageX = margin + ((imageMaxWidth - renderWidth) / 2);

                    doc.addImage(
                        imageDataUrl,
                        imageFormat,
                        imageX,
                        y,
                        renderWidth,
                        renderHeight,
                        undefined,
                        'FAST'
                    );
                } catch (error) {
                    console.error('Failed to attach payment receipt image to PDF', error);
                }
            }
        }

        doc.save(`${selectedOrder.orderNumber}-receipt.pdf`);
    }

    return (
        <div className={styles.ordersContainer}>
            {/* Header Area */}
            <div className={styles.ordersHeaderArea}>
                <div>
                    <h2 className={styles.ordersTitle}>Orders</h2>
                    <p className={styles.ordersSub}>Manage incoming orders, track their status, and ensure timely fulfillment.</p>
                </div>
            </div>

            {/* Controls Row */}
            <div className={styles.ordersControlsRow}>
                <div className={styles.ordersTabs}>
                    {STATUS_TABS.map(tab => (
                        <button
                            key={tab.key}
                            className={`${styles.orderTabBtn} ${filt === tab.key ? styles.orderTabActive : ''}`}
                            onClick={() => setFilt(tab.key)}
                        >
                            {tab.label} {tab.key === 'Pending' && counts['Pending'] > 0 && <span className={styles.tabBadge}>{counts['Pending']}</span>}
                        </button>
                    ))}
                </div>
                <div className={styles.ordersFiltersRight}>
                    <button className={styles.dateFilterBtn}>
                        <MapPin size={16} /> {/* Placeholder for calendar icon */} Today, Mar 5
                    </button>
                    <button className={styles.settingsFilterBtn}>
                        <Layers size={16} /> Filters
                    </button>
                </div>
            </div>

            {/* Orders Content */}
            <div className={styles.ordersContentArea} style={{ position: 'relative' }}>
                {/* Refreshing Indicator */}
                {loading && orders.length > 0 && (
                    <div className={styles.refreshingIndicator}>
                        <RefreshCw size={14} className={styles.spinning} />
                        <span>Updating...</span>
                    </div>
                )}

                {loading && orders.length === 0 ? (
                    <div className={styles.loadingContainer}>
                        <div className={styles.spinner}></div>
                        <p className={styles.loadingText}>Fetching your orders...</p>
                    </div>
                ) : displayed.length === 0 ? (
                    <div className={styles.emptyStateContainer}>
                        <div className={styles.emptyStateIconCircle}>
                            <Bell size={32} />
                        </div>
                        <h3 className={styles.emptyStateTitle}>No orders yet</h3>
                        <p className={styles.emptyStateText}>
                            Pending incoming orders from customers will appear here automatically. Hang tight!
                        </p>
                    </div>
                ) : (
                    /* Desktop Table & Mobile Cards Wrapper */
                    <>
                        <div className={styles.infoCardDesktop}>
                            <div className={styles.tableWrap}>
                                <table className={styles.ordersMainTable}>
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Customer</th>
                                            <th>Items</th>
                                            <th>Total</th>
                                            <th>Status</th>
                                            <th>Time</th>
                                            <th style={{ textAlign: 'right' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {displayed.map(o => {
                                            const meta = statusMeta(o.status);
                                            const actionBtn = meta.next ? (
                                                <button 
                                                    className={styles.btnActionAccept}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        updateStatus(o.id, meta.next);
                                                    }}
                                                >
                                                    {meta.nextLabel}
                                                </button>
                                            ) : null;

                                            return (
                                                <tr key={o.id} className={styles.ordersTableRow} onClick={() => openOrderDetails(o)} style={{ cursor: 'pointer' }}>
                                                    <td className={styles.orderIdCell}>{o.orderNumber}</td>
                                                    <td>
                                                        <div className={styles.customerCell}>
                                                            <div className={styles.customerAvatarInitials}>
                                                                {getInitials(o.customer)}
                                                            </div>
                                                            <span className={styles.customerName}>{o.customer}</span>
                                                            {o.note && (
                                                                <div style={{ 
                                                                    fontSize: '0.7rem', 
                                                                    color: '#B91C1C', 
                                                                    marginTop: '2px', 
                                                                    fontStyle: 'italic',
                                                                    maxWidth: '200px',
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    whiteSpace: 'nowrap'
                                                                }} title={o.note}>
                                                                    Note: {o.note}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className={styles.multiLineItemsCell}>
                                                        {o.items.map((it, idx) => (
                                                            <div key={idx} className={styles.itemLine}>
                                                                {it.quantity}x {it.name}
                                                                {it.variations && (
                                                                    <div style={{ fontSize: '0.75rem', color: '#6B7280', paddingLeft: '1rem' }}>
                                                                        {it.variations.name && <span>{it.variations.name}</span>}
                                                                        {it.variations.addOns && it.variations.addOns.length > 0 && <span> • +{it.variations.addOns.length}</span>}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </td>
                                                    <td className={styles.totalCell}>${Number(o.total).toFixed(2)}</td>
                                                    <td>
                                                        <span className={`${styles.statusPillSmall} ${
                                                            o.status === 'Pending' ? styles.pillNew :
                                                            o.status === 'Order Confirmed' ? styles.pillPreparing :
                                                            o.status === 'Out for Delivery' ? styles.pillReady :
                                                            o.status === 'Delivered' ? styles.pillReady :
                                                            styles.pillNew
                                                        }`}>{o.status}</span>
                                                    </td>
                                                    <td className={styles.timeCell}>{o.time}</td>
                                                    <td className={styles.textRight}>
                                                        {actionBtn}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile List View (Hidden on Desktop via CSS) */}
                        <div className={styles.ordersMobileList}>
                            {displayed.map(o => {
                                const meta = statusMeta(o.status);
                                return (
                                    <div key={o.id} className={styles.orderMobileCard} onClick={() => openOrderDetails(o)}>
                                        <div className={styles.orderCardHeader}>
                                            <div className={styles.orderCardCustomer}>
                                                <div className={styles.customerAvatarInitials}>
                                                    {getInitials(o.customer)}
                                                </div>
                                                <div>
                                                    <div className={styles.orderCardId}>{o.orderNumber}</div>
                                                    <div className={styles.customerName} style={{fontSize: '0.8rem'}}>{o.customer}</div>
                                                </div>
                                            </div>
                                            <span className={`${styles.statusPillSmall} ${
                                                o.status === 'Pending' ? styles.pillNew :
                                                o.status === 'Order Confirmed' ? styles.pillPreparing :
                                                o.status === 'Out for Delivery' ? styles.pillReady :
                                                o.status === 'Delivered' ? styles.pillReady :
                                                styles.pillNew
                                            }`}>{o.status}</span>
                                        </div>

                                        <div className={styles.orderCardDetails}>
                                            {o.items.map((it, idx) => (
                                                <div key={idx}>
                                                    {it.quantity}x {it.name}
                                                    {it.variations && (
                                                        <span style={{fontSize: '0.7rem', color: '#6B7280', marginLeft: '4px'}}>
                                                            ({it.variations.name})
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                            {o.note && <div style={{marginTop: '4px', fontStyle: 'italic', color: '#B91C1C', fontSize: '0.75rem'}}>Note: {o.note}</div>}
                                        </div>

                                        <div className={styles.orderCardFooter}>
                                            <div className={styles.orderCardTotal}>${Number(o.total).toFixed(2)}</div>
                                            <div className={styles.timeCell}>{o.time}</div>
                                            {meta.next && (
                                                <button 
                                                    className={styles.btnActionAccept}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        updateStatus(o.id, meta.next);
                                                    }}
                                                >
                                                    {meta.nextLabel}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>

            {/* Order Details Panel */}
            {selectedOrder && (
                <>
                    <div className={styles.overlay} onClick={() => setSelectedOrder(null)}></div>
                    <div className={styles.orderDetailsPanel}>
                        <div className={styles.panelHeader}>
                            <div>
                                <h2 className={styles.panelTitle}>Order Details</h2>
                                <p className={styles.panelSubtitle}>{selectedOrder.orderNumber}</p>
                            </div>
                            <button className={styles.closePanelBtn} onClick={() => { setSelectedOrder(null); setDetailTab('order'); }}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Tabs: Order Details / Proof of Payment */}
                        {hasProofOfPaymentTab && (
                            <div style={{ display: 'flex', borderBottom: '2px solid #F3F4F6', padding: '0 1.25rem' }}>
                                <button
                                    onClick={() => setDetailTab('order')}
                                    style={{
                                        padding: '0.7rem 1.25rem', fontSize: '0.85rem', fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer',
                                        color: detailTab === 'order' ? '#B91C1C' : '#6B7280',
                                        borderBottom: detailTab === 'order' ? '2px solid #B91C1C' : '2px solid transparent',
                                        marginBottom: '-2px',
                                    }}
                                >
                                    Order Details
                                </button>
                                <button
                                    onClick={() => setDetailTab('payment')}
                                    style={{
                                        padding: '0.7rem 1.25rem', fontSize: '0.85rem', fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer',
                                        color: detailTab === 'payment' ? '#B91C1C' : '#6B7280',
                                        borderBottom: detailTab === 'payment' ? '2px solid #B91C1C' : '2px solid transparent',
                                        marginBottom: '-2px', display: 'flex', alignItems: 'center', gap: '6px',
                                    }}
                                >
                                    Proof of Payment
                                    {selectedOrder.paymentStatus !== 'paid' && selectedOrder.paymentReceipt && (
                                        <span style={{ background: '#FEF3C7', color: '#92400E', fontSize: '0.65rem', fontWeight: 700, padding: '1px 6px', borderRadius: '99px' }}>!</span>
                                    )}
                                </button>
                            </div>
                        )}

                        <div className={styles.panelContent}>
                            {/* ─── ORDER DETAILS TAB ─── */}
                            {detailTab === 'order' && (
                                <>
                            {selectedOrder.status !== 'Delivered' && selectedOrder.status !== 'Cancelled' && (
                                <div className={styles.statusAlert}>
                                    <AlertCircle size={16} />
                                    {selectedOrder.status === 'Pending' && ' Awaiting restaurant confirmation'}
                                    {selectedOrder.status === 'Order Confirmed' && ' Kitchen is preparing the order'}
                                    {selectedOrder.status === 'Out for Delivery' && ' Rider is on the way to customer'}
                                </div>
                            )}

                            {/* Status Tracker using real timeline data */}
                            <div className={styles.statusTracker}>
                                {(selectedOrder.timeline || []).map((step, idx, arr) => (
                                    <React.Fragment key={step.label}>
                                        <div className={styles.trackerStepInfo}>
                                            <div className={step.state === 'completed' || step.state === 'active' ? styles.trackerDotActive : styles.trackerDotInactive}>
                                                {(step.state === 'completed' || step.state === 'active') && <Check size={12} color="#fff" />}
                                            </div>
                                            <div>
                                                <div className={step.state === 'completed' || step.state === 'active' ? styles.trackerLabelActive : styles.trackerLabelInactive}>
                                                    {step.label}
                                                </div>
                                                {step.time && <div className={styles.trackerTime}>{step.time}</div>}
                                            </div>
                                        </div>
                                        {idx < arr.length - 1 && <div className={styles.trackerLine}></div>}
                                    </React.Fragment>
                                ))}
                            </div>

                            {/* Customer Info */}
                            <div className={styles.panelSection}>
                                <h4 className={styles.sectionHeading}>Customer Information</h4>
                                <div className={styles.customerInfoBlock}>
                                    <div className={styles.customerAvatarLargeInitials}>
                                        {getInitials(selectedOrder.customerName)}
                                    </div>
                                    <div>
                                        <div className={styles.customerNameLarge}>{selectedOrder.customerName}</div>
                                        <div className={styles.customerPhone}>
                                            📞 {selectedOrder.contactNumber || selectedOrder.customerPhone || 'N/A'}
                                        </div>
                                        <div className={styles.customerAddress} style={{fontSize: '0.85rem', color: '#6B7280', marginTop: '4px'}}>
                                            📍 {selectedOrder.deliveryAddress || selectedOrder.customerAddress || 'N/A'}
                                        </div>
                                        {(selectedOrder.specialInstructions || selectedOrder.note) && (
                                            <div style={{ marginTop: '0.75rem', padding: '0.75rem', backgroundColor: '#FEF2F2', borderLeft: '3px solid #B91C1C', borderRadius: '4px' }}>
                                                <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#B91C1C', textTransform: 'uppercase', marginBottom: '2px' }}>Special Instructions</div>
                                                <div style={{ fontSize: '0.85rem', color: '#B91C1C', fontStyle: 'italic' }}>"{selectedOrder.specialInstructions || selectedOrder.note}"</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>


                            {/* Items List */}
                            <div className={styles.panelSection}>
                                <h4 className={styles.sectionHeading}>Items ({selectedOrder.items.reduce((s, it) => s + it.quantity, 0)})</h4>
                                <div className={styles.panelItemsList}>
                                    {selectedOrder.items.map((it, idx) => (
                                        <div key={idx} className={styles.panelItemRow}>
                                            <img src={it.image || 'https://via.placeholder.com/60'} alt={it.name} className={styles.panelItemImg} />
                                            <div className={styles.panelItemDetails}>
                                                <div className={styles.panelItemTitle}>{it.name}</div>
                                                {it.variations && (
                                                    <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '2px' }}>
                                                        {it.variations.name && <div>Variant: {it.variations.name}</div>}
                                                        {it.variations.addOns && it.variations.addOns.length > 0 && (
                                                            <div>Add-ons: {it.variations.addOns.map(a => a.name).join(', ')}</div>
                                                        )}
                                                    </div>
                                                )}
                                                <div className={styles.panelItemQty}>Qty: x{it.quantity}</div>
                                            </div>
                                            <div className={styles.panelItemPrice}>${Number(it.quantity * it.price).toFixed(2)}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className={styles.panelBreakdown}>
                                <div className={styles.breakdownRow}>
                                    <span>Subtotal</span>
                                    <span>₱{Number(selectedOrder.subtotal).toFixed(2)}</span>
                                </div>
                                <div className={styles.breakdownRow}>
                                    <span>Delivery Fee</span>
                                    <span>₱{Number(selectedOrder.deliveryFee).toFixed(2)}</span>
                                </div>
                                {selectedOrder.discount > 0 && (
                                    <div className={`${styles.breakdownRow} ${styles.breakdownDiscount}`}>
                                        <span>Discount</span>
                                        <span>-₱{Number(selectedOrder.discount).toFixed(2)}</span>
                                    </div>
                                )}
                                <div className={styles.breakdownTotalRow}>
                                    <span>Total Amount</span>
                                    <span className={styles.breakdownTotalValue}>₱{Number(selectedOrder.total).toFixed(2)}</span>
                                </div>
                                {/* Payment Method badge */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #E5E7EB' }}>
                                    <span style={{ fontSize: '0.82rem', color: '#6B7280' }}>Payment Method</span>
                                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#111827' }}>
                                        {selectedOrder.paymentMethod === 'cod' ? '💵 Cash on Delivery' : selectedOrder.paymentMethod === 'gcash' ? '📱 GCash' : selectedOrder.paymentMethod === 'maya' ? '💳 Maya' : '🏦 Bank Transfer'}
                                    </span>
                                </div>
                            </div>
                                </>
                            )}

                            {/* ─── PROOF OF PAYMENT TAB ─── */}
                            {hasProofOfPaymentTab && detailTab === 'payment' && (
                                <div style={{ padding: '0.5rem 0' }}>
                                    {/* Payment Method Info */}
                                    <div style={{ padding: '1rem', background: '#F9FAFB', borderRadius: '12px', border: '1px solid #E5E7EB', marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{
                                                    background: selectedOrder.paymentMethod === 'gcash' ? '#0066FF' : selectedOrder.paymentMethod === 'maya' ? '#00B900' : '#0F2C82',
                                                    color: 'white', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold'
                                                }}>
                                                    {selectedOrder.paymentMethod === 'gcash' ? 'G' : selectedOrder.paymentMethod === 'maya' ? 'M' : '🏦'}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#111827' }}>
                                                        {selectedOrder.paymentMethod === 'gcash' ? 'GCash' : selectedOrder.paymentMethod === 'maya' ? 'Maya' : 'Bank Transfer'}
                                                    </div>
                                                    <div style={{ fontSize: '0.78rem', color: '#6B7280' }}>Online Payment</div>
                                                </div>
                                            </div>
                                            <span style={{
                                                fontSize: '0.75rem', fontWeight: 700, padding: '4px 12px', borderRadius: '99px',
                                                background: selectedOrder.paymentStatus === 'paid' ? '#D1FAE5' : selectedOrder.paymentStatus === 'rejected' ? '#FEE2E2' : '#FEF3C7',
                                                color: selectedOrder.paymentStatus === 'paid' ? '#065F46' : selectedOrder.paymentStatus === 'rejected' ? '#991B1B' : '#92400E',
                                            }}>
                                                {selectedOrder.paymentStatus === 'paid' ? '✓ Confirmed' : selectedOrder.paymentStatus === 'rejected' ? '✗ Rejected' : '⏳ Awaiting Confirmation'}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #E5E7EB' }}>
                                            <span style={{ fontSize: '0.82rem', color: '#6B7280' }}>Amount</span>
                                            <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#111827' }}>₱{Number(selectedOrder.total).toFixed(2)}</span>
                                        </div>
                                        {selectedOrder.paymentSenderName && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                                                <span style={{ fontSize: '0.82rem', color: '#6B7280' }}>Sender Name</span>
                                                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111827' }}>{selectedOrder.paymentSenderName}</span>
                                            </div>
                                        )}
                                        {selectedOrder.paymentTransactionId && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                                                <span style={{ fontSize: '0.82rem', color: '#6B7280' }}>Reference No.</span>
                                                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111827', wordBreak: 'break-all', textAlign: 'right', maxWidth: '60%' }}>{selectedOrder.paymentTransactionId}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Receipt Image */}
                                    <div style={{ marginBottom: '1rem' }}>
                                        <h4 className={styles.sectionHeading} style={{ marginBottom: '0.75rem' }}>Payment Receipt</h4>
                                        {selectedOrder.paymentReceipt ? (
                                            <div style={{ textAlign: 'center', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '1.25rem' }}>
                                                <img
                                                    src={selectedOrder.paymentReceipt}
                                                    alt="Payment receipt"
                                                    style={{ maxHeight: '320px', maxWidth: '100%', borderRadius: '10px', objectFit: 'contain', cursor: 'pointer', border: '1px solid #E5E7EB' }}
                                                    onClick={() => window.open(selectedOrder.paymentReceipt, '_blank')}
                                                />
                                                <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '0.5rem', marginBottom: 0 }}>
                                                    <Eye size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                                                    Click image to view full size
                                                </p>
                                            </div>
                                        ) : (
                                            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: '#F9FAFB', borderRadius: '12px', border: '2px dashed #D1D5DB' }}>
                                                <div style={{ background: '#FEF2F2', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                                                    <Eye size={20} color="#B91C1C" />
                                                </div>
                                                <p style={{ fontWeight: 600, color: '#374151', margin: '0 0 0.25rem' }}>No receipt uploaded yet</p>
                                                <p style={{ fontSize: '0.78rem', color: '#9CA3AF', margin: 0 }}>The customer has not uploaded a payment screenshot.</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Confirm / Reject Buttons */}
                                    {selectedOrder.paymentReceipt && selectedOrder.paymentStatus !== 'paid' && selectedOrder.paymentStatus !== 'rejected' && (
                                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                                            <button
                                                className={styles.btnAcceptOrder}
                                                style={{ flex: 1, fontSize: '0.85rem', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                                onClick={async () => {
                                                    try {
                                                        await api.put(`/owner/orders/${selectedOrder.id}/confirm-payment`, { action: 'confirm' });
                                                        fetchOrders();
                                                        setSelectedOrder(prev => ({ ...prev, paymentStatus: 'paid' }));
                                                    } catch (err) { console.error(err); }
                                                }}
                                            >
                                                <Check size={16} /> Confirm Payment
                                            </button>
                                            <button
                                                className={styles.btnPrint}
                                                style={{ flex: 1, fontSize: '0.85rem', padding: '0.75rem', color: '#991B1B', borderColor: '#FCA5A5', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                                onClick={async () => {
                                                    try {
                                                        await api.put(`/owner/orders/${selectedOrder.id}/confirm-payment`, { action: 'reject' });
                                                        fetchOrders();
                                                        setSelectedOrder(prev => ({ ...prev, paymentStatus: 'rejected' }));
                                                    } catch (err) { console.error(err); }
                                                }}
                                            >
                                                <X size={16} /> Reject Payment
                                            </button>
                                        </div>
                                    )}

                                    {selectedOrder.paymentStatus === 'paid' && (
                                        <div style={{ textAlign: 'center', padding: '1rem', background: '#D1FAE5', borderRadius: '12px', marginTop: '0.5rem' }}>
                                            <Check size={20} color="#065F46" style={{ marginBottom: '0.25rem' }} />
                                            <p style={{ fontWeight: 700, color: '#065F46', margin: '0 0 0.25rem', fontSize: '0.9rem' }}>Payment Confirmed</p>
                                            <p style={{ fontSize: '0.78rem', color: '#065F46', margin: 0, opacity: 0.8 }}>This order's payment has been verified.</p>
                                        </div>
                                    )}
                                    {selectedOrder.paymentStatus === 'rejected' && (
                                        <div style={{ textAlign: 'center', padding: '1rem', background: '#FEE2E2', borderRadius: '12px', marginTop: '0.5rem' }}>
                                            <X size={20} color="#991B1B" style={{ marginBottom: '0.25rem' }} />
                                            <p style={{ fontWeight: 700, color: '#991B1B', margin: '0 0 0.25rem', fontSize: '0.9rem' }}>Payment Rejected</p>
                                            <p style={{ fontSize: '0.78rem', color: '#991B1B', margin: 0, opacity: 0.8 }}>This order's payment was rejected.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Footer Actions */}
                        <div className={styles.panelFooter}>
                            <button className={styles.btnPrint} onClick={handlePrintReceipt}>Print</button>
                            {statusMeta(selectedOrder.status).next && (
                                <button 
                                    className={styles.btnAcceptOrder}
                                    onClick={() => {
                                        updateStatus(selectedOrder.id, statusMeta(selectedOrder.status).next);
                                        setSelectedOrder(null);
                                    }}
                                >
                                    {statusMeta(selectedOrder.status).nextLabel}
                                </button>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
