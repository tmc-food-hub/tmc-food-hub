import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
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

        {/* Custom Header for Testimonials */}
        <div className="text-center mb-5" data-aos="fade-up">
          <span
            className="subtitle text-uppercase mb-3 d-inline-block px-3 py-1 rounded-2 fw-bold"
            style={{ backgroundColor: '#FDECE9', color: '#D94C38', fontSize: '0.8rem' }}
          >
            CUSTOMER TESTIMONIALS
          </span>
          <h2 className="mb-3 fw-bold" style={{ fontSize: '2.5rem', color: '#1B1B1B' }}>
            What Our Foodies Are Saying
          </h2>
          <p className="text-muted mx-auto" style={{ maxWidth: '600px', fontSize: '1rem', lineHeight: '1.6' }}>
            Hear from our happy foodies who love the convenience, variety, and speed of TMC Foodhub.
          </p>
        </div>

        {/* The Viewport */}
        <div className="embla mt-5" ref={emblaRef} style={{ overflow: 'hidden', cursor: 'grab' }} data-aos="fade-up" data-aos-delay="200">
          {/* The Track */}
          <div className="embla__container d-flex">
            {infiniteData.map((testimonial, index) => (
              <div key={index} className="embla__slide">
                <TestimonialCard
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
