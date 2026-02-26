import aboutUsImage from "../../assets/home/aboutus.png";

/**
 * Displays company mission, vision, and about information with refined circular icons.
 */
function AboutSection() {
  return (
    <section 
      className="about__v4 section" 
      id="about" 
      style={{ 
        paddingTop: '80px', 
        paddingBottom: '50px'
      }}
    >   
      <div className="container">
        <div className="row">
          {/* LEFT CONTENT COLUMN */}
          <div className="col-md-6 order-md-2">
            <div className="row justify-content-end">
              <div className="col-md-11 mb-4 mb-md-0">
                <span
                  className="subtitle text-uppercase mb-3"
                  data-aos="fade-up"
                  data-aos-delay="0"
                >
                  About us
                </span>

                <h2
                  className="mb-4"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  Precision in IT Resourcing. Confidence in Selection.
                </h2>

                <div data-aos="fade-up" data-aos-delay="200">
                  <p>
                    The IT landscape is evolving rapidly, but the process of
                    identifying and selecting the right talent often remains
                    fragmented and manual. At AVAA (Autopilot Virtual Agency
                    Assistant), we are redefining how employers navigate the IT
                    workforce.
                  </p>
                  <p>
                    We are not just a database; we are an Employer-Side
                    Resource Management Platform. We bridge the gap between
                    complex project requirements and qualified professionals by
                    replacing guesswork with data, and scattered searches with
                    a centralized, intelligent system.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE COLUMN */}
          <div className="col-md-6">
            <div className="img-wrap position-relative h-100">
              <img
                className="img-fluid rounded-4"
                src={aboutUsImage}
                alt="AVAA platform overview"
                data-aos="fade-up"
                data-aos-delay="0"
              />
            </div>
          </div>
        </div>

        {/* MISSION & VISION FULL CONTENT CARDS */}
        <div className="row g-4 mt-5">
          {/* FULL MISSION CARD */}
          <div className="col-md-6" data-aos="fade-up" data-aos-delay="300">
            <div className="p-4 rounded-4 shadow-sm border h-100">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div 
                  className="icon rounded-circle bg-success-subtle d-flex align-items-center justify-content-center"
                  style={{ width: '50px', height: '50px', flexShrink: 0 }}
                >
                  <i className="bi bi-lightbulb fs-4 text-success"></i>
                </div>
                <h3 className="text-uppercase">Mission</h3>
              </div>
              <p className="mb-3">
                AVAA’s mission is to enable clients and employers in the IT
                industry to accurately identify and select qualified IT
                professionals through a centralized, structured, and reliable
                employer-side resource management platform.
              </p>
              <p className="mb-0">
                By consolidating detailed IT talent profiles including technical 
                skills, experience, and project background along with streamlined 
                navigation and an advanced criteria-based filtering engine, AVAA 
                minimizes fragmented workflows and manual searching, supporting 
                informed, efficient, and confident IT workforce selection.
              </p>
            </div>
          </div>

          {/* FULL VISION CARD */}
          <div className="col-md-6" data-aos="fade-up" data-aos-delay="600">
            <div className="p-4 rounded-4 shadow-sm border h-100">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div 
                  className="icon rounded-circle bg-success-subtle d-flex align-items-center justify-content-center"
                  style={{ width: '50px', height: '50px', flexShrink: 0 }}
                >
                  <i className="bi bi-eye fs-4 text-success"></i>
                </div>
                <h3 className="text-uppercase">Vision</h3>
              </div>
              <p className="mb-3">
                AVAA envisions becoming a leading employer-side resource
                management platform for the IT industry, trusted by
                organizations as the standard system for discovering,
                evaluating, and selecting IT professionals.
              </p>
              <p className="mb-0">
                We aim to shape a future where identifying people to work
                with in the IT field is streamlined, transparent, and
                data-driven, supported by well-designed system architecture,
                accurate talent information, and scalable technology that
                adapts to evolving workforce and project requirements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;