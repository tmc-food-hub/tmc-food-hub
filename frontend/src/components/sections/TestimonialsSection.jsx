import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import SectionHeader from '../ui/SectionHeader';
import TestimonialCard from '../ui/TestimonialCard';
import testimonials from "../../data/testimonials.json";

function TestimonialsSection() {
 
  const infiniteData = [...testimonials, ...testimonials];

 
  const [emblaRef] = useEmblaCarousel(
    { 
      loop: true,          
      align: 'center', 
      skipSnaps: false,
      duration: 35          
    }, 
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );

  return (
    <section className="section testimonials__v2 py-5" id="testimonials">
      <div className="container">
        <SectionHeader
          subtitle="Testimonials"
          title="What Our Users Are Saying"
          centered
        />

        {/* The Viewport */}
        <div className="embla mt-5" ref={emblaRef} style={{ overflow: 'hidden', cursor: 'grab' }}>
          {/* The Track */}
          <div className="embla__container d-flex">
            {infiniteData.map((testimonial, index) => (
              <div key={index} className="embla__slide">
                <TestimonialCard
                  companyLogo={testimonial.logo}
                  quote={testimonial.quote}
                  authorAvatar={testimonial.avatar}
                  authorName={testimonial.name}
                  authorJobTitle={testimonial.jobTitle}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
