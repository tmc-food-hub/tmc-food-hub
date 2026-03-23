import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './components/ui/ThemeContext.jsx';
import { CartProvider } from './components/ui/CartContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import { OrderProvider } from './context/OrderContext.jsx';
import { OwnerAuthProvider } from './context/OwnerAuthContext.jsx';
import { AdminAuthProvider } from './context/AdminAuthContext.jsx';
import './assets/css/App.css';
import './assets/css/about.css';
import './assets/css/contact.css';
import './assets/css/faq.css';
import './assets/css/features.css';
import './assets/css/footer.css';
import './assets/css/hero.css';
import './assets/css/howitworks.css';
import './assets/css/navbar.css';
import './assets/css/newsblog.css';
import './assets/css/preloader.css';
import './assets/css/services.css';
import './assets/css/testimonials.css';
import './assets/css/company-events-and-announcements.css';
import './assets/css/support.css';
import './assets/css/announcement-detail.css'
import './assets/css/dark-mode-overrides.css'
import 'leaflet/dist/leaflet.css';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <NotificationProvider>
          <AuthProvider>
            <CartProvider>
              <OrderProvider>
                <OwnerAuthProvider>
                  <AdminAuthProvider>
                    <App />
                  </AdminAuthProvider>
                </OwnerAuthProvider>
              </OrderProvider>
            </CartProvider>
          </AuthProvider>
        </NotificationProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
