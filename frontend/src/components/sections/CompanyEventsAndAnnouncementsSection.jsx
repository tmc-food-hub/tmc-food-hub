import React from 'react';
import { Link } from 'react-router-dom';  
import SectionHeader from '../ui/SectionHeader'; 
import '../../assets/css/company-events-and-announcements.css';
import { useTimeAgo } from '../../hooks/useTimeAgo';

const CompanyEventsAndAnnouncementsSection = () => {
   const featuredPostDate = "2026-02-16T14:30:00"; 
  
   const { timeDisplay, fullDate } = useTimeAgo(featuredPostDate);

    const createSlug = (text) => 
    text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  return (
    <div id="company-events-announcements" className="section cea-main-wrapper">
      <div className="container">
        <SectionHeader 
          subtitle="COMPANY EVENTS & ANNOUNCEMENTS"
          title="AVAA Company Events"
          description="Stay updated with AVAA's latest platform updates, service announcements, and company activities."
          centered={true}
        />

        {/* --- FEATURED SECTION --- */}
      <div className="cea-featured-box shadow-sm" data-aos="fade-up">
        <div className="row g-0 align-items-center">
           <div className="col-lg-6 order-1 order-lg-2">
            <img 
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80" 
              alt="Featured" 
              className="cea-featured-img" 
            />
          </div>
 
            <div className="col-lg-6 p-4 p-md-5 order-2 order-lg-1">
              <span className="cea-badge-featured">FEATURED</span>
              <h2 className="cea-item-title mt-3">Platform Update: Advanced Filtering Engine v1.2</h2>
              <p className="cea-platform-version">Platform Update</p>
              <p className="cea-description">
                AVAA has released an enhanced version of its Advanced Filter-based filtering engine. 
                This update improves accuracy when matching IT professionals.
              </p>
              
              <div className="d-flex justify-content-between align-items-center mt-4">
                <p className="cea-date-footer mb-0">
                  {fullDate} • {timeDisplay}
                </p>
                 <Link 
                  className="special-link d-inline-flex gap-2 align-items-center text-decoration-none" 
                  to={`/announcement/${createSlug("Scheduled Platform Maintenance & Security Upgrade")}`}
                >
                  <span className="icons">
                    <i className="icon-1 bi bi-arrow-right-short"></i>
                    <i className="icon-2 bi bi-arrow-right-short"></i>
                  </span>
                  <span>Read more</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
        <div className="cea-spacer"></div>

        {/* --- GENERAL ANNOUNCEMENT--- */}
        <div className="cea-bg-mint" data-aos="fade-up">
          <h2 className="cea-section-heading mb-5">General Announcement</h2>
          <div className="row g-4 justify-content-center">
            <div className="col-md-5">
              <div className="cea-white-card shadow-sm">
                <img 
                  src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80" 
                  className="cea-card-img" 
                  alt="Automation" 
                />
                <div className="cea-card-body-long">
                  <span className="cea-badge-small">GENERAL</span>
                  <h4 className="cea-card-title-long">New Service Category: Automation Specialists</h4>
                  <p className="cea-platform-version-italic">Service Expansion</p>
                  <p className="cea-description-long">
                    AVAA now includes Automation Specialists focused on streamlining manual workflows and implementing autopilot business processes.
                  </p>
                  <div className="cea-card-footer-long">
                    <span className="cea-date">January 10, 2026</span>
                     <Link 
                      className="special-link d-inline-flex gap-2 align-items-center text-decoration-none" 
                      to={`/announcement/${createSlug("Expansion of Automation Specialists Service Line")}`}
                    >
                      <span className="icons">
                        <i className="icon-1 bi bi-arrow-right-short"></i>
                        <i className="icon-2 bi bi-arrow-right-short"></i>
                      </span>
                      <span>Read more</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-5">
              <div className="cea-white-card shadow-sm">
                <img 
                  src="https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=600&q=80" 
                  className="cea-card-img" 
                  alt="UI/UX Design" 
                />
                <div className="cea-card-body-long">
                  <span className="cea-badge-small">GENERAL</span>
                  <h4 className="cea-card-title-long">UI/UX Talent Profiles Standardization Completed</h4>
                  <p className="cea-platform-version-italic">System Improvement</p>
                  <p className="cea-description-long">
                    All UI/UX designer profiles have been migrated to a standardized format, enabling clearer comparison of skills.
                  </p>
                  <div className="cea-card-footer-long">
                    <span className="cea-date">January 5, 2026</span>
                     <Link 
                      className="special-link d-inline-flex gap-2 align-items-center text-decoration-none" 
                      to={`/announcement/${createSlug("AVAA Forms Strategic Cloud Infrastructure Alliance")}`}
                    >
                      <span className="icons">
                        <i className="icon-1 bi bi-arrow-right-short"></i>
                        <i className="icon-2 bi bi-arrow-right-short"></i>
                      </span>
                      <span>Read more</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="cea-spacer"></div>

        {/* --- COMPANY EVENTS --- */}
        <div className="cea-bg-teal" data-aos="fade-up">
          <h2 className="cea-section-heading text-white mb-5">Company Events</h2>
          <div className="cea-white-card mb-4 shadow-sm">
            <img 
              src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80" 
              className="cea-event-img-large" 
              alt="Event" 
            />
            <div className="cea-card-body">
              <span className="cea-badge-small">UPCOMING EVENTS</span>
              <h4 className="cea-card-title mt-2">AVAA Platform Walkthrough & Demo</h4>
              <div className="cea-event-info-list mt-3">
                <p><strong>Date:</strong> February 5, 2026</p>
                <p><strong>Time:</strong> 3:00 PM - 4:00 PM (PHT)</p>
                <p><strong>Format:</strong> Online (Zoom)</p>
              </div>
              <p className="cea-description-event mt-3">
                A guided walkthrough of AVAA's employer-side resource management workflow.
              </p>
              <div className="d-flex justify-content-end mt-2">
                 <Link 
                  className="cea-btn-register text-decoration-none" 
                  style={{ display: 'inline-block', textAlign: 'center' }}
                  to={`/event/${createSlug("AI-Assisted Talent Matching Now Live")}`}
                >
                  Register for Event →
                </Link>
              </div>
            </div>
          </div>

          <div className="cea-white-card shadow-sm">
            <img 
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80"
              className="cea-card-img" 
              alt="Internal Review" 
            />
            <div className="cea-card-body">
              <span className="cea-badge-small">UPCOMING EVENTS</span>
              <h4 className="cea-card-title mt-2">Internal Design & System Architecture Review</h4>
              <div className="cea-event-info-list mt-3">
                <p><strong>Date:</strong> February 12, 2026</p>
                <p><strong>Type Badge:</strong> Internal Event</p>
              </div>
              <p className="cea-description-event mt-3">
                Cross-functional review of AVAA's UI/UX flows and backend system architecture.
              </p>
              <div className="d-flex justify-content-end mt-2">
                  <Link 
                  className="cea-btn-register text-decoration-none" 
                  style={{ display: 'inline-block', textAlign: 'center' }}
                  to={`/event/${createSlug("AVAA Reaches 1,000 Active Enterprise Clients")}`}
                >
                  View Details →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyEventsAndAnnouncementsSection;