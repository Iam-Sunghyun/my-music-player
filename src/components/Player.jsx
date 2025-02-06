import { useRef, useState } from "react";
import { useMusicList } from "../context/MusicProvider";
import useAudioContext from "../hooks/useAudioContext";
import Card from "../ui/Card";
import AudioEqualizer from "./AudioEqualizer";
import AudioVisualizer from "./AudioVisualizer";
import Controller from "./Controller";
import style from "./Player.module.css";
import PopUpPlayList from "./PopUpPlayList";
import ProgressArea from "./ProgressArea";
import SongDetails from "./SongDetails";
import TopBar from "./TopBar";

function Player() {
  const [popUpPlayList, setPopUpPlayList] = useState(false);
  const [popUpEqualizer, setPopUpEqualizer] = useState(false);
  const { musics, setCurrent, current, setCurrentIndex, currentIndex } = useMusicList();
  const [playPause, setPlayPause] = useState(false);
  const [loop, setLoop] = useState(0); // 0 -> 기본, 1 -> 루프, 2 -> 셔플
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audio = new Audio(current?.objectURL); // HTMLAudioElement 객체
  const audioElement = useRef(); // Audio 요소 참조

  const { analyser, audioContext, panner, filters } = useAudioContext(audioElement);

  // 오디오 객체 메타데이터 로드 이벤트(음악 총 길이 저장)
  audio.onloadedmetadata = () => {
    if (audio.readyState > 0) {
      setDuration(audio?.duration);
    }
  };

  // audio onTimeUpdate 이벤트 핸들러
  const handleCurrentTime = () => {
    const time = audioElement.current.currentTime;
    setCurrentTime(time);
  };

  // audio onEnded 이벤트 핸들러
  const handleOnEnded = () => {
    setPlayPause(false); // 정지 버튼 렌더링

    // 기본 설정인 경우 다음 노래로 넘어가기
    if (loop === 0) {
      setCurrentIndex((prev) => (prev + 1) % musics.length);
      setCurrent(musics[(musics.indexOf(current) + 1) % musics.length]);
    }

    // 셔플 설정인 경우 현재 노래와 다른 곡 인덱스 나올때 까지 난수 할당
    if (loop === 2) {
      let random = currentIndex;
      while (random === currentIndex) {
        random = Math.floor(Math.random() * musics.length);
      }
      setCurrentIndex(random);
      setCurrent(musics[random]);
    }
  };

  return (
    <Card className={style.playerCard}>
      <TopBar
        popUpPlayList={popUpPlayList}
        setPopUpPlayList={setPopUpPlayList}
        popUpEqualizer={popUpEqualizer}
        setPopUpEqualizer={setPopUpEqualizer}
      />
      <AudioVisualizer analyser={analyser} />
      <SongDetails />
      <ProgressArea
        audioElement={audioElement}
        currentTime={currentTime}
        setCurrentTime={setCurrentTime}
        duration={duration}
      />
      <Controller
        audioElement={audioElement}
        setLoop={setLoop}
        loop={loop}
        playPause={playPause}
        setCurrentTime={setCurrentTime}
        musics={musics}
        setCurrent={setCurrent}
        current={current}
        setCurrentIndex={setCurrentIndex}
        currentIndex={currentIndex}
      />
      <PopUpPlayList popUpPlayList={popUpPlayList} />
      <AudioEqualizer
        popUpEqualizer={popUpEqualizer}
        audioContext={audioContext}
        audioElement={audioElement}
        panner={panner}
        filters={filters}
      />
      <audio
        ref={audioElement}
        loop={loop === 1 ? true : false}
        src={current?.objectURL}
        onTimeUpdate={handleCurrentTime}
        onEnded={handleOnEnded}
        onPause={() => setPlayPause(false)}
        onPlay={() => setPlayPause(true)}
        autoPlay
        hidden
      />
    </Card>
  );
}

export default Player;
