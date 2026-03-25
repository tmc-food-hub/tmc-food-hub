import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Preloader from './components/ui/Preloader';

// ── Customer Pages (lazy-loaded) ──
const Homepage = lazy(() => import('./pages/customer/Home'));
const NewsBlogPage = lazy(() => import('./pages/customer/NewsBlogPage'));
const NewsBlogDetailPage = lazy(() => import('./pages/customer/NewsBlogDetailPage'));
const CompanyEventsAndAnnouncements = lazy(() => import('./pages/customer/CompanyEventsAndAnnouncements'));
const SupportPage = lazy(() => import('./pages/customer/SupportPage'));
const FAQPage = lazy(() => import('./pages/customer/FAQPage'));
const ServicesPage = lazy(() => import('./pages/customer/ServicesPage'));
const MenuPage = lazy(() => import('./pages/customer/MenuPage'));
const RestaurantMenuPage = lazy(() => import('./pages/customer/RestaurantMenuPage'));
const CartPage = lazy(() => import('./pages/customer/CartPage'));
const CheckoutPage = lazy(() => import('./pages/customer/CheckoutPage'));
const LoginPage = lazy(() => import('./pages/customer/LoginPage'));
const SignupPage = lazy(() => import('./pages/customer/SignupPage'));
const ForgotPasswordPage = lazy(() => import('./pages/customer/ForgotPasswordPage'));
const OrderTrackingPage = lazy(() => import('./pages/customer/OrderTrackingPage'));
const MyOrdersPage = lazy(() => import('./pages/customer/MyOrdersPage'));
const ProfilePage = lazy(() => import('./pages/customer/ProfilePage'));

// ── Shared Components (lazy-loaded) ──
const AnnouncementDetail = lazy(() => import('./components/sections/AnnouncementDetail'));

// ── Owner Portal (lazy-loaded) ──
const OwnerLoginPage = lazy(() => import('./pages/owner/OwnerLoginPage'));
const OwnerDashboard = lazy(() => import('./pages/owner/OwnerDashboard'));

// ── Admin Portal (lazy-loaded) ──
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (window.AOS) {
      window.AOS.init({
        duration: 800,
        easing: 'slide',
        once: true
      });
      setTimeout(() => window.AOS.refresh(), 50);
    }
  }, [pathname]);

  return (
    <>
      <Preloader />
      <Suspense fallback={<Preloader />}>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/news-and-blogs" element={<NewsBlogPage />} />
        <Route path="/news/:category" element={<NewsBlogDetailPage />} />
        <Route path="/blogs/:category" element={<NewsBlogDetailPage />} />
        <Route path="/news-blog-detail" element={<NewsBlogDetailPage />} />
        <Route path="/company-events-announcements" element={<CompanyEventsAndAnnouncements />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/announcement/:title" element={<AnnouncementDetail />} />
        <Route path="/event/:title" element={<AnnouncementDetail />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/menu/:storeId" element={<RestaurantMenuPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-tracking" element={<OrderTrackingPage />} />
        <Route path="/my-orders" element={<MyOrdersPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        {/* ── Restaurant Owner Portal ── */}
        <Route path="/owner-login" element={<OwnerLoginPage />} />
        <Route path="/owner-dashboard" element={<OwnerDashboard />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
      </Suspense>
    </>
  )
}

export default App

