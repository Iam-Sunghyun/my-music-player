import { useEffect, useState } from "react";
import style from "./Controller.module.css";
import toast, { Toaster } from "react-hot-toast";

function Controller({
  audioElement,
  setLoop,
  loop,
  playPause,
  setCurrentTime,
  musics,
  setCurrent,
  current,
  setCurrentIndex,
  currentIndex,
}) {
  const [volumeBtn, setVolumeBtn] = useState(false);
  const [volume, setVolume] = useState(35);

  // 재생, 정지 버튼 핸들러
  const handlePlayPause = () => {
    if (playPause) {
      audioElement?.current?.pause();
    } else {
      audioElement?.current?.play();
    }
  };

  // 이전 버튼 클릭 이벤트
  const handlePrevMusic = () => {
    // 노래가 0초대라면 이전 곡으로
    if (Math.floor(audioElement.current.currentTime) === 0) {
      setCurrentIndex((n) => (n - 1 < 0 ? musics?.length - 1 : n - 1));

      // 0초 초과면 노래 시작으로
    } else {
      audioElement.current.currentTime = 0;
    }
  };

  // 다음 버튼 클릭 이벤트
  const handleNextMusic = () => {
    // 기본, 루프 설정인 경우 다음 버튼 클릭 시 다음 노래로 넘어감
    if (loop === 0 || loop === 1) {
      setCurrentIndex((n) => (n + 1) % musics?.length);

      // 셔플 설정인 경우 다음 버튼 클릭 시 셔플
    } else if (loop === 2) {
      let random = currentIndex;
      while (random === currentIndex) {
        random = Math.floor(Math.random() * musics?.length);
      }
      setCurrentIndex(random);
      setCurrent(musics[random]);
    }
  };

  useEffect(() => {
    // 곡(인덱스) 변경 시 현재 재생 곡(current) 업데이트
    if (musics) {
      setCurrent(musics[currentIndex]);

      // 선택한 곡이 없거나 삭제되면 play 버튼 렌더링, 곡 선택시 자동 재생과 pause 버튼 렌더링
      if (!current) {
        audioElement?.current?.pause();
        setCurrentTime(0);
      }
    }
  }, [currentIndex, current]);

  return (
    <div className={style.controls}>
      <span
        onClick={() => {
          setLoop((prev) => (prev + 1) % 3);
          // if (loop === 0) {
          //   toast("한곡 반복");
          // } else if (loop === 1) {
          //   toast("셔 플");
          // } else if (loop === 2) {
          //   toast("다음 곡 재생");
          // }
        }}
        id="repeat-plist"
        className="material-symbols-outlined"
      >
        {/* <Toaster
          toastOptions={{
            className: "",
            style: {
              "-webkit-text-fill-color": "#000",
              fontSize: "20px",
            },
            duration: 2000,
          }}
        /> */}
        {loop === 0 ? "trending_flat" : loop === 1 ? "repeat_one" : "shuffle"}
      </span>

      <span onClick={handlePrevMusic} id="prev" className="material-symbols-outlined">
        skip_previous
      </span>

      {/* style 어트리뷰트: 재생 중인 곡 없으면 재생버튼 비활성화 */}
      <div className={style.playPause} style={{ pointerEvents: `${current ? "" : "none"}` }}>
        {
          <span onClick={handlePlayPause} className="material-symbols-outlined">
            {playPause ? "pause" : "play_arrow"}
          </span>
        }
      </div>

      <span onClick={handleNextMusic} id="next" className="material-symbols-outlined">
        skip_next
      </span>

      <span onClick={() => setVolumeBtn((b) => !b)} className="material-symbols-outlined">
        {`${audioElement?.current?.volume === 0 ? "volume_off" : "volume_up"}`}
      </span>

      {volumeBtn ? (
        <div className={style.volume}>
          <input
            id={style.volumeBar}
            type="range"
            value={volume}
            onChange={(e) => {
              audioElement.current.volume = e.target.value / 70;
              setVolume(e.target.value);
            }}
            min={0}
            max={70}
            step={1}
          />
        </div>
      ) : null}
    </div>
  );
}

export default Controller;
