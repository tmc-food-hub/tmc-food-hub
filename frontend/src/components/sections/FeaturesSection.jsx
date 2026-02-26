
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
              Why Choose <span className="text-success">AVAA</span>
            </h2>
            <div 
              className="bg-success mx-auto mt-3" 
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
                          <h2>Eliminate the Noise. Elevate the Selection.</h2>
                          <p className="mb-5 text-muted lead" style={{ fontSize: '1.1rem' }}>
                            In a market saturated with fragmented data and manual workflows, 
                            AVAA provides the precision required by the modern IT industry.
                          </p>
                        </div>
                        <div className="align-self-start mx-auto mx-lg-0">
                          <a 
                            className="glightbox btn btn-outline-dark d-inline-flex align-items-center gap-2 px-4 py-2" 
                            href="https://youtu.be/oZkfMuJD5Fs?si=v06B3wxWJKY4eHr0" 
                            data-gallery="video"
                          >
                            <i className="bi bi-play-circle-fill fs-5 text-success"></i> 
                            <span className="fw-bold">Watch the Video</span>
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
                        icon: "bi-database-check",
                        title: "A Unified Source of Truth",
                        text: "Stop juggling multiple platforms. AVAA centralizes talent profiles, technical backgrounds, and project history into one structured environment.",
                        delay: 0
                      },
                      {
                        icon: "bi-funnel",
                        title: "Precision Filtering",
                        text: "Our advanced engine allows you to move beyond basic keywords. Filter by specific project experience, technology stacks, and niche expertise with absolute accuracy.",
                        delay: 100
                      },
                      {
                        icon: "bi-shield-check",
                        title: "Data-Driven Confidence",
                        text: "We replace 'gut feel' with a transparent, data-backed evaluation process, ensuring that every hire or resource allocation is supported by verified information.",
                        delay: 200
                      },
                      {
                        icon: "bi-layers",
                        title: "Architected for Scale",
                        text: "Built on a foundation of robust system architecture, our platform grows with your organization, adapting to shifting project requirements without losing performance.",
                        delay: 300
                      }
                    ].map((feature, idx) => (
                      <div key={idx} className="col-sm-6" data-aos="fade-up" data-aos-delay={feature.delay}>
                        <div className="p-4 rounded-4 shadow-sm  h-100 border">
                          <div 
                            className="rounded-3  d-flex align-items-center justify-content-center mb-3" 
                            style={{ width: '50px', height: '50px' }}
                          >
                            <i className={`bi ${feature.icon} fs-2 text-success`}></i>
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