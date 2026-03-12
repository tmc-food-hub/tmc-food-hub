function FeaturesSection() {
  const features = [
    {
      icon: "bi-basket",
      title: "Wide Variety",
      text: "Browse hundreds of restaurants, cuisines, and food categories all in one place.",
      delay: 0
    },
    {
      icon: "bi-truck",
      title: "Fast & Reliable Delivery",
      text: "Real-time tracking ensures your food arrives hot and on time.",
      delay: 100
    },
    {
      icon: "bi-tags",
      title: "Exclusive Deals",
      text: "Enjoy promos, discounts, and loyalty rewards available only on Foodhub.",
      delay: 200
    },
    {
      icon: "bi-phone",
      title: "Easy Ordering",
      text: "A clean, intuitive interface makes ordering effortless from any device.",
      delay: 300
    },
    {
      icon: "bi-shop",
      title: "Support Local",
      text: "We partner with local restaurants and home cooks to boost community food businesses.",
      delay: 400
    }
  ];

  return (
    <section className="section features__v2 py-5" id="features">
      <div className="container">

        {/* Section Header */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8 text-center" data-aos="fade-up">
            <h2
              className="display-5 fw-bold text-uppercase mb-0"
              style={{ letterSpacing: '-1px', color: '#1B1B1B' }}
            >
              Why Choose <span style={{ color: 'var(--bs-primary)' }}>TMC</span>
            </h2>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div
              className="d-lg-flex p-4 p-md-5 rounded-4 bg-white"
              style={{ border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
              data-aos="fade-in"
              data-aos-delay="0"
            >
              <div className="row align-items-center w-100 mx-0">

                {/* Left Side */}
                <div className="col-lg-5 mb-5 mb-lg-0" data-aos="fade-up" data-aos-delay="0">
                  <div className="row">
                    <div className="col-lg-11 text-center text-lg-start">
                      <div className="h-100 flex-column justify-content-between d-flex">
                        <div>
                          <h2 className="fw-bold mb-4" style={{ fontSize: '2.5rem', color: '#1B1B1B' }}>
                            Satisfy Every Craving.<br />Every Time.
                          </h2>
                          <p className="mb-5 text-muted" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                            TMC Foodhub transforms the way people discover and enjoy food &mdash; putting your favorite restaurants just a few taps away.
                          </p>
                        </div>
                        <div className="align-self-start mx-auto mx-lg-0">
                          <a
                            className="btn d-inline-flex align-items-center gap-2 px-4 py-2 text-white text-decoration-none rounded-3 fw-semibold"
                            style={{ backgroundColor: 'var(--bs-primary)', borderColor: 'var(--bs-primary)' }}
                            href="#"
                          >
                            <i className="bi bi-play-circle-fill"></i>
                            <span>Watch the Video</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side */}
                <div className="col-lg-7">
                  <div className="row g-4">
                    {features.map((feature, idx) => {
                      const isLastOddItem = features.length % 2 === 1 && idx === features.length - 1;

                      return (
                      <div
                        key={idx}
                        className={`col-sm-6${isLastOddItem ? ' mx-sm-auto' : ''}`}
                        data-aos="fade-up"
                        data-aos-delay={feature.delay}
                      >
                        <div className="p-4 rounded-4 h-100 bg-white" style={{ border: '1px solid #E5E7EB', boxShadow: '0 2px 4px -1px rgba(0,0,0,0.05)' }}>
                          <div
                            className="rounded-3 d-flex align-items-center justify-content-center mb-3"
                            style={{ width: '40px', height: '40px', backgroundColor: '#FFF5E6', color: '#F59E0B' }}
                          >
                            <i className={`bi ${feature.icon} fs-5`}></i>
                          </div>
                          <h3 className="fs-6 fw-bold mb-2" style={{ color: '#1B1B1B' }}>{feature.title}</h3>
                          <p className="small mb-0 text-muted" style={{ lineHeight: '1.6' }}>{feature.text}</p>
                        </div>
                      </div>
                    )})}
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