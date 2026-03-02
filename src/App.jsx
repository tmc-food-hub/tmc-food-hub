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
function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (window.AOS) {
      window.AOS.init({
        duration: 800,
        easing: 'slide',
        once: true
      });
      window.AOS.refresh();
    }
  }, [pathname]);

  return (
    <>
      <Preloader />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/news-and-blogs" element={<NewsBlogPage />} />
        <Route path="/news/:slug" element={<NewsBlogDetailPage />} />
        <Route path="/blogs/:slug" element={<NewsBlogDetailPage />} />
        {/* Keep the old route for backward compatibility */}
        <Route path="/news-blog-detail" element={<NewsBlogDetailPage />} />
        <Route path="/company-events-announcements" element={<CompanyEventsAndAnnouncements />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/announcement/:title" element={<AnnouncementDetail />} />
        <Route path="/event/:title" element={<AnnouncementDetail />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/menu" element={<MenuPage />} />
      </Routes>
    </>
  )
}

export default App
