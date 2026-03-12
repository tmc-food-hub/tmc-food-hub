import { useContext, useState } from 'react';
import { ThemeContext } from '../ui/ThemeContext';
import { CartContext } from '../ui/CartContext';
import { Sun, Moon, Menu, ShoppingCart, ClipboardList, User, LogOut, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { navigationItems } from '../../constants/navigation';
import { useNavbarLogic } from '../../hooks/useNavbarLogic';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';
import tmcLogo from '../../assets/imgs/tmc-foodhub-logo.svg';

function Navbar() {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const { cartCount, cartItems, cartSubtotal } = useContext(CartContext);
  const { user, isAuthenticated, logout } = useAuth();
  const { activeOrders } = useOrders();
  const location = useLocation();
  const navigate = useNavigate();
  const { isScrolled, isActive, handleNavClick } = useNavbarLogic(isDarkMode);

  const isHomePage = location.pathname === '/';

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const closeMobileMenu = () => {
    const offcanvasElement = document.getElementById('fbs__net-navbars');
    if (offcanvasElement) {
      const bsOffcanvas = window.bootstrap?.Offcanvas.getInstance(offcanvasElement);
      if (bsOffcanvas) {
        bsOffcanvas.hide();
      } else {
        const closeBtn = offcanvasElement.querySelector('.btn-close');
        if (closeBtn) closeBtn.click();
      }
    }
  };

  const handleInternalLink = (sectionId, e, isMobile) => {
    if (isMobile) closeMobileMenu();

    if (location.pathname !== '/') {
      const targetPath = sectionId === 'home' ? '/' : `/#${sectionId}`;
      navigate(targetPath);
    } else {
      handleNavClick(sectionId, e);
    }
  };

  const renderNavItems = (isMobile = false) =>
    navigationItems.map((item) => {
      const isHomePage = location.pathname === '/';
      const isServicesPath = location.pathname === '/services';
      const isFAQPath = location.pathname === '/faq';
      const isSupportPath = location.pathname === '/support';

      if (item.children) {
        const isNewsPath = location.pathname === '/news-and-blogs';
        const isEventsPath = location.pathname === '/company-events-announcements';
        const isMenuPath = location.pathname === '/menu';
        const isAnyChildActive =
          (item.id === 'news-blogs-dropdown' && (isNewsPath || isEventsPath)) ||
          (item.id === 'services-dropdown' && (isServicesPath || isMenuPath)) ||
          (isHomePage && item.children.some(c => isActive(c.id)));

        return (
          <li key={item.id} className="nav-item dropdown px-lg-2">
            <a
              className={`nav-link custom-nav-link dropdown-toggle ${isAnyChildActive ? 'active' : ''}`}
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ fontSize: '15px', fontWeight: 500 }}
            >
              {item.label}
            </a>
            <ul className={`dropdown-menu shadow-sm ${isDarkMode ? 'dropdown-menu-dark' : ''}`} style={{ border: 'none', borderRadius: '8px' }}>
              {item.children.map((child) => {
                const isEventsPage = child.id === 'company-events-announcements';
                const isNewsPage = child.id === 'news-blogs' || child.isExternal;
                const isMenuPage = child.id === 'menu';
                const isServicesPage = child.id === 'services';

                const isChildActive =
                  (isEventsPage && isEventsPath) ||
                  (isNewsPage && isNewsPath) ||
                  (isMenuPage && isMenuPath) ||
                  (isServicesPage && isServicesPath) ||
                  (isHomePage && isActive(child.id));

                return (
                  <li key={child.id}>
                    <Link
                      className={`dropdown-item ${isChildActive ? 'active' : ''}`}
                      to={
                        child.isExternal ? "/news-and-blogs" :
                          isEventsPage ? "/company-events-announcements" :
                            isMenuPage ? "/menu" :
                              isServicesPage ? "/services" :
                                `/#${child.id}`
                      }
                      onClick={(e) => {
                        if (child.isExternal || isEventsPage || child.id === 'services' || child.id === 'menu') {
                          if (isMobile) closeMobileMenu();
                        } else {
                          handleInternalLink(child.id, e, isMobile);
                        }
                      }}
                      style={{ fontSize: '14.5px', padding: '8px 16px' }}
                    >
                      {child.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        );
      }

      const isItemActive = item.id === 'services'
        ? isServicesPath
        : item.id === 'faq'
          ? isFAQPath
          : item.id === 'contact'
            ? isSupportPath
            : (isHomePage ? isActive(item.id) : false);

      return (
        <li key={item.id} className="nav-item px-lg-2">
          <Link
            className={`nav-link custom-nav-link scroll-link ${isItemActive ? 'active' : ''}`}
            to={
              item.id === 'home' ? '/' :
                item.id === 'services' ? '/services' :
                  item.id === 'faq' ? '/faq' :
                    item.id === 'contact' ? '/support' :
                      `/#${item.id}`
            }
            onClick={(e) => {
              if (item.id === 'faq' || item.id === 'contact') {
                if (isMobile) closeMobileMenu();
              } else {
                handleInternalLink(item.id, e, isMobile);
              }
            }}
            style={{ fontSize: '15px', fontWeight: 500 }}
          >
            {item.label}
          </Link>
        </li>
      );
    });

  return (
    <>
      <style>
        {`
          .fbs__net-navbar .navbar-nav > li > .nav-link.custom-nav-link {
            color: ${isDarkMode ? '#E5E7EB' : '#374151'} !important;
          }
          .fbs__net-navbar.active .navbar-nav > li > .nav-link.custom-nav-link {
            color: ${isDarkMode ? '#E5E7EB' : '#374151'} !important;
          }
          .fbs__net-navbar .navbar-nav > li > .nav-link.custom-nav-link:hover,
          .fbs__net-navbar .navbar-nav > li > .nav-link.custom-nav-link.active {
            color: #B91C1C !important;
          }
          .fbs__net-navbar .navbar-nav > li > .nav-link.custom-nav-link::before {
            background-color: #B91C1C !important;
            height: 2px !important;
          }
          .custom-login-btn {
            background-color: transparent !important;
            color: ${isDarkMode ? '#FFF' : '#111827'} !important;
            transition: all 0.2s ease-in-out !important;
          }
          .custom-login-btn:hover {
            background-color: ${isDarkMode ? '#374151' : '#F3F4F6'} !important;
            color: ${isDarkMode ? '#FFF' : '#111827'} !important;
          }
          .custom-nav-btn {
            transition: all 0.2s ease-in-out !important;
          }
          .custom-nav-btn:hover {
            transform: none !important;
            box-shadow: none !important;
          }
          .fbs__net-navbar .user-dropdown-menu {
            background-color: ${isDarkMode ? '#1f2937' : '#ffffff'} !important;
            border: 1px solid ${isDarkMode ? '#374151' : '#e5e7eb'} !important;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
            padding: 0.5rem !important;
            min-width: 200px !important;
            left: auto !important;
            right: 0 !important;
            top: 100% !important;
            transform: none !important;
            margin-top: 0.5rem !important;
          }
          .user-dropdown-item {
            color: ${isDarkMode ? '#f3f4f6' : '#111827'} !important;
            border-radius: 6px !important;
            padding: 0.5rem 1rem !important;
            transition: background-color 0.15s ease-in-out;
            width: 100% !important;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            background: transparent !important;
            border: none;
            text-align: left;
            margin-left: 0 !important;
            margin-right: 0 !important;
          }
          .user-dropdown-item:hover {
            background-color: ${isDarkMode ? '#374151' : '#f3f4f6'} !important;
            color: ${isDarkMode ? '#ffffff' : '#000000'} !important;
          }
          .user-dropdown-item.text-danger:hover {
            background-color: #FEE2E2 !important;
            color: #DC2626 !important;
          }
        `}
      </style>
      <header className={`fbs__net-navbar navbar navbar-expand-lg fixed-top ${isDarkMode ? 'dark' : 'light'} ${isScrolled || isDarkMode || !isHomePage ? 'active shadow-sm' : ''}`} style={{ padding: '0.75rem 0', backgroundColor: isDarkMode ? '#111827' : '#FFFFFF', borderBottom: '1px solid #E5E7EB' }}>
        <div className="container-fluid px-4 px-xl-5 d-flex align-items-center justify-content-between" style={{ maxWidth: '1600px' }}>
          <Link className="navbar-brand" to="/" onClick={() => window.scrollTo(0, 0)}>
            <img src={tmcLogo} alt="TMC Food Hub banner" style={{ height: '60px', width: 'auto', objectFit: 'contain' }} />
          </Link>

          {/* Desktop purely flex-center */}
          <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
            <ul className="navbar-nav align-items-center">
              {renderNavItems()}
            </ul>
          </div>

          {/* Desktop right buttons */}
          <div className="d-none d-lg-flex align-items-center gap-2 gap-xl-3">
            {isAuthenticated ? (
              <div className="nav-item dropdown" style={{ position: 'relative' }}>
                <button
                  className="custom-nav-btn d-flex align-items-center justify-content-center"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{
                    border: '1px solid #D1D5DB',
                    padding: 0,
                    height: '42px',
                    width: '42px',
                    borderRadius: '8px',
                    backgroundColor: 'transparent',
                    color: isDarkMode ? '#FFF' : '#111827',
                    boxSizing: 'border-box'
                  }}
                  title={`Hi, ${user?.name?.split(' ')[0] || 'User'}`}
                >
                  <User size={20} />
                </button>
                <ul className={`dropdown-menu dropdown-menu-end shadow-sm user-dropdown-menu`} aria-labelledby="userDropdown">
                  <li>
                    <Link className="dropdown-item user-dropdown-item" to="/profile">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button className="dropdown-item user-dropdown-item" onClick={toggleTheme}>
                      {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                      {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                    </button>
                  </li>
                  <li><hr className="dropdown-divider" style={{ margin: '0.25rem 0', borderColor: isDarkMode ? '#374151' : '#e5e7eb' }} /></li>
                  <li>
                    <button className="dropdown-item user-dropdown-item text-danger" onClick={() => setShowLogoutModal(true)}>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn custom-nav-btn custom-login-btn d-flex align-items-center justify-content-center" style={{ border: '1px solid #D1D5DB', padding: '0 1.25rem', height: '42px', borderRadius: '8px', fontSize: '15px', fontWeight: 500, boxSizing: 'border-box' }}>
                  Login
                </Link>
                <Link to="/signup" className="btn custom-nav-btn d-flex align-items-center justify-content-center" style={{ backgroundColor: '#991B1B', color: 'white', padding: '0 1.25rem', height: '42px', borderRadius: '8px', fontSize: '15px', fontWeight: 500, border: '1px solid transparent', boxSizing: 'border-box' }}>
                  Sign up
                </Link>
                <button className="custom-nav-btn d-flex align-items-center justify-content-center" onClick={toggleTheme} style={{ border: '1px solid #D1D5DB', backgroundColor: 'transparent', color: isDarkMode ? '#FFF' : '#111827', height: '42px', width: '42px', borderRadius: '8px', cursor: 'pointer', padding: 0, boxSizing: 'border-box' }}>
                  {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              </>
            )}
            {isAuthenticated && (
              <>
                <button className="custom-nav-btn d-flex align-items-center justify-content-center" onClick={() => navigate('/my-orders')} style={{ backgroundColor: 'transparent', color: isDarkMode ? '#FFF' : '#111827', position: 'relative', border: '1px solid #D1D5DB', height: '42px', width: '42px', borderRadius: '8px', cursor: 'pointer', padding: 0, boxSizing: 'border-box' }}>
                  <ClipboardList size={20} />
                  {activeOrders.length > 0 && <span style={{ position: 'absolute', top: '-8px', right: '-8px', backgroundColor: '#991B1B', color: 'white', borderRadius: '50%', width: '22px', height: '22px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{activeOrders.length}</span>}
                </button>
                <div className="nav-item dropdown" style={{ position: 'relative' }}>
                  <button className="custom-nav-btn d-flex align-items-center justify-content-center" onClick={() => navigate('/cart')} style={{ backgroundColor: '#F59E0B', color: 'white', position: 'relative', border: '1px solid transparent', height: '42px', width: '42px', borderRadius: '8px', cursor: 'pointer', padding: 0, boxSizing: 'border-box' }}>
                    <ShoppingCart size={20} />
                    {cartCount > 0 && <span style={{ position: 'absolute', top: '-8px', right: '-8px', backgroundColor: '#111827', color: 'white', borderRadius: '50%', width: '22px', height: '22px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{cartCount}</span>}
                  </button>
                  <div className={`dropdown-menu dropdown-menu-end shadow user-dropdown-menu p-0`} style={{ width: '320px', overflow: 'hidden', cursor: 'default' }} onClick={(e) => e.stopPropagation()}>
                    <div className="p-3 border-bottom" style={{ borderColor: isDarkMode ? '#374151' : '#e5e7eb' }}>
                      <h6 className="mb-0 fw-bold" style={{ color: isDarkMode ? '#F9FAFB' : '#111827' }}>My Cart ({cartCount} items)</h6>
                    </div>
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {cartItems.length === 0 ? (
                        <div className="p-4 text-center">
                          <ShoppingCart size={40} className="mb-2" style={{ color: isDarkMode ? '#4B5563' : '#9CA3AF' }} />
                          <p className="mb-0" style={{ color: isDarkMode ? '#D1D5DB' : '#6B7280', fontSize: '0.9rem' }}>Your cart is currently empty.</p>
                        </div>
                      ) : (
                        <ul className="list-unstyled mb-0 w-100">
                          {cartItems.map((item, index) => (
                            <li key={index} className="p-3 border-bottom d-flex align-items-center gap-3 w-100" style={{ borderColor: isDarkMode ? '#374151' : '#e5e7eb', backgroundColor: isDarkMode ? '#1f2937' : '#ffffff', transition: 'background-color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? '#374151' : '#f9fafb'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? '#1f2937' : '#ffffff'}>
                              <img src={item.image} alt={item.title} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} />
                              <div className="flex-grow-1 overflow-hidden">
                                <h6 className="mb-0 text-truncate" style={{ fontSize: '0.9rem', color: isDarkMode ? '#F9FAFB' : '#111827', fontWeight: 600 }}>{item.title}</h6>
                                <div className="d-flex justify-content-between align-items-center mt-1">
                                  <span style={{ fontSize: '0.85rem', color: isDarkMode ? '#9CA3AF' : '#6B7280' }}>Qty: {item.quantity}</span>
                                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#991B1B' }}>${Number(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    {cartItems.length > 0 && (
                      <div className="p-3" style={{ backgroundColor: isDarkMode ? '#111827' : '#f9fafb' }}>
                        <div className="d-flex justify-content-between mb-3">
                          <span style={{ fontWeight: 600, color: isDarkMode ? '#D1D5DB' : '#4B5563' }}>Subtotal:</span>
                          <span style={{ fontWeight: 'bold', color: isDarkMode ? '#F9FAFB' : '#111827', fontSize: '1.1rem' }}>${Number(cartSubtotal).toFixed(2)}</span>
                        </div>
                        <div className="d-flex gap-2">
                          <button className="btn w-50" onClick={() => navigate('/cart')} style={{ backgroundColor: 'transparent', border: `1px solid ${isDarkMode ? '#4B5563' : '#D1D5DB'}`, color: isDarkMode ? '#F9FAFB' : '#111827', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600 }}>View Cart</button>
                          <button className="btn w-50" onClick={() => navigate('/checkout')} style={{ backgroundColor: '#991B1B', color: 'white', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Checkout</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="fbs__net-navbar-toggler d-flex justify-content-center align-items-center ms-auto d-lg-none" data-bs-toggle="offcanvas" data-bs-target="#fbs__net-navbars" style={{ border: 'none', background: 'transparent', color: 'inherit' }}>
            <Menu size={28} />
          </button>

          <div className="offcanvas offcanvas-start w-75 d-lg-none shadow" id="fbs__net-navbars" tabIndex="-1">
            <div className="offcanvas-header border-bottom">
              <Link to="/" onClick={() => { window.scrollTo(0, 0); closeMobileMenu(); }}>
                <img src={tmcLogo} alt="TMC Food Hub banner" style={{ height: '52px', width: 'auto', objectFit: 'contain' }} />
              </Link>
              <button className={`btn-close ${isDarkMode ? 'btn-close-white' : ''}`} data-bs-dismiss="offcanvas" />
            </div>
            <div className="offcanvas-body d-flex flex-column pb-4">
              <ul className="navbar-nav mb-auto">{renderNavItems(true)}</ul>
              <div className="mt-4 px-2 d-flex flex-column gap-3">
                {isAuthenticated ? (
                  <div className="accordion" id="mobileUserAccordion">
                    <div className="accordion-item" style={{ border: 'none', backgroundColor: 'transparent' }}>
                      <h2 className="accordion-header">
                        <button className={`accordion-button collapsed custom-nav-btn ${isDarkMode ? 'text-white bg-dark' : 'text-dark bg-light'}`} type="button" data-bs-toggle="collapse" data-bs-target="#collapseUser" aria-expanded="false" aria-controls="collapseUser" style={{ borderRadius: '8px', padding: '0.8rem 1rem', border: '1px solid #D1D5DB', fontWeight: 500 }}>
                          Hi, {user?.name?.split(' ')[0] || 'User'}
                        </button>
                      </h2>
                      <div id="collapseUser" className="accordion-collapse collapse" data-bs-parent="#mobileUserAccordion">
                        <div className="accordion-body d-flex flex-column gap-2 p-2">
                          <Link to="/profile" className="btn custom-nav-btn w-100 d-flex align-items-center justify-content-start gap-2" style={{ backgroundColor: 'transparent', color: isDarkMode ? '#FFF' : '#111827', padding: '0.6rem 1rem', border: 'none', textAlign: 'left' }} onClick={closeMobileMenu}>
                            Profile
                          </Link>
                          <button className="btn custom-nav-btn w-100 d-flex align-items-center justify-content-start gap-2" style={{ backgroundColor: 'transparent', color: isDarkMode ? '#FFF' : '#111827', padding: '0.6rem 1rem', border: 'none', textAlign: 'left' }} onClick={() => { toggleTheme(); closeMobileMenu(); }}>
                            {isDarkMode ? <><Sun size={18} /> Light Mode</> : <><Moon size={18} /> Dark Mode</>}
                          </button>
                          <hr className="my-1" />
                          <button className="btn custom-nav-btn w-100 d-flex align-items-center justify-content-start gap-2 text-danger" style={{ backgroundColor: 'transparent', padding: '0.6rem 1rem', border: 'none', textAlign: 'left' }} onClick={() => { setShowLogoutModal(true); closeMobileMenu(); }}>
                            Logout
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <Link to="/login" className="btn custom-nav-btn custom-login-btn w-100 d-flex align-items-center justify-content-center" style={{ border: '1px solid #D1D5DB', padding: '0.6rem', borderRadius: '8px', fontSize: '15px', fontWeight: 500, boxSizing: 'border-box' }} onClick={closeMobileMenu}>
                      Login
                    </Link>
                    <Link to="/signup" className="btn custom-nav-btn w-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#991B1B', color: 'white', padding: '0.6rem', borderRadius: '8px', fontSize: '15px', fontWeight: 500, border: '1px solid transparent', boxSizing: 'border-box' }} onClick={closeMobileMenu}>
                      Sign up
                    </Link>
                    <button className="btn custom-nav-btn w-100 d-flex align-items-center justify-content-center gap-2" style={{ border: '1px solid #D1D5DB', backgroundColor: 'transparent', color: isDarkMode ? '#FFF' : '#111827', padding: '0.6rem', borderRadius: '8px', fontSize: '15px', fontWeight: 500, boxSizing: 'border-box' }} onClick={() => { toggleTheme(); closeMobileMenu(); }}>
                      {isDarkMode ? <><Sun size={18} /> Light Mode</> : <><Moon size={18} /> Dark Mode</>}
                    </button>
                  </>
                )}
                {isAuthenticated && (
                  <>
                    <button className="btn custom-nav-btn w-100 d-flex align-items-center justify-content-center gap-2" style={{ border: '1px solid #D1D5DB', backgroundColor: 'transparent', color: isDarkMode ? '#FFF' : '#111827', padding: '0.6rem', borderRadius: '8px', fontSize: '15px', fontWeight: 500, boxSizing: 'border-box', position: 'relative' }} onClick={() => { closeMobileMenu(); navigate('/my-orders'); }}>
                      <ClipboardList size={20} /> My Orders{activeOrders.length > 0 ? ` (${activeOrders.length})` : ''}
                    </button>
                    <button className="btn custom-nav-btn w-100 d-flex align-items-center justify-content-center gap-2" style={{ backgroundColor: '#F59E0B', color: 'white', padding: '0.6rem', borderRadius: '8px', fontSize: '15px', fontWeight: 500, border: '1px solid transparent', boxSizing: 'border-box' }} onClick={() => { closeMobileMenu(); navigate('/cart'); }}>
                      <ShoppingCart size={20} /> Cart{cartCount > 0 ? ` (${cartCount})` : ''}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal (Modern Design) */}
      {showLogoutModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1060, backdropFilter: 'blur(4px)' }} tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document" style={{ maxWidth: '400px' }}>
            <div className={`modal-content text-center p-4 ${isDarkMode ? 'bg-dark border-secondary' : ''}`} style={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>

              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: isDarkMode ? '#9CA3AF' : '#6B7280', padding: '8px', cursor: 'pointer', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? '#374151' : '#F3F4F6'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <X size={20} />
              </button>

              <div style={{ width: '64px', height: '64px', backgroundColor: '#FEE2E2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', color: '#DC2626' }}>
                <LogOut size={32} />
              </div>

              <h4 className="fw-bold mb-2" style={{ color: isDarkMode ? '#F9FAFB' : '#111827', fontSize: '1.25rem' }}>Sign Out</h4>
              <p style={{ color: isDarkMode ? '#D1D5DB' : '#6B7280', fontSize: '0.95rem', marginBottom: '1.75rem', padding: '0 10px' }}>
                Are you sure you want to log out from TMC Food Hub?
              </p>

              <div className="d-flex flex-column gap-2">
                <button
                  className="btn w-100 fw-bold d-flex align-items-center justify-content-center border-0"
                  onClick={() => { setShowLogoutModal(false); logout(); navigate('/'); }}
                  style={{ backgroundColor: '#991B1B', color: 'white', padding: '0.8rem', borderRadius: '12px', fontSize: '1rem', transition: 'transform 0.1s' }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  Yes, Logout
                </button>
                <button
                  className="btn w-100 fw-bold d-flex align-items-center justify-content-center"
                  onClick={() => setShowLogoutModal(false)}
                  style={{ backgroundColor: 'transparent', color: isDarkMode ? '#F9FAFB' : '#111827', padding: '0.8rem', borderRadius: '12px', fontSize: '1rem', border: `1px solid ${isDarkMode ? '#4B5563' : '#D1D5DB'}`, transition: 'background-color 0.2s' }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? '#374151' : '#F9FAFB'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
