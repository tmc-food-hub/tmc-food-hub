import SectionHeader from '../ui/SectionHeader';

function HowItWorksSection() {
  return (
    <section className="section howitworks__v1 py-5" id="how-it-works">
      <div className="container py-lg-4">

        <SectionHeader
          subtitle="How It Works"
          title="Everything will be at Your Door Step in just 4 Simple Steps!"
          description="TMC Food Hub transforms the complex task of resource management into a logical, four-step workflow."
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
                <h3 className="fs-5 fw-bold mb-1">Browse Menu</h3>
                <p className="text-muted small leading-normal mb-4">
                  Explore thousands of mouth-watering dishes from your favorite local restaurants right in the app.
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
                <h3 className="fs-5 fw-bold mb-1">Select Food</h3>
                <p className="text-muted small leading-normal mb-4">
                  Customize your order with a tap. Add extra toppings, select portion sizes, and make it perfectly yours.
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
                <h3 className="fs-5 fw-bold mb-1">Pay Securely</h3>
                <p className="text-muted small leading-normal mb-4">
                  Checkout seamlessly with our secure payment partners, whether you're using a card, e-wallet, or cash.
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
                <h3 className="fs-5 fw-bold mb-1">Fast Delivery</h3>
                <p className="text-muted small leading-normal mb-4">
                  Track your food in real-time. Within minutes, your freshly prepared meal will be knocking on your door.
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