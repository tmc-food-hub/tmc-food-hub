// ── Reusable image refs ──────────────────────────────────────────────────
const IMG = {
    fries: '/assets/images/service/fries.png',
    spag: '/assets/images/service/spag.png',
    burger: '/assets/images/service/burger.png',
    juice: '/assets/images/service/juice.png',
    steak: '/assets/images/service/steak.png',
    sushi: '/assets/images/service/sushi.png',
};

// ── Reusable restaurant logo refs ────────────────────────────────────────
const LOGO = {
    jollibee: '/assets/images/service/resturant_logo/jollibee.svg',
    mcdonalds: '/assets/images/service/resturant_logo/mcdonald-s-7.svg',
    sushiNori: '/assets/images/service/resturant_logo/sushi nori.svg',
    mangInasal: '/assets/images/service/resturant_logo/Mang_Inasal.svg',
    chowking: '/assets/images/service/resturant_logo/chowking.svg',
    kfc: '/assets/images/service/resturant_logo/KFC.svg',
};

// ── Owner credentials (one per store) ───────────────────────────────────
export const ownerCredentials = [
    { storeId: 1, email: 'jollibee@tmcfoodhub.com', password: 'jollibee123' },
    { storeId: 2, email: 'mcdo@tmcfoodhub.com', password: 'mcdo123' },
    { storeId: 3, email: 'sushinori@tmcfoodhub.com', password: 'sushi123' },
    { storeId: 4, email: 'manginasal@tmcfoodhub.com', password: 'inasal123' },
    { storeId: 5, email: 'kfc@tmcfoodhub.com', password: 'kfc123' },
    { storeId: 6, email: 'chowking@tmcfoodhub.com', password: 'chowking123' },
];

// ── Default operating hours (Mon-Sun) ────────────────────────────────────
const defaultHours = [
    { day: 'Monday', open: true, from: '09:00', to: '22:00' },
    { day: 'Tuesday', open: true, from: '09:00', to: '22:00' },
    { day: 'Wednesday', open: true, from: '09:00', to: '22:00' },
    { day: 'Thursday', open: true, from: '09:00', to: '22:00' },
    { day: 'Friday', open: true, from: '09:00', to: '23:00' },
    { day: 'Saturday', open: true, from: '09:00', to: '23:00' },
    { day: 'Sunday', open: true, from: '10:00', to: '21:00' },
];

// ── Store / Restaurant Data ──────────────────────────────────────────────
export const defaultStores = [
    {
        id: 1,
        name: 'Jollibee',
        branchName: 'Jollibee SM City Branch',
        cuisine: 'Filipino Fast Food · Chicken · Burgers',
        category: 'Fast Food',
        dietary: 'Halal',
        location: 'SM City, North Reclamation Area, Cebu City',
        hours: '7:00 AM – 11:00 PM',
        phone: '+63 32 234 5678',
        status: 'Operational',
        deliveryTime: '20–35 min',
        minOrder: '$2.00',
        cover: LOGO.jollibee,
        logo: LOGO.jollibee,
        brandColor: 'linear-gradient(135deg, #D62027 0%, #EE3124 100%)',
        rating: 4.7,
        about: "One of the Philippines' most beloved fast food chains. Famous for Chickenjoy, Jolly Spaghetti, and Yumburger since 1978.",
        operatingHours: [
            { day: 'Monday', open: true, from: '07:00', to: '23:00' },
            { day: 'Tuesday', open: true, from: '07:00', to: '23:00' },
            { day: 'Wednesday', open: true, from: '07:00', to: '23:00' },
            { day: 'Thursday', open: true, from: '07:00', to: '23:00' },
            { day: 'Friday', open: true, from: '07:00', to: '23:00' },
            { day: 'Saturday', open: true, from: '07:00', to: '23:00' },
            { day: 'Sunday', open: true, from: '07:00', to: '23:00' },
        ],
        menuItems: [
            { id: 101, category: 'Chickenjoy Meals', title: 'Chickenjoy Solo', description: '1-pc crispy fried chicken, regular fries & drinks.', price: 3.50, available: true, image: '/assets/images/service/jollibee/1pc-Chickenjoy-Solo.svg' },
            { id: 102, category: 'Chickenjoy Meals', title: 'Chickenjoy 2-pc', description: '2-pc fried chicken with rice and gravy.', price: 5.80, available: true, image: '/assets/images/service/jollibee/2pc-Chickenjoy-Solo.svg' },
            { id: 103, category: 'Chickenjoy Meals', title: 'Chickenjoy Bucket 8-pc', description: 'Family bucket of 8 crispy chicken pieces.', price: 18.00, available: true, image: '/assets/images/service/jollibee/Chickenjoy-Bucket-8pc.svg' },
            { id: 104, category: 'Chickenjoy Meals', title: '10-pc Chicken Nuggets', description: 'Juicy chicken nuggets with dipping sauce.', price: 4.20, available: true, image: '/assets/images/service/jollibee/10-pc-Chicken-Nuggets.svg' },
            { id: 105, category: 'Burgers & Sandwiches', title: 'Yumburger', description: "Classic beef burger with Jollibee's signature sauce.", price: 1.80, available: true, image: '/assets/images/service/jollibee/Yumburger.svg' },
            { id: 106, category: 'Burgers & Sandwiches', title: 'Cheesy Yumburger', description: 'Yumburger topped with melted American cheese.', price: 2.30, available: true, image: '/assets/images/service/jollibee/Cheesy-Yumburger.svg' },
            { id: 107, category: 'Burgers & Sandwiches', title: 'Creamy Ranch Chicken Sandwich', description: 'Crispy chicken fillet in a soft burger bun with ranch.', price: 3.00, available: true, image: '/assets/images/service/jollibee/Creamy-Ranch-Chicken-Sandwich.svg' },
            { id: 108, category: 'Pasta & Rice', title: 'Jolly Spaghetti', description: 'Sweet-style spaghetti with hotdog slices and cheese.', price: 2.80, available: true, image: '/assets/images/service/jollibee/Jolly-Spaghetti.svg' },
            { id: 109, category: 'Pasta & Rice', title: 'Garlic Rice', description: 'Fragrant garlic fried rice perfect with any meal.', price: 1.50, available: true, image: '/assets/images/service/jollibee/Garlic Rice.svg' },
            { id: 110, category: 'Pasta & Rice', title: 'Jolly Hotdog', description: 'Grilled hotdog in a soft bun with cheese sauce.', price: 2.00, available: true, image: '/assets/images/service/jollibee/Jolly-Hotdog.svg' },
            { id: 111, category: 'Desserts & Drinks', title: 'Peach Mango Pie', description: 'Flaky pastry filled with sweet peach and mango.', price: 1.20, available: true, image: '/assets/images/service/jollibee/Peach-Mango-Pie.svg' },
            { id: 112, category: 'Desserts & Drinks', title: 'Jolly Sundae', description: 'Creamy soft-serve in chocolate or strawberry.', price: 1.00, available: true, image: '/assets/images/service/jollibee/Jolly-Sundae.svg' },
            { id: 113, category: 'Desserts & Drinks', title: 'Coke Float', description: 'Refreshing Coke with soft-serve vanilla.', price: 1.50, available: true, image: '/assets/images/service/jollibee/Coke Float.svg' },
        ],
        reviews: [
            { id: 1, name: 'Ana M.', avatar: 'AM', rating: 5, date: 'Mar 1, 2026', text: 'Best Chickenjoy in the city! Always fresh and crispy.' },
            { id: 2, name: 'Ben C.', avatar: 'BC', rating: 5, date: 'Feb 22, 2026', text: 'Fast service and always consistent. Love it!' },
            { id: 3, name: 'Carla D.', avatar: 'CD', rating: 4, date: 'Feb 10, 2026', text: 'Spaghetti is a bit sweeter than usual but still delicious.' },
            { id: 4, name: 'Dan R.', avatar: 'DR', rating: 5, date: 'Feb 3, 2026', text: 'Peach Mango Pie is always the highlight! Great value.' },
        ]
    },
    {
        id: 2,
        name: "McDonald's",
        branchName: "McDonald's Ayala Center Branch",
        cuisine: 'American Fast Food · Burgers · Coffee',
        category: 'Fast Food',
        dietary: 'All',
        location: 'Ayala Center Cebu, Archbishop Reyes Ave.',
        hours: '24 Hours',
        phone: '+63 32 888 1234',
        status: 'Operational',
        deliveryTime: '15–25 min',
        minOrder: '$3.00',
        cover: LOGO.mcdonalds,
        logo: LOGO.mcdonalds,
        brandColor: 'linear-gradient(135deg, #DA291C 0%, #FFC72C 100%)',
        rating: 4.5,
        about: "The world's largest fast food chain. Known for the Big Mac, McFlurry, and McCafé. Now serving 24/7 at Ayala.",
        operatingHours: [
            { day: 'Monday', open: true, from: '00:00', to: '23:59' },
            { day: 'Tuesday', open: true, from: '00:00', to: '23:59' },
            { day: 'Wednesday', open: true, from: '00:00', to: '23:59' },
            { day: 'Thursday', open: true, from: '00:00', to: '23:59' },
            { day: 'Friday', open: true, from: '00:00', to: '23:59' },
            { day: 'Saturday', open: true, from: '00:00', to: '23:59' },
            { day: 'Sunday', open: true, from: '00:00', to: '23:59' },
        ],
        menuItems: [
            { id: 201, category: 'Mix & Match', title: 'McSavers Burger', description: 'Budget-friendly beef burger with lettuce and ketchup.', price: 1.50, available: true, image: '/assets/images/service/mcdonald/McSavers-Burger.svg' },
            { id: 202, category: 'Mix & Match', title: 'McSavers McFries', description: 'Small golden fries at a great everyday price.', price: 1.20, available: true, image: '/assets/images/service/mcdonald/McSavers-Fries.svg' },
            { id: 203, category: 'Mix & Match', title: 'McSavers Sundae', description: 'Soft-serve sundae in chocolate or strawberry drizzle.', price: 1.00, available: true, image: '/assets/images/service/mcdonald/McSavers-Sundae.svg' },
            { id: 204, category: 'Mix & Match', title: 'McSavers Fried Chicken', description: '1-pc crispy chicken at budget price.', price: 2.00, available: true, image: '/assets/images/service/mcdonald/McSavers-Chicken-Mcdo.svg' },
            { id: 205, category: 'Fully Loaded', title: 'Big Mac', description: 'Double beef patty, special sauce, lettuce, cheese, pickles.', price: 5.00, available: true, image: '/assets/images/service/mcdonald/Big-Mac.svg' },
            { id: 206, category: 'Fully Loaded', title: 'Quarter Pounder with Cheese', description: 'Quarter-pound beef with fresh tomato and crispy lettuce.', price: 5.50, available: true, image: '/assets/images/service/mcdonald/Quarter-Pounder-with-Cheese.svg' },
            { id: 207, category: 'Fully Loaded', title: 'Crispy Chicken Ala King Solo', description: 'Crispy chicken fillets with creamy ala king sauce.', price: 4.80, available: true, image: '/assets/images/service/mcdonald/Crispy-Chicken-Ala-King-Solo.svg' },
            { id: 208, category: 'Fully Loaded', title: 'BFF Fries', description: 'Our largest serving of golden crispy fries.', price: 3.50, available: true, image: '/assets/images/service/mcdonald/BFF-Fries.svg' },
            { id: 209, category: 'McCafé', title: 'McCafe Sea Salt Caramel Iced Coffee', description: 'Iced coffee with sea salt caramel.', price: 3.80, available: true, image: '/assets/images/service/mcdonald/McCafe-Sea-Salt-Caramel-Iced-Coffee.svg' },
            { id: 210, category: 'McCafé', title: 'McCafe Cereal Milk Iced Coffee', description: 'Iced coffee swirled with cereal milk sweetness.', price: 3.50, available: true, image: '/assets/images/service/mcdonald/McCafe-Cereal-Milk-Iced-Coffee.svg' },
            { id: 211, category: 'McCafé', title: 'McFlurry with Oreo', description: 'Soft serve blended with crushed Oreo cookies.', price: 3.00, available: true, image: '/assets/images/service/mcdonald/McFlurry-with-Oreo.svg' },
            { id: 212, category: 'Happy Meals', title: 'Chicken McDo Happy Meal', description: '1-pc chicken, small fries, juice, and a toy surprise.', price: 4.00, available: true, image: '/assets/images/service/mcdonald/Chicken-Mcdo-Happy-Meal.svg' },
            { id: 213, category: 'Happy Meals', title: 'Burger Happy Meal', description: 'Cheeseburger, small fries, apple juice, and a toy.', price: 3.80, available: true, image: '/assets/images/service/mcdonald/Burger-Mcdo-Happy-Meal.svg' },
        ],
        reviews: [
            { id: 1, name: 'Rico P.', avatar: 'RP', rating: 5, date: 'Mar 3, 2026', text: 'Open 24 hours is a lifesaver! Big Mac never disappoints.' },
            { id: 2, name: 'Lea S.', avatar: 'LS', rating: 4, date: 'Feb 28, 2026', text: 'Clean branch, fast lanes. McFlurry is always on point.' },
            { id: 3, name: 'Mark T.', avatar: 'MT', rating: 4, date: 'Feb 15, 2026', text: 'Good food but can get crowded during lunch rush.' },
            { id: 4, name: 'Joy B.', avatar: 'JB', rating: 5, date: 'Feb 8, 2026', text: 'The McCafé drinks are seriously underrated.' },
        ]
    },
    {
        id: 3,
        name: 'Sushi Nori',
        branchName: 'Sushi Nori IT Park Branch',
        cuisine: 'Japanese · Sushi · Ramen',
        category: 'Japanese',
        dietary: 'All',
        location: 'Cebu IT Park, Lahug, Cebu City',
        hours: '11:00 AM – 10:00 PM',
        phone: '+63 32 411 9900',
        status: 'Operational',
        deliveryTime: '30–45 min',
        minOrder: '$5.00',
        cover: LOGO.sushiNori,
        logo: LOGO.sushiNori,
        brandColor: 'linear-gradient(135deg, #1e3a5f 0%, #2563EB 100%)',
        rating: 4.6,
        about: 'A modern Japanese dining experience with fresh sushi, bento sets, and authentic ramen.',
        operatingHours: [
            { day: 'Monday', open: true, from: '11:00', to: '22:00' },
            { day: 'Tuesday', open: true, from: '11:00', to: '22:00' },
            { day: 'Wednesday', open: true, from: '11:00', to: '22:00' },
            { day: 'Thursday', open: true, from: '11:00', to: '22:00' },
            { day: 'Friday', open: true, from: '11:00', to: '23:00' },
            { day: 'Saturday', open: true, from: '11:00', to: '23:00' },
            { day: 'Sunday', open: false, from: '12:00', to: '21:00' },
        ],
        menuItems: [
            { id: 301, category: 'Signature Rolls', title: 'California Roll', description: 'Crab stick, mango, cucumber, and mayo.', price: 8.00, available: true, image: '/assets/images/service/sushiNori/California-Roll.svg' },
            { id: 302, category: 'Signature Rolls', title: 'Tuna Roll', description: 'Fresh tuna chunks rolled in nori.', price: 9.50, available: true, image: '/assets/images/service/sushiNori/Tuna-Roll.svg' },
            { id: 303, category: 'Signature Rolls', title: 'Tamago Roll', description: 'Sweet Japanese omelette in a sushi roll.', price: 9.00, available: true, image: '/assets/images/service/sushiNori/Tamago-Roll.svg' },
            { id: 304, category: 'Signature Rolls', title: 'Salmon Aburi', description: 'Torched Norwegian salmon with yuzu ponzu and scallion.', price: 10.50, available: true, image: '/assets/images/service/sushiNori/Salmon-Aburi.svg' },
            { id: 305, category: 'Hot Bowls & Platters', title: 'Basic Party Platter', description: 'An assortment of 40 pieces signature sushi.', price: 25.50, available: true, image: '/assets/images/service/sushiNori/Basic-Party-Platter.svg' },
            { id: 306, category: 'Hot Bowls & Platters', title: 'Classic Party Platter', description: 'An assortment of 55 pieces signature sushi.', price: 35.00, available: true, image: '/assets/images/service/sushiNori/Classic-Party-Platter.svg' },
            { id: 307, category: 'Hot Bowls & Platters', title: 'Gyudon Beef Bowl', description: 'Seasoned beef and onions over steamed Japanese rice.', price: 8.50, available: true, image: '/assets/images/service/sushiNori/Gyudon-Beef-Bowl.svg' },
            { id: 308, category: 'Hot Bowls & Platters', title: 'Chirashi Bowl', description: 'Assorted sashimi over sushi rice with pickled ginger.', price: 12.00, available: true, image: '/assets/images/service/sushiNori/Chirasi-Bowl.svg' },
            { id: 309, category: 'Grills & Mains', title: 'Wagyu Teppan Donburi', description: 'Premium wagyu beef grilled teppan style over rice.', price: 15.00, available: true, image: '/assets/images/service/sushiNori/Wagyu-Teppan-Donburi.svg' },
            { id: 310, category: 'Grills & Mains', title: 'Karaage Teriyaki', description: 'Japanese fried chicken glazed with teriyaki sauce.', price: 11.00, available: true, image: '/assets/images/service/sushiNori/Karaage-Teriyaki.svg' },
            { id: 311, category: 'Grills & Mains', title: 'Karaage Platter', description: 'Double serving of Japanese fried chicken with kewpie mayo.', price: 7.50, available: true, image: '/assets/images/service/sushiNori/Karaage-Platter.svg' },
            { id: 312, category: 'Beverages', title: 'Matcha Ube Latte', description: 'Ceremonial grade matcha with sweet ube oat milk.', price: 4.00, available: true, image: '/assets/images/service/sushiNori/Matcha-Ube-Latte.svg' },
            { id: 313, category: 'Beverages', title: 'Matcha Yuzu Lemonade', description: 'Refreshing yuzu citrus matcha with sparkling water.', price: 3.50, available: true, image: '/assets/images/service/sushiNori/Matcha-Yuzu-Lemonade.svg' },
            { id: 314, category: 'Beverages', title: 'Matcha Strawberry Latte', description: 'Brewed matcha tea with fresh strawberry pure and milk.', price: 3.00, available: true, image: '/assets/images/service/sushiNori/Matcha-Strawberry-Latte.svg' },
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
        name: 'Mang Inasal',
        branchName: 'Mang Inasal Colon Branch',
        cuisine: 'Filipino BBQ · Rice Meals · Inasal',
        category: 'Filipino',
        dietary: 'Halal',
        location: 'Colon Street, Downtown, Cebu City',
        hours: '9:00 AM – 10:00 PM',
        phone: '+63 32 256 7788',
        status: 'Operational',
        deliveryTime: '25–40 min',
        minOrder: '$2.50',
        cover: LOGO.mangInasal,
        logo: LOGO.mangInasal,
        brandColor: 'linear-gradient(135deg, #7C2D12 0%, #EA580C 100%)',
        rating: 4.4,
        about: 'Home of unlimited rice and authentic charcoal-grilled chicken inasal. Great value for Cebuanos.',
        operatingHours: defaultHours.map(h => ({ ...h, from: '09:00', to: '22:00' })),
        menuItems: [
            { id: 401, category: 'Paborito Meals', title: 'Chicken Paa Solo', description: 'Charcoal-grilled chicken leg with unli-rice and soup.', price: 3.80, available: true, image: '/assets/images/service/mangInasal/Chicken-Paa-Solo.svg' },
            { id: 402, category: 'Paborito Meals', title: 'Chicken Pecho Solo', description: 'Grilled chicken breast, extra juicy with calamansi marinade.', price: 4.00, available: true, image: '/assets/images/service/mangInasal/Chicken-Pecho-Solo.svg' },
            { id: 403, category: 'Paborito Meals', title: 'BBQ Pork Combo', description: 'Skewered pork BBQ with garlic rice and sawsawan.', price: 4.50, available: true, image: '/assets/images/service/mangInasal/BBQ-Pork-Combo.svg' },
            { id: 404, category: 'Paborito Meals', title: 'Liempo Meal', description: 'Grilled pork belly with rice. A Cebuano classic.', price: 5.00, available: true, image: '/assets/images/service/mangInasal/Liempo-Meal.svg' },
            { id: 405, category: 'Fiesta Packages', title: '4-pc Inasal Pack', description: '4 pcs chicken inasal, rice, soup, sawsawan for 2-3 pax.', price: 12.00, available: true, image: '/assets/images/service/mangInasal/4-Pc-Inasal-Pack.svg' },
            { id: 406, category: 'Fiesta Packages', title: 'Family Fiesta Bucket', description: 'Perfect chicken family fiesta meal.', price: 22.00, available: true, image: '/assets/images/service/mangInasal/All-Chicken-Inasal-Family-Fiesta.svg' },
            { id: 407, category: 'Sidings', title: 'Palabok', description: 'Rice noodles in savory shrimp sauce with pork chicharon.', price: 3.50, available: true, image: '/assets/images/service/mangInasal/Palabok.svg' },
            { id: 408, category: 'Sidings', title: 'Bangus Sisig', description: 'Sizzling milkfish sisig with onions and peppers.', price: 4.20, available: true, image: '/assets/images/service/mangInasal/Bangus-Sisig.svg' },
            { id: 409, category: 'Sidings', title: 'Java Rice', description: 'Fragrant java rice perfect with any grilled dish.', price: 1.50, available: true, image: '/assets/images/service/mangInasal/Java-Rice.svg' },
            { id: 410, category: 'Desserts & Drinks', title: 'Halo-Halo', description: 'Classic Filipino shaved ice with leche flan and ube ice cream.', price: 2.50, available: true, image: '/assets/images/service/mangInasal/Halo-Halo.svg' },
            { id: 411, category: 'Desserts & Drinks', title: 'Crema de Leche Halo-Halo', description: 'Sweet creamy shaved ice with milk drizzle.', price: 2.00, available: true, image: '/assets/images/service/mangInasal/Crema-de-Leche-Halo-Halo.svg' },
            { id: 412, category: 'Desserts & Drinks', title: 'Iced Red Gulaman', description: 'Chilled sweet juice with gulaman.', price: 1.50, available: true, image: '/assets/images/service/mangInasal/Iced-Red-Gulaman.svg' },
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
        name: 'KFC',
        branchName: 'KFC IT Park Branch',
        cuisine: 'American Fast Food · Chicken',
        category: 'Fast Food',
        dietary: 'All',
        location: 'Cebu IT Park, Lahug, Cebu City',
        hours: '10:00 AM – 10:00 PM',
        phone: '+63 32 412 1234',
        status: 'Operational',
        deliveryTime: '20–35 min',
        minOrder: '$3.00',
        cover: LOGO.kfc,
        logo: LOGO.kfc,
        brandColor: 'linear-gradient(135deg, #E60000 0%, #A30000 100%)',
        rating: 4.8,
        about: 'Finger Lickin Good fried chicken.',
        operatingHours: defaultHours.map(h => ({ ...h, from: '10:00', to: '22:00' })),
        menuItems: [
            { id: 501, category: 'Chicken Meals', title: '1-PC Fully Loaded Meal', description: '1-pc chicken, rice, mushroom soup, and drink.', price: 4.00, available: true, image: '/assets/images/service/kfc/1-PC-Fully-Loaded-Meal.svg' },
            { id: 502, category: 'Chicken Meals', title: '1-pc Chicken Meal', description: '1-pc original recipe chicken, rice, and gravy.', price: 3.50, available: true, image: '/assets/images/service/kfc/1pc-Chicken-Meal.svg' },
            { id: 503, category: 'Chicken Meals', title: '2-pc Chicken Meal', description: '2-pc original recipe chicken, rice, and gravy.', price: 5.50, available: true, image: '/assets/images/service/kfc/2pc-Chicken-Meal.svg' },
            { id: 504, category: 'Chicken Meals', title: '8-pc Chicken Bucket', description: '8 pieces of delicious fried chicken.', price: 18.00, available: true, image: '/assets/images/service/kfc/8pc-Chicken-Bucket.svg' },
            { id: 505, category: 'Bowls', title: 'Ala King Rice Bowl', description: 'Chicken shots with Ala King sauce and rice.', price: 2.80, available: true, image: '/assets/images/service/kfc/Ala-King-Rice-Bowl.svg' },
            { id: 506, category: 'Bowls', title: 'Sisig Rice Bowl', description: 'Sisig style chicken shots over rice.', price: 3.00, available: true, image: '/assets/images/service/kfc/Sisig-Rice-Bowl.svg' },
            { id: 507, category: 'Bowls', title: 'Famous Bowl', description: 'Mashed potatoes topped with chicken, corn, gravy and cheese.', price: 3.50, available: true, image: '/assets/images/service/kfc/Famous-Bowl.svg' },
            { id: 508, category: 'Burgers & Wraps', title: 'Zinger Burger', description: 'Spicy chicken fillet burger with lettuce and mayo.', price: 3.50, available: true, image: '/assets/images/service/kfc/Zinger-Burger.svg' },
            { id: 509, category: 'Burgers & Wraps', title: 'Cali Maki Twister', description: 'Chicken strips, cucumber, mango, wrapped in a tortilla.', price: 3.20, available: true, image: '/assets/images/service/kfc/Cali-Maki-Twister.svg' },
            { id: 510, category: 'Sides', title: 'Crispy Fries', description: 'Golden crispy fries.', price: 2.00, available: true, image: '/assets/images/service/kfc/Crispy-Fries.svg' },
            { id: 511, category: 'Sides', title: 'Mashed Potato Regular', description: 'Creamy mashed potato with signature gravy.', price: 1.50, available: true, image: '/assets/images/service/kfc/Mashed-Potato-Regular.svg' },
            { id: 512, category: 'Sides', title: 'Regular Shots', description: 'Bite-sized chicken shots.', price: 2.50, available: true, image: '/assets/images/service/kfc/Regular-Shots.svg' },
            { id: 513, category: 'Desserts', title: 'Brownie Box', description: 'Box of fudgy brownies.', price: 3.00, available: true, image: '/assets/images/service/kfc/Brownie-Box.svg' },
        ],
        reviews: [
            { id: 1, name: 'John D.', avatar: 'JD', rating: 5, date: 'Mar 1, 2026', text: 'Zinger is the best fast food burger!' }
        ]
    },
    {
        id: 6,
        name: 'Chowking',
        branchName: 'Chowking SM City',
        cuisine: 'Chinese Fast Food · Dimsum',
        category: 'Chinese',
        dietary: 'All',
        location: 'SM City Cebu',
        hours: '10:00 AM – 9:00 PM',
        phone: '+63 32 234 9999',
        status: 'Operational',
        deliveryTime: '25–40 min',
        minOrder: '$3.00',
        cover: LOGO.chowking,
        logo: LOGO.chowking,
        brandColor: 'linear-gradient(135deg, #DA291C 0%, #FFC72C 100%)',
        rating: 4.3,
        about: 'Freshly prepared Chinese fast food.',
        operatingHours: defaultHours.map(h => ({ ...h, from: '10:00', to: '21:00' })),
        menuItems: [
            { id: 601, category: 'Chao Fan', title: 'Beef Chao Fan', description: 'Fried rice served with beef toppings.', price: 2.50, available: true, image: '/assets/images/service/chowking/Beef-Chao-Fan.svg' },
            { id: 602, category: 'Chao Fan', title: 'Pork Chao Fan', description: 'Fried rice served with pork toppings.', price: 2.30, available: true, image: '/assets/images/service/chowking/Pork-Chao-Fan.svg' },
            { id: 603, category: 'Chao Fan', title: 'Siomai Chao Fan', description: 'Fried rice topped with steamed siomai.', price: 3.00, available: true, image: '/assets/images/service/chowking/Siomai-Chao-Fan.svg' },
            { id: 604, category: 'Chao Fan', title: 'Spicy Chao Fan Platter', description: 'Spicy fried rice platter for sharing.', price: 5.50, available: true, image: '/assets/images/service/chowking/Spicy-Chao-Fan-Platter.svg' },
            { id: 605, category: 'Chao Fan', title: 'Extra Egg Fried Rice', description: 'Egg fried rice extra flavor.', price: 1.50, available: true, image: '/assets/images/service/chowking/Extra-Egg-Fried-Rice.svg' },
            { id: 606, category: 'Noodles', title: 'Beef Mami', description: 'Noodle soup with slow-cooked beef bricket.', price: 3.50, available: true, image: '/assets/images/service/chowking/Beef-Mami.svg' },
            { id: 607, category: 'Noodles', title: 'Wonton Mami', description: 'Noodle soup with pork wontons.', price: 3.20, available: true, image: '/assets/images/service/chowking/Wonton-Mami.svg' },
            { id: 608, category: 'Noodles', title: 'Pancit Canton', description: 'Stir-fried noodles with meat and vegetables.', price: 3.50, available: true, image: '/assets/images/service/chowking/Pancit-Canton.svg' },
            { id: 609, category: 'Chicken & Dimsum', title: '1pc Chinese-Style Fried Chicken', description: 'Fried chicken with a crisp, savory skin.', price: 3.00, available: true, image: '/assets/images/service/chowking/1pc-Chinese-Style-Fried-Chicken.svg' },
            { id: 610, category: 'Chicken & Dimsum', title: '8pc Chinese-Style Fried Chicken', description: '8 pieces of crispy fried chicken.', price: 16.00, available: true, image: '/assets/images/service/chowking/8pc-Chinese-Style-Fried-Chicken.svg' },
            { id: 611, category: 'Chicken & Dimsum', title: 'Chinese-Style Fried Chicken Lauriat', description: 'Chicken, rice, noodles, chicharap, and buchi.', price: 6.00, available: true, image: '/assets/images/service/chowking/Chinese-Style-Fried-Chicken-Lauriat.svg' },
            { id: 612, category: 'Chicken & Dimsum', title: 'Lumpiang Shanghai Rice Meal', description: 'Fried spring rolls with rice.', price: 2.50, available: true, image: '/assets/images/service/chowking/Lumpiang-Shanghai-Rice-Meal.svg' },
            { id: 613, category: 'Desserts & Drinks', title: 'Halo-Halo Supreme', description: 'Classic Filipino shaved ice dessert.', price: 3.50, available: true, image: '/assets/images/service/chowking/Halo-Halo-Supreme.svg' },
            { id: 614, category: 'Desserts & Drinks', title: 'Black Tea Latte with Pudding', description: 'Sweet black tea latte with pudding.', price: 2.80, available: true, image: '/assets/images/service/chowking/Black-Tea-Latte-with-Pudding.svg' },
            { id: 615, category: 'Desserts & Drinks', title: 'Buchi Group Platter', description: 'Deep-fried sesame balls with lotus paste.', price: 4.50, available: true, image: '/assets/images/service/chowking/Buchi-Group-Platter.svg' },
        ],
        reviews: [
            { id: 1, name: 'Maria C.', avatar: 'MC', rating: 4, date: 'Mar 2, 2026', text: 'Chao Fan is my go-to comfort food.' }
        ]
    },
];

// ── Get live stores (merges localStorage edits on top of defaults) ───────
export function getStores() {
    try {
        const saved = localStorage.getItem('tmcStores');
        if (saved) {
            const parsed = JSON.parse(saved);
            // Invalidate cache if it contains old stores that were replaced or old images
            const hasOldStores = parsed.some(s => s.name === 'Steak & Co.' || s.name === 'Té Hana Ramen' || s.name === 'Patty Shack');
            const hasOldImages = parsed.some(s => s.menuItems && s.menuItems.some(m => m.image && (m.image.includes('fries.png') || m.image.includes('burger.png'))));

            if (hasOldStores || hasOldImages) {
                localStorage.removeItem('tmcStores');
                return defaultStores;
            }
            return parsed;
        }
        return defaultStores;
    } catch {
        return defaultStores;
    }
}

export function saveStores(stores) {
    localStorage.setItem('tmcStores', JSON.stringify(stores));
}
