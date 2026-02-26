import SectionHeader from '../ui/SectionHeader';
import ServiceCard from '../ui/ServiceCard';


const services = [
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`, // Replace with a better icon if needed
    title: "Food Delivery",
    description: "Get your favorite meals delivered hot and fresh directly to your doorstep in record time.",
    delay: 0
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`, // Replace with a better icon if needed
    title: "Catering Services",
    description: "Planning an event? We offer comprehensive catering packages for parties, corporate events, and more.",
    delay: 100
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
    title: "Table Reservation",
    description: "Secure a table at top local restaurants ahead of time, ensuring a seamless dining experience.",
    delay: 200
  }
];

function ServicesSection() {
  return (
    <section className="section services__v3" id="services">
      <div className="container">
        <SectionHeader
          subtitle="Our Services"
          title="Designed for Your Convenience"
          centered
        />
        <div className="row g-4 justify-content-center">
          {services.map((service, index) => (
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
      </div>
    </section>
  );
}

export default ServicesSection;