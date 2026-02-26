import React from 'react';

const categories = [
  "All",
  "Platform Updates",
  "IT Workforce Strategy",
  "System Architecture",
  "Data Analytics",
  "Newsletter",
  "Research",
  "Case Studies"
];

const BlogFilters = ({ activeCategory, onCategoryChange }) => {
  return (
    <div className="blog-filters" data-aos="fade-up" data-aos-delay="300">
      {categories.map((cat) => (
        <button
          key={cat}
          className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
          onClick={() => onCategoryChange(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default BlogFilters;