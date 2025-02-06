import { useState } from "react";
import style from "./PanningController.module.css";

function PanningController({ panner }) {
  const [panning, setPanning] = useState(0);

  const panningHandler = (e) => {
    const newPanning = e.target.value;
    panner.pan.value = newPanning;
    setPanning(newPanning);
  };

  const handleResetPanning = () => {
    panner.pan.value = 0;
    setPanning(0);
  };
  return (
    <div className={style.panningController}>
      <div>Panning</div>
      <input type="range" min="-1" max="1" value={panning} step={0.01} onChange={panningHandler} />
      <span className={style.panning}>{panning}</span>
      <span onClick={handleResetPanning} className="material-symbols-outlined">
        restart_alt
      </span>
    </div>
  );
}

export default PanningController;
