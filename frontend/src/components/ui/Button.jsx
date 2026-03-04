/**
 * Reusable button/link component supporting multiple Bootstrap variants.
 */
function Button({ children, variant = 'primary', className = '', href = '#', ...props }) {
  const buttonClass = `btn btn-${variant} ${className}`;
  
  return (
    <a className={buttonClass} href={href} {...props}>
      {children}
    </a>
  );
}

export default Button;
