import React, { useState, useEffect } from 'react';
import { MapPin, Layers, X, AlertCircle, Check } from 'lucide-react';
import { STATUS_ORDER, statusMeta } from './shared';
import { useOrders } from '../../../context/OrderContext';
import styles from '../OwnerDashboard.module.css';

export default function OrdersSection({ store }) {
    const { orders: allOrders, loading, fetchOrders, updateStatus } = useOrders();
    const [orders, setOrders] = useState([]);
    
    useEffect(() => {
        // In a real app, this would filter by store ID.
        // For now, we take all orders since we're mocking multiple stores in one dashboard context.
        setOrders(allOrders || []);
    }, [allOrders]);

    const [filt, setFilt] = useState('All');
    const [selectedOrder, setSelectedOrder] = useState(null);

    const STATUS_TABS = [
        { key: 'All', label: 'All' },
        { key: 'Order Placed', label: 'New' },
        { key: 'Order Confirmed', label: 'Confirmed' },
        { key: 'Being Prepared', label: 'Preparing' },
        { key: 'Picked Up', label: 'Ready' },
        { key: 'Delivered', label: 'Complete' }
    ];

    const counts = { All: orders.length };
    STATUS_ORDER.forEach(s => { counts[s] = orders.filter(o => o.status === s).length; });

    const displayed = filt === 'All' ? orders : orders.filter(o => o.status === filt);

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
                            {tab.label} {tab.key === 'Order Placed' && counts['Order Placed'] > 0 && <span className={styles.tabBadge}>{counts['Order Placed']}</span>}
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

            {/* Orders Table */}
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
                                                <img src={`https://i.pravatar.cc/100?u=${o.id}`} alt="Customer" className={styles.customerAvatar} />
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
                                        <td className={styles.totalCell}>${o.total.toFixed(2)}</td>
                                        <td>
                                            <span className={`${styles.statusPillSmall} ${
                                                o.status === 'Order Placed' ? styles.pillNew :
                                                o.status === 'Being Prepared' ? styles.pillPreparing :
                                                o.status === 'Picked Up' ? styles.pillReady :
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
                            <div className={styles.statusAlert}>
                                <AlertCircle size={16} /> Awaiting Kitchen Approval
                            </div>

                            {/* Status Tracker */}
                            <div className={styles.statusTracker}>
                                <div className={styles.trackerStepInfo}>
                                    <div className={styles.trackerDotActive}><Check size={12} color="#fff" /></div>
                                    <div>
                                        <div className={styles.trackerLabelActive}>Order Placed</div>
                                        <div className={styles.trackerTime}>12:30 PM</div>
                                    </div>
                                </div>
                                <div className={styles.trackerLine}></div>
                                <div className={styles.trackerStepInfo}>
                                    <div className={styles.trackerDotInactive}></div>
                                    <div className={styles.trackerLabelInactive}>Confirmed</div>
                                </div>
                            </div>

                            {/* Customer Info */}
                            <div className={styles.panelSection}>
                                <h4 className={styles.sectionHeading}>Customer Information</h4>
                                <div className={styles.customerInfoBlock}>
                                    <img src={`https://i.pravatar.cc/100?u=${selectedOrder.id}`} alt="Customer" className={styles.customerAvatarLarge} />
                                    <div>
                                        <div className={styles.customerNameLarge}>{selectedOrder.customerName}</div>
                                        <div className={styles.customerPhone}>{selectedOrder.customerPhone}</div>
                                        <div className={styles.customerAddress} style={{fontSize: '0.85rem', color: '#6B7280', marginTop: '4px'}}>{selectedOrder.customerAddress}</div>
                                        {selectedOrder.note && (
                                            <div style={{ marginTop: '0.75rem', padding: '0.75rem', backgroundColor: '#FEF2F2', borderLeft: '3px solid #B91C1C', borderRadius: '4px' }}>
                                                <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#B91C1C', textTransform: 'uppercase', marginBottom: '2px' }}>Special Instructions</div>
                                                <div style={{ fontSize: '0.85rem', color: '#B91C1C', fontStyle: 'italic' }}>"{selectedOrder.note}"</div>
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
                                            <div className={styles.panelItemPrice}>${(it.quantity * it.price).toFixed(2)}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>


                            {/* Price Breakdown */}
                            <div className={styles.panelBreakdown}>
                                <div className={styles.breakdownRow}>
                                    <span>Subtotal</span>
                                    <span>${selectedOrder.total.toFixed(2)}</span>
                                </div>
                                <div className={styles.breakdownRow}>
                                    <span>Delivery Fee</span>
                                    <span>$3.00</span>
                                </div>
                                <div className={`${styles.breakdownRow} ${styles.breakdownDiscount}`}>
                                    <span>Discount (PROMO5)</span>
                                    <span>-$5.00</span>
                                </div>
                                <div className={styles.breakdownTotalRow}>
                                    <span>Total Amount</span>
                                    <span className={styles.breakdownTotalValue}>${(selectedOrder.total - 2).toFixed(2)} <span className={styles.currency}>USD</span></span>
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
