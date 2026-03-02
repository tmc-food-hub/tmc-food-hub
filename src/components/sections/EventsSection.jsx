import ServiceCard from '../ui/ServiceCard';
import { Link } from 'react-router-dom';

const eventUpdates = [
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    title: "TMC Foodhub Platform Demo & Walkthrough",
    date: "February 15, 2026",
    time: "3:00 PM – 4:00 PM (PHT)",
    description: "A live demo of the Foodhub platform covering menu browsing, ordering flow, real-time tracking, and the restaurant partner dashboard.",
    delay: 0
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    title: "Scheduled Platform Maintenance",
    date: "March 5, 2026",
    time: "11:00 PM – 2:00 AM",
    description: "TMC Foodhub services will be temporarily unavailable due to scheduled infrastructure upgrades.",
    delay: 100
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`,
    title: "Scheduled Delivery Feature Now Live",
    date: "February 10, 2026",
    time: "Effective Immediately",
    description: "Customers can now schedule food orders up to 7 days in advance, ensuring fresh meals arrive exactly when needed.",
    delay: 200
  }
];

function EventsSection() {
  return (
    <section className="section events__v1" id="events">
      <div className="container">
        <div className="text-center mb-5">
          <span
            className="subtitle text-uppercase mb-3 d-inline-block px-3 py-1 rounded-2 fw-bold"
            style={{ backgroundColor: '#FDECE9', color: '#D94C38', fontSize: '0.8rem' }}
          >
            UPDATES & NOTICES
          </span>
          <h2 className="mb-3 fw-bold events-heading" style={{ fontSize: '2.2rem' }}>
            Company Events and Announcements
          </h2>
        </div>
        <div className="row g-4 justify-content-center">
          {eventUpdates.map((item, index) => (
            <div key={index} className="col-md-6 col-lg-4 d-flex align-items-stretch">
              <ServiceCard
                icon={item.icon}
                title={item.title}
                description={
                  <div className="event-content">
                    <div className="d-flex flex-column mb-3">
                      <span className="fw-bold small" style={{ color: '#D94C38' }}>
                        <i className="bi bi-calendar3 me-2"></i>{item.date}
                      </span>
                      <span className="text-muted small">
                        <i className="bi bi-clock me-2"></i>{item.time}
                      </span>
                    </div>
                    <p className="mb-0">{item.description}</p>
                  </div>
                }
                delay={item.delay}
                linkTo="/company-events-announcements"
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-5">
          <Link
            to="/company-events-announcements"
            className="btn px-5 py-2 fw-bold shadow-sm"
            onClick={() => window.scrollTo(0, 0)}
            style={{
              backgroundColor: '#8B1F1C',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
            }}
          >
            View all
          </Link>
        </div>
      </div>
    </section>
  );
}

export default EventsSection;
