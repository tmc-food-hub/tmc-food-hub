function TestimonialCard({ quote, authorName, authorJobTitle, authorAvatar }) {
  return (
    <div className="h-100 w-100 px-2" style={{ maxWidth: '400px' }}>
      <div className="testimonial-card shadow-sm border bg-white rounded-4 p-4 d-flex flex-column h-100" style={{ borderColor: '#E5E7EB' }}>

        {/* Rating Stars */}
        <div className="d-flex text-warning mb-3 gap-1" style={{ fontSize: '1.2rem' }}>
          <i className="bi bi-star-fill"></i>
          <i className="bi bi-star-fill"></i>
          <i className="bi bi-star-fill"></i>
          <i className="bi bi-star-fill"></i>
          <i className="bi bi-star-fill"></i>
        </div>

        {/* Quote */}
        <div className="flex-grow-1 mb-4">
          <p className="fst-italic text-muted mb-0" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>"{quote}"</p>
        </div>

        {/* Author Profile */}
        <div className="testimonial-author d-flex gap-3 align-items-center mt-auto pt-3 border-top">
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
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=8B1F1C&color=fff`;
              }}
            />
          </div>
          <div className="lh-sm overflow-hidden text-start">
            <strong className="d-block text-truncate text-dark" style={{ fontSize: '0.9rem' }}>{authorName}</strong>
            <span className="text-muted d-block text-truncate" style={{ fontSize: '0.8rem' }}>{authorJobTitle}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestimonialCard;