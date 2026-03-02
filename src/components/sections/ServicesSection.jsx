import SectionHeader from '../ui/SectionHeader';
import ServiceCard from '../ui/ServiceCard';
import { Link } from 'react-router-dom';

const services = [
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 16h6"/><path d="M16 20h6"/><path d="M12 6H2"/><path d="M12 10H2"/><path d="M12 14H2"/><path d="M12 18H2"/><path d="M21 6l-3 3-3-3"/></svg>`,
    title: "Food Delivery",
    description: "Fast, reliable doorstep delivery from partner restaurants and food vendors — tracked in real time so you always know where your order is.",
    delay: 0
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>`,
    title: "Online Menu Browsing",
    description: "Explore full digital menus with photos, descriptions, prices, and ratings — helping customers make confident, satisfying choices every time.",
    delay: 100
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`,
    title: "Deals & Promotions",
    description: "Exclusive platform-wide and restaurant-specific deals, discount codes, and loyalty points that reward regular customers and drive repeat orders.",
    delay: 200
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
    title: "Restaurant Partner Dashboard",
    description: "A dedicated back-end portal for restaurant partners to manage their menu, track incoming orders, update availability, and view sales analytics in real time.",
    delay: 300
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/></svg>`,
    title: "Scheduled Orders",
    description: "Allow customers to schedule their orders in advance — perfect for meal prep, office deliveries, and events — with guaranteed pickup and delivery windows.",
    delay: 400
  }
];

function ServicesSection() {
  return (
    <section className="section services__v3" id="services">
      <div className="container">
        <div className="text-center mb-5">
          <span
            className="subtitle text-uppercase mb-3 d-inline-block px-3 py-1 rounded-2 fw-bold"
            style={{ backgroundColor: '#FDECE9', color: '#D94C38', fontSize: '0.8rem' }}
          >
            OUR SERVICES
          </span>
          <h2 className="mb-3 fw-bold" style={{ fontSize: '2.2rem', color: '#1B1B1B' }}>
            Innovative Tech Solutions to Drive<br />Your Digital Transformation
          </h2>
        </div>

        {/* Top Row - 3 cards */}
        <div className="row g-4 justify-content-center">
          {services.slice(0, 3).map((service, index) => (
            <div key={index} className="col-md-6 col-lg-4 d-flex align-items-stretch">
              <ServiceCard
                icon={service.icon}
                title={service.title}
                description={service.description}
                delay={service.delay}
              />
            </div>
          ))}
        </div>

        {/* Bottom Row - 2 cards */}
        <div className="row g-4 justify-content-center mt-2">
          {services.slice(3).map((service, index) => (
            <div key={index + 3} className="col-md-6 col-lg-4 d-flex align-items-stretch">
              <ServiceCard
                icon={service.icon}
                title={service.title}
                description={service.description}
                delay={service.delay}
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-5">
          <Link
            to="/services"
            className="btn px-5 py-2 fw-bold shadow-sm"
            onClick={() => window.scrollTo(0, 0)}
            style={{
              backgroundColor: '#8B1F1C',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
            }}
          >
            View more
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;