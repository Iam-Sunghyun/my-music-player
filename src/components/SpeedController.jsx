import { useState } from "react";
import style from "./SpeedController.module.css";

function SpeedController({ audioElement }) {
  const [speed, setSpeed] = useState(1);

  // 음악 속도 변경 핸들러
  const handleSpeedChange = (e) => {
    const newSpeed = parseFloat(e.target.value);
    setSpeed(newSpeed);

    if (audioElement.current) {
      audioElement.current.playbackRate = newSpeed; // HTMLAudioElement(audio 태그)의 playbackRate 설정
    }
  };

  // 리셋 버튼 핸들러
  const handleResetSpeed = () => {
    setSpeed(1);
    if (audioElement.current) {
      audioElement.current.playbackRate = 1;
    }
  };

  return (
    <div className={style.speedController}>
      <div>Speed </div>
      <input
        type="range"
        min="0.25"
        max="2"
        step="0.01"
        value={speed}
        onChange={handleSpeedChange}
      />
      <span className={style.speed}>{speed}</span>
      <span onClick={handleResetSpeed} className="material-symbols-outlined">
        restart_alt
      </span>
    </div>
  );
}

export default SpeedController;
