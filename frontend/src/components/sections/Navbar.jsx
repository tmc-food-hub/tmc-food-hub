import { useContext } from 'react';
import { ThemeContext } from '../ui/ThemeContext';
import { CartContext } from '../ui/CartContext';
import { Sun, Moon, Menu, ShoppingCart } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { navigationItems } from '../../constants/navigation';
import { useNavbarLogic } from '../../hooks/useNavbarLogic';
import tmcLogo from '../../assets/imgs/tmc-foodhub-logo.svg';

function Navbar() {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const { cartCount } = useContext(CartContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { isScrolled, isActive, handleNavClick } = useNavbarLogic(isDarkMode);

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
        `}
      </style>
      <header className={`fbs__net-navbar navbar navbar-expand-lg fixed-top ${isDarkMode ? 'dark' : 'light'} ${isScrolled || isDarkMode ? 'active shadow-sm' : ''}`} style={{ padding: '0.75rem 0', backgroundColor: isDarkMode ? '#111827' : '#FFFFFF', borderBottom: '1px solid #E5E7EB' }}>
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
            <Link to="/login" className="btn custom-nav-btn custom-login-btn d-flex align-items-center justify-content-center" style={{ border: '1px solid #D1D5DB', padding: '0 1.25rem', height: '42px', borderRadius: '8px', fontSize: '15px', fontWeight: 500, boxSizing: 'border-box' }}>
              Login
            </Link>
            <Link to="/signup" className="btn custom-nav-btn d-flex align-items-center justify-content-center" style={{ backgroundColor: '#991B1B', color: 'white', padding: '0 1.25rem', height: '42px', borderRadius: '8px', fontSize: '15px', fontWeight: 500, border: '1px solid transparent', boxSizing: 'border-box' }}>
              Sign up
            </Link>
            <button className="custom-nav-btn d-flex align-items-center justify-content-center" onClick={toggleTheme} style={{ border: '1px solid #D1D5DB', backgroundColor: 'transparent', color: isDarkMode ? '#FFF' : '#111827', height: '42px', width: '42px', borderRadius: '8px', cursor: 'pointer', padding: 0, boxSizing: 'border-box' }}>
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="custom-nav-btn d-flex align-items-center justify-content-center" onClick={() => navigate('/cart')} style={{ backgroundColor: '#F59E0B', color: 'white', position: 'relative', border: '1px solid transparent', height: '42px', width: '42px', borderRadius: '8px', cursor: 'pointer', padding: 0, boxSizing: 'border-box' }}>
              <ShoppingCart size={20} />
              {cartCount > 0 && <span style={{ position: 'absolute', top: '-8px', right: '-8px', backgroundColor: '#111827', color: 'white', borderRadius: '50%', width: '22px', height: '22px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{cartCount}</span>}
            </button>
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
                <Link to="/login" className="btn custom-nav-btn custom-login-btn w-100 d-flex align-items-center justify-content-center" style={{ border: '1px solid #D1D5DB', padding: '0.6rem', borderRadius: '8px', fontSize: '15px', fontWeight: 500, boxSizing: 'border-box' }} onClick={closeMobileMenu}>
                  Login
                </Link>
                <Link to="/signup" className="btn custom-nav-btn w-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#991B1B', color: 'white', padding: '0.6rem', borderRadius: '8px', fontSize: '15px', fontWeight: 500, border: '1px solid transparent', boxSizing: 'border-box' }} onClick={closeMobileMenu}>
                  Sign up
                </Link>
                <button className="btn custom-nav-btn w-100 d-flex align-items-center justify-content-center gap-2" style={{ border: '1px solid #D1D5DB', backgroundColor: 'transparent', color: isDarkMode ? '#FFF' : '#111827', padding: '0.6rem', borderRadius: '8px', fontSize: '15px', fontWeight: 500, boxSizing: 'border-box' }} onClick={() => { toggleTheme(); closeMobileMenu(); }}>
                  {isDarkMode ? <><Sun size={18} /> Light Mode</> : <><Moon size={18} /> Dark Mode</>}
                </button>
                <button className="btn custom-nav-btn w-100 d-flex align-items-center justify-content-center gap-2" style={{ backgroundColor: '#F59E0B', color: 'white', padding: '0.6rem', borderRadius: '8px', fontSize: '15px', fontWeight: 500, border: '1px solid transparent', boxSizing: 'border-box' }} onClick={() => { closeMobileMenu(); navigate('/cart'); }}>
                  <ShoppingCart size={20} /> Cart{cartCount > 0 ? ` (${cartCount})` : ''}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;
