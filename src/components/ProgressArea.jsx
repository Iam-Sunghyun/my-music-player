import { useMusicList } from "../context/MusicProvider";
import timer from "../utils/timer";
import style from "./ProgressArea.module.css";

function ProgressArea({ audio, duration, currentTime, setCurrentTime }) {
  const { current } = useMusicList();

  // 프로그레스바 클릭 이벤트 핸들러
  const handleProgressBarClick = (e) => {
    const width = e.currentTarget.clientWidth; // progressArea 너비를 픽셀로 반환
    const offsetX = e.nativeEvent.offsetX; // offsetX -> 해당 이벤트와 대상 노드 내 여백 사이의 마우스 포인터의 수평 좌표를 제공
    const clicked = (offsetX / width) * duration; // 클릭한 위치의 시간 값(초) 계산
    audio.current.currentTime = clicked; // audio 요소 현재 시간 업데이트
    setCurrentTime(clicked);
  };

  return (
    <div className={`${style.progressArea}`} onClick={handleProgressBarClick}>
      <div
        className={`${style.progressBar}`}
        // 프로그레스바 현재시간 업데이트
        style={{ width: `${(currentTime / duration) * 100}%` }}
      ></div>
      {
        <div className={`${style.timer}`}>
          <span className="current">{timer(current ? currentTime : 0)}</span>
          <span className="current">{timer(current ? duration : 0)}</span>
        </div>
      }
    </div>
  );
}

export default ProgressArea;
