import React, { useEffect } from 'react';
import Navbar from '../components/sections/Navbar';
import Footer from '../components/sections/Footer';
import BackToTop from '../components/ui/BackToTop';
import ServicesSection from '../components/sections/services/ServicesSection';
import TrustSection from '../components/sections/services/TrustSection';
import CTASection from '../components/sections/services/CTASection';

function ServicesPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="site-wrap">
        <Navbar />

        <main style={{ paddingTop: '80px' }}>
          <ServicesSection />
          <TrustSection />
          <CTASection />
        </main>

        <Footer />
      </div>

      <BackToTop />
    </>
  );
}

export default ServicesPage;
