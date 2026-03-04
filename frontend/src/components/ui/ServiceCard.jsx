import { Link } from 'react-router-dom';

/**
 * ServiceCard component for displaying services.
 */
function ServiceCard({ icon, title, description, delay = 0, linkTo }) {
  const ReadMoreLink = linkTo ? (
    <Link
      className="special-link d-inline-flex gap-2 align-items-center text-decoration-none"
      to={linkTo}
      onClick={() => window.scrollTo(0, 0)}
    >
      <span className="icons">
        <i className="icon-1 bi bi-arrow-right-short"></i>
        <i className="icon-2 bi bi-arrow-right-short"></i>
      </span>
      <span>Read more</span>
    </Link>
  ) : (
    <a className="special-link d-inline-flex gap-2 align-items-center text-decoration-none" href="#">
      <span className="icons">
        <i className="icon-1 bi bi-arrow-right-short"></i>
        <i className="icon-2 bi bi-arrow-right-short"></i>
      </span>
      <span>Read more</span>
    </a>
  );

  return (
    <div data-aos="fade-up" data-aos-delay={delay}>
      <div className="service-card p-4 rounded-4 h-100 d-flex flex-column justify-content-between gap-5">
        <div>
          <span className="icon mb-4" dangerouslySetInnerHTML={{ __html: icon }} />
          <h3 className="fs-5 mb-3">{title}</h3>
          <div className="mb-0 text-muted">
            {description}
          </div>
        </div>
        {ReadMoreLink}
      </div>
    </div>
  );
}

export default ServiceCard;