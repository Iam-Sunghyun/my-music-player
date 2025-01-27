import Card from "../ui/Card";
import style from "./AudioEqualizer.module.css";

function AudioEqualizer({ popUpEqualizer }) {
  return (
    <Card className={`${style.equalizer} ${popUpEqualizer ? style.popUp : style.popIn}`}>
      <header>
        <p>Equalizer</p>
      </header>
      <div>test</div>
    </Card>
  );
}

export default AudioEqualizer;
