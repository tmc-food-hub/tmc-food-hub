import aboutUsImage from "../../assets/home/about_us_image.png";

/**
 * Displays company mission, vision, and about information.
 */
function AboutSection() {
  return (
    <section
      className="about__v4 section overflow-hidden"
      id="about"
      style={{
        paddingTop: '80px',
        paddingBottom: '50px'
      }}
    >

      <div className="container">
        {/* Top Content Row: Image on left, Text on right */}
        <div className="row align-items-center mb-5">
          {/* LEFT COLUMN: Image */}
          <div className="col-md-6 mb-4 mb-md-0" data-aos="fade-right">
            <div className="img-wrap position-relative">



              <img
                className="img-fluid rounded-4 w-100 object-fit-cover shadow-sm"
                style={{ maxHeight: '450px', position: 'relative', zIndex: 1 }}
                src={aboutUsImage}
                alt="About TMC Food Hub"
              />
            </div>
          </div>

          {/* RIGHT COLUMN: Text */}
          <div className="col-md-6 ps-md-5" data-aos="fade-left">
            <span
              className="subtitle text-uppercase mb-3 d-inline-block px-3 py-1 rounded-2 fw-bold"
              style={{ backgroundColor: '#FDECE9', color: '#D94C38', fontSize: '0.8rem' }}
            >
              ABOUT US
            </span>

            <h2
              className="mb-4 fw-bold"
              style={{ fontSize: '2.5rem', color: '#1B1B1B' }}
            >
              Bringing Great Food Closer to You.
            </h2>

            <div className="text-muted" style={{ fontSize: '1rem', lineHeight: '1.7' }}>
              <p>
                TMC Foodhub is a modern food e-commerce platform dedicated to connecting hungry customers with the best local restaurants, home cooks, and specialty food vendors. We believe great food should be accessible to everyone &mdash; quickly, conveniently, and affordably. Our platform streamlines the entire ordering experience from discovery and selection to checkout and real-time tracking.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Content Row: Mission and Vision Cards */}
        <div className="row g-4 mt-2">
          {/* MISSION CARD */}
          <div className="col-md-6" data-aos="fade-up" data-aos-delay="100">
            <div className="p-4 p-lg-5 rounded-4 border h-100 bg-white" style={{ borderColor: '#E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
              <div className="d-flex align-items-center gap-3 mb-4">
                <div
                  className="icon rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '45px', height: '45px', backgroundColor: '#FDECE9', color: '#D94C38' }}
                >
                  <i className="bi bi-lightbulb fs-5"></i>
                </div>
                <h3 className="fs-5 fw-bold mb-0" style={{ color: '#1B1B1B' }}>MISSION</h3>
              </div>
              <p className="mb-0 text-muted" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                To create a seamless and enjoyable food ordering experience by connecting communities with their favorite local flavors &mdash; empowering restaurants and food vendors to grow their business while delighting customers with fast, reliable, and personalized delivery service.
              </p>
            </div>
          </div>

          {/* VISION CARD */}
          <div className="col-md-6" data-aos="fade-up" data-aos-delay="200">
            <div className="p-4 p-lg-5 rounded-4 border h-100 bg-white" style={{ borderColor: '#E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
              <div className="d-flex align-items-center gap-3 mb-4">
                <div
                  className="icon rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '45px', height: '45px', backgroundColor: '#FDECE9', color: '#D94C38' }}
                >
                  <i className="bi bi-eye fs-5"></i>
                </div>
                <h3 className="fs-5 fw-bold mb-0" style={{ color: '#1B1B1B' }}>VISION</h3>
              </div>
              <p className="mb-0 text-muted" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                TMC Foodhub envisions becoming the most trusted and beloved food delivery platform in the Philippines &mdash; recognized for its speed, variety, and commitment to supporting local food businesses. We strive to build a platform where every meal ordered creates value for customers, vendors, and communities alike.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;