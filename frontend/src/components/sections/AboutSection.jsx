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
                  Enjoy Your Food, Hassle-Free
                </h2>

                <div data-aos="fade-up" data-aos-delay="200">
                  <p>
                    At TMC Food Hub, we believe that enjoying great food shouldn't be complicated.
                    That's why we've streamlined the delivery process to ensure your favorites
                    arrive hot, fresh, and on time.
                  </p>
                  <p>
                    We partner with the best local restaurants to offer a wide variety of cuisines,
                    satisfying every craving with just a few clicks. Experience the convenience of
                    premium food delivery, brought directly to your door.
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
          <div className="col-md-6" data-aos="fade-up" data-aos-delay="300">
            <div className="p-4 rounded-4 shadow-sm border h-100">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div
                  className="icon rounded-circle bg-danger-subtle d-flex align-items-center justify-content-center"
                  style={{ width: '50px', height: '50px', flexShrink: 0 }}
                >
                  <i className="bi bi-clock-history fs-4 text-primary"></i>
                </div>
                <h3 className="text-uppercase" style={{ color: 'var(--bs-primary)' }}>Quick Order</h3>
              </div>
              <p className="mb-3">
                Browse our extensive menu and place your order in seconds. Our intuitive interface makes finding and ordering your favorite meals easier than ever.
              </p>
            </div>
          </div>

          <div className="col-md-6" data-aos="fade-up" data-aos-delay="600">
            <div className="p-4 rounded-4 shadow-sm border h-100">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div
                  className="icon rounded-circle bg-danger-subtle d-flex align-items-center justify-content-center"
                  style={{ width: '50px', height: '50px', flexShrink: 0 }}
                >
                  <i className="bi bi-geo-alt fs-4 text-primary"></i>
                </div>
                <h3 className="text-uppercase" style={{ color: 'var(--bs-primary)' }}>Live Tracking</h3>
              </div>
              <p className="mb-3">
                Follow your food's journey from the kitchen to your doorstep with our real-time GPS tracking. Know exactly when your delicious meal will arrive.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;