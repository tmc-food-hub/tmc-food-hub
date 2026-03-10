import React from 'react';
import { useNavigate } from 'react-router-dom';

function BlogCard({
  id,
  tag,
  title,
  date,
  readTime,
  delay = 0,
  summary,
  author,
  keyTakeaways,
  content,
  linkTo
}) {
  const navigate = useNavigate();

  // Function to generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleReadMore = (e) => {
    e.preventDefault();

    // If linkTo is provided, navigate there instead
    if (linkTo) {
      navigate(linkTo);
      window.scrollTo(0, 0);
      return;
    }

    // Define which tags are News vs Blogs
    const newsTags = ["Platform Updates", "System Architecture", "Data Analytics", "Newsletter"];
    const slug = generateSlug(title);

    // Generate the correct URL based on tag
    if (newsTags.includes(tag)) {
      navigate(`/news/${slug}`, {
        state: {
          id: id,
          tag: tag,
          title: title,
          date: date,
          readTime: readTime,
          summary: summary || `Summary for ${title}`,
          author: author || 'TMC Foodhub Editorial Team',
          keyTakeaways: keyTakeaways || [
            'Data-driven selection reduces hiring risk',
            'Internal resource mobility optimizes efficiency',
            'Agile resourcing allows for faster project pivots'
          ],
          content: content || `<p>Content for ${title}</p>`,
          tags: [tag]
        }
      });
    } else {
      navigate(`/blogs/${slug}`, {
        state: {
          id: id,
          tag: tag,
          title: title,
          date: date,
          readTime: readTime,
          summary: summary || `Summary for ${title}`,
          author: author || 'TMC Foodhub Editorial Team',
          keyTakeaways: keyTakeaways || [
            'Data-driven selection reduces hiring risk',
            'Internal resource mobility optimizes efficiency',
            'Agile resourcing allows for faster project pivots'
          ],
          content: content || `<p>Content for ${title}</p>`,
          tags: [tag]
        }
      });
    }
  };

  return (
    <div
      className="col-lg-4 col-md-6"
      data-aos="fade-up"
      data-aos-delay={`${delay}`}
    >
      <div className="blog-card rounded-4 d-flex flex-column shadow-sm">

        {/* Category Tag */}
        <div className="mb-3">
          <span className="blog-tag">{tag}</span>
        </div>

        {/* Title */}
        <h3 className="blog-title mb-3">{title}</h3>

        {/* Meta Information */}
        <div className="blog-meta mb-auto text-muted small">
          {date} • {readTime}
        </div>

        {/* Read More Link */}
        <div className="border-top-light">
          <a
            href="#"
            className="special-link d-inline-flex gap-2 align-items-center text-decoration-none"
            onClick={handleReadMore}
          >
            <span className="icons">
              <i className="icon-1 bi bi-arrow-right-short"></i>
              <i className="icon-2 bi bi-arrow-right-short"></i>
            </span>
            <span>Read more</span>
          </a>
        </div>

      </div>
    </div>
  );
}

export default BlogCard;