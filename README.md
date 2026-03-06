# TMC Food Hub 

TMC Food Hub is a full-stack web application designed to connect restaurants with customers. It provides a seamless food ordering experience and a dedicated management dashboard for restaurant owners.

##  Key Features

### For Customers:
- **Clean Interface:** A responsive and modern user interface built using React and Lucide React icons.
- **Store Browsing:** View various restaurants, their menus, operating hours, and customer reviews.
- **Shopping Cart & Checkout:** Intuitive cart persistence and checkout flow.
- **Live Order Tracking:** Post-checkout dashboard with a mockup Leaflet map that visualizes the driver's location en route.
- **Order History:** A dedicated "My Orders" tab holding ongoing, completed, and combined order tracking.
- **Customer Feedback:** A full review and rating system allowing customers to leave comments and tags for restaurants.

### For Restaurant Owners
- **Owner Dashboard:** A dedicated portal for restaurant owners to manage their branch operations.
- **Menu Management:** Ability to quickly add, edit, toggle availability, or delete items from an interactive grid.
- **Store Customization:** Tools to update branch descriptions, operating hours, cover photos, and other vital store info.
- **Active Orders Pipeline:** Interface to track incoming orders and change status ("Confirmed" -> "Preparing" -> "Delivered").

---

##  Technology Stack

- **Frontend:** React.js, React Router DOM, React-Leaflet (for maps), standard CSS Modules.
- **Backend:** Laravel (PHP Framework)
- **Database:** MySQL
- **Tooling:** Vite, npm, Composer

---

## 📂 Project Structure

- `/frontend` - Contains the React application (pages, components, context state).
- `/backend` - Contains the Laravel application (controllers, models, migrations, seeders).

---

##  Getting Started

If you are a contributor looking to run the project locally or team members collaborating via Git, **please read the collaborator guide**:
 [**Read COLLABORATOR_COMMANDS.md**](./COLLABORATOR_COMMANDS.md) for step-by-step setup and daily Git workflow instructions.

If you are looking to set up the MySQL Database alongside the Laravel Backend initially:
 [**Read BACKEND_SETUP_TODO.md**](./BACKEND_SETUP_TODO.md) to understand the data requirements and view the migration/seeding roadmap.

---

## 📜 Future Roadmap
* Wire frontend API calls strictly via Axios pointing to Laravel (replacing `localStorage` context data arrays).
* Hook up real-time websocket delivery tracking for the maps.
* Implement a robust admin dashboard for platform super-users to add new stores on-demand.
