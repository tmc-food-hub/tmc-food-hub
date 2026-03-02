/**
 * Displays section headers with subtitle, title, and optional description.
 */
function SectionHeader({ subtitle, title, description, centered = true }) {
  return (
    <div className={`row mb-5 ${centered ? 'text-center' : ''}`}>
      <div className={centered ? 'col-md-6 mx-auto' : 'col-12'}>
        {subtitle && (
          <span className="subtitle text-uppercase mb-3" data-aos="fade-up" data-aos-delay="0">
            {subtitle}
          </span>
        )}
        {title && (
          <h2 className="mb-3" data-aos="fade-up" data-aos-delay="100">
            {title}
          </h2>
        )}
        {description && (
          <p data-aos="fade-up" data-aos-delay="200">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

export default SectionHeader;
