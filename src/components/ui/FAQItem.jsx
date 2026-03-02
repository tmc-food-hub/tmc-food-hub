/**
 * Accordion item component for displaying FAQ questions and answers.
 */
function FAQItem({ id, question, answer, isOpen }) {
  return (
    <div className="accordion-item" id={id}>
      <h2 className="accordion-header" id={`heading-${id}`}>
        <button
          className={`accordion-button ${!isOpen ? 'collapsed' : ''}`}
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={`#collapse-${id}`}
          aria-expanded={isOpen}
          aria-controls={`collapse-${id}`}
        >
          {question}
        </button>
      </h2>
      <div
        id={`collapse-${id}`}
        className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}
        aria-labelledby={`heading-${id}`}
        data-bs-parent="#accordionPanelsStayOpenExample"
      >
        <div className="accordion-body">{answer}</div>
      </div>
    </div>
  );
}


export default FAQItem;

