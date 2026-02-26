/**
 * Reusable form textarea field with optional label and customizable height.
 */
function Textarea({
  id,
  label,
  name,
  placeholder,
  rows = 5,
  required = false,
  className = "",
  ...props
}) {
  return (
    <div className={`form-group ${className}`}>
      {label && <label className="mb-2" htmlFor={id}>{label}</label>}
      <textarea
        className="form-control no-resize"
        id={id}
        name={name}
        placeholder={placeholder}
        rows={rows}
        required={required}
        {...props}
      />
    </div>
  );
}

export default Textarea;
