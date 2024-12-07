import style from "./PitchController.module.css";
import { useState } from "react";

export default function PitchController({ audioComponent }) {
  const [pitch, setPitch] = useState(1);
  const handlePitchChange = (e) => {
    const newPitch = e.target.value;
    setPitch(newPitch);
  };

  return (
    <div className={style.pitchController}>
      <div>Pitch</div>
      <input
        type="range"
        min="-12"
        max="12"
        step="1"
        defaultValue="0"
        onChange={handlePitchChange}
      />
      <span className={style.pitch}>{pitch}</span>
      <span className="material-symbols-outlined">restart_alt</span>
    </div>
  );
}