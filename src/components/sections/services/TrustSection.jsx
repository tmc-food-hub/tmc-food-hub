import { FiCheckCircle } from 'react-icons/fi';
import styles from './ServicesPage.module.css';

const trustItems = [
  'Expanded Customer Reach',
  'Smart Order Management',
  'Faster Growth, Less Hassle'
];

function TrustSection() {
  return (
    <section className={`${styles.section} ${styles.trustSection}`} aria-labelledby="trust-heading">
      <div className="container">
        <div className="row align-items-center g-4 g-lg-5">
          <div className="col-lg-6">
            <h2 id="trust-heading" className={styles.trustHeading}>
              Why Restaurants Trust TMC Foodhub for Their Growth
            </h2>

            <ul className={styles.trustList}>
              {trustItems.map((item) => (
                <li key={item} className={styles.trustItem}>
                  <FiCheckCircle className={styles.checkIcon} size={20} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <a href="#" className={styles.trustButton}>
              Partner With TMC Foodhub
            </a>
          </div>

          <div className="col-lg-6">
            <div className={styles.trustImageWrap}>
              <img
                src="/assets/images/business/business-img-1-min.jpg"
                alt="Restaurant team working with TMC Foodhub"
                className={styles.trustImage}
              />
              <div className={styles.testimonialOverlay}>
                <p className={styles.testimonialText}>
                  TMC Foodhub helped us simplify operations and significantly increase repeat orders.
                </p>
                <span className={styles.testimonialAuthor}>Partner Restaurant Owner</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrustSection;
