import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from '../ui/SectionHeader';
import BlogFilters from './BlogFilters';
import BlogCard from '../ui/BlogCard';

// ===== Blogs Array (Updated with New Blogs) =====
const allBlogs = [
  { id: 1, tag: "Food Trends", title: "What's Cooking in 2026: The Food Trends Shaping How We Order", date: "Feb 18, 2026", readTime: "5 min read" },
  { id: 2, tag: "Platform News", title: "Foodhub Introduces Real-Time Order Tracking for a Faster, Smarter Experience", date: "Feb 22, 2026", readTime: "4 min read" },
  { id: 3, tag: "Restaurant Spotlight", title: "Restaurant Spotlight: How Local Flavors Are Winning Hearts on Foodhub", date: "Feb 8, 2026", readTime: "7 min read" },
  { id: 4, tag: "Restaurant Spotlight", title: "Meet Our Partner: The Story Behind One of Foodhub's Fastest-Growing Kitchens", date: "Jan 30, 2026", readTime: "6 min read" },
  { id: 5, tag: "Food Trends", title: "From Cloud Kitchens to Comfort Food: The Rise of Smart Dining at Home", date: "Feb 10, 2026", readTime: "6 min read" },
  { id: 6, tag: "Platform News", title: "New on Foodhub: Scheduled Orders for Effortless Meal Planning", date: "Feb 14, 2026", readTime: "5 min read" },
];

const NewsBlogSection = ({ isPreview = false }) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const blogsPerPage = 6;

  // ===== Sort Blogs by Date Descending =====
  const sortedBlogs = [...allBlogs].sort((a, b) => new Date(b.date) - new Date(a.date));

  // ===== Generate all unique tags dynamically =====
  const allTags = ["All", ...Array.from(new Set(sortedBlogs.map(blog => blog.tag)))];

  const filteredBlogs = activeCategory === "All"
    ? sortedBlogs
    : sortedBlogs.filter(blog => blog.tag === activeCategory);

  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const startIndex = (currentPage - 1) * blogsPerPage;
  const endIndex = startIndex + blogsPerPage;

  const displayBlogs = isPreview ? sortedBlogs.slice(0, 6) : filteredBlogs.slice(startIndex, endIndex);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setCurrentPage(1);
  }

  return (
    <section className="section news-blog" id="news-blogs-section">
      <div className="container">
        {isPreview ? (
          <div className="text-center mb-5">
            <span
              className="subtitle text-uppercase mb-3 d-inline-block px-3 py-1 rounded-2 fw-bold"
              style={{ backgroundColor: '#FDECE9', color: '#D94C38', fontSize: '0.8rem' }}
            >
              BLOGS
            </span>
            <h2 className="mb-3 fw-bold" style={{ fontSize: '2.2rem', color: '#1B1B1B' }}>
              Ideas, Insights & Food Trends
            </h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '600px', fontSize: '1rem', lineHeight: '1.6' }}>
              From food delivery tips to restaurant spotlights — TMC Foodhub keeps you updated on the latest in the food scene and platform news.
            </p>
          </div>
        ) : (
          <SectionHeader
            subtitle="News & Blogs"
            title="TMC Food Hub Blogs"
            description="Insights, updates, and expert perspectives on the best food experiences in town."
            centered={true}
          />
        )}

        {isPreview === false && (
          <div className="featured-card-wrapper shadow" data-aos="fade-up">
            <div className="col-lg-6 p-4 p-md-5">
              <span className="featured-badge">FEATURED</span>
              <h2 className="featured-title mt-3">Why Having Food Delivered Is Better Than Cooking (Sometimes)</h2>
              <p className="featured-desc text-muted">
                Explore the reasons why giving yourself a break and ordering in can actually be beneficial for your mental health and productivity, with tips on making the best choices.
              </p>
              <div className="d-flex justify-content-between align-items-center mt-4">
                <span className="featured-meta text-muted">Feb 22, 2026 • 6 min read</span>
                <a href="#" className="special-link d-inline-flex gap-2 align-items-center text-decoration-none">
                  <span className="icons">
                    <i className="icon-1 bi bi-arrow-right-short text-primary"></i>
                    <i className="icon-2 bi bi-arrow-right-short text-primary"></i>
                  </span>
                  <span>Read more</span>
                </a>
              </div>
            </div>
            <div className="featured-img-box"></div>
          </div>
        )}

        {isPreview === false && (
          <BlogFilters
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
            allTags={allTags}
          />
        )}

        <div className="row g-4 mt-2">
          {displayBlogs.length > 0 ? (
            displayBlogs.map((blog, index) => (
              <BlogCard
                key={blog.id}
                {...blog}
                delay={index * 100}
              />
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <p className="text-muted">No blogs found in this category.</p>
            </div>
          )}
        </div>

        {!isPreview && totalPages > 1 && (
          <div className="pagination-wrapper d-flex justify-content-center mt-5 gap-2 flex-wrap">
            <button
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              <i className="bi bi-arrow-left"></i>
            </button>

            {Array.from({ length: totalPages }).map((_, index) => {
              const page = index + 1;
              return (
                <button
                  key={page}
                  className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              );
            })}

            <button
              className="pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        )}

        {isPreview && (
          <div className="text-center mt-5">
            <Link
              to="/news-and-blogs"
              className="btn btn-primary px-5 py-2 fw-bold shadow-sm"
              onClick={() => window.scrollTo(0, 0)}
              style={{
                color: 'white',
                border: 'none',
                borderRadius: '8px',
              }}
            >
              View all
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsBlogSection;
