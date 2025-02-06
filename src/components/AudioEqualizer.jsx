import Card from "../ui/Card";
import style from "./AudioEqualizer.module.css";
import PanningController from "./PanningController";
import SpeedController from "./SpeedController";

const EQ_FREQUENCIES = [60, 170, 310, 600, 1000, 3000, 6000];

function AudioEqualizer({ popUpEqualizer, audioElement, panner, filters }) {
  return (
    <Card className={`${style.equalizer} ${popUpEqualizer ? style.popUp : style.popIn}`}>
      <header>
        <p>Equalizer</p>
      </header>

      <div className={style.equalizerBar}>
        {filters.map((n, i) => (
          <div key={i}>
            <input
              // 음악 선택 전엔 비활성화
              style={{ pointerEvents: Number.isInteger(filters[i]) ? `none` : "" }}
              onChange={(e) => {
                filters[i].gain.value = e.target.value;
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

      <div>
        <PanningController panner={panner} />

        <SpeedController audioElement={audioElement} />
      </div>
    </Card>
  );
}

export default AudioEqualizer;
