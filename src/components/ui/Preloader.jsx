import React, { useEffect, useState } from 'react';

const Preloader = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const timer = setTimeout(() => {
      setIsLoaded(true);
      document.body.style.overflow = 'auto';
    }, 1250);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div id="preloader" className={isLoaded ? 'fade-out' : ''}>
      <div className="loader-content">
        <img
          src="/assets/images/TMClogo.png"
          alt="TMC Logo"
          className="loader-logo"
        />
        <div className="loader-line">
          <div className="loader-fill"></div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;