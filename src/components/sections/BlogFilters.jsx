import React from 'react';

const categories = [
  "All",
  "Food Trends",
  "Restaurant Spotlight",
  "Delivery Tips",
  "Healthy Eating",
  "Platform News",
  "Promotions & Deals",
  "Company News",
  "Thought Leadership"
];

const BlogFilters = ({ activeCategory, onCategoryChange, allTags }) => {
  // Use allTags if provided (dynamic), otherwise fall back to default categories
  const displayTags = allTags && allTags.length > 0 ? allTags : categories;

  return (
    <div className="blog-filters" data-aos="fade-up" data-aos-delay="300">
      {displayTags.map((cat) => (
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