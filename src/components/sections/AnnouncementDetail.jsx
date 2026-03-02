import React, { useState, useRef, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { Check, MoreHorizontal } from "lucide-react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

import { useContentBySlug } from "../../hooks/useContentBySlug";
import Navbar from "../sections/Navbar";
import Footer from "../sections/Footer";
import { ThemeContext } from "../ui/ThemeContext";

import "../../assets/css/announcement-detail.css";

const AnnouncementDetail = () => {
  const { title } = useParams();
  const data = useContentBySlug(title);
  const { isDarkMode } = useContext(ThemeContext) || { isDarkMode: false };

  // ----------------- Dropdown & Share States -----------------
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setDropdownOpen(prev => !prev);
  const closeDropdown = () => setDropdownOpen(false);

  // ----------------- Actions -----------------
  const handleDownloadPDF = async () => {
    const dropdownEl = dropdownRef.current;
    if (dropdownEl) dropdownEl.style.display = "none";

    // Wait for all images to load
    const images = Array.from(document.images);
    await Promise.all(
      images.map(img =>
        !img.complete
          ? new Promise(resolve => {
            img.onload = img.onerror = resolve;
          })
          : Promise.resolve()
      )
    );

    // Capture the full window
    const canvas = await html2canvas(document.body, {
      scale: 2,
      scrollY: -window.scrollY,
      useCORS: true,
      allowTaint: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);

    const imgWidth = pdfWidth;
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(`${data.title}-fullwindow.pdf`);

    if (dropdownEl) dropdownEl.style.display = "";
  };

  const handlePrintArticle = () => {
    closeDropdown();
    window.print();
  };

  const handleEmailArticle = () => {
    closeDropdown();
    const subject = encodeURIComponent(`Check out this article: ${data.title}`);
    const body = encodeURIComponent(`${data.summary}\n\nRead more here: ${window.location.href}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleBookmarkArticle = () => {
    closeDropdown();
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    if (!bookmarks.some(b => b.title === data.title)) {
      bookmarks.push({ title: data.title, date: data.date });
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
      alert("Article bookmarked!");
    } else {
      alert("Article already bookmarked.");
    }
  };

  const handleShareClick = () => {
    const shareUrl = window.location.href;

    navigator.clipboard.writeText(shareUrl)
      .then(() => setCopiedToClipboard(true))
      .catch(console.error);

    if (navigator.share) {
      navigator.share({
        title: data.title,
        text: data.summary,
        url: shareUrl,
      }).catch(console.error);
    }

    setTimeout(() => setCopiedToClipboard(false), 2000);
  };

  // ----------------- Breadcrumbs -----------------
  const renderBreadcrumbs = (path) => {
    if (!path) return null;

    const parts = path.split(" / ");
    return parts.map((part, index) => {
      const isLast = index === parts.length - 1;
      let displayPart = part;

      if (part === "Events & Announcement") displayPart = "TMC Foodhub Company Events";
      if (part === "General")
        displayPart = data.type === "event" ? "Company Events" : "General Announcement";

      let url = "/";
      if (part === "Events & Announcement" || part === "General") url = "/company-events-announcements";

      return (
        <React.Fragment key={index}>
          {isLast ? (
            <span className="cea-breadcrumb-active">{displayPart}</span>
          ) : (
            <>
              <Link to={url} className="cea-breadcrumb-link" onClick={() => window.scrollTo(0, 0)}>
                {displayPart}
              </Link>
              <span className="cea-breadcrumb-separator"> / </span>
            </>
          )}
        </React.Fragment>
      );
    });
  };

  // ----------------- Not Found -----------------
  if (!data) {
    return (
      <div className="site-wrap">
        <Navbar />
        <div className="container py-5 mt-5 text-center">
          <h1>Content Not Found</h1>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="site-wrap">
      <Navbar />

      <main className="cea-detail-page">
        <div className="cea-container-narrow">

          {/* Breadcrumbs */}
          <nav className="cea-breadcrumbs">{renderBreadcrumbs(data.path)}</nav>

          {/* Header */}
          <header className="mb-4">
            <span className="cea-category-pill">{data.categoryTag}</span>
            <h1 className="cea-h1-title">{data.title}</h1>
            <p className="cea-subtitle">Expanding Our Horizon</p>
          </header>

          {/* Publisher + Actions */}
          <div className="cea-publisher-block d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <div className="cea-avatar-circle me-3">
                <img src="/assets/images/TMClogo.png" alt="TMC Foodhub" className="cea-publisher-logo" />
              </div>
              <div className="cea-author-info">
                <p className="cea-author-name">TMC Foodhub Editorial Team</p>
                <small className="cea-publish-date">
                  Published on {data.date} • {data.readTime}
                </small>
              </div>
            </div>

            <div className="d-flex gap-2">
              {/* Share Button */}
              <button
                className={`action-btn ${isDarkMode ? "dark-mode" : ""} ${copiedToClipboard ? "copied" : ""}`}
                title={copiedToClipboard ? "Link copied!" : "Share"}
                onClick={handleShareClick}
              >
                <img src="/assets/images/logo/link.svg" alt="Share" width="20" height="20" />
                {copiedToClipboard && <span className="copied-indicator">✓</span>}
              </button>

              {/* Dropdown */}
              <div className="dropdown" ref={dropdownRef}>
                <button
                  className={`action-btn ${isDarkMode ? "dark-mode" : ""}`}
                  title="More options"
                  onClick={toggleDropdown}
                >
                  <MoreHorizontal size={18} />
                </button>

                {dropdownOpen && (
                  <ul className="dropdown-menu show">
                    <li><button className="dropdown-item" onClick={handleDownloadPDF}>Download PDF</button></li>
                    <li><button className="dropdown-item" onClick={handlePrintArticle}>Print</button></li>
                    <li><button className="dropdown-item" onClick={handleBookmarkArticle}>Bookmark</button></li>
                    <li><button className="dropdown-item" onClick={handleEmailArticle}>Email</button></li>
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="cea-summary-box">
            <p className="mb-0"><span className="fw-bold">Summary:</span> {data.summary}</p>
          </div>

          {/* Hero Image */}
          <figure className="cea-hero-figure">
            <img src={data.image} alt="Featured" className="img-fluid" />
          </figure>

          {/* Content */}
          <div className="cea-content-body">
            {data.sections.map((section, index) => (
              <section key={index} className="mb-5">
                <h2 className="cea-h2-heading">{section.h2}</h2>
                <p className="cea-body-text">{section.content}</p>

                {index === 0 && data.takeaways && (
                  <div className="cea-takeaways-card">
                    <h5 className="cea-takeaways-title">Key Takeaways</h5>
                    <ul className="list-unstyled mb-0">
                      {data.takeaways.map((item, i) => (
                        <li key={i} className="d-flex align-items-center mb-2">
                          <div className="cea-check-circle">
                            <Check size={10} color="white" strokeWidth={4} />
                          </div>
                          <span className="fw-semibold" style={{ fontSize: "0.95rem" }}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AnnouncementDetail;
