import contactInfo from '../../data/contact.json';
import { Link } from 'react-router-dom';  

/**
 * Displays footer with company information, navigation links, services, and contact details.
 */
function Footer() {
  
   const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;  
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer pt-5 pb-5">
      <div className="container">
        <div className="row mb-5 pb-4 g-4">
          {/* Column 1: About AVAA */}
          <div className="col-lg-3 col-md-6">
            <h3 className="mb-3 fw-bold">AVAA</h3>
            <p className="mb-3 small">Precision in IT Resourcing.</p>
            <p className="small">We are an Employer-Side Resource Management Platform redefining how you navigate the IT workforce. We replace guesswork with data and scattered searches with a centralized, intelligent system.</p>
          </div>

          {/* Column 2: Explore */}
          <div className="col-lg-3 col-md-6">
            <h3 className="mb-3">Explore</h3>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/#about" onClick={() => scrollToSection('about')}>About Us</Link>
              </li>
              <li className="mb-2">
                <Link to="/#features" onClick={() => scrollToSection('features')}>Why Choose Us</Link>
              </li>
              <li className="mb-2">
                <Link to="/#how-it-works" onClick={() => scrollToSection('how-it-works')}>How It Works</Link>
              </li>
               <li className="mb-2">
                <Link to="/company-events-announcements" onClick={() => window.scrollTo(0, 0)}>
                  Events & Announcements
                </Link>
              </li>
               <li className="mb-2">
                <Link to="/news-and-blogs" onClick={() => window.scrollTo(0, 0)}>
                  News & Blogs
                </Link>
              </li>
             
              <li className="mb-2">
                <Link to="/support" onClick={() => scrollToSection('support')}>Support</Link>
              </li>
              <li className="mb-2">
                <Link to="/faq" onClick={() => scrollToSection('faq')}>FAQ</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Our Services */}
          <div className="col-lg-3 col-md-6">
            <h3 className="mb-3">Our Services</h3>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/#services" onClick={() => scrollToSection('services')}>Web & App Development</Link>
              </li>
              <li className="mb-2">
                <Link to="/#services" onClick={() => scrollToSection('services')}>UI/UX Design</Link>
              </li>
              <li className="mb-2">
                <Link to="/#services" onClick={() => scrollToSection('services')}>Business Systems & CRM</Link>
              </li>
              <li className="mb-2">
                <Link to="/#services" onClick={() => scrollToSection('services')}>Automation Specialists</Link>
              </li>
              <li className="mb-2">
                <Link to="/#services" onClick={() => scrollToSection('services')}>Digital Marketing</Link>
              </li>
              <li className="mb-2">
                <Link to="/#services" onClick={() => scrollToSection('services')}>IT Support Services</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Information */}
          <div className="col-lg-3 col-md-6">
            <h3 className="mb-3">Contact Us</h3>
          {/*  <div className="mb-3">
              <p className="small fw-bold mb-1">Address:</p>
              <p className="small">{contactInfo.addressLines.join(' ')}</p>
            </div>*/}
            <div className="mb-3">
              <p className="small fw-bold mb-1">Email Address:</p>
              <p className="small"><a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a></p>
            </div>
            {/*<div className="mb-3">
              <p className="small fw-bold mb-1">Contact Number:</p>
              <p className="small"><a href={`tel:${contactInfo.phoneHref}`}>{contactInfo.phoneDisplay}</a></p>
            </div>*/}
          </div>
        </div>

        <div className="row credits pt-3 border-top">
          <div className="col-xl-12 text-center">
            &copy; {new Date().getFullYear()} AVAA. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;