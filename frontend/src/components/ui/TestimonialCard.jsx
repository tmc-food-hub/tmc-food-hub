function TestimonialCard({ companyLogo, quote, authorName, authorJobTitle, authorAvatar }) {
  return (
    <div className="h-100 w-100 px-2">
      <div className="testimonial-card shadow-sm border  d-flex flex-column">
        
        <div className="testimonial-logo mb-3" style={{ height: '30px' }}>
          <img 
            src={companyLogo} 
            alt="Logo" 
            style={{ maxHeight: '100%', width: 'auto', objectFit: 'contain' }} 
          />
        </div>

        <div className="flex-grow-1">
            <p className="quote">"{quote}"</p>
        </div>

        <hr className="my-4 opacity-10" />

        <div className="testimonial-author d-flex gap-3 align-items-center">
          <div className="author-img" style={{ flex: '0 0 50px' }}>
            <img 
              className="rounded-circle" 
              src={authorAvatar} 
              alt={authorName} 
              style={{ 
                width: '50px', 
                height: '50px', 
                objectFit: 'cover',
                imageRendering: '-webkit-optimize-contrast',
                transform: 'translateZ(0)' // Fixes flickering/blurring
              }}
              onError={(e) => { 
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=359a92&color=fff`; 
              }}
            />
          </div>
          <div className="lh-sm overflow-hidden text-start">
            <strong className="d-block text-truncate" style={{ fontSize: '0.85rem' }}>{authorName}</strong>
            <span className="text-muted d-block text-truncate" style={{ fontSize: '0.75rem' }}>{authorJobTitle}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestimonialCard;