import SectionHeader from '../ui/SectionHeader';
import { useSupportPageLogic } from '../../hooks/useSupportPageLogic';
import { Link } from 'react-router-dom';

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
    { label: 'How to add talent', icon: 'bi-person-plus', id: 'Eight' },
    { label: 'Reset password', icon: 'bi-shield-lock', id: 'Six' },
    { label: 'Billing & Invoices', icon: 'bi-credit-card', id: 'Seven' },
    { label: 'General FAQ', icon: 'bi-question-circle', id: 'One' },
  ];

  return (
    <section className="support section py-5" id="support">
      <div className="container">
        <SectionHeader
          subtitle="SUPPORT CENTER"
          title="We're Here to Help"
          description="Get the priority support you need for your AVAA experience. Our dedicated team is standing by to ensure your success."
          centered
        />

        <div className="row mt-5">
          {/* LEFT COLUMN — CONTACT FORM */}
          <div className="col-lg-8 mb-4">
            <div
              className="form-card shadow-sm p-4 p-md-5"
              style={{
                borderRadius: '20px',
                border: '1px solid #f0f0f0',
              }}
            >
              <h3 className="fw-bold mb-4">Contact Our Team</h3>

              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <label className="form-label text-muted">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-control form-control-lg shadow-none"
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <small className="text-danger">{errors.name}</small>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-muted">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-control form-control-lg shadow-none"
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <small className="text-danger">{errors.email}</small>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label text-muted">Subject</label>
                  <select
                    name="topic_id"
                    value={formData.topic_id}
                    onChange={handleChange}
                    className="form-select form-select-lg shadow-none"
                    disabled={topicsLoading}
                  >
                    <option value="">
                      {topicsLoading ? "Loading topics…" : "Select a topic"}
                    </option>
                    {topics.map((topic) => (
                      <option key={topic.id} value={topic.id}>
                        {topic.label}
                      </option>
                    ))}
                  </select>
                  {topicsError && (
                    <small className="text-danger d-block mt-1">{topicsError}</small>
                  )}
                  {errors.topic_id && (
                    <small className="text-danger">{errors.topic_id}</small>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label text-muted">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="form-control shadow-none"
                    rows="5"
                    placeholder="How can we help?"
                  />
                </div>

                {/* ATTACHMENT SECTION */}
                <div className="mb-4">
                  <label className="form-label text-muted">Attachment</label>

                  <div
                    className="border rounded-3 p-5 text-center"
                    style={{ cursor: 'pointer' }}
                    onClick={handleFileClick}
                    onDrop={handleFileDrop}
                    onDragOver={handleDragOver}
                  >
                    <div className="text-muted">
                      <i className="bi bi-file-earmark-arrow-up fs-3 d-block mb-2"></i>

                      {file ? (
                        <>
                          <span className="small text-success d-block">
                            {file.name}
                          </span>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger mt-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile();
                            }}
                          >
                            Remove
                          </button>
                        </>
                      ) : (
                        <span className="small">
                          Click or drag files here to upload
                        </span>
                      )}
                    </div>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </div>

                <button type="submit" className="btn btn-lg">
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT COLUMN — QUICK LINKS */}
          <div className="col-lg-4">
            <h3 className="fw-bold mb-4">Quick Links</h3>

            <div className="list-group  gap-2 mb-5">
              {quickLinks.map((item, index) => (
                <Link
                  key={index}
                  to={`/faq#${item.id}`}
                  className="list-group-item list-group-item-action  d-flex align-items-center justify-content-between p-3"
                >
                  <div className="d-flex align-items-center gap-2">
                    <div className="icon-link">
                      <i className={item.icon}></i>
                    </div>
                    <span className="link-label">{item.label}</span>
                  </div>

                  <i className="bi bi-chevron-right text-muted small"></i>
                </Link>
              ))}
            </div>

            {/* HELP CARD */}
            <div className="help-card shadow-sm p-4">
              <h5 className="fw-bold">Need Immediate Help?</h5>

              <p className="text-muted small mb-4">
                Our support lines are open Monday - Friday, 9am to 6pm EST.
              </p>

              {/* <div className="d-flex align-items-center mb-3">
                <i className="bi bi-telephone me-3"></i>
                <span className="fw-medium">+63 (02) 9123 4567</span>
              </div> */}

              <div className="d-flex align-items-center">
                <i className="bi bi-envelope me-3"></i>
                <span className="fw-medium">
                  autopilotvirtualassist@gmail.com
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* OFFICE SECTION */}
        {/* <div className="py-5">
          <div className="row">
            <div className="col-md-6">
              <div className="location-card shadow-sm p-5">
                <h2 className="fw-bold mb-4">Our Office</h2>

                <p className="text-muted mb-5">
                  Located in the heart of the innovation district. We welcome
                  scheduled visits from our enterprise partners.
                </p>

                <div className="d-flex align-items-start">
                  <div className="rounded-circle d-flex align-items-center justify-content-center me-4">
                    <i className="bi bi-geo-alt fs-4"></i>
                  </div>

                  <div>
                    <h5 className="fw-bold mb-1">
                      Metro Manila, Philippines
                    </h5>

                    <p className="text-muted small mb-0">
                      Unit 3-Unit 5 Corporate Plaza, 26th Street,
                      Bonifacio Global City, Taguig, 1634 Metro Manila,
                      Philippines
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="location-card shadow-sm overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7723.66114148236!2d121.04288463884677!3d14.55167958114619!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c909e6a4a1b1%3A0xeb5bff922a557eb2!2sHigh%20Street%20South%20Corporate%20Plaza%20Tower%201!5e0!3m2!1sen!2sph!4v1771213230035!5m2!1sen!2sph"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Office Location"
                />
              </div>
            </div> 
          </div>
        </div>*/}
      </div>
    </section>
  );
}

export default SupportSection;
