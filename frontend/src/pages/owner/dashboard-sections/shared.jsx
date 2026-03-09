import React from 'react';
import { Bell, Timer, Truck, CheckCircle2 } from 'lucide-react';

export const IMAGES = [
    '/assets/images/service/fries.webp',
    '/assets/images/service/spag.webp',
    '/assets/images/service/burger.webp',
    '/assets/images/service/juice.webp',
    '/assets/images/service/steak.webp',
    '/assets/images/service/sushi.webp',
];

export function buildOrders(store) {
    const img = (name) => store.menuItems.find(i => i.title === name)?.image || IMAGES[0];
    return [
        { id: 'ORD-1041', customer: 'Maria Santos', address: 'Lahug, Cebu City', items: [{ name: 'Chickenjoy 2-pc', qty: 2, image: img('Chickenjoy 2-pc') }, { name: 'Jolly Spaghetti', qty: 1, image: img('Jolly Spaghetti') }], total: 15.60, status: 'Pending', time: '2 min ago', note: '' },
        { id: 'ORD-1040', customer: 'Juan dela Cruz', address: 'Mabolo, Cebu City', items: [{ name: 'Yumburger', qty: 3, image: img('Yumburger') }, { name: 'Peach Mango Pie', qty: 2, image: img('Peach Mango Pie') }], total: 7.80, status: 'Preparing', time: '8 min ago', note: 'No onions please' },
        { id: 'ORD-1039', customer: 'Ana Reyes', address: 'Banilad, Cebu City', items: [{ name: 'Chickenjoy Bucket 8-pc', qty: 1, image: img('Chickenjoy Bucket 8-pc') }], total: 18.00, status: 'Delivering', time: '18 min ago', note: '' },
        { id: 'ORD-1038', customer: 'Ramon Villanueva', address: 'IT Park, Cebu City', items: [{ name: 'Garlic Rice', qty: 2, image: img('Garlic Rice') }, { name: 'Jolly Hotdog', qty: 2, image: img('Jolly Hotdog') }], total: 7.00, status: 'Delivered', time: '35 min ago', note: '' },
        { id: 'ORD-1037', customer: 'Leila Bautista', address: 'Apas, Cebu City', items: [{ name: 'Chickenjoy Solo', qty: 1, image: img('Chickenjoy Solo') }, { name: 'Jolly Sundae', qty: 1, image: img('Jolly Sundae') }], total: 4.50, status: 'Delivered', time: '52 min ago', note: 'Leave at gate' },
    ];
}

export const STATUS_ORDER = ['Pending', 'Preparing', 'Delivering', 'Delivered'];

export function statusMeta(s) {
    return { Pending: { color: '#D97706', bg: '#FEF3C7', icon: <Bell size={13} />, next: 'Preparing', nextLabel: 'Accept & Prepare' }, Preparing: { color: '#2563EB', bg: '#DBEAFE', icon: <Timer size={13} />, next: 'Delivering', nextLabel: 'Out for Delivery' }, Delivering: { color: '#7C3AED', bg: '#EDE9FE', icon: <Truck size={13} />, next: 'Delivered', nextLabel: 'Mark Delivered' }, Delivered: { color: '#059669', bg: '#D1FAE5', icon: <CheckCircle2 size={13} />, next: null, nextLabel: null } }[s] || {};
}
