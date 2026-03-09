import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Homepage from './pages/customer/Home'
import Preloader from './components/ui/Preloader';
import NewsBlogPage from './pages/customer/NewsBlogPage';
import NewsBlogDetailPage from './pages/customer/NewsBlogDetailPage';
import CompanyEventsAndAnnouncements from './pages/customer/CompanyEventsAndAnnouncements';
import SupportPage from './pages/customer/SupportPage';
import AnnouncementDetail from './components/sections/AnnouncementDetail';
import FAQPage from './pages/customer/FAQPage';
import ServicesPage from './pages/customer/ServicesPage';
import MenuPage from './pages/customer/MenuPage';
import RestaurantMenuPage from './pages/customer/RestaurantMenuPage';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import LoginPage from './pages/customer/LoginPage';
import SignupPage from './pages/customer/SignupPage';
import ForgotPasswordPage from './pages/customer/ForgotPasswordPage';
import OrderTrackingPage from './pages/customer/OrderTrackingPage';
import MyOrdersPage from './pages/customer/MyOrdersPage';
import ProfilePage from './pages/customer/ProfilePage';
import OwnerLoginPage from './pages/owner/OwnerLoginPage';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import { OwnerAuthProvider } from './context/OwnerAuthContext';
import { OrderProvider } from './context/OrderContext';
import { AuthProvider } from './context/AuthContext';

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
    <AuthProvider>
      <OrderProvider>
        <OwnerAuthProvider>
          <>
            <Preloader />
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/news-and-blogs" element={<NewsBlogPage />} />
              <Route path="/news/:slug" element={<NewsBlogDetailPage />} />
              <Route path="/blogs/:slug" element={<NewsBlogDetailPage />} />
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
            </Routes>
          </>
        </OwnerAuthProvider>
      </OrderProvider>
    </AuthProvider>
  )
}

export default App

