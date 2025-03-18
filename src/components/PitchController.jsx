import style from "./PitchController.module.css";
import { useState } from "react";

export default function PitchController({ pitchShift }) {
  const [pitch, setPitch] = useState(0);
  const handlePitchChange = (e) => {
    const newPitch = +e.target.value;
    setPitch(newPitch);
    if (pitchShift) {
      pitchShift.pitch = newPitch;
    }
  };

  return (
    <div className={style.pitchController}>
      <p>Pitch</p>
      <input type="range" min="-12" max="12" step="1" value={pitch} onChange={handlePitchChange} />
      <span className={style.pitch}>{pitch}</span>
      <span className="material-symbols-outlined">restart_alt</span>
    </div>
  );
}
