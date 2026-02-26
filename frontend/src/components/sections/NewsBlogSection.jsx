import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from '../ui/SectionHeader';
import BlogFilters from './BlogFilters';
import BlogCard from '../ui/BlogCard';

// ===== Blogs Array (Updated with New Blogs) =====
const allBlogs = [
  { id: 1, tag: "System Architecture", title: "Optimizing Scalability in Modern IT Ecosystems", date: "Feb 3, 2026", readTime: "8 min read" },
  { id: 2, tag: "Data Analytics", title: "Predictive Analytics: Anticipating Talent Gaps", date: "Feb 3, 2026", readTime: "8 min read" },
  { id: 3, tag: "Platform Updates", title: "Introducing AVAA Flow: Seamless Hiring Pipelines", date: "Feb 3, 2026", readTime: "8 min read" },
  { id: 4, tag: "IT Workforce Strategy", title: "Bridging the Skills Gap in Full-Stack Development", date: "Feb 3, 2026", readTime: "8 min read" },
  { id: 5, tag: "Case Studies", title: "How GlobalTech Reduced Hiring Costs by 40%", date: "Feb 3, 2026", readTime: "8 min read" },
  { id: 6, tag: "IT Workforce Strategy", title: "AI & The Future of Technical Resourcing", date: "Feb 3, 2026", readTime: "8 min read" },
  { id: 7, tag: "Newsletter", title: "AVAA Monthly: February 2026 Edition", date: "Feb 1, 2026", readTime: "5 min read" },
  { id: 8, tag: "Research", title: "2026 IT Talent Landscape Report", date: "Jan 28, 2026", readTime: "12 min read" },

  // New Blogs Added
  { id: 9, tag: "Product Update", title: "AVAA Introduces Advanced Filtering for Faster Talent Matching", date: "January 10, 2026", readTime: "3 min read" },
  { id: 10, tag: "Company News", title: "AVAA Reaches Early Adoption Milestone Among Digital Agencies", date: "January 22, 2026", readTime: "2 min read" },
  { id: 11, tag: "Platform Overview", title: "What Is AVAA? A Smarter Way to Manage Talent", date: "February 2, 2026", readTime: "5 min read" },
  { id: 12, tag: "Industry Trends", title: "The Shift Toward Centralized Talent Platforms", date: "February 15, 2026", readTime: "6 min read" },
  { id: 13, tag: "System Architecture", title: "Behind the Code: Ensuring Security in Cloud-Native Hiring Platforms", date: "November 20, 2025", readTime: "10 min read" },
  { id: 14, tag: "IT Workforce Strategy", title: "From Fragmented to Focused: The Future of Employer-Side Resource Management", date: "February 10, 2026", readTime: "8 min read" },
  { id: 15, tag: "Platform Updates", title: "AVAA 2.0 Release Notes: Enhanced Criteria-Based Filtering Engine", date: "January 28, 2026", readTime: "5 min read" },
  { id: 16, tag: "Case Studies", title: "Case Study: Scaling Frontend Teams for a High-Traffic E-Commerce Giant", date: "January 15, 2026", readTime: "12 min read" },
  { id: 17, tag: "Newsletter", title: "The Autopilot Monthly: Trends in Automation and CRM Development", date: "December 05, 2025", readTime: "6 min read" },
  { id: 18, tag: "System Architecture", title: "Behind the Code: Ensuring Security in Cloud-Native Hiring Platforms", date: "November 20, 2025", readTime: "10 min read" }
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
        <SectionHeader
          subtitle={isPreview ? "NEWS & BLOGS" : "News & Blogs"}
          title={isPreview ? "News & Blogs" : "AVAA Blogs"}
          description={isPreview 
            ? "Stay informed with the latest insights in workforce optimization." 
            : "Insights, updates, and expert perspectives on IT talent management, system architecture, and data-driven workforce decisions."
          }
          centered={true}
        />

        {isPreview === false && (
          <div className="featured-card-wrapper shadow" data-aos="fade-up">
            <div className="col-lg-6 p-4 p-md-5">
              <span className="featured-badge">FEATURED</span>
              <h2 className="featured-title mt-3">Why Employer-Side Resource Management Is Replacing Traditional Hiring Models</h2>
              <p className="featured-desc text-muted">
                Discover how modern enterprises are shifting their approach to talent acquisition by prioritizing internal resource optimization and agile workforce planning. Learn the key benefits of visibility over volume in IT hiring.
              </p>
              <div className="d-flex justify-content-between align-items-center mt-4">
                <span className="featured-meta text-muted">Feb 3, 2026 • 8 min read</span>
                <a href="#" className="special-link d-inline-flex gap-2 align-items-center text-decoration-none">
                  <span className="icons">
                    <i className="icon-1 bi bi-arrow-right-short"></i>
                    <i className="icon-2 bi bi-arrow-right-short"></i>
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
              className="btn btn-teal px-5 py-2 fw-bold shadow-sm"
              onClick={() => window.scrollTo(0, 0)}
              style={{
                backgroundColor: '#45a29e',
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
