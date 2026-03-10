import React, { useState } from 'react';
import { MapPin, Layers, X, AlertCircle, Check } from 'lucide-react';
import { buildOrders, STATUS_ORDER } from './shared';
import styles from '../OwnerDashboard.module.css';

export default function OrdersSection({ store }) {
    const [orders] = useState(() => buildOrders(store));
    const [filt, setFilt] = useState('All');
    const [selectedOrder, setSelectedOrder] = useState(null);

    const STATUS_TABS = [
        { key: 'All', label: 'All' },
        { key: 'Pending', label: 'New' },
        { key: 'Preparing', label: 'Preparing' },
        { key: 'Delivering', label: 'Ready' },
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
                                // Map old status to new simplified ones for the pill display only
                                let displayStatus = 'New';
                                let statusPillClass = styles.pillNew;
                                let actionBtn = <button className={styles.btnActionAccept}>Accept</button>;

                                if (o.status === 'Preparing') {
                                    displayStatus = 'Preparing';
                                    statusPillClass = styles.pillPreparing;
                                    actionBtn = <button className={styles.btnActionReady}>Ready</button>;
                                }
                                if (o.status === 'Delivering' || o.status === 'Delivered') {
                                    displayStatus = 'Ready'; // Simplify for this view
                                    statusPillClass = styles.pillReady;
                                    actionBtn = <button className={styles.btnActionHandover}>Handover</button>;
                                }

                                return (
                                    <tr key={o.id} className={styles.ordersTableRow} onClick={() => setSelectedOrder(o)} style={{ cursor: 'pointer' }}>
                                        <td className={styles.orderIdCell}>{o.id}</td>
                                        <td>
                                            <div className={styles.customerCell}>
                                                <img src={`https://i.pravatar.cc/100?u=${o.id}`} alt="Customer" className={styles.customerAvatar} />
                                                <span className={styles.customerName}>{o.customer}</span>
                                            </div>
                                        </td>
                                        <td className={styles.multiLineItemsCell}>
                                            {o.items.map((it, idx) => (
                                                <div key={idx} className={styles.itemLine}>{it.qty}x {it.name}</div>
                                            ))}
                                        </td>
                                        <td className={styles.totalCell}>${o.total.toFixed(2)}</td>
                                        <td>
                                            <span className={`${styles.statusPillSmall} ${statusPillClass}`}>{displayStatus}</span>
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
                                <p className={styles.panelSubtitle}>{selectedOrder.id}</p>
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
                                        <div className={styles.customerNameLarge}>{selectedOrder.customer}</div>
                                        <div className={styles.customerPhone}>+1 (555) 000-1234</div>
                                    </div>
                                </div>
                            </div>

                            {/* Items List */}
                            <div className={styles.panelSection}>
                                <h4 className={styles.sectionHeading}>Items ({selectedOrder.items.reduce((s, it) => s + it.qty, 0)})</h4>
                                <div className={styles.panelItemsList}>
                                    {selectedOrder.items.map((it, idx) => (
                                        <div key={idx} className={styles.panelItemRow}>
                                            <img src={it.image} alt={it.name} className={styles.panelItemImg} />
                                            <div className={styles.panelItemDetails}>
                                                <div className={styles.panelItemName}>{it.name}</div>
                                                <div className={styles.panelItemQty}>Qty: x{it.qty}</div>
                                            </div>
                                            <div className={styles.panelItemPrice}>${(it.qty * it.price).toFixed(2)}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Special Instructions */}
                            {selectedOrder.note && (
                                <div className={styles.panelSection}>
                                    <h4 className={styles.sectionHeading}>Special Instructions</h4>
                                    <div className={styles.instructionsBlock}>
                                        "{selectedOrder.note}"
                                    </div>
                                </div>
                            )}

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
                            <button className={styles.btnAcceptOrder}>Accept Order</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
