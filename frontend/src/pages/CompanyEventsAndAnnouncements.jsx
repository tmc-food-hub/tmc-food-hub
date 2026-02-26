import React from 'react';
import Navbar from '../components/sections/Navbar';
import Footer from '../components/sections/Footer';
import CompanyEventsAndAnnouncementsSection from '../components/sections/CompanyEventsAndAnnouncementsSection';

const CompanyEventsAndAnnouncements = () => {
  return (
    <div className="site-wrap">
      <Navbar />
      
     <main className="pb-5" style={{ paddingTop: '50px' }}>         
         <CompanyEventsAndAnnouncementsSection />
      </main>

      <Footer />
    </div>
  );
};

export default CompanyEventsAndAnnouncements;