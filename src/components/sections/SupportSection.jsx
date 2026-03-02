import { Link } from 'react-router-dom';
import { useSupportPageLogic } from '../../hooks/useSupportPageLogic';

function SupportSection() {
  const {
    file,
    fileInputRef,
    formData,
    errors,
    topics,
    topicsLoading,
    topicsError,
    handleChange,
    handleFileChange,
    handleFileClick,
    handleFileDrop,
    handleDragOver,
    removeFile,
    handleSubmit,
  } = useSupportPageLogic();

  const quickLinks = [
    { label: 'How to place an order', icon: 'bi-bag', to: '/faq#One' },
    { label: 'Track my delivery', icon: 'bi-geo-alt', to: '/faq#Two' },
    { label: 'Cancel or modify an order', icon: 'bi-x-circle', to: '/faq#Three' },
    { label: 'General FAQ', icon: 'bi-question-circle', to: '/faq' },
  ];

  const handleDropzoneKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleFileClick();
    }
  };

  return (
    <section className="support section support-center" id="support">
      <div className="container">
        <div className="support-heading text-center">
          <span className="support-tag">SUPPORT CENTER</span>
          <h1>We&apos;re Here to Help</h1>
          <p>
            Get the help you need for your TMC Foodhub experience. Our team is ready to
            assist with orders, payments, and everything in between.
          </p>
        </div>

        <div className="row g-4 support-main-row">
          <div className="col-lg-7">
            <div className="support-card contact-card">
              <h3 className="support-card-title">Contact Our Team</h3>

              <form className="support-form" onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-control shadow-none"
                      placeholder="Enter your full name"
                    />
                    {errors.name && <small className="text-danger">{errors.name}</small>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-control shadow-none"
                      placeholder="Enter your email"
                    />
                    {errors.email && <small className="text-danger">{errors.email}</small>}
                  </div>
                </div>

                <div className="mt-3">
                  <label className="form-label">Subject</label>
                  <select
                    name="topic_id"
                    value={formData.topic_id}
                    onChange={handleChange}
                    className="form-select shadow-none"
                    disabled={topicsLoading}
                  >
                    <option value="">{topicsLoading ? 'Loading topics...' : 'Select a topic'}</option>
                    {topics.map((topic) => (
                      <option key={topic.id} value={topic.id}>
                        {topic.label}
                      </option>
                    ))}
                  </select>
                  {topicsError && <small className="text-danger d-block mt-1">{topicsError}</small>}
                  {errors.topic_id && <small className="text-danger">{errors.topic_id}</small>}
                </div>

                <div className="mt-3">
                  <label className="form-label">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="form-control shadow-none"
                    rows="5"
                    placeholder="Describe your issue or question..."
                  />
                </div>

                <div className="mt-3">
                  <label className="form-label">Attachment (Optional)</label>
                  <div
                    className="support-dropzone"
                    onClick={handleFileClick}
                    onDrop={handleFileDrop}
                    onDragOver={handleDragOver}
                    onKeyDown={handleDropzoneKeyDown}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="support-dropzone-content">
                      <i className="bi bi-file-earmark-arrow-up" aria-hidden="true"></i>
                      {file ? (
                        <>
                          <span className="support-file-name">{file.name}</span>
                          <button
                            type="button"
                            className="support-remove-file"
                            onClick={(event) => {
                              event.stopPropagation();
                              removeFile();
                            }}
                          >
                            Remove
                          </button>
                        </>
                      ) : (
                        <span className="support-dropzone-copy">Click or drag files here to upload</span>
                      )}
                    </div>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="d-none"
                  />
                </div>

                <button type="submit" className="btn support-submit-btn mt-3">
                  Send Message
                </button>
              </form>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="support-sidebar">
              <h3 className="support-links-title">Quick Links</h3>
              <div className="support-quick-links">
                {quickLinks.map((item) => (
                  <Link key={item.label} to={item.to} className="support-quick-link">
                    <span className="support-quick-link-left">
                      <span className="support-link-icon">
                        <i className={item.icon} aria-hidden="true"></i>
                      </span>
                      <span className="support-link-label">{item.label}</span>
                    </span>
                    <i className="bi bi-chevron-right" aria-hidden="true"></i>
                  </Link>
                ))}
              </div>

              <div className="support-card help-card">
                <h4>Need Immediate Help?</h4>
                <p>Our support team is available Monday - Sunday, 8:00 AM - 10:00 PM PHT.</p>
                <div className="help-item">
                  <i className="bi bi-telephone-fill" aria-hidden="true"></i>
                  <span>+63 XXX XXX XXXX</span>
                </div>
                <div className="help-item">
                  <i className="bi bi-envelope-fill" aria-hidden="true"></i>
                  <span>support@tmcfoodhub.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4 office-row">
          <div className="col-lg-6">
            <div className="support-card office-card">
              <h3 className="support-card-title">Our Office</h3>
              <p className="office-copy">
                Located in the heart of the innovation district. We welcome scheduled visits from
                our enterprise partners.
              </p>
              <div className="office-location">
                <span className="office-pin">
                  <i className="bi bi-geo-alt-fill" aria-hidden="true"></i>
                </span>
                <div>
                  <h4>Metro Manila, Philippines</h4>
                  <p>
                    Unit 3-Unit 5 Corporate Plaza, 26th Street, Bonifacio Global City, Taguig,
                    1634 Metro Manila, Philippines
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="support-card map-card">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7723.66114148236!2d121.04288463884677!3d14.55167958114619!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c909e6a4a1b1%3A0xeb5bff922a557eb2!2sHigh%20Street%20South%20Corporate%20Plaza%20Tower%201!5e0!3m2!1sen!2sph!4v1771213230035!5m2!1sen!2sph"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="TMC Foodhub office map"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SupportSection;
