import Card from "../ui/Card";
import style from "./AudioEqualizer.module.css";
import PanningController from "./PanningController";
import SpeedController from "./SpeedController";

const EQ_FREQUENCIES = [60, 170, 310, 600, 1000, 3000, 6000];

function AudioEqualizer({ popUpEqualizer, setPopUpEqualizer, audioElement, panner, filters }) {
  return (
    <Card className={`${style.equalizer} ${popUpEqualizer ? style.popUp : style.popIn}`}>
      <header className={style.header}>
        <p>Equalizer</p>
        <span onClick={() => setPopUpEqualizer(false)} className="material-symbols-outlined">
          close
        </span>
      </header>

      <div className={style.equalizerBar}>
        {filters.map((n, i) => (
          <div key={i}>
            <input
              onChange={(e) => {
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
        <SpeedController audioElement={audioElement} />
      </div>
    </Card>
  );
}

export default AudioEqualizer;
