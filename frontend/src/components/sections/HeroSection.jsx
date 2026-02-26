import heroImage from "../../assets/home/heroimage.png"

/**
 * Main hero banner with headline, description, and call-to-action buttons.
 */
function HeroSection() {
  return (
    <>
      <style>{`
        @media (max-width: 991px) {
          .hero__v6 { 
            padding-top: 100px !important; 
            padding-bottom: 100px !important;
          }
        }
      `}</style>
      <section className="hero__v6 section" id="home">
        <div className="container">
          <div className="row">
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
                    className="hero-title mb-3"
                    data-aos="fade-up"
                    data-aos-delay="100"
                  >
                    Your Cravings, Delivered, Anytime, Anywhere.
                  </h1>

                  <p
                    className="hero-description mb-4 mb-lg-5"
                    data-aos="fade-up"
                    data-aos-delay="200"
                  >
                    TMC Food Hub is your premier delivery service connecting you to the best
                    local restaurants. Fast, reliable, and convenient dining at your fingertips.
                  </p>

                  <div
                    className="cta d-flex gap-2 mb-4 mb-lg-5"
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    <a className="btn" href="#">
                      Order Now
                    </a>

                    <a className="btn btn-white-outline" href="#">
                      <i className="bi bi-play-circle-fill me-2 fs-5"></i>
                      Explore
                    </a>
                  </div>

                  {/* <div
                  className="logos mb-4"
                  data-aos="fade-up"
                  data-aos-delay="400"
                >
                  <span className="logos-title text-uppercase mb-4 d-block">
                    Trusted by employers and clients
                  </span>

                  <div className="logos-images d-flex gap-4 align-items-center">
                    <img
                      className="img-fluid js-img-to-inline-svg"
                      src="assets/images/logo/actual-size/logo-air-bnb__black.svg"
                      alt="Company 1"
                      style={{ width: "110px" }}
                    />
                    <img
                      className="img-fluid js-img-to-inline-svg"
                      src="assets/images/logo/actual-size/logo-ibm__black.svg"
                      alt="Company 2"
                      style={{ width: "80px" }}
                    />
                    <img
                      className="img-fluid js-img-to-inline-svg"
                      src="assets/images/logo/actual-size/logo-google__black.svg"
                      alt="Company 3"
                      style={{ width: "110px" }}
                    />
                  </div>
                </div> */}
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="hero-img">
                {/* <img */}
                {/*   className="img-card img-fluid" */}
                {/*   src="assets/images/card-expenses.png" */}
                {/*   alt="Talent profile card" */}
                {/*   data-aos="fade-down" */}
                {/*   data-aos-delay="600" */}
                {/* /> */}
                <img
                  className="img-main img-fluid rounded-4"
                  src={heroImage}
                  alt="AVAA platform preview"
                  data-aos="fade-in"
                  data-aos-delay="500"
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
