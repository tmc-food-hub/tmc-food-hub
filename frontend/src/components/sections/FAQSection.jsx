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
    <section className="section faq__v2" id="faq" style={{ backgroundColor: '#FFF5F0' }}>
      <div className="container">
        <div className="text-center mb-5">
          <span
            className="subtitle text-uppercase mb-3 d-inline-block px-3 py-1 rounded-2 fw-bold"
            style={{ backgroundColor: '#FDECE9', color: '#D94C38', fontSize: '0.8rem' }}
          >
            FAQS
          </span>
          <h2 className="mb-3 fw-bold" style={{ fontSize: '2.2rem', color: '#1B1B1B' }}>
            Frequently Asked Questions
          </h2>
          <p className="text-muted mx-auto" style={{ maxWidth: '600px', fontSize: '1rem', lineHeight: '1.6' }}>
            Curious about how TMC Foodhub works? Get quick answers to our most common questions.
          </p>
        </div>
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
                    isOpen={activeId === faq.id}
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
