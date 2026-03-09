import Navbar from '../../components/sections/Navbar';

import Footer from '../../components/sections/Footer';

import BackToTop from '../../components/ui/BackToTop';
import SupportSection from '../../components/sections/SupportSection';

function SupportPage() {
  return (
    <>
      <div className="site-wrap">
         <Navbar />

    <main className="pb-5" style={{ paddingTop: '80px' }}>         
          <SupportSection />
        </main>

        <Footer />
      </div>

      <BackToTop />
    </>
  );
}

export default SupportPage;