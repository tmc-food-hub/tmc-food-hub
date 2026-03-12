

/**
 * Main hero banner with headline, description, and call-to-action buttons.
 */
function HeroSection() {
  return (
    <>
      <style>{`
        .hero-cta-btn {
          width: 170px;
          height: 48px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 991px) {
          .hero__v6 { 
            padding-top: 100px !important; 
            padding-bottom: 100px !important;
          }
        }
      `}</style>
      <section className="hero__v6 section" id="home">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="row">
                <div className="col-lg-11">
                  <span
                    className="hero-subtitle text-uppercase"
                    data-aos="fade-up"
                    data-aos-delay="0"
                  >
                    TMC Food Hub
                  </span>

                  <h1
                    className="hero-title mb-3 fw-bold"
                    data-aos="fade-up"
                    data-aos-delay="100"
                  >
                    Your Cravings, Delivered, Anytime, Anywhere.
                  </h1>

                  <p
                    className="hero-description mb-4 mb-lg-5 text-muted"
                    style={{ fontSize: '1.1rem' }}
                    data-aos="fade-up"
                    data-aos-delay="200"
                  >
                    TMC Food Hub is your premier delivery service connecting you to the best
                    local restaurants. Fast, reliable, and convenient dining at your fingertips.
                  </p>

                  <div
                    className="cta d-flex gap-3 mb-4 mb-lg-5 align-items-center"
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    <a className="btn btn-primary px-4 py-2 fw-semibold rounded-3 hero-cta-btn" style={{ backgroundColor: 'var(--bs-primary)', borderColor: 'var(--bs-primary)' }} href="#">
                      Order Now
                    </a>

                    <a className="btn btn-white-outline d-flex align-items-center fw-semibold px-4 py-2 rounded-3 hero-cta-btn" href="#">
                      <i className="bi bi-play-circle-fill me-2 text-danger" style={{ fontSize: '1.5rem', color: 'var(--bs-primary)' }}></i>
                      Explore
                    </a>
                  </div>

                </div>
              </div>
            </div>

            <div className="col-lg-6 mt-5 mt-lg-0">
              <div className="hero-img">
                <img
                  className="img-main img-fluid rounded-4 w-100"
                  src="/assets/images/home/main_hero.webp"
                  alt="TMC Food Hub Hero"
                  data-aos="fade-left"
                  data-aos-delay="400"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HeroSection;
