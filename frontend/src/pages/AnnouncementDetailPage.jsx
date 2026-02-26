import React from 'react';
import Navbar from '../components/sections/Navbar';
import Footer from '../components/sections/Footer';
 import AnnouncementDetail from '../components/sections/AnnouncementDetail';
const AnnouncementDetailPage = () => {
  return (
    <div className="site-wrap">
      <Navbar />
      
     <main className="pb-5" style={{ paddingTop: '50px' }}>         
         <AnnouncementDetail />
      </main>

      <Footer />
    </div>
  );
};

export default AnnouncementDetailPage;