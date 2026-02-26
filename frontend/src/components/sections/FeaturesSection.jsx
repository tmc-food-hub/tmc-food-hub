
function FeaturesSection() {
  return (
    <section className="section features__v2" id="features">
      <div className="container">


        <div className="row justify-content-center mb-5">
          <div className="col-lg-8 text-center" data-aos="fade-up">
            <h2
              className="display-4 fw-bold  text-uppercase mb-0"
              style={{ letterSpacing: '-1px' }}
            >
              Why Choose <span className="text-primary">TMC</span>
            </h2>
            <div
              className="bg-primary mx-auto mt-3"
              style={{ width: '60px', height: '4px', borderRadius: '2px' }}
            ></div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">

            <div
              className="d-lg-flex p-4 p-md-5 rounded-4 content shadow-sm border"
              data-aos="fade-in"
              data-aos-delay="0"

            >
              <div className="row align-items-center">

                {/* Left Side */}
                <div className="col-lg-5 mb-5 mb-lg-0" data-aos="fade-up" data-aos-delay="0">
                  <div className="row">
                    <div className="col-lg-11 text-center text-lg-start">
                      <div className="h-100 flex-column justify-content-between d-flex">
                        <div>
                          <h2>Everything you need, whenever you need it.</h2>
                          <p className="mb-5 text-muted lead" style={{ fontSize: '1.1rem' }}>
                            TMC Food Hub delivers a seamless experience from finding
                            your craving to having it at your door step quickly.
                          </p>
                        </div>
                        <div className="align-self-start mx-auto mx-lg-0">
                          <a
                            className="btn btn-primary d-inline-flex align-items-center gap-2 px-4 py-2 text-white text-decoration-none"
                            href="#"
                          >
                            <span className="fw-bold">Order Now</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side */}
                <div className="col-lg-7">
                  <div className="row g-4">
                    {[
                      {
                        icon: "bi-truck",
                        title: "Fast Delivery",
                        text: "Get your food PIPING hot! Our optimized delivery routes ensure your meals arrive as quickly as possible.",
                        delay: 0
                      },
                      {
                        icon: "bi-shop",
                        title: "Wide Selection",
                        text: "From local favorites to international cuisines, explore a vast array of restaurants right at your fingertips.",
                        delay: 100
                      },
                      {
                        icon: "bi-shield-lock",
                        title: "Secure Payments",
                        text: "Pay with confidence. We support multiple payment methods, all secured by industry-leading encryption.",
                        delay: 200
                      },
                      {
                        icon: "bi-headset",
                        title: "24/7 Support",
                        text: "Got an issue with your order? Our dedicated customer support team is available around the clock to assist you.",
                        delay: 300
                      }
                    ].map((feature, idx) => (
                      <div key={idx} className="col-sm-6" data-aos="fade-up" data-aos-delay={feature.delay}>
                        <div className="p-4 rounded-4 shadow-sm  h-100 border">
                          <div
                            className="rounded-3 d-flex align-items-center justify-content-center mb-3 bg-danger-subtle"
                            style={{ width: '50px', height: '50px' }}
                          >
                            <i className={`bi ${feature.icon} fs-2 text-primary`}></i>
                          </div>
                          <h3 className="fs-6 fw-bold mb-2 ">{feature.title}</h3>
                          <p className="small mb-0 text-muted" style={{ lineHeight: '1.6' }}>{feature.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;