import SectionHeader from '../ui/SectionHeader';

function HowItWorksSection() {
  return (
    <section className="section howitworks__v1 py-5" id="how-it-works">
      <div className="container py-lg-4">
        
        <SectionHeader
          subtitle="How It Works"
          title="Four Steps to a Streamlined IT Workforce"
          description="AVAA transforms the complex task of resource management into a logical, four-step workflow."
          centered
        />

        {/* Steps */}
        <div className="row g-4 g-xl-5 mt-4">
          
          
          <div className="col-md-6 col-lg-3">
            <div
              className="step-card text-center h-100 d-flex flex-column align-items-center"
              data-aos="fade-up"
              data-aos-delay="0"
            >
              <div className="position-relative w-100 mb-3">
                <div data-aos="fade-right" data-aos-delay="500">
                  <img
                    className="arch-line d-none d-lg-block"
                    src="assets/images/arch-line.svg"
                    alt="Decorative line"
                  />
                </div>
                <span className="step-number rounded-circle d-flex align-items-center justify-content-center fw-bold mx-auto">1</span>
              </div>
              <div className="px-2">
                <h3 className="fs-5 fw-bold mb-1">Centralize Talent Profiles</h3>
                <p className="text-muted small leading-normal mb-4">
                  Import or aggregate detailed IT professional profiles into the AVAA ecosystem. Our structure ensures that technical skills, previous project roles, and experience levels are captured in a standardized format.
                </p>
              </div>
            </div>
          </div>

          
          <div className="col-md-6 col-lg-3" data-aos="fade-up" data-aos-delay="400">
            <div className="step-card reverse text-center h-100 d-flex flex-column align-items-center">
              <div className="position-relative w-100 mb-3">
                <div data-aos="fade-left" data-aos-delay="1100">
                  <img
                    className="arch-line reverse d-none d-lg-block"
                    src="assets/images/arch-line-reverse.svg"
                    alt="Decorative line"
                  />
                </div>
                <span className="step-number rounded-circle d-flex align-items-center justify-content-center fw-bold mx-auto">2</span>
              </div>
              <div className="px-2">
                <h3 className="fs-5 fw-bold mb-1">Apply Advanced Criteria</h3>
                <p className="text-muted small leading-normal mb-4">
                  Utilize our advanced filtering engine to narrow down the field. Define your specific requirements—from specific coding languages to industry-specific project backgrounds—to find the perfect match.
                </p>
              </div>
            </div>
          </div>

         
          <div className="col-md-6 col-lg-3" data-aos="fade-up" data-aos-delay="800">
            <div className="step-card text-center h-100 d-flex flex-column align-items-center">
              <div className="position-relative w-100 mb-3">
                <div data-aos="fade-right" data-aos-delay="1700">
                  <img
                    className="arch-line d-none d-lg-block"
                    src="assets/images/arch-line.svg"
                    alt="Decorative line"
                  />
                </div>
                <span className="step-number rounded-circle d-flex align-items-center justify-content-center fw-bold mx-auto">3</span>
              </div>
              <div className="px-2">
                <h3 className="fs-5 fw-bold mb-1">Evaluate & Compare</h3>
                <p className="text-muted small leading-normal mb-4">
                  Review structured talent data side-by-side. Our transparent interface allows you to evaluate candidates based on objective metrics and detailed history, minimizing the time spent on manual screening.
                </p>
              </div>
            </div>
          </div>

          
          <div className="col-md-6 col-lg-3" data-aos="fade-up" data-aos-delay="1200">
            <div className="step-card last text-center h-100 d-flex flex-column align-items-center">
              <div className="position-relative w-100 mb-3">
                <span className="step-number rounded-circle d-flex align-items-center justify-content-center fw-bold mx-auto">4</span>
              </div>
              <div className="px-2">
                <h3 className="fs-5 fw-bold mb-1">Select with Confidence</h3>
                <p className="text-muted small leading-normal mb-4">
                  Execute your selection within a single system. By removing fragmented workflows, AVAA allows you to finalize your IT workforce decisions quickly, efficiently, and with total clarity.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;