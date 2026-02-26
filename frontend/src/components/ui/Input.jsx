/**
 * Reusable form input field with optional label and validation support.
 */
function Input({
  id,
  label,
  type = "text",
  name,
  placeholder,
  required = false,
  className = "",
  ref = null,
  onChangeFunc = (e) => {},
  ...props
}) {
  return (
    <div className={`form-group ${className}`}>
      {label && <label className="mb-2" htmlFor={id}>{label}</label>}
      <input
        className="form-control"
        id={id}
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        ref={ref}
        {...props}
        onChange={(e) => onChangeFunc(e)}
      />
    </div>
  );
}

export default Input;
