import { FiBookOpen, FiCalendar, FiGrid, FiPercent, FiTruck } from 'react-icons/fi';
import ServiceFeatureCard from '../../ui/ServiceFeatureCard';
import styles from './ServicesPage.module.css';

const services = [
  {
    icon: FiTruck,
    title: 'Food Delivery',
    description: 'Deliver meals quickly and reliably with live tracking and order status updates for every customer.',
    href: '#',
    delay: 0
  },
  {
    icon: FiBookOpen,
    title: 'Online Menu Browsing',
    description: 'Showcase your menu with clear categories, item details, and smooth ordering from any device.',
    href: '#',
    delay: 80
  },
  {
    icon: FiPercent,
    title: 'Deals & Promotions',
    description: 'Launch time-based offers, bundle deals, and discounts that help increase repeat purchases.',
    href: '#',
    delay: 160
  },
  {
    icon: FiGrid,
    title: 'Restaurant Partner Dashboard',
    description: 'Manage orders, monitor performance, and track restaurant growth from a centralized dashboard.',
    href: '#',
    delay: 240
  },
  {
    icon: FiCalendar,
    title: 'Scheduled Orders',
    description: 'Allow customers to place advanced orders for better prep planning and steady daily workflows.',
    href: '#',
    delay: 320
  }
];

function ServicesSection() {
  return (
    <section className={styles.section} aria-labelledby="services-offer-heading">
      <div className="container">
        <header className={styles.sectionHeader}>
          <span className={styles.kicker}>OUR EXPERTISE</span>
          <h1 id="services-offer-heading" className={styles.title}>
            What We Offer
          </h1>
          <p className={styles.summary}>
            We provide practical digital tools that help restaurants increase visibility, streamline operations,
            and improve customer experience at every order touchpoint.
          </p>
        </header>

        <div className="row g-4 justify-content-center">
          {services.map((service) => (
            <div key={service.title} className="col-12 col-md-6 col-lg-4 d-flex align-items-stretch">
              <ServiceFeatureCard
                icon={service.icon}
                title={service.title}
                description={service.description}
                href={service.href}
                delay={service.delay}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;
