/**
 * NewsCard component - Simple card for News & Blog carousel
 * Displays category, image, title and read more link
 */
import React from 'react';

const NewsCard = ({ category, title, image, link, isDarkMode }) => (
  <div
    style={{
      background: isDarkMode ? '#000000' : '#f5f8f6',
      borderRadius: '18px',
      boxShadow: isDarkMode 
        ? '0 4px 12px rgba(0,0,0,0.4)'
        : '0 4px 12px rgba(0,0,0,0.06)',
      width: '100%',
      maxWidth: '900px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '1.2rem',
      margin: '0 auto',
      overflow: 'hidden',
      transition: 'background 0.3s ease, box-shadow 0.3s ease',
    }}
  >
    {/* Image */}
    {image && (
      <div style={{ width: '100%', padding: '2rem 1.5rem 0 1.5rem' }}>
        <div
          style={{
            width: '100%',
            height: '200px',
            borderRadius: '12px',
            overflow: 'hidden',
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </div>
    )}

    {/* Category Badge */}
    {category && (
      <div style={{ padding: image ? '0 2.5rem' : '2rem 2.5rem 0 2.5rem' }}>
        <span
          style={{
            display: 'inline-block',
            padding: '0.4rem 0.9rem',
            background: isDarkMode 
              ? 'rgba(16, 185, 129, 0.25)'
              : 'rgba(16, 185, 129, 0.15)',
            color: isDarkMode ? '#10b981' : '#059669',
            borderRadius: '9999px',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            transition: 'background 0.3s ease, color 0.3s ease',
          }}
        >
          {category}
        </span>
      </div>
    )}

    {/* Title and Link Container */}
    <div style={{ padding: image ? '0 2.5rem 2rem 2.5rem' : '0 2.5rem 2rem 2.5rem', width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Title */}
      {title && (
        <h3
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 700,
            fontSize: '1.5rem',
            color: isDarkMode ? '#ffffff' : '#333',
            margin: 0,
            lineHeight: 1.3,
            transition: 'color 0.3s ease',
          }}
        >
          {title}
        </h3>
      )}

      {/* Read More Link */}
      {link && (
        <a
          href={link}
          className="news-card-read-more"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#10b981',
            textDecoration: 'none',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 600,
            fontSize: '1rem',
            transition: 'gap 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.gap = '0.75rem';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.gap = '0.5rem';
          }}
        >
          <span>Read more</span>
          <span className="news-card-arrow">→</span>
        </a>
      )}
    </div>
  </div>
);

export default NewsCard;
