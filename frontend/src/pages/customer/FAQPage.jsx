import Navbar from '../../components/sections/Navbar';
import Footer from '../../components/sections/Footer';
import BackToTop from '../../components/ui/BackToTop';
import FAQSection from '../../components/sections/FAQSection';

function FAQPage() {
  return (
    <>
      <div className="site-wrap">
        <Navbar />

        <main>         
          <FAQSection />
        </main>

        <Footer />
      </div>

      <BackToTop />
    </>
  );
}

export default FAQPage;