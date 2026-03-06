# TMC Food Hub - Backend & Database Setup Plan

This document tracks the steps needed to transition the current frontend mock data (stores, menus, users, orders, and reviews) into a fully functional Laravel + MySQL backend.

## 1. Database & Environment Setup
- [ ] Ensure XAMPP/MySQL is running.
- [ ] Create a new MySQL database (e.g., `tmc_foodhub`).
- [ ] Update `backend/.env` with the correct database credentials (`DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`).
- [ ] Run `php artisan migrate:fresh` to clear and reset the database.

## 2. Models & Migrations
Create the necessary database tables via Laravel Migrations:
- [ ] **Users Table**
  - Roles (Customer vs. Restaurant Owner vs. Admin)
  - Name, Email, Password, Phone, Address
- [ ] **Stores/Restaurants Table**
  - Connect to User (Owner ID)
  - Name, Branch Name, Cuisine/Category, Location, Hours, Phone, Status (Operational/Closed), Delivery Time, Min Order
  - Brand branding (Logo path, Cover path, Brand color, Rating)
  - About/Description
- [ ] **Menu Categories Table**
  - Connect to Store ID
  - Name (e.g., "Signature Rolls", "Drinks", "Desserts")
- [ ] **Menu Items Table**
  - Connect to Menu Category ID or Store ID
  - Title, Description, Price, Image path, Available (boolean)
- [ ] **Reviews Table**
  - Connect to Store ID and User ID (Customer)
  - Rating (1-5), Comment Text, Date, Tags (JSON array)
- [ ] **Orders Table**
  - Connect to User ID (Customer) and Store ID
  - Total amount, Subtotal, Delivery Fee, Discount, Status, Estimated Arrival, Payment Method, Delivery Address, Special Instructions
- [ ] **Order Items Table**
  - Connect to Order ID and Menu Item ID
  - Quantity, Price at time of order

## 3. Database Seeding (Moving Mock Data)
- [ ] Create a `StoreSeeder` to import the current mock restaurants from `storesData.js`.
- [ ] Create a `MenuItemSeeder` to attach the initial menus to those stores.
- [ ] Create an `OwnerSeeder` for the mock owner accounts (`jollibee@tmcfoodhub.com`, etc.).
- [ ] Use Laravel Database Seeders (`php artisan db:seed`) to populate the initial tables so the frontend has data to work with immediately.

## 4. API Controllers & Routes
Create `API` routes in `backend/routes/api.php` and corresponding controllers:
- [ ] **AuthAPI Controller** (Login, Register, Logout using Sanctum/JWT)
- [ ] **StoreController**
  - `GET /api/stores` - List all stores (with filters for category)
  - `GET /api/stores/{id}` - Get single store with full menu and reviews
  - `PUT /api/stores/{id}` - Update store details (Owner only)
- [ ] **MenuController**
  - `POST /api/menu` - Add a new menu item (Owner only)
  - `PUT /api/menu/{id}` - Update menu item details/availability
  - `DELETE /api/menu/{id}` - Remove menu item
- [ ] **OrderController**
  - `POST /api/orders` - Place a new order (Customer)
  - `GET /api/orders` - List current user's orders (Customer)
  - `GET /api/owner/orders` - List store's orders (Owner only)
  - `PUT /api/orders/{id}/status` - Update order status (Owner only)
- [ ] **ReviewController**
  - `POST /api/reviews` - Submit a new review for a store (Customer)

## 5. Frontend Integration
Change the React frontend to fetch from Laravel instead of `localStorage`:
- [ ] Install configuring Axios (`axios.js`) to point to the Laravel `http://localhost:8000/api` base URL.
- [ ] Update `storesData.js / MenuPage.jsx` to fetch stores from the API.
- [ ] Update `StoreModal.jsx` to fetch and submit reviews via API.
- [ ] Update `CartContext.jsx / CheckoutPage.jsx` to post the final order to the API.
- [ ] Update `OrderContext.jsx / MyOrdersPage.jsx` to fetch active/completed orders from the API instead of dummy data.
- [ ] Update `OwnerDashboard.jsx` to fetch and update real backend menu items and orders for their specific `store_id`.

## 6. Testing & Finalization
- [ ] Test the full User Registration -> Order Flow using the database.
- [ ] Test the full Owner Login -> Manage Menu -> Process Order Flow using the database.
- [ ] Ensure all local assets (images) are uploaded via Laravel Storage or served from the public folder correctly.
