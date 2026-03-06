import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Homepage from './pages/Home'
import Preloader from './components/ui/Preloader';
import NewsBlogPage from './pages/NewsBlogPage';
import NewsBlogDetailPage from './pages/NewsBlogDetailPage';
import CompanyEventsAndAnnouncements from './pages/CompanyEventsAndAnnouncements';
import SupportPage from './pages/SupportPage';
import AnnouncementDetail from './components/sections/AnnouncementDetail';
import FAQPage from './pages/FAQPage';
import ServicesPage from './pages/ServicesPage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import ProfilePage from './pages/ProfilePage';
import OwnerLoginPage from './pages/OwnerLoginPage';
import OwnerDashboard from './pages/OwnerDashboard';
import { OwnerAuthProvider } from './context/OwnerAuthContext';

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
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-tracking" element={<OrderTrackingPage />} />
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
  )
}

export default App

