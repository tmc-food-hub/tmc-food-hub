/**
 * Home Page
 * Main landing page that combines all section and UI components
 * Structure: Header > Main Content (Sections) > Back to Top Button
 */

// Import section components
import Navbar from '../../components/sections/Navbar';
import HeroSection from '../../components/sections/HeroSection';
import AboutSection from '../../components/sections/AboutSection';
import FeaturesSection from '../../components/sections/FeaturesSection';
import HowItWorksSection from '../../components/sections/HowItWorksSection';
import ServicesSection from '../../components/sections/ServicesSection';
import NewsBlogSection from '../../components/sections/NewsBlogSection';
import TestimonialsSection from '../../components/sections/TestimonialsSection';
import FAQSection from '../../components/sections/FAQSection';
import ContactSection from '../../components/sections/ContactSection';
import Footer from '../../components/sections/Footer';
import EventsSection from '../../components/sections/EventsSection'; // Added this
// Import UI components
import BackToTop from '../../components/ui/BackToTop';

function Homepage() {
  return (
    <>
      <div className="site-wrap">
        {/*Header*/}
        <Navbar />

        {/*Main*/}
        <main>
          <HeroSection />
          <AboutSection />
          <FeaturesSection />
          <HowItWorksSection />
          <TestimonialsSection />
          <ServicesSection />
          <EventsSection />
          <NewsBlogSection isPreview={true} />
          <FAQSection />
          <ContactSection />
          <Footer />
        </main>
      </div>

      {/*Back to Top */}
      <BackToTop />
    </>
  );
}

export default Homepage;
