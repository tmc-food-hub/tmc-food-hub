import React, { useState, useEffect } from 'react';
import { MapPin, Layers, X, AlertCircle, Check, Bell, RefreshCw } from 'lucide-react';
import { STATUS_ORDER, statusMeta } from './shared';
import { useOrders } from '../../../context/OrderContext';
import styles from '../OwnerDashboard.module.css';

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
                                            <th className={styles.textRight}>Actions</th>
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
                                                <tr key={o.id} className={styles.ordersTableRow} onClick={() => setSelectedOrder(o)} style={{ cursor: 'pointer' }}>
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
                                    <div key={o.id} className={styles.orderMobileCard} onClick={() => setSelectedOrder(o)}>
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
                            <button className={styles.closePanelBtn} onClick={() => setSelectedOrder(null)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className={styles.panelContent}>
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
                                                <div className={styles.panelItemName}>{it.name}</div>
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
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className={styles.panelFooter}>
                            <button className={styles.btnPrint}>Print</button>
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
