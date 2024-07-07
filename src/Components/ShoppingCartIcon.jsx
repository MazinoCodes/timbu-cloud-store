
const ShoppingCartIcon = ({ cartItems }) => {
  const hasItems = cartItems.length > 0;
  return (
    <svg width="17" height="20" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.7035 0.25C6.644 0.25 4.9535 1.9405 4.9535 4V4.75H1.25L1.2035 5.4535L0.4535 18.9535L0.40625 19.75H17L16.9535 18.9528L16.2035 5.45275L16.1562 4.75H12.4535V4C12.4535 1.9405 10.763 0.25 8.7035 0.25ZM8.7035 1.75C9.30024 1.75 9.87253 1.98705 10.2945 2.40901C10.7164 2.83097 10.9535 3.40326 10.9535 4V4.75H6.4535V4C6.4535 3.40326 6.69055 2.83097 7.11251 2.40901C7.53447 1.98705 8.10676 1.75 8.7035 1.75ZM2.65625 6.25H4.9535V8.5H6.4535V6.25H10.9535V8.5H12.4535V6.25H14.7507L15.407 18.25H2.00075L2.65625 6.25Z" fill="#343A40"/>
      {hasItems && (
        <circle cx="13" cy="3" r="3" fill="red"/> // Conditionally render the circle
      )}
    </svg>
  );
};

export default ShoppingCartIcon;