# TMC Food Hub
## Detailed Feature Documentation

Prepared from a direct codebase inspection on March 30, 2026.

---

## 1. Document Purpose

This document describes the current features, modules, and system behavior of the TMC Food Hub project. It is intended to serve as:

- a product feature reference
- a system overview for developers and stakeholders
- a complete reference for the implemented modules and delivered platform behavior

The documentation covers the full stack:

- the customer-facing website and ordering flow
- the restaurant owner dashboard
- the administrator portal
- the Laravel backend services and API behavior

---

## 2. Product Overview

TMC Food Hub is a multi-role food ordering platform built as a full-stack web application. The system supports three core user groups:

- **Customers** who browse restaurants, place food orders, upload payment proofs, track deliveries, manage accounts, and leave reviews
- **Restaurant owners** who manage menus, categories, inventory, order fulfillment, payment settings, analytics, and store configuration
- **Administrators** who oversee customers, restaurants, orders, disputes, promotions, analytics, platform settings, permissions, and activity logs

The repository is organized into:

- `frontend` - React + Vite application
- `backend` - Laravel API, models, migrations, mailers, tests, and support code

---

## 3. Technology Stack

### 3.1 Frontend

- React 19
- React Router
- Axios
- React Leaflet
- Lucide React
- jsPDF
- html2canvas
- CSS Modules and shared CSS assets

### 3.2 Backend

- Laravel 12
- Laravel Sanctum
- Eloquent ORM
- Mail-based OTP delivery
- Migration-driven database structure

### 3.3 Main Data Domains

- Users
- Restaurant owners
- Categories
- Menu items
- Orders
- Order items
- Reviews
- Review helpful votes
- Promotions
- Platform settings
- Security settings
- Activity logs
- Email verifications
- Password reset verifications

---

## 4. Current Feature Status Summary

| Area | Status | Summary |
| --- | --- | --- |
| Customer authentication | Implemented | Email login, signup, OTP verification, Google auth, forgot-password OTP reset |
| Restaurant browsing | Implemented | Restaurant listing, menu pages, filters, search, pagination |
| Cart and checkout | Implemented | Single-restaurant cart, scheduling, payment selection, online payment receipt upload |
| Order lifecycle | Implemented | Order placement, status updates, cancellation, tracking, reorder |
| Customer reviews | Implemented | Review submission, rating summaries, helpful votes, owner replies |
| Owner dashboard | Implemented | Orders, inventory, menu CRUD, categories, reviews, analytics, payment settings |
| Owner promotions | Implemented | Owner promotions management includes listing, filtering, metrics, and promotion creation workflows |
| Admin dashboard | Implemented | KPIs, orders, customers, restaurants, reviews, disputes, payments, analytics, promotions, settings |
| Admin exports | Implemented | Export flows are available across administrative reporting and management areas |
| Marketing/content pages | Implemented | Home, services, FAQ, support, events, announcements, and news/blog pages |

---

## 5. Customer-Facing Features

### 5.1 Public Website and Content Experience

The public site includes a branded marketing and information experience composed of reusable sections and individual pages.

**Implemented pages and sections**

- Home page
- Services page
- FAQ page
- Support page
- Company events and announcements page
- News and blogs listing page
- News/blog detail pages
- Announcement detail pages

**Home page section set**

- Hero
- About
- Features
- How It Works
- Testimonials
- Services
- Events
- News/blog preview
- FAQ
- Contact
- Footer

**Additional content behavior**

- Shared theme support through `ThemeContext`
- Lazy-loaded route components for major pages
- Announcement detail pages include a PDF export flow built with `jsPDF` and `html2canvas`

### 5.2 Customer Authentication and Registration

The customer authentication layer supports both traditional and Google-based access.

**Login features**

- Email and password login
- Google login
- Remember-me UI option
- Validation feedback and API error handling

**Signup features**

- Multi-step signup flow
- Role-aware signup shell shared with partner registration
- Email OTP verification before account completion
- Legal acceptance flow for terms and privacy
- Optional marketing opt-in

**Forgot password features**

- Email-based reset initiation
- Reset OTP verification
- Password reset token handling
- New password and confirmation step

**Session management**

- Token stored in local storage
- Authenticated user restored from token on refresh
- Unauthorized token cleanup when session validation fails

### 5.3 Customer Profile Management

Authenticated customers can manage their personal profile and delivery-related data.

**Profile capabilities**

- View personal account summary
- Edit first name and last name
- Update phone number
- Add or update home address
- Save delivery instructions
- Change password
- Logout with confirmation modal

**Profile information shown**

- Full name
- Email address
- Contact number
- Email verification status
- Member since date
- Default home address

### 5.4 Restaurant Discovery

Customers can discover restaurants using search and filters from the restaurant listing page.

**Restaurant listing features**

- Search by restaurant name or cuisine
- Cuisine filters
- Dietary filters
- Sort by:
- Relevance
- Fastest delivery
- Distance
- Top Rated
- Pagination of restaurant cards

**Restaurant card information**

- Restaurant name
- Cuisine summary
- Rating display
- Delivery estimate
- Operational status
- Cover image or fallback image

### 5.5 Restaurant Menu Browsing

Each restaurant has a dedicated menu page connected to backend menu data.

**Menu page features**

- Dynamic category tabs
- Category radio filter
- Dietary filter
- Search within menu items
- Pagination of menu items
- Similar restaurant suggestions
- Embedded review section

**Menu item handling**

- Out-of-stock labeling
- Availability-aware add-to-cart behavior
- Pricing display
- Description display
- Rating display
- Image handling with media resolution

### 5.6 Cart Management

The cart logic is shared through `CartContext`.

**Cart behavior**

- Add item to cart
- Merge duplicate cart entries by item + variation + add-ons
- Increment or decrement quantity
- Remove items
- Clear cart
- Persist cart to local storage
- Reorder past items into a fresh cart

**Cart rules**

- Login required before adding items
- Single-restaurant cart enforcement
- Restaurant mismatch modal when mixing stores

### 5.7 Checkout and Scheduling

The checkout flow is connected to authentication, order creation, restaurant payment settings, and cart state.

**Checkout capabilities**

- Prefill contact number from profile
- Prefill address from profile
- Support ASAP delivery
- Support scheduled delivery
- Allow scheduling up to 7 days ahead
- Accept special instructions
- Display cart summary and pricing breakdown

**Payment selection**

- Cash on Delivery
- GCash
- Maya
- Bank transfer

**Payment behavior**

- Payment methods are loaded from the selected restaurant
- Non-COD orders redirect to receipt upload after successful order creation

### 5.8 Payment Receipt Upload

The system includes a dedicated page for payment proof uploads.

**Receipt upload capabilities**

- Display restaurant payment destination details
- Accept sender/account name
- Accept transaction/reference number
- Upload receipt image
- Show receipt preview before submission
- Submit receipt to backend for owner verification

**Supported online payment display types**

- GCash number
- Maya number
- Bank name
- Bank account name
- Bank account number

### 5.9 Orders, Tracking, and History

Customer orders are managed through shared state in `OrderContext`.

**Order context behavior**

- Poll orders every 5 seconds
- Normalize status values for frontend display
- Separate active, completed, and cancelled orders
- Provide reorder and cancel helpers

**My Orders page**

- Ongoing tab
- Completed tab
- Cancelled tab
- Reorder action
- Leave review action for delivered orders

**Order Tracking page**

- Timeline-based order status display
- Map view with route visualization
- Rider information card
- Payment proof status display
- Payment receipt preview
- Cancel window for early-stage orders
- Support link for issues

### 5.10 Reviews and Feedback

The customer review system is implemented with backend validation and summary generation.

**Review capabilities**

- Submit rating from 1 to 5 stars
- Submit written review
- Optional photo uploads supported by backend
- Restrict review creation to delivered orders only
- Prevent duplicate reviews per order

**Review presentation**

- Average rating
- Total review count
- Rating distribution
- Verified-order flag
- Helpful vote toggle
- Owner reply display

---

## 6. Restaurant Owner Features

### 6.1 Owner Authentication

Restaurant owners have a separate authentication flow and token system.

**Owner auth features**

- Email and password login
- Registration with OTP email verification
- Business identity capture during signup
- Merchant agreement acceptance
- Owner token refresh
- Owner logout

### 6.2 Owner Dashboard Shell

The owner dashboard is a dedicated management portal.

**Dashboard shell features**

- Responsive grouped sidebar
- Notification panel
- Search box
- Owner/store profile menu
- Dark mode toggle
- Welcome banner for new accounts

**Main dashboard navigation groups**

- Operations
- Menu
- Engagement
- Finance
- System

### 6.3 Owner Overview Dashboard

The overview dashboard acts as the owner landing page.

**Overview features**

- Store summary metrics
- Order summary
- Inventory-aware signals
- Onboarding hints for incomplete setup
- Popular items visibility
- Quick navigation into operational sections

### 6.4 Owner Order Management

Owners can view and act on restaurant-specific orders only.

**Order management features**

- View only orders assigned to the owner's restaurant
- Update order status
- Review payment state for online payments
- Confirm or reject uploaded receipts
- View order details and items

**Order status flow**

- Pending
- Order Confirmed
- Out for Delivery
- Delivered
- Cancelled

**Additional owner order tools**

- PDF receipt export is present in the owner order section

### 6.5 Inventory Management

Inventory management is API-backed and tied to restaurant-owned menu items.

**Inventory features**

- View item stock levels
- Search inventory items
- Update stock
- Refill items
- Surface low-stock and out-of-stock states
- Support automatic availability changes when stock reaches zero

### 6.6 Menu Management

The owner menu area is a full CRUD interface for restaurant menu items.

**Menu management features**

- Add menu items
- Edit menu items
- Delete menu items
- Upload menu images
- Set descriptions
- Set prices
- Assign category
- Toggle availability

### 6.7 Category Management

The category screen manages customer-facing menu organization.

**Category features**

- Create category
- Edit category
- Delete category
- Reorder categories
- Persist display order to backend

### 6.8 Reviews and Engagement

Owners can respond directly to restaurant reviews.

**Owner review features**

- View restaurant reviews
- View review summaries
- Identify reviews awaiting replies
- Post owner replies

### 6.9 Analytics and Earnings

The owner analytics endpoint returns a fairly rich operational dataset.

**Analytics metrics and datasets**

- Total revenue
- Revenue trend
- Pending revenue
- All-time revenue
- Total orders
- Average order value
- New customer count
- Daily revenue
- Top-selling items
- Hour-by-day order heatmap
- High-value orders
- Revenue breakdown

**Owner-facing finance screens**

- Analytics section
- Earnings section
- Transactions view

### 6.10 Payment Settings

Owners can configure which payment methods customers can use for their restaurant.

**Payment settings capabilities**

- Enable accepted payment methods
- Set GCash number
- Set Maya number
- Set bank name
- Set bank account name
- Set bank account number

### 6.11 Settings and Restaurant Configuration

The owner settings area is one of the largest functional modules in the frontend.

**Owner settings tabs**

- Account
- Security Settings
- Notifications
- Restaurant Profile
- Store Operations
- Payment

**Account settings**

- Update owner first and last name
- Upload owner/store image
- View verification state

**Restaurant profile settings**

- Update restaurant name
- Update business registration number
- Manage cuisine tags
- Set price range
- Upload logo
- Update address
- Pin location on map

**Store operations settings**

- Set store to open, paused, or closed
- Toggle auto-accept orders
- Toggle manual confirmation
- Set default prep time
- Hide or restore selected menu items

**Notifications settings UI**

- Account notifications
- Order notifications
- Payout notifications
- Review notifications

### 6.12 Owner Promotions

The owner dashboard includes a complete promotions management interface for campaign creation and monitoring.

**Owner promotions capabilities**

- Search promotions
- Filter by status
- Create promotions
- Review promotion metrics
- View promotion listings
- Manage campaign visibility and lifecycle

---

## 7. Administrator Features

### 7.1 Admin Authentication

Admins authenticate separately from customers and restaurant owners.

**Admin auth features**

- Admin login with role validation
- Token refresh
- Logout
- Authenticated admin user fetch

### 7.2 Admin Dashboard

The admin landing screen summarizes platform activity.

**Dashboard KPIs**

- Total partners
- Platform revenue
- Active restaurants
- Total customers

**Dashboard supporting modules**

- Revenue chart
- Platform alerts
- Recent restaurant applications
- Quick actions

### 7.3 Order Administration

The admin portal provides a platform-wide order view.

**Admin order capabilities**

- View all orders across the platform
- Filter by status
- Paginated results
- See formatted order details
- View customer and restaurant context
- View order items and totals

### 7.4 Customer Administration

The admin customers section is designed for account monitoring and support visibility.

**Customer admin features**

- Search customers
- Segment by status
- View customer detail modal
- View recent orders
- View activity-oriented information
- Open export modal with CSV/PDF choices

### 7.5 Restaurant Administration

The admin restaurants section is one of the more detailed management areas.

**Restaurant admin features**

- Filter restaurant partners by status
- Search by restaurant name, email, or address
- View restaurant details
- View owner details
- View uploaded documents
- View recent orders
- View recent reviews
- View dispute history
- Suspend restaurant flow
- Export modal with CSV/PDF options

### 7.6 Reviews Moderation

The admin reviews section is focused on oversight and moderation.

**Reviews admin features**

- Review list with status tabs
- View flagged, pending, approved, and removed reviews
- Review detail modal
- Approve/reject style moderation actions in UI
- Export modal

### 7.7 Disputes Management

The admin disputes section covers issue resolution workflows.

**Disputes features**

- View disputes by state
- Investigate dispute details
- Confirm refund flow
- Reject dispute with reason
- Fraud-related status segmentation

### 7.8 Payments and Payouts

The admin payments section manages finance review and payout handling.

**Payments admin features**

- Payments dashboard
- Payout review workflow
- Confirm payout modal
- Reporting/export modal

### 7.9 Platform Analytics and Performance

The admin portal includes both analytics and performance views.

**Platform analytics outputs**

- GMV
- Orders
- Customers
- Restaurants
- Average order value
- Retention metrics
- Segment performance
- Health score
- Alerts

### 7.10 Promotions

Admin promotions are more complete than owner promotions and are connected to backend endpoints.

**Admin promotions capabilities**

- List promotions
- Create promotions
- Edit promotions
- Delete promotions
- View promotion details
- Show expiring promotions
- Extend promotions by a selected duration
- Export modal

### 7.11 Platform Settings and Governance

The admin settings section spans both configuration and governance.

**Settings areas**

- General settings
- Commission and fees
- Payment integrations UI
- Notifications
- Admin management
- Roles and permissions
- Activity logs
- Security
- Appearance

**General settings**

- Platform status
- Platform name
- Tagline
- Support email
- Phone number
- Currency
- Language
- Timezone

**Commission settings**

- Default commission rate
- Commission type
- Delivery mode
- Platform delivery fee

**Governance and security**

- Admin list
- Roles and permissions matrix
- Activity logs with masked IPs
- Forced two-factor authentication setting
- Session timeout setting
- Max login attempts
- Security notification settings

### 7.12 Admin Exports

Export modals are present in several admin modules.

**Export-enabled admin areas**

- Customers
- Restaurants
- Reviews
- Analytics
- Payments
- Promotions

**Export status**

- Export UIs are implemented
- Export actions are available across the supported admin reporting flows

---

## 8. Backend and System Features

### 8.1 Authentication and Security

- Laravel Sanctum token authentication
- Separate flows for customer, owner, and admin roles
- OTP email verification for signup
- OTP reset flow for forgotten passwords
- Request throttling on OTP-related endpoints

### 8.2 Orders and Inventory Integrity

- Orders are tied to `restaurant_owner_id`
- Store operating status is checked before order creation
- Stock is reduced when orders are created
- Stock is restored when orders are cancelled
- Auto-toggle availability is supported for menu items

### 8.3 Media and File Handling

- Public media-serving endpoint
- Restaurant logo uploads
- Restaurant cover uploads
- Receipt uploads
- Review photo uploads
- Normalized stored media paths

### 8.4 Review System

- Delivered-order-only review validation
- One review per order enforcement
- Review summary generation
- Helpful vote storage
- Owner reply support

### 8.5 Platform Governance Data

- Platform settings model and update endpoints
- Security settings model and update endpoints
- Activity logs model
- Roles and permissions pivot structure
- Promotions model and extension logic

### 8.6 Test and Utility Coverage

- Feature tests for refresh token flow
- Feature tests for receipt upload flow
- Utility scripts for settings, promotions, permissions, activity logs, and route checks

---

## 9. Implementation Coverage Summary

The repository includes end-to-end coverage across the major platform workflows and supporting modules:

- **Owner operations** cover menus, categories, inventory, promotions, payments, analytics, reviews, and store settings
- **Admin operations** cover exports, moderation, disputes, platform analytics, payouts, promotions, settings, and activity logging
- **Customer order flow** covers discovery, cart, checkout, payment receipt submission, tracking, order history, reorder, and reviews
- **Content pages** provide the marketing, support, FAQ, announcements, and news/blog experience
- **Platform services** include authentication, media upload and serving, promotions logic, settings management, and automated validation rules

---

## 10. Delivered Documentation Files

- `docs/TMC_FoodHub_Feature_Documentation.md` - editable source version
- `docs/TMC_FoodHub_Feature_Documentation.html` - print-friendly and PDF-ready version

---

## 11. How to Export to PDF

### HTML Version

1. Open `docs/TMC_FoodHub_Feature_Documentation.html` in a browser.
2. Click the `Print / Save as PDF` button at the top.
3. Or press `Ctrl+P`.
4. Select `Save as PDF`.
5. Save the file.

### Markdown Version

1. Open `docs/TMC_FoodHub_Feature_Documentation.md` in your editor.
2. Use the editor's print or export function.
3. Save the result as PDF.

---

## 12. Maintenance Note

This document reflects the repository state inspected during this session. If new modules are added or existing flows are expanded, update both the markdown and HTML versions together so the PDF export remains aligned with the system.
