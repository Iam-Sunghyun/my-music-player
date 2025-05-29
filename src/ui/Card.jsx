import style from "./Card.module.css";

function Card({ children, className, hide }) {
  return (
    <div
      className={`${style.container} ${className}`}
      style={{ visibility: hide ? "hidden" : "visible" }}
      inert={hide ? "true" : undefined}
    >
      {children}
    </div>
  );
}

export default Card;
