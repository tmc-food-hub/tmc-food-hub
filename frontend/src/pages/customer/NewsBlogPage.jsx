import Navbar from '../../components/sections/Navbar';
import NewsBlogSection from '../../components/sections/NewsBlogSection'; 
import Footer from '../../components/sections/Footer';

import BackToTop from '../../components/ui/BackToTop';

function NewsBlogPage() {
  return (
    <>
      <div className="site-wrap">
         <Navbar />

    <main className="pb-5" style={{ paddingTop: '80px' }}>         
          <NewsBlogSection />
        </main>

        <Footer />
      </div>

      <BackToTop />
    </>
  );
}

export default NewsBlogPage;