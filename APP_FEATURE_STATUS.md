# Application Feature Status & Roadmap

This document outlines the current state of features across the TMC FoodHub application. It highlights which features are fully functional and connected to the live API, and which features are currently relying on static/mock data and need further development.

## 1. Promotions System

| Role | Status | Description |
| :--- | :--- | :--- |
| **Admin** | 🟢 Fully Functional | Fully connected to the live backend. Admins can create, edit, delete, and view active/expiring promotions. |
| **Owner** | 🔴 Mock Data | The `PromotionsSection` UI is static. Clicking "Create" shows a fake success dialog. No backend endpoints exist for Owners to manage their own promos. |
| **Customer** | 🔴 Missing | The Checkout page has no input field for applying Promo Codes, and the Cart logic does not calculate discount subtractions. |

## 2. Customer Application

| Feature | Status | Description |
| :--- | :--- | :--- |
| **User Authentication** | 🟢 Functional | Login, Registration, OTP, and Profile fetching are live and connected. |
| **Restaurant Browsing** | 🟢 Functional | Fetching Live Restaurants, Menus, and Reviews are working. |
| **Cart & Order Placement** | 🟢 Functional | Cart logic connects to `OrderController` backend successfully. |
| **Inventory Deduction** | 🟢 Functional | Connected backend logic successfully reduces stock levels upon ordering. |
| **Live Map Tracking** | 🔴 Mock Data | The `OrderTrackingPage` uses simulated GPS coordinates and fake rider movement logic instead of live tracking. |
| **Distance/Time Sorting** | 🔴 Mock Data | The Menu page sorting by "Nearest" or "Fastest" relies on hardcoded mockup logic. |
| **Address/Favorites** | 🔴 Missing | Users cannot proactively save multiple delivery addresses or "Favorite" a restaurant for quick access. |

## 3. Restaurant Owner Application

| Feature | Status | Description |
| :--- | :--- | :--- |
| **Order Management** | 🟢 Functional | Owners can safely view orders targeted at their restaurant and update live status. |
| **Menu/Category Mgmt** | 🟢 Functional | Fully connected to CRUD endpoints for managing their live menus. |
| **Real-time Ringing** | 🟡 Polling Used | The app "polls" the server every 5 seconds for new orders instead of using instant WebSockets (Pusher/Reverb). |
| **Analytics Dashboard** | 🟡 Partially Mocked| Basic invoice/sales calculations work, but the advanced graphing/visualization data relies on static arrays. |

> [!NOTE] 
> **Next Recommended Steps:**
> - **Frontend Quick Wins:** Build a **Global Search and Filter Component** for the Customer App, or add a **Favorites System** (can be built rapidly using frontend Local Storage).
> - **Core Feature Completion:** Finish the **Promotions Flow** (Adding Promo Input to Customer Checkout & Building Owner Promo API routes).
