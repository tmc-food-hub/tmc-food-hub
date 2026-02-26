import SectionHeader from '../ui/SectionHeader';
import ServiceCard from '../ui/ServiceCard';


const services = [
  
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
    title: "Web Development",
    description: "Comprehensive web solutions tailored to business objectives, ensuring high availability and robust performance.",
    delay: 0
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`,
    title: "Frontend Development",
    description: "Crafting responsive, intuitive, and high-speed interfaces using modern frameworks to ensure a seamless client-side experience.",
    delay: 100
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" height="5" rx="9" ry="3" cy="5"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>`,
    title: "Backend Development",
    description: "Building the 'engine room' of your application—focusing on secure server-side logic, database management, and API integrations.",
    delay: 200
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
    title: "Full-Stack Development",
    description: "End-to-end development handling both the visual interface and the underlying architecture for a cohesive, turnkey digital product.",
    delay: 300
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>`,
    title: "Mobile Application Development",
    description: "Creating powerful iOS and Android applications that provide a native experience and extend your platform’s reach to mobile users.",
    delay: 400
  },
  
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.5 1.5"></path><path d="M7.5 9l-3 3"></path><path d="M11.5 11.5l-4 4"></path></svg>`,
    title: "UI/UX Design",
    description: "We go beyond aesthetics. Our design process focuses on user behavior, creating wireframes and interfaces that simplify complex workflows.",
    delay: 500
  },
  
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>`,
    title: "CRM Development",
    description: "Customizing and implementing Customer Relationship Management systems that centralize client data and streamline communication.",
    delay: 600
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>`,
    title: "Automation Specialist",
    description: "Replacing repetitive manual tasks with 'Autopilot' workflows, reducing human error and increasing organizational throughput.",
    delay: 700
  },
 
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`,
    title: "Digital Marketing",
    description: "Strategic, multi-channel campaigns focused on ROI, lead generation, and brand positioning within the IT and tech sectors.",
    delay: 800
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>`,
    title: "Social Media Specialist",
    description: "Managing and optimizing your social footprint to engage with industry stakeholders and build a community around your brand.",
    delay: 850
  },

  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>`,
    title: "IT Support",
    description: "Proactive technical assistance and maintenance to resolve hardware, software, and network issues, ensuring business continuity.",
    delay: 900
  }
];

function ServicesSection() {
  return (
    <section className="section services__v3" id="services">
      <div className="container">
        <SectionHeader
          subtitle="Our Services"
          title="Innovative Tech Solutions to Drive Your Digital Transformation"
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