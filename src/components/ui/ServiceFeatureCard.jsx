import { createElement } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import styles from './ServiceFeatureCard.module.css';

function ServiceFeatureCard({ icon: Icon, title, description, href = '#', delay = 0 }) {
  return (
    <article className={styles.card} data-aos="fade-up" data-aos-delay={delay}>
      <div className={styles.iconWrap}>
        {createElement(Icon, { size: 22 })}
      </div>

      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>

      <a href={href} className={styles.readMore}>
        <span>Read more</span>
        <FiArrowRight size={15} className={styles.readMoreIcon} />
      </a>
    </article>
  );
}

export default ServiceFeatureCard;
