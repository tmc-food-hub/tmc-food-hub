import SectionHeader from '../ui/SectionHeader';
import ServiceCard from '../ui/ServiceCard';

const eventUpdates = [
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
    title: "Quarterly Team Alignment Meeting",
    date: "March 15, 2026",
    time: "10:00 AM – 12:00 PM",
    description: "A scheduled alignment meeting to discuss company goals, project updates, and team priorities for the upcoming quarter.",
    delay: 0
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
    title: "Scheduled System Maintenance",
    date: "March 10, 2026",
    time: "11:00 PM – 2:00 AM",
    description: "AVAA services may be temporarily unavailable due to scheduled system maintenance during this period.",
    delay: 100
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`,
    title: "Platform Interface Improvements",
    date: "February 6, 2026",
    time: "—", 
    description: "Minor UI enhancements have been implemented to improve readability and overall user experience.",
    delay: 200
  }
];

function EventsSection() {
  return (
    <section className="section events__v1" id="events">
      <div className="container">
        <SectionHeader
          subtitle="Updates & Notices"
          title="Company Events and Announcements"
          centered
        />
        <div className="row g-4 justify-content-center">
          {eventUpdates.map((item, index) => (
            <div key={index} className="col-md-6 col-lg-4 d-flex align-items-stretch">
              <ServiceCard
                icon={item.icon}
                title={item.title}
                description={
                  <div className="event-content">
                    <div className="d-flex flex-column mb-3">
                      <span className="text-primary fw-bold small">
                        <i className="bi bi-calendar3 me-2"></i>{item.date}
                      </span>
                      {}
                      <span className="text-muted small">
                        <i className="bi bi-clock me-2"></i>{item.time}
                      </span>
                    </div>
                    <p className="mb-0">{item.description}</p>
                  </div>
                }
                delay={item.delay}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default EventsSection;
