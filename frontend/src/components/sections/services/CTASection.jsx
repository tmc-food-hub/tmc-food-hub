import styles from './ServicesPage.module.css';

function CTASection() {
  return (
    <section className={`${styles.section} ${styles.ctaSection}`} aria-labelledby="services-cta-heading">
      <div className="container">
        <div className={styles.ctaCard}>
          <h2 id="services-cta-heading" className={styles.ctaTitle}>
            Ready to Grow Your Food Business?
          </h2>
          <p className={styles.ctaText}>Let's build smarter systems together.</p>
          <a href="#" className={`btn ${styles.ctaButton}`}>
            Get Started Now
          </a>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
