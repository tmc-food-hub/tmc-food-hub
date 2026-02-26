import { useContext } from 'react';
import { ThemeContext } from '../ui/ThemeContext';
import { Sun, Moon, Menu } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { navigationItems } from '../../constants/navigation';
import { useNavbarLogic } from '../../hooks/useNavbarLogic';

function Navbar() {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
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

      if (item.children) {
        const isNewsPath = location.pathname === '/news-and-blogs';
        const isEventsPath = location.pathname === '/company-events-announcements';
        const isSupportPath = location.pathname === '/support';
        const isFAQPath = location.pathname === '/faq';
        const isAnyChildActive =
          (item.id === 'resources-dropdown' && (isNewsPath || isEventsPath)) ||
          (item.id === 'support-dropdown' && (isSupportPath || isFAQPath)) ||
          (isHomePage && item.children.some(c => isActive(c.id)));

        return (
          <li key={item.id} className="nav-item dropdown">
            <a
              className={`nav-link dropdown-toggle ${isAnyChildActive ? 'active' : ''}`}
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {item.label}
            </a>
            <ul className={`dropdown-menu shadow-sm ${isDarkMode ? 'dropdown-menu-dark' : ''}`}>
              {item.children.map((child) => {
                const isEventsPage = child.id === 'company-events-announcements';
                const isNewsPage = child.id === 'news-blogs' || child.isExternal;
                const isSupportPage = child.id === 'support';
                const isFaqPage = child.id === 'faq';
                const isChildActive =
                  (isEventsPage && isEventsPath) ||
                  (isNewsPage && isNewsPath) ||
                  (isSupportPage && isSupportPath) ||
                  (isFaqPage && isFAQPath) ||
                  (isHomePage && isActive(child.id));

                return (
                  <li key={child.id}>
                    <Link
                      className={`dropdown-item ${isChildActive ? 'active' : ''}`}
                      to={
                        child.isExternal ? "/news-and-blogs" :
                          isEventsPage ? "/company-events-announcements" :
                            isSupportPage ? "/support" :
                              isFaqPage ? "/faq" :
                                `/#${child.id}`
                      }
                      onClick={(e) => {
                        if (child.isExternal || isEventsPage || isSupportPage || isFaqPage) {
                          window.scrollTo(0, 0);
                          if (isMobile) closeMobileMenu();
                        } else {
                          handleInternalLink(child.id, e, isMobile);
                        }
                      }}
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

      if (item.id === 'services') {
        return (
          <li key={item.id} className="nav-item">
            <Link
              className={`nav-link ${isServicesPath ? 'active' : ''}`}
              to="/services"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                if (isMobile) closeMobileMenu();
              }}
            >
              {item.label}
            </Link>
          </li>
        );
      }

      const isItemActive = isHomePage ? isActive(item.id) : false;
      return (
        <li key={item.id} className="nav-item">
          <Link
            className={`nav-link scroll-link ${isItemActive ? 'active' : ''}`}
            to={item.id === 'home' ? '/' : `/#${item.id}`}
            onClick={(e) => handleInternalLink(item.id, e, isMobile)}
          >
            {item.label}
          </Link>
        </li>
      );
    });

  return (
    <header className={`fbs__net-navbar navbar navbar-expand-lg fixed-top ${isDarkMode ? 'dark' : 'light'} ${isScrolled || isDarkMode ? 'active' : ''}`} style={{ padding: '0.1rem 0' }}>
      <div className="container d-flex align-items-center justify-content-between">
        <Link className="navbar-brand" to="/" onClick={() => window.scrollTo(0, 0)}>
          <img src="/assets/images/TMClogo.png" alt="TMC Food Hub banner" style={{ width: '100px', height: '35px', objectFit: 'contain' }} />
        </Link>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {renderNavItems()}
            <li className="nav-item ms-lg-3">
              <button className="btn-mode d-flex align-items-center justify-content-center" onClick={toggleTheme} style={{ width: '40px', height: '40px', padding: '0', borderRadius: '50%' }}>
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </li>
          </ul>
        </div>

        <button className="fbs__net-navbar-toggler d-flex justify-content-center align-items-center ms-auto d-lg-none" data-bs-toggle="offcanvas" data-bs-target="#fbs__net-navbars" style={{ border: 'none', background: 'transparent', color: 'inherit' }}>
          <Menu size={28} />
        </button>

        <div className="offcanvas offcanvas-start w-75 d-lg-none" id="fbs__net-navbars" tabIndex="-1">
          <div className="offcanvas-header border-bottom">
            <Link to="/" onClick={() => { window.scrollTo(0, 0); closeMobileMenu(); }}>
              <img src="/assets/images/TMClogo.png" alt="TMC Food Hub banner" style={{ width: '100px', height: '35px', objectFit: 'contain' }} />
            </Link>
            <button className={`btn-close ${isDarkMode ? 'btn-close-white' : ''}`} data-bs-dismiss="offcanvas" />
          </div>
          <div className="offcanvas-body">
            <ul className="navbar-nav">{renderNavItems(true)}</ul>
            <div className="mt-4 px-3">
              <button className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={() => {
                  toggleTheme();
                  closeMobileMenu();
                }}>
                {isDarkMode ? <><Sun size={18} /> Light Mode</> : <><Moon size={18} /> Dark Mode</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
