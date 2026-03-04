import { createElement } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa6';
import styles from './Footer.module.css';

const socialLinks = [
  { icon: FaFacebookF, label: 'Facebook', href: '#' },
  { icon: FaInstagram, label: 'Instagram', href: '#' },
  { icon: FaLinkedinIn, label: 'LinkedIn', href: '#' },
];

const quickLinks = [
  { label: 'Home', type: 'route', to: '/' },
  { label: 'Menu', type: 'anchor', href: '#' },
  { label: 'Restaurants', type: 'anchor', href: '#' },
  { label: 'How It Works', type: 'route', to: '/#how-it-works' },
  { label: 'Deals & Promos', type: 'anchor', href: '#' },
  { label: 'FAQs', type: 'route', to: '/faq' },
  { label: 'Contact Us', type: 'route', to: '/#contact' },
];

const restaurantLinks = [
  { label: 'Partner With Us', href: '#' },
  { label: 'Restaurant Dashboard', href: '#' },
  { label: 'Merchant Support', href: '#' },
  { label: 'Success Stories', href: '#' },
];

const serviceLinks = [
  { label: 'Food Delivery', href: '#' },
  { label: 'Scheduled Orders', href: '#' },
  { label: 'Deals & Promotions', href: '#' },
  { label: 'Loyalty Rewards', href: '#' },
  { label: 'Catering Orders', href: '#' },
];

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className="row g-4 pb-4">
          <div className="col-lg-3 col-md-6">
            <h3 className={styles.heading}>TMC Foodhub</h3>
            <p className={styles.description}>
              Your go-to platform for fast, reliable food delivery connecting local lovers
              with local restaurants and home kitchens across the Philippines.
            </p>
            <h4 className={styles.socialTitle}>Social Media</h4>
            <div className={styles.socialRow}>
              {socialLinks.map(({ icon, label, href }) => (
                <a key={label} href={href} aria-label={label} className={styles.socialIcon}>
                  {createElement(icon, { size: 12 })}
                </a>
              ))}
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h4 className={styles.subheading}>Quick Links</h4>
            <ul className={styles.linkList}>
              {quickLinks.map((item) => (
                <li key={item.label}>
                  {item.type === 'route' ? (
                    <Link to={item.to} className={styles.link}>
                      {item.label}
                    </Link>
                  ) : (
                    <a href={item.href} className={styles.link}>
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="col-lg-2 col-md-6">
            <h4 className={styles.subheading}>For Restaurants</h4>
            <ul className={styles.linkList}>
              {restaurantLinks.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className={styles.link}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-lg-2 col-md-6">
            <h4 className={styles.subheading}>Our Services</h4>
            <ul className={styles.linkList}>
              {serviceLinks.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className={styles.link}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h4 className={styles.subheading}>Contact Information</h4>
            <address className={styles.contactInfo}>
              <p>
                <span>Support Center</span>
                <Link to="/support">Support Center</Link>
              </p>
              <p>
                <span>Email</span>
                <a href="mailto:support@tmcfoodhub.com">support@tmcfoodhub.com</a>
              </p>
              <p>
                <span>Phone</span>
                <a href="tel:+63XXXXXXXXXX">+63 XXX XXX XXXX</a>
              </p>
              <p>
                <span>Website</span>
                <a href="https://tmcfoodhub.com">https://tmcfoodhub.com</a>
              </p>
            </address>
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className="container text-center">&copy; 2026 TMC Foodhub. All Rights Reserved.</div>
      </div>
    </footer>
  );
}

export default Footer;
