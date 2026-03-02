import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/company-events-and-announcements.css';

const CompanyEventsAndAnnouncementsSection = () => {
  const createSlug = (text) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  return (
    <div id="company-events-announcements" className="section cea-main-wrapper">
      <div className="container">

        {/* Page Header */}
        <div className="text-center mb-5">
          <span
            className="subtitle text-uppercase mb-3 d-inline-block px-3 py-1 rounded-2 fw-bold"
            style={{ backgroundColor: '#FDECE9', color: '#D94C38', fontSize: '0.8rem' }}
          >
            UPDATES & NOTICES
          </span>
          <h2 className="mb-3 fw-bold cea-page-heading" style={{ fontSize: '2.2rem' }}>
            Company Events and<br />Announcements
          </h2>
          <p className="text-muted mx-auto cea-page-description" style={{ maxWidth: '600px', fontSize: '1rem', lineHeight: '1.6' }}>
            Stay updated with TMC's latest platform updates, service announcements, and company activities.
          </p>
        </div>

        {/* --- FEATURED SECTION --- */}
        <div className="cea-featured-box shadow-sm" data-aos="fade-up">
          <div className="row g-0 align-items-center">
            <div className="col-lg-6 order-1 order-lg-2">
              <img
                src="/assets/images/tmc_foodhub_platformm.png"
                alt="TMC Foodhub Platform Demo"
                className="cea-featured-img"
              />
            </div>

            <div className="col-lg-6 p-4 p-md-5 order-2 order-lg-1">
              <span className="cea-badge-featured">FEATURED</span>
              <h2 className="cea-item-title mt-3">TMC Foodhub Platform Demo & Walkthrough</h2>
              <p className="cea-description">
                A live demo of the Foodhub platform covering menu browsing, ordering flow, real-time tracking, and the restaurant partner dashboard.
              </p>

              <div className="mt-3">
                <p className="cea-date-info mb-1">
                  <i className="bi bi-calendar3 me-2" style={{ color: '#D94C38' }}></i>
                  <strong>February 15, 2026</strong>
                </p>
                <p className="cea-date-info mb-0">
                  <i className="bi bi-clock me-2" style={{ color: '#D94C38' }}></i>
                  3:00 PM – 4:00 PM (PHT)
                </p>
              </div>

              <div className="mt-4">
                <Link
                  className="special-link d-inline-flex gap-2 align-items-center text-decoration-none"
                  to={`/announcement/${createSlug("TMC Foodhub Platform Demo & Walkthrough")}`}
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

        {/* --- ANNOUNCEMENTS --- */}
        <div className="cea-bg-mint" data-aos="fade-up">
          <h2 className="cea-section-heading mb-5">Announcements</h2>
          <div className="row g-4 justify-content-center">
            <div className="col-md-5">
              <div className="cea-white-card shadow-sm">
                <img
                  src="/assets/images/scheduled_platform_thumbnail.png"
                  className="cea-card-img"
                  alt="Platform Maintenance"
                />
                <div className="cea-card-body-long">
                  <span className="cea-badge-small">SCHEDULED MAINTENANCE</span>
                  <h4 className="cea-card-title-long">Scheduled Platform Maintenance</h4>
                  <p className="cea-description-long">
                    TMC Foodhub services will be temporarily unavailable due to scheduled infrastructure upgrades.
                  </p>
                  <div className="cea-card-footer-long">
                    <div>
                      <p className="cea-date mb-1">
                        <i className="bi bi-calendar3 me-2" style={{ color: '#D94C38' }}></i>
                        March 5, 2026
                      </p>
                      <p className="cea-date mb-0">
                        <i className="bi bi-clock me-2" style={{ color: '#D94C38' }}></i>
                        11:00 PM – 2:00 AM
                      </p>
                    </div>
                    <Link
                      className="special-link d-inline-flex gap-2 align-items-center text-decoration-none"
                      to={`/announcement/${createSlug("Scheduled Platform Maintenance")}`}
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
                  src="/assets/images/scheduled_platform_thumbnail.png"
                  className="cea-card-img"
                  alt="Scheduled Delivery Feature"
                />
                <div className="cea-card-body-long">
                  <span className="cea-badge-small">NEW FEATURE</span>
                  <h4 className="cea-card-title-long">Scheduled Delivery Feature Now Live</h4>
                  <p className="cea-description-long">
                    Customers can now schedule food orders up to 7 days in advance, ensuring fresh meals arrive exactly when needed.
                  </p>
                  <div className="cea-card-footer-long">
                    <div>
                      <p className="cea-date mb-1">
                        <i className="bi bi-calendar3 me-2" style={{ color: '#D94C38' }}></i>
                        February 10, 2026
                      </p>
                      <p className="cea-date mb-0">
                        <i className="bi bi-clock me-2" style={{ color: '#D94C38' }}></i>
                        Effective Immediately
                      </p>
                    </div>
                    <Link
                      className="special-link d-inline-flex gap-2 align-items-center text-decoration-none"
                      to={`/announcement/${createSlug("Scheduled Delivery Feature Now Live")}`}
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
        <div className="cea-bg-warm" data-aos="fade-up">
          <h2 className="cea-section-heading mb-5">Company Events</h2>
          <div className="cea-white-card mb-4 shadow-sm">
            <img
              src="/assets/images/tmc_foodhub_platformm.png"
              className="cea-event-img-large"
              alt="TMC Foodhub Platform Demo"
            />
            <div className="cea-card-body">
              <span className="cea-badge-small">UPCOMING EVENT</span>
              <h4 className="cea-card-title mt-2">TMC Foodhub Platform Demo & Walkthrough</h4>
              <div className="cea-event-info-list mt-3">
                <p>
                  <i className="bi bi-calendar3 me-2" style={{ color: '#D94C38' }}></i>
                  <strong>Date:</strong> February 15, 2026
                </p>
                <p>
                  <i className="bi bi-clock me-2" style={{ color: '#D94C38' }}></i>
                  <strong>Time:</strong> 3:00 PM – 4:00 PM (PHT)
                </p>
              </div>
              <p className="cea-description-event mt-3">
                A live demo of the Foodhub platform covering menu browsing, ordering flow, real-time tracking, and the restaurant partner dashboard.
              </p>
              <div className="mt-4">
                <Link
                  className="special-link d-inline-flex gap-2 align-items-center text-decoration-none"
                  to={`/event/${createSlug("TMC Foodhub Platform Demo Walkthrough")}`}
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
  );
};

export default CompanyEventsAndAnnouncementsSection;