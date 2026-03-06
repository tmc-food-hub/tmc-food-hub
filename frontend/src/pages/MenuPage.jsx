import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, Clock, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import StoreModal from '../components/ui/StoreModal';
import Navbar from '../components/sections/Navbar';
import Footer from '../components/sections/Footer';
import BackToTop from '../components/ui/BackToTop';
import styles from './MenuPage.module.css';

// ── Images reused from existing assets ──────────────────────────────────
const IMG = {
    fries: '/assets/images/service/fries.webp',
    spag: '/assets/images/service/spag.webp',
    burger: '/assets/images/service/burger.webp',
    juice: '/assets/images/service/juice.webp',
    steak: '/assets/images/service/steak.webp',
    sushi: '/assets/images/service/sushi.webp',
};

// ── Store / Restaurant Data ──────────────────────────────────────────────
const stores = [
    {
        id: 1,
        name: "Jollibee",
        branchName: "Jollibee SM City Branch",
        cuisine: "Filipino Fast Food · Chicken · Burgers",
        category: "Fast Food",
        dietary: "Halal",
        location: "SM City, North Reclamation Area, Cebu City",
        hours: "7:00 AM – 11:00 PM",
        phone: "+63 32 234 5678",
        status: "Operational",
        deliveryTime: "20–35 min",
        minOrder: "$2.00",
        cover: IMG.burger,
        logo: IMG.fries,
        brandColor: "linear-gradient(135deg, #D62027 0%, #EE3124 100%)",
        rating: 4.7,
        about: "One of the Philippines' most beloved fast food chains. Famous for Chickenjoy, Jolly Spaghetti, and Yumburger since 1978.",
        menuItems: [
            // ── Chickenjoy Meals ──
            { id: 101, category: 'Chickenjoy Meals', title: 'Chickenjoy Solo', description: '1-pc crispy fried chicken, regular fries & drinks.', price: 3.50, image: IMG.fries },
            { id: 102, category: 'Chickenjoy Meals', title: 'Chickenjoy 2-pc', description: '2-pc fried chicken with rice and gravy.', price: 5.80, image: IMG.fries },
            { id: 103, category: 'Chickenjoy Meals', title: 'Chickenjoy Bucket 8-pc', description: 'Family bucket of 8 crispy chicken pieces.', price: 18.00, image: IMG.fries },
            { id: 104, category: 'Chickenjoy Meals', title: 'Chicken Strips Meal', description: 'Juicy chicken strips with honeydip sauce and fries.', price: 4.20, image: IMG.fries },
            // ── Burgers & Sandwiches ──
            { id: 105, category: 'Burgers & Sandwiches', title: 'Yumburger', description: 'Classic beef burger with Jollibee\'s signature sauce.', price: 1.80, image: IMG.burger },
            { id: 106, category: 'Burgers & Sandwiches', title: 'Cheesy Yumburger', description: 'Yumburger topped with melted American cheese.', price: 2.30, image: IMG.burger },
            { id: 107, category: 'Burgers & Sandwiches', title: 'Jolly Crispy Burger', 'description': 'Crispy chicken fillet in a soft burger bun.', price: 3.00, image: IMG.burger },
            // ── Pasta & Rice ──
            { id: 108, category: 'Pasta & Rice', title: 'Jolly Spaghetti', description: 'Sweet-style spaghetti with hotdog slices and cheese.', price: 2.80, image: IMG.spag },
            { id: 109, category: 'Pasta & Rice', title: 'Words of Mouth Garlic Rice', description: 'Fragrant garlic fried rice perfect with any meal.', price: 1.50, image: IMG.spag },
            { id: 110, category: 'Pasta & Rice', title: 'Jolly Hotdog', description: 'Grilled hotdog in a soft bun with cheese sauce.', price: 2.00, image: IMG.spag },
            // ── Desserts & Drinks ──
            { id: 111, category: 'Desserts & Drinks', title: 'Peach Mango Pie', description: 'Flaky pastry filled with sweet peach and mango.', price: 1.20, image: IMG.juice },
            { id: 112, category: 'Desserts & Drinks', title: 'Jolly Sundae', description: 'Creamy soft-serve in chocolate or strawberry.', price: 1.00, image: IMG.juice },
            { id: 113, category: 'Desserts & Drinks', title: 'Pineapple Juice', description: 'Refreshing 100% pineapple juice, chilled.', price: 1.50, image: IMG.juice },
        ],
        reviews: [
            { id: 1, name: 'Ana M.', avatar: 'AM', rating: 5, date: 'Mar 1, 2026', text: 'Best Chickenjoy in the city! Always fresh and crispy.' },
            { id: 2, name: 'Ben C.', avatar: 'BC', rating: 5, date: 'Feb 22, 2026', text: 'Fast service and the food is always consistent. Love it!' },
            { id: 3, name: 'Carla D.', avatar: 'CD', rating: 4, date: 'Feb 10, 2026', text: 'Spaghetti is a bit sweeter than usual but still delicious.' },
            { id: 4, name: 'Dan R.', avatar: 'DR', rating: 5, date: 'Feb 3, 2026', text: 'Peach Mango Pie is always the highlight! Great value.' },
        ]
    },
    {
        id: 2,
        name: "McDonald's",
        branchName: "McDonald's Ayala Center Branch",
        cuisine: "American Fast Food · Burgers · Coffee",
        category: "Fast Food",
        dietary: "All",
        location: "Ayala Center Cebu, Archbishop Reyes Ave.",
        hours: "24 Hours",
        phone: "+63 32 888 1234",
        status: "Operational",
        deliveryTime: "15–25 min",
        minOrder: "$3.00",
        cover: IMG.burger,
        logo: IMG.burger,
        brandColor: "linear-gradient(135deg, #DA291C 0%, #FFC72C 100%)",
        rating: 4.5,
        about: "The world's largest fast food chain. Known for the Big Mac, McFlurry, and McCafé. Now serving 24/7 at Ayala.",
        menuItems: [
            // ── Mix & Match ──
            { id: 201, category: 'Mix & Match', title: 'McSavers Burger', description: 'Budget-friendly beef burger with lettuce and ketchup.', price: 1.50, image: IMG.burger },
            { id: 202, category: 'Mix & Match', title: 'McSavers McFries', description: 'Small golden fries at a great everyday price.', price: 1.20, image: IMG.fries },
            { id: 203, category: 'Mix & Match', title: 'McSavers Sundae', description: 'Soft-serve sundae in chocolate or strawberry drizzle.', price: 1.00, image: IMG.juice },
            { id: 204, category: 'Mix & Match', title: 'McSavers Fried Chicken', description: '1-pc crispy chicken at budget price.', price: 2.00, image: IMG.steak },
            // ── Fully Loaded ──
            { id: 205, category: 'Fully Loaded', title: 'Big Mac', description: 'Double beef patty, special sauce, lettuce, cheese, pickles.', price: 5.00, image: IMG.burger },
            { id: 206, category: 'Fully Loaded', title: 'Quarter Pounder Deluxe', description: 'Quarter-pound beef with fresh tomato and crispy lettuce.', price: 5.50, image: IMG.burger },
            { id: 207, category: 'Fully Loaded', title: 'McSpicy Double', description: 'Double crispy spicy fillets with jalapeño sauce.', price: 4.80, image: IMG.steak },
            { id: 208, category: 'Fully Loaded', title: 'Mega McFries', description: 'Our largest serving of golden crispy fries.', price: 3.50, image: IMG.fries },
            // ── McCafé ──
            { id: 209, category: 'McCafé', title: 'Caramel Macchiato', description: 'Espresso shots with vanilla syrup and caramel drizzle.', price: 3.80, image: IMG.juice },
            { id: 210, category: 'McCafé', title: 'Mocha Frappe', description: 'Blended mocha with whipped cream and chocolate drizzle.', price: 3.50, image: IMG.juice },
            { id: 211, category: 'McCafé', title: 'Strawberry Shake', description: 'Thick strawberry milkshake blended with real strawberries.', price: 3.00, image: IMG.juice },
            // ── Happy Meals ──
            { id: 212, category: 'Happy Meals', title: 'Chicken McDo Happy Meal', description: '1-pc chicken, small fries, juice, and a toy surprise.', price: 4.00, image: IMG.steak },
            { id: 213, category: 'Happy Meals', title: 'Burger Happy Meal', description: 'Cheeseburger, small fries, apple juice, and a toy.', price: 3.80, image: IMG.burger },
        ],
        reviews: [
            { id: 1, name: 'Rico P.', avatar: 'RP', rating: 5, date: 'Mar 3, 2026', text: 'Open 24 hours is a lifesaver! Big Mac never disappoints.' },
            { id: 2, name: 'Lea S.', avatar: 'LS', rating: 4, date: 'Feb 28, 2026', text: 'Clean branch, fast lanes. McFlurry is always on point.' },
            { id: 3, name: 'Mark T.', avatar: 'MT', rating: 4, date: 'Feb 15, 2026', text: 'Good food but can get crowded during lunch rush.' },
            { id: 4, name: 'Joy B.', avatar: 'JB', rating: 5, date: 'Feb 8, 2026', text: 'The McCafé drinks are seriously underrated. Love the macchiato!' },
        ]
    },
    {
        id: 3,
        name: "Sushi Nori",
        branchName: "Sushi Nori IT Park Branch",
        cuisine: "Japanese · Sushi · Ramen",
        category: "Japanese",
        dietary: "All",
        location: "Cebu IT Park, Lahug, Cebu City",
        hours: "11:00 AM – 10:00 PM",
        phone: "+63 32 411 9900",
        status: "Operational",
        deliveryTime: "30–45 min",
        minOrder: "$5.00",
        cover: IMG.sushi,
        logo: IMG.sushi,
        brandColor: "linear-gradient(135deg, #1e3a5f 0%, #2563EB 100%)",
        rating: 4.6,
        about: "A modern Japanese dining experience with fresh sushi, bento sets, and authentic ramen.",
        menuItems: [
            // ── Signature Rolls ──
            { id: 301, category: 'Signature Rolls', title: 'Dragon Roll', description: 'Shrimp tempura, avocado, spicy mayo and tobiko.', price: 8.00, image: IMG.sushi },
            { id: 302, category: 'Signature Rolls', title: 'Rainbow Roll', description: 'California roll topped with assorted sashimi.', price: 9.50, image: IMG.sushi },
            { id: 303, category: 'Signature Rolls', title: 'Volcano Roll', description: 'Spicy tuna inside, baked seafood mixture on top.', price: 9.00, image: IMG.sushi },
            { id: 304, category: 'Signature Rolls', title: 'Salmon Aburi', description: 'Torched Norwegian salmon with yuzu ponzu and scallion.', price: 10.50, image: IMG.sushi },
            // ── Ramen & Hot Bowls ──
            { id: 305, category: 'Ramen & Hot Bowls', title: 'Tonkotsu Ramen', description: 'Rich creamy pork broth with chashu, soft egg, and nori.', price: 9.50, image: IMG.spag },
            { id: 306, category: 'Ramen & Hot Bowls', title: 'Spicy Miso Ramen', description: 'Bold miso broth with chili, corn, butter, and bean sprouts.', price: 9.00, image: IMG.spag },
            { id: 307, category: 'Ramen & Hot Bowls', title: 'Gyudon (Beef Bowl)', description: 'Seasoned beef and onions over steamed Japanese rice.', price: 8.50, image: IMG.steak },
            { id: 308, category: 'Ramen & Hot Bowls', title: 'Chirashi Bowl', description: 'Assorted sashimi over sushi rice with pickled ginger.', price: 12.00, image: IMG.sushi },
            // ── Grills & Mains ──
            { id: 309, category: 'Grills & Mains', title: 'Wagyu Steak', description: 'A5 wagyu sirloin, grilled to order with truffle butter.', price: 15.00, image: IMG.steak },
            { id: 310, category: 'Grills & Mains', title: 'Grilled Salmon Teriyaki', description: 'Norwegian salmon glazed with teriyaki sauce and sesame.', price: 11.00, image: IMG.steak },
            { id: 311, category: 'Grills & Mains', title: 'Karaage Platter', description: 'Double serving of Japanese fried chicken with kewpie mayo.', price: 7.50, image: IMG.steak },
            // ── Beverages ──
            { id: 312, category: 'Beverages', title: 'Matcha Latte', description: 'Ceremonial grade matcha with steamed oat milk.', price: 4.00, image: IMG.juice },
            { id: 313, category: 'Beverages', title: 'Yuzu Lemonade', description: 'Refreshing yuzu citrus with sparkling water.', price: 3.50, image: IMG.juice },
            { id: 314, category: 'Beverages', title: 'Peach Oolong Tea', description: 'Brewed oolong tea with fresh peach and ice.', price: 3.00, image: IMG.juice },
        ],
        reviews: [
            { id: 1, name: 'Yuki L.', avatar: 'YL', rating: 5, date: 'Mar 2, 2026', text: 'The Dragon Roll is incredible. Best sushi in Cebu!' },
            { id: 2, name: 'James T.', avatar: 'JT', rating: 5, date: 'Feb 20, 2026', text: 'Ambiance is amazing. The ramen is soul-warming.' },
            { id: 3, name: 'Sarah G.', avatar: 'SG', rating: 4, date: 'Feb 5, 2026', text: 'Pricier but totally worth it for the quality.' },
            { id: 4, name: 'Ken M.', avatar: 'KM', rating: 5, date: 'Jan 28, 2026', text: 'Wagyu Steak is absolutely divine. 10/10 would order again.' },
        ]
    },
    {
        id: 4,
        name: "Mang Inasal",
        branchName: "Mang Inasal Colon Branch",
        cuisine: "Filipino BBQ · Rice Meals · Inasal",
        category: "Filipino",
        dietary: "Halal",
        location: "Colon Street, Downtown, Cebu City",
        hours: "9:00 AM – 10:00 PM",
        phone: "+63 32 256 7788",
        status: "Operational",
        deliveryTime: "25–40 min",
        minOrder: "$2.50",
        cover: IMG.steak,
        logo: IMG.steak,
        brandColor: "linear-gradient(135deg, #7C2D12 0%, #EA580C 100%)",
        rating: 4.4,
        about: "Home of unlimited rice and authentic charcoal-grilled chicken inasal. Great value for Cebuanos.",
        menuItems: [
            // ── Paborito Meals (Bestsellers) ──
            { id: 401, category: 'Paborito Meals', title: 'Chicken Paa Solo', description: 'Charcoal-grilled chicken leg with unli-rice and soup.', price: 3.80, image: IMG.steak },
            { id: 402, category: 'Paborito Meals', title: 'Chicken Pecho Solo', description: 'Grilled chicken breast, extra juicy with calamansi marinade.', price: 4.00, image: IMG.steak },
            { id: 403, category: 'Paborito Meals', title: 'BBQ Pork Combo', description: 'Skewered pork BBQ with garlic rice and sawsawan.', price: 4.50, image: IMG.steak },
            { id: 404, category: 'Paborito Meals', title: 'Liempo Meal', description: 'Grilled pork belly with rice. A Cebuano classic.', price: 5.00, image: IMG.steak },
            // ── Fiesta Packages ──
            { id: 405, category: 'Fiesta Packages', title: '4-pc Inasal Pack', description: '4 pcs chicken inasal, rice, soup, sawsawan for 2-3 pax.', price: 12.00, image: IMG.steak },
            { id: 406, category: 'Fiesta Packages', title: '8-pc Paborito Bucket', description: '8 pcs chicken, 4 rice, 2 soup. Perfect for family sharing.', price: 22.00, image: IMG.steak },
            // ── Sidings ──
            { id: 407, category: 'Sidings', title: 'Palabok', description: 'Rice noodles in savory shrimp sauce with pork chicharon.', price: 3.50, image: IMG.spag },
            { id: 408, category: 'Sidings', title: 'Bangus Sisig', description: 'Sizzling milkfish sisig with onions and peppers.', price: 4.20, image: IMG.spag },
            { id: 409, category: 'Sidings', title: 'Garlic Fried Rice', description: 'Fragrant garlic rice perfect with any grilled dish.', price: 1.50, image: IMG.spag },
            // ── Desserts & Drinks ──
            { id: 410, category: 'Desserts & Drinks', title: 'Halo-Halo', description: 'Classic Filipino shaved ice with leche flan and ube ice cream.', price: 2.50, image: IMG.juice },
            { id: 411, category: 'Desserts & Drinks', title: 'Mais con Yelo', description: 'Sweet corn kernels on crushed ice, drizzled with milk.', price: 2.00, image: IMG.juice },
            { id: 412, category: 'Desserts & Drinks', title: 'Pineapple Cooler', description: 'Chilled pineapple juice with a hint of mint.', price: 1.50, image: IMG.juice },
        ],
        reviews: [
            { id: 1, name: 'Pedro L.', avatar: 'PL', rating: 5, date: 'Mar 1, 2026', text: 'Unli rice is the best deal! Inasal flavor is perfect.' },
            { id: 2, name: 'Nena J.', avatar: 'NJ', rating: 4, date: 'Feb 18, 2026', text: 'Always busy but worth the wait. The chicken is always juicy.' },
            { id: 3, name: 'Lito B.', avatar: 'LB', rating: 4, date: 'Feb 8, 2026', text: 'Good value, big portions. Halo-halo is refreshing!' },
            { id: 4, name: 'Grace C.', avatar: 'GC', rating: 5, date: 'Jan 30, 2026', text: 'The Liempo Meal is so worth it. Best BBQ spot in Colon.' },
        ]
    },
    {
        id: 5,
        name: "Steak & Co.",
        branchName: "Steak & Co. Crossroads Branch",
        cuisine: "Western · Steakhouse · Grills",
        category: "Grills",
        dietary: "All",
        location: "Crossroads Mall, Banilad, Cebu City",
        hours: "11:00 AM – 11:00 PM",
        phone: "+63 32 317 4422",
        status: "Operational",
        deliveryTime: "35–50 min",
        minOrder: "$8.00",
        cover: IMG.steak,
        logo: IMG.steak,
        brandColor: "linear-gradient(135deg, #1C1C1C 0%, #4B2D1A 100%)",
        rating: 4.8,
        about: "Premium steaks sourced from quality cuts. Fine dining that brings Western steakhouse flavors to Cebu.",
        menuItems: [
            // ── Prime Cuts ──
            { id: 501, category: 'Prime Cuts', title: 'Ribeye Steak (12oz)', description: 'USDA prime ribeye, flame-grilled with herb butter.', price: 18.00, image: IMG.steak },
            { id: 502, category: 'Prime Cuts', title: 'Wagyu Striploin (200g)', description: 'A5 Japanese wagyu striploin with truffle jus.', price: 28.00, image: IMG.steak },
            { id: 503, category: 'Prime Cuts', title: 'T-Bone Royale', description: 'Massive T-bone with both tenderloin and striploin sides.', price: 22.00, image: IMG.steak },
            { id: 504, category: 'Prime Cuts', title: 'Filet Mignon', description: 'Tenderloin medallion, wrapped in bacon, pan-seared.', price: 20.00, image: IMG.steak },
            // ── Burgers & Sandwiches ──
            { id: 505, category: 'Burgers & Sandwiches', title: 'Wagyu Smash Burger', description: 'A5 wagyu smash patty with truffle aioli on brioche.', price: 12.00, image: IMG.burger },
            { id: 506, category: 'Burgers & Sandwiches', title: 'Classic Club Sandwich', 'description': 'Triple-layer toasted sandwich with chicken, bacon, and egg.', price: 8.50, image: IMG.burger },
            { id: 507, category: 'Burgers & Sandwiches', title: 'BBQ Bacon Burger', description: 'Double smash patty with smoky BBQ sauce and crispy bacon.', price: 10.00, image: IMG.burger },
            // ── Sides ──
            { id: 508, category: 'Sides', title: 'Truffle Parmesan Fries', description: 'Crispy fries tossed in truffle oil and aged parmesan.', price: 5.00, image: IMG.fries },
            { id: 509, category: 'Sides', title: 'Bacon Mac & Cheese', description: 'Creamy macaroni with crispy bacon bits and cheddar crust.', price: 5.50, image: IMG.spag },
            { id: 510, category: 'Sides', title: 'Caesar Salad', description: 'Crisp romaine, shaved parmesan, anchovies, croutons.', price: 4.50, image: IMG.juice },
            // ── Beverages ──
            { id: 511, category: 'Beverages', title: 'Red Wine (Cabernet)', description: 'Chilean Cabernet Sauvignon, full-bodied and smooth.', price: 7.00, image: IMG.juice },
            { id: 512, category: 'Beverages', title: 'Craft Beer', description: 'Local artisan IPA, smooth with citrus finish.', price: 4.50, image: IMG.juice },
            { id: 513, category: 'Beverages', title: 'Sparkling Lemonade', description: 'Freshly squeezed lemon with sparkling water and mint.', price: 3.00, image: IMG.juice },
        ],
        reviews: [
            { id: 1, name: 'Chris B.', avatar: 'CB', rating: 5, date: 'Mar 3, 2026', text: 'Best steak in Cebu. Perfectly cooked medium-rare.' },
            { id: 2, name: 'Dana F.', avatar: 'DF', rating: 5, date: 'Feb 26, 2026', text: 'Worth every peso. Smoky, tender, full of flavour.' },
            { id: 3, name: 'Mike A.', avatar: 'MA', rating: 4, date: 'Feb 14, 2026', text: 'The Wagyu Burger blew my mind. Will definitely return.' },
            { id: 4, name: 'Tina L.', avatar: 'TL', rating: 5, date: 'Feb 6, 2026', text: 'Truffle fries are addictive. The wine pairing was perfect.' },
        ]
    },
    {
        id: 6,
        name: "Té Hana Ramen",
        branchName: "Té Hana Ramen Mango Ave. Branch",
        cuisine: "Japanese · Korean · Asian Fusion",
        category: "Drinks",
        dietary: "Vegetarian",
        location: "Mango Avenue, Cebu City",
        hours: "10:00 AM – 12:00 AM",
        phone: "+63 32 520 8833",
        status: "Operational",
        deliveryTime: "20–30 min",
        minOrder: "$4.00",
        cover: IMG.spag,
        logo: IMG.spag,
        brandColor: "linear-gradient(135deg, #134E4A 0%, #0D9488 100%)",
        rating: 4.3,
        about: "A vibrant fusion of Japanese ramen and Korean-inspired toppings. Late-night favourite on Mango Ave.",
        menuItems: [
            // ── Signature Ramen ──
            { id: 601, category: 'Signature Ramen', title: 'Spicy Miso Ramen', description: 'Bold miso broth, corn, butter, chashu, and ramen egg.', price: 7.50, image: IMG.spag },
            { id: 602, category: 'Signature Ramen', title: 'Shoyu Ramen', description: 'Clear soy-based broth with tender chashu and green onions.', price: 7.00, image: IMG.spag },
            { id: 603, category: 'Signature Ramen', title: 'Tantanmen', description: 'Sesame and spicy pork broth with bok choy and soft egg.', price: 8.00, image: IMG.spag },
            { id: 604, category: 'Signature Ramen', title: 'Vegan Shio Ramen', description: 'Light salt broth with tofu, mushrooms, and baby spinach.', price: 7.00, image: IMG.spag },
            // ── Korean Corner ──
            { id: 605, category: 'Korean Corner', title: 'Bibimbap', description: 'Rice topped with assorted veggies, egg, and gochujang.', price: 6.00, image: IMG.steak },
            { id: 606, category: 'Korean Corner', title: 'Tteokbokki', description: 'Spicy rice cakes in gochujang sauce with fish cake.', price: 5.50, image: IMG.steak },
            { id: 607, category: 'Korean Corner', title: 'Korean Fried Chicken', description: 'Double-fried crispy chicken with sweet soy glaze.', price: 7.00, image: IMG.steak },
            { id: 608, category: 'Korean Corner', title: 'Japchae', description: 'Glass noodles stir-fried with vegetables and sesame oil.', price: 5.80, image: IMG.spag },
            // ── Sides & Snacks ──
            { id: 609, category: 'Sides & Snacks', title: 'Karaage', description: 'Japanese fried chicken, juicy inside with crispy skin.', price: 5.50, image: IMG.fries },
            { id: 610, category: 'Sides & Snacks', title: 'Gyoza (6 pcs)', description: 'Pan-fried pork and cabbage dumplings with ponzu dip.', price: 4.50, image: IMG.fries },
            { id: 611, category: 'Sides & Snacks', title: 'Edamame', description: 'Lightly salted steamed edamame pods.', price: 2.50, image: IMG.fries },
            // ── Drinks ──
            { id: 612, category: 'Drinks', title: 'Taro Bubble Tea', description: 'Classic taro milk tea with brown sugar tapioca pearls.', price: 3.50, image: IMG.juice },
            { id: 613, category: 'Drinks', title: 'Matcha Latte', description: 'Ceremonial matcha with steamed oat milk, served hot or iced.', price: 4.00, image: IMG.juice },
            { id: 614, category: 'Drinks', title: 'Korean Barley Tea', description: 'Roasted barley tea, caffeine-free and naturally earthy.', price: 2.50, image: IMG.juice },
            { id: 615, category: 'Drinks', title: 'Yuzu Citrus Soda', description: 'Japanese yuzu with sparkling water and honey.', price: 3.00, image: IMG.juice },
        ],
        reviews: [
            { id: 1, name: 'Kai M.', avatar: 'KM', rating: 4, date: 'Mar 2, 2026', text: 'The Spicy Miso Ramen hits different at midnight!' },
            { id: 2, name: 'Ria T.', avatar: 'RT', rating: 5, date: 'Feb 25, 2026', text: 'Love the fusion concept. Bibimbap is filling and flavourful.' },
            { id: 3, name: 'Lena P.', avatar: 'LP', rating: 4, date: 'Feb 12, 2026', text: 'Great ambiance. The bubble tea is very authentic.' },
            { id: 4, name: 'Sam K.', avatar: 'SK', rating: 5, date: 'Feb 1, 2026', text: 'Tteokbokki obsession fulfilled. Late night vibes are 10/10.' },
        ]
    },
];

function MenuPage() {
    const [selectedStore, setSelectedStore] = useState(null);
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeDietary, setActiveDietary] = useState('All');

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const filtered = stores.filter(s => {
        const matchCat = activeCategory === 'All' || s.category === activeCategory;
        const matchDiet = activeDietary === 'All' || s.dietary === activeDietary;
        return matchCat && matchDiet;
    });

    return (
        <>
            <div className="site-wrap">
                <Navbar />

                <main className={styles.menuPage}>
                    <div className="container-lg">

                        {/* Header */}
                        <div className={styles.pageHeader} data-aos="fade-up">
                            <div className={styles.breadcrumbs}>
                                <Link to="/">Home</Link> <span className="mx-2">/</span>
                                <span className={styles.current}>Restaurants</span>
                            </div>
                            <h1 className={styles.title}>Explore Restaurants</h1>
                            <p className={styles.subtitle}>Browse local branches, check their menus, and order with ease.</p>
                        </div>

                        {/* Search and Sort */}
                        <div className={styles.searchBarContainer} data-aos="fade-up" data-aos-delay="100">
                            <div className={styles.searchInputWrapper}>
                                <Search className={styles.searchIcon} size={18} />
                                <input type="text" className={styles.searchInput} placeholder="Search for a restaurant or cuisine..." />
                            </div>
                            <div className={styles.searchMeta}>
                                <div>
                                    <span className={styles.recipeCount}>{filtered.length}</span> restaurants found
                                </div>
                                <div>
                                    <span style={{ color: '#555', marginRight: '5px' }}>Sort by:</span>
                                    <select className={styles.sortSelect} defaultValue="Popularity">
                                        <option value="Popularity">Popularity</option>
                                        <option value="Rating">Rating</option>
                                        <option value="DeliveryTime">Delivery Time</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="row">

                            {/* Sidebar */}
                            <div className="col-lg-3 mb-4 mb-lg-0" data-aos="fade-right" data-aos-delay="200">
                                <div className={styles.sidebar}>
                                    <div className={styles.filterHeader}>
                                        <Filter size={20} color="#888" />
                                        <span>Filters</span>
                                    </div>

                                    <div className={styles.filterGroup}>
                                        <div className={styles.filterGroupTitle}>CATEGORY</div>
                                        {['All', 'Fast Food', 'Filipino', 'Japanese', 'Grills', 'Drinks'].map(cat => (
                                            <label key={cat} className={styles.radioLabel}>
                                                <input type="radio" name="category" className={styles.radioInput}
                                                    checked={activeCategory === cat} onChange={() => setActiveCategory(cat)} />
                                                {cat}
                                            </label>
                                        ))}
                                    </div>

                                    <div className={styles.filterGroup}>
                                        <div className={styles.filterGroupTitle}>DIETARY PREFERENCE</div>
                                        {['All', 'Vegetarian', 'Halal'].map(diet => (
                                            <label key={diet} className={styles.radioLabel}>
                                                <input type="radio" name="dietary" className={styles.radioInput}
                                                    checked={activeDietary === diet} onChange={() => setActiveDietary(diet)} />
                                                {diet}
                                            </label>
                                        ))}
                                    </div>

                                    <button className={styles.clearFiltersBtn}
                                        onClick={() => { setActiveCategory('All'); setActiveDietary('All'); }}>
                                        Clear all filters
                                    </button>
                                </div>
                            </div>

                            {/* Main content */}
                            <div className="col-lg-9" data-aos="fade-up" data-aos-delay="300">
                                <div className="row g-4">
                                    {filtered.map(store => (
                                        <div className="col-md-6 col-lg-4" key={store.id}>
                                            <div className={styles.productCard} onClick={() => setSelectedStore(store)}
                                                style={{ cursor: 'pointer' }}>
                                                <div className={styles.cardImageWrapper}>
                                                    <img src={store.cover} alt={store.name} className={styles.cardImage} loading="lazy" />
                                                    <span className={styles.deliveryBadge}><Clock size={11} /> {store.deliveryTime}</span>
                                                    <span className={store.status === 'Operational' ? styles.statusBadgeOpen : styles.statusBadgeClosed}>
                                                        ● {store.status}
                                                    </span>
                                                </div>
                                                <div className={styles.cardBody}>
                                                    <h3 className={styles.cardTitle}>{store.name}</h3>
                                                    <p className={styles.cardBranch}>{store.branchName}</p>
                                                    <p className={styles.cardDesc}>{store.cuisine}</p>
                                                    <div className={styles.cardMeta}>
                                                        <MapPin size={12} className={styles.metaIcon} />
                                                        <span className={styles.cardLocation}>{store.location}</span>
                                                    </div>
                                                    <div className={styles.cardFooter}>
                                                        <span className={styles.price}>
                                                            <Star size={13} fill="#F5A623" color="#F5A623" /> {store.rating}
                                                        </span>
                                                        <button className={styles.addBtn}>View Menu</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className={styles.pagination}>
                                    <Link to="#" className={`${styles.pageBtn} ${styles.pageIconBtn}`}><ChevronLeft size={18} /></Link>
                                    <Link to="#" className={`${styles.pageBtn} ${styles.active}`}>1</Link>
                                    <Link to="#" className={styles.pageBtn}>2</Link>
                                    <Link to="#" className={styles.pageBtn}>3</Link>
                                    <Link to="#" className={`${styles.pageBtn} ${styles.pageIconBtn}`}><ChevronRight size={18} /></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>

            <BackToTop />

            {selectedStore && (
                <StoreModal store={selectedStore} onClose={() => setSelectedStore(null)} />
            )}
        </>
    );
}

export default MenuPage;
