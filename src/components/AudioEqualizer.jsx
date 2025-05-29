import Card from "../ui/Card";
import style from "./AudioEqualizer.module.css";
import PanningController from "./PanningController";
import SpeedController from "./SpeedController";
import { useEffect, useState } from "react";

const EQ_FREQUENCIES = [60, 170, 310, 600, 1000, 3000, 6000];

function AudioEqualizer({ popUpEqualizer, setPopUpEqualizer, audioElement, panner, filters }) {
  const [hide, setHide] = useState(false);

  // 팝업 이퀄라이저 popIn 시 포커스 방지용
  useEffect(() => {
    if (!popUpEqualizer) {
      // 닫을 때 visibility를 나중에(0.2초 뒤) hidden으로 처리
      setHide(true);
    } else {
      // 열릴 때는 바로 보여줌
      setHide(false);
    }
  }, [popUpEqualizer]);

  return (
    <Card
      className={`${style.equalizer} ${popUpEqualizer ? style.popUp : style.popIn}`}
      hide={hide}
    >
      <header className={style.header}>
        <p>Equalizer</p>
        <span
          onClick={() => setPopUpEqualizer((prev) => !prev)}
          className="material-symbols-outlined"
        >
          close
        </span>
      </header>

      <div className={style.equalizerBar}>
        {filters.map((n, i) => (
          <div key={i}>
            <input
              onChange={(e) => {
                // filters의 요소 값이 Number가 아니라는 것은 이퀄라이저 필터가 생성됐다는 의미. useAudioContext.js 참조
                if (!Number.isInteger(filters[i])) {
                  filters[i].gain.value = e.target.value;
                }
              }}
              id={`bar${i + 1}`}
              type="range"
              min="-20"
              max="20"
              step="1"
              defaultValue={0}
            />
          </div>
        ))}
      </div>

      <div className={style.frequencyValue}>
        {EQ_FREQUENCIES.map((n, i) => (
          <p key={i}>{`${n}hz`}</p>
        ))}
      </div>

      <div className={style.controllers}>
        <PanningController panner={panner} />
        {/* <PitchController pitchShift={pitchShift} audioElement={audioElement} /> */}
        <SpeedController audioElement={audioElement} />
      </div>
    </Card>
  );
}

export default AudioEqualizer;
