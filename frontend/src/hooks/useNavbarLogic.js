import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { navigationItems } from '../constants/navigation';

export const useNavbarLogic = (isDarkMode) => {
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();  
  
  const isClickScrolling = useRef(false);
  const scrollTimeout = useRef(null);

  // Theme Logic
  useEffect(() => {
    const theme = isDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-bs-theme', theme);
  }, [isDarkMode]);

  // Scroll Header Style
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

   useLayoutEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [location.pathname]);

   useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      const sectionId = location.hash.replace('#', '');
      isClickScrolling.current = true;
      setActiveSection(sectionId);

      const timeout = setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const yOffset = -80;
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
        
        if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        scrollTimeout.current = setTimeout(() => {
          isClickScrolling.current = false;
        }, 1200);
      }, 150);
      return () => clearTimeout(timeout);
    } else if (location.pathname === '/news-and-blogs') {
      setActiveSection('news-blogs');
    }
  }, [location.pathname, location.hash]);

   useEffect(() => {
    if (location.pathname !== '/') return;

    const elementsToObserve = navigationItems
      .flatMap((item) => (item.children ? item.children.map((child) => child.id) : item.id))
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickScrolling.current) return;
        
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) {
          setActiveSection(visible.target.id);
        }
      },
      { rootMargin: '-30% 0px -40% 0px', threshold: 0.1 }
    );

    elementsToObserve.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [location.pathname]);

   const isActive = (sectionId) => {
    const isNewsPath = location.pathname === '/news-and-blogs';
    
     if (isNewsPath) {
      return sectionId === 'news-blogs' || sectionId === 'resources-dropdown';
    }

    
    return activeSection === sectionId;
  };

  
  const handleNavClick = (sectionId, e) => {
    if (e) e.preventDefault();
    
    isClickScrolling.current = true;
    setActiveSection(sectionId);
 
    const newPath = sectionId === 'home' ? '/' : `/#${sectionId}`;
    navigate(newPath, { replace: true });

    if (sectionId === 'home') {
    
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        const yOffset = -80;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }

    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      isClickScrolling.current = false;
    }, 1000);  
  };

  return { isScrolled, isActive, handleNavClick };
};