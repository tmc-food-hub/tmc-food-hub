import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SectionHeader from '../ui/SectionHeader';
import FAQItem from '../ui/FAQItem';
import faqs from '../../data/faqs.json';

function FAQSection() {
  const location = useLocation();
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    const hashId = location.hash.replace('#', '');
    
    if (hashId) {
      // Open only the FAQ that matches the Quick Link
      setActiveId(hashId);

      const element = document.getElementById(hashId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // No hash → normal navigation → open the first FAQ
      if (faqs.length > 0) setActiveId(faqs[0].id);
    }
  }, [location.hash]);

  return (
    <section className="section faq__v2" id="faq">
      <div className="container">
        <SectionHeader
          subtitle="FAQ"
          title="Frequently Asked Questions"
          description="Utilize our tools to develop your concepts and bring your vision to life. Once complete, effortlessly share your creations."
          centered
        />
        <div className="row">
          <div className="col-md-8 mx-auto">
            <div className="faq-content">
              <div className="accordion custom-accordion" id="accordionPanelsStayOpenExample">
                {faqs.map((faq) => (
                  <FAQItem
                    key={faq.id}
                    id={faq.id}
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={activeId === faq.id} // only the activeId is open
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>  
    </section>
  );
}

export default FAQSection;
