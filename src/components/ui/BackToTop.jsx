/**
 * Floating button that scrolls the page to the top smoothly.
 */
import { useEffect, useState } from 'react';

function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 170);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button id="back-to-top" className={isVisible ? 'show' : ''} onClick={handleClick} aria-label="Back to top">
      <i className="bi bi-arrow-up-short"></i>
    </button>
  );
}

export default BackToTop;
