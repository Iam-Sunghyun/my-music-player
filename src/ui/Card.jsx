import style from "./Card.module.css";

function Card({ children, className, hide }) {
  return (
    <div
      className={`${style.container} ${className}`}
      style={{ visibility: hide ? "hidden" : "visible" }}
    >
      {children}
    </div>
  );
}

export default Card;
