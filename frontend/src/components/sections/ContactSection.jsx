import { useState, useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import emailjs from '@emailjs/browser';
import SectionHeader from '../ui/SectionHeader';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import contactInfo from '../../data/contact.json';

/**
 * Displays contact information and a contact form for user inquiries.
 */
function ContactSection() {
  const formRef = useRef(null);
  const [isLoading, setisLoading] = useState(false);
  const [showSuccessAlert, setshowSuccessAlert] = useState(false);
  const [showFailAlert, setshowFailAlert] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const emailInput = formRef.current.elements.email;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formRef.current.elements.email.value)) {
      console.log("regex failed");
      emailInput.setCustomValidity("Invalid email address.");
      emailInput.reportValidity();
      setisLoading(false);
      return;
    }

    setisLoading(true);
    const formData = {
      name: DOMPurify.sanitize(formRef.current.elements.name.value),
      email: DOMPurify.sanitize(emailInput.value),
      subject: DOMPurify.sanitize(formRef.current.elements.subject.value),
      message: DOMPurify.sanitize(formRef.current.elements.message.value),
    };

    emailjs.send("service_p29brlg", "template_9f228s7", formData, {
      publicKey: "cRQUB8AroDpRsZzxr"
    })
      .then(() => {
        formRef.current.reset();
        setshowSuccessAlert(true);
        setisLoading(false);
      }, (error) => {
        console.log("Error sending message:");
        console.log(error);
        setshowFailAlert(true);
        setisLoading(false);
      });
  }

  useEffect(() => {
    let timer;

    if (showSuccessAlert) {
      timer = setTimeout(() => {
        setshowSuccessAlert(false);
      }, 3000);
    }

    if (showFailAlert) {
      timer = setTimeout(() => {
        setshowFailAlert(false);
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [showSuccessAlert, showFailAlert]);

  return (
    <section className="section contact__v2" id="contact">
      <div className="container">
        <SectionHeader
          subtitle="Contact"
          title="Contact Us"
          description="Have a question or feedback? We'd love to hear from you. Send us a message!"
          centered
        />

        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-7">

            <div className="info mb-5" data-aos="fade-up" data-aos-delay="100">
              <div className="d-flex align-items-center gap-3">

                <div className="icon d-flex align-items-center justify-content-center flex-shrink-0 rounded-circle border border-secondary"
                  style={{ width: '44px', height: '44px' }}>
                  <i className="bi bi-send text-body"></i>
                </div>
                <span>
                  <span className="d-block text-muted small">Email</span>
                  <strong className="text-body">{contactInfo.email}</strong>
                </span>
              </div>
            </div>

            <div className="form-wrapper" data-aos="fade-up" data-aos-delay="300">
              <form id="contactForm" onSubmit={handleFormSubmit} ref={formRef}>

                <div className="row mb-3">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <Input
                      id="name"
                      label="Name"
                      type="text"
                      name="name"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <Input
                      id="email"
                      label="Email"
                      type="email"
                      name="email"
                      required
                      onChangeFunc={(e) => e.target.setCustomValidity("")}
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-12">
                    <Input
                      id="subject"
                      label="Subject"
                      type="text"
                      name="subject"
                    />
                  </div>
                </div>

                <div className="row mb-4">
                  <div className="col-md-12">
                    <Textarea
                      id="message"
                      label="Message"
                      name="message"
                      rows={5}
                      required
                    />
                  </div>
                </div>

                <div className='actions'>
                  <button className="btn btn-primary fw-semibold w-100 py-3 text-white"
                    type="submit"
                    disabled={isLoading}
                    style={{ border: 'none' }}>
                    {!isLoading ? (
                      <>Send Message</>
                    ) : (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                        <span role="status">Loading...</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className={`mt-3 alert alert-success fade ${showSuccessAlert ? "show visible" : "invisible d-none"}`} id="successMessage">
                Message sent successfully!
              </div>

              <div className={`mt-3 alert alert-danger fade ${showFailAlert ? "show visible" : "invisible d-none"}`} id="successMessage">
                Message sending failed. Please try again later
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;