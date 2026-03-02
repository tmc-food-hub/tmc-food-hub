import SectionHeader from '../ui/SectionHeader';

function HowItWorksSection() {
  return (
    <section className="section howitworks__v1 py-5" id="how-it-works">
      <style>{`
        @keyframes flowDots {
          from { stroke-dashoffset: 48; }
          to { stroke-dashoffset: 0; }
        }
        .flowing-dots {
          animation: flowDots 3s linear infinite;
        }
      `}</style>
      <div className="container py-lg-4">

        {/* Custom Section Header styling for the new design */}
        <div className="text-center mb-5">
          <span
            className="subtitle text-uppercase mb-3 d-inline-block px-3 py-1 rounded-2 fw-bold"
            style={{ backgroundColor: '#FDECE9', color: '#D94C38', fontSize: '0.8rem' }}
          >
            HOW IT WORKS
          </span>
          <h2 className="mb-3 fw-bold" style={{ fontSize: '2.5rem', color: '#1B1B1B' }}>
            Four Simple Steps to Your Next Great Meal
          </h2>
          <p className="text-muted mx-auto" style={{ maxWidth: '600px', fontSize: '1rem', lineHeight: '1.6' }}>
            TMC Foodhub makes ordering food as easy and satisfying as the meal itself.
          </p>
        </div>

        {/* Steps */}
        <div className="row g-4 g-xl-5 mt-4 position-relative">

          {/* Continuous background line for desktop */}
          <div className="d-none d-lg-block position-absolute w-100" style={{ top: '30px', left: 0, zIndex: 0, pointerEvents: 'none' }}>
            <svg
              style={{
                width: '75%',
                marginLeft: '12.5%',
                height: '40px',
                transform: 'translateY(-50%)'
              }}
              viewBox="0 0 300 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <path
                className="flowing-dots"
                d="M 0 20 Q 50 -10 100 20 Q 150 50 200 20 Q 250 -10 300 20"
                stroke="#991B1B"
                strokeWidth="2.5"
                strokeDasharray="12 12"
              />
            </svg>
          </div>

          {/* STEP 1 */}
          <div className="col-md-6 col-lg-3">
            <div
              className="step-card text-center h-100 d-flex flex-column align-items-center"
              data-aos="fade-up"
              data-aos-delay="0"
            >
              <div className="position-relative w-100 mb-4 d-flex justify-content-center">
                <span
                  className="step-number position-relative rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow-sm"
                  style={{ width: '60px', height: '60px', fontSize: '1.5rem', backgroundColor: '#581C0C', zIndex: 2 }}
                >
                  1
                </span>
              </div>
              <div className="px-2">
                <h3 className="fs-6 fw-bold mb-3" style={{ color: '#1B1B1B' }}>Browse & Discover</h3>
                <p className="text-muted small mb-0" style={{ lineHeight: '1.6' }}>
                  Explore a wide selection of restaurants, cuisines, and dishes near you. Use filters by cuisine type, price range, dietary preference, or delivery time to find exactly what you're craving.
                </p>
              </div>
            </div>
          </div>

          {/* STEP 2 */}
          <div className="col-md-6 col-lg-3" data-aos="fade-up" data-aos-delay="200">
            <div className="step-card text-center h-100 d-flex flex-column align-items-center">
              <div className="position-relative w-100 mb-4 d-flex justify-content-center">
                <span
                  className="step-number position-relative rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow-sm"
                  style={{ width: '60px', height: '60px', fontSize: '1.5rem', backgroundColor: '#991B1B', zIndex: 2 }}
                >
                  2
                </span>
              </div>
              <div className="px-2">
                <h3 className="fs-6 fw-bold mb-3" style={{ color: '#1B1B1B' }}>Customize & Add to Cart</h3>
                <p className="text-muted small mb-0" style={{ lineHeight: '1.6' }}>
                  Select your items, customize your order (e.g., spice level, add-ons, special instructions), and add everything to your cart. Easily review your order before checkout.
                </p>
              </div>
            </div>
          </div>

          {/* STEP 3 */}
          <div className="col-md-6 col-lg-3" data-aos="fade-up" data-aos-delay="400">
            <div className="step-card text-center h-100 d-flex flex-column align-items-center">
              <div className="position-relative w-100 mb-4 d-flex justify-content-center">
                <span
                  className="step-number position-relative rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow-sm"
                  style={{ width: '60px', height: '60px', fontSize: '1.5rem', backgroundColor: '#C2410C', zIndex: 2 }}
                >
                  3
                </span>
              </div>
              <div className="px-2">
                <h3 className="fs-6 fw-bold mb-3" style={{ color: '#1B1B1B' }}>Checkout & Pay</h3>
                <p className="text-muted small mb-0" style={{ lineHeight: '1.6' }}>
                  Choose your delivery address, select a payment method (Cash on Delivery, GCash, Credit/Debit Card, or Maya), and apply any promo codes or vouchers. Confirm your order with a single tap.
                </p>
              </div>
            </div>
          </div>

          {/* STEP 4 */}
          <div className="col-md-6 col-lg-3" data-aos="fade-up" data-aos-delay="600">
            <div className="step-card last text-center h-100 d-flex flex-column align-items-center">
              <div className="position-relative w-100 mb-4 d-flex justify-content-center">
                <span
                  className="step-number position-relative rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow-sm"
                  style={{ width: '60px', height: '60px', fontSize: '1.5rem', backgroundColor: '#F59E0B', zIndex: 2 }}
                >
                  4
                </span>
              </div>
              <div className="px-2">
                <h3 className="fs-6 fw-bold mb-3" style={{ color: '#1B1B1B' }}>Track & Receive</h3>
                <p className="text-muted small mb-0" style={{ lineHeight: '1.6' }}>
                  Get real-time updates on your order status &mdash; from preparation to pickup to delivery. Track your rider on a live map and receive your meal fresh, hot, and on time.
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