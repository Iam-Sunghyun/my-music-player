import style from "./Card.module.css";

function Card({ children, className, hide }) {
  return (
    <div className={`${style.container} ${className}`} inert={hide ? "true" : undefined}>
      {children}
    </div>
  );
}

export default Card;
