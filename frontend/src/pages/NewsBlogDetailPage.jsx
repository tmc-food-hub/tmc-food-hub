import Navbar from '../components/sections/Navbar';
import NewsBlogDetailSection from '../components/sections/NewsBlogDetailSection'; 
import Footer from '../components/sections/Footer';
import BackToTop from '../components/ui/BackToTop';

function NewsBlogDetailPage() {
  return (
    <>
      <div className="site-wrap">
        <Navbar />

        <main className="pb-5" style={{ paddingTop: '100px' }}>         
          <NewsBlogDetailSection />
        </main>

        <Footer />
      </div>

      <BackToTop />
    </>
  );
}

export default NewsBlogDetailPage;