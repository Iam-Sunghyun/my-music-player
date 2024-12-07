import { useRef, useState } from "react";
import { useMusicList } from "../context/MusicProvider";
import useAudioContext from "../hooks/useAudioContext";
import Card from "../ui/Card";
import AudioVisualizer from "./AudioVisualizer";
import Controller from "./Controller";
import PitchController from "./PitchController";
import style from "./Player.module.css";
import PopUpPlayList from "./PopUpPlayList";
import ProgressArea from "./ProgressArea";
import SongDetails from "./SongDetails";
import SpeedController from "./SpeedController";
import TopBar from "./TopBar";
import * as Tone from "tone";

function Player() {
  const [popUpPlayList, setPopUpPlayList] = useState(false);
  const { musics, setCurrent, current, setCurrentIndex, currentIndex } = useMusicList();
  const [playPause, setPlayPause] = useState(true);
  const [loop, setLoop] = useState(0); // 0 -> 기본, 1 -> 루프, 2 -> 셔플
  const [volumeBtn, setVolumeBtn] = useState(false);
  const [volume, setVolume] = useState(50);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audio = new Audio(current?.objectURL); // HTMLAudioElement
  const audioComponent = useRef();

  const { audioContext, analyser } = useAudioContext({ audioComponent });

  // 오디오 메타데이터 로드 이벤트
  audio.onloadedmetadata = () => {
    if (audio.readyState > 0) {
      setDuration(audio?.duration);
    }
  };

  // audio onTimeUpdate 이벤트 핸들러
  const handleCurrentTime = () => {
    const time = audioComponent.current.currentTime;
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
    }
  };

  return (
    <Card className={style.playerCard}>
      <TopBar popUpPlayList={popUpPlayList} setPopUpPlayList={setPopUpPlayList} />
      <AudioVisualizer audio={audioComponent} audioContext={audioContext} analyser={analyser} />
      <SongDetails />
      <ProgressArea
        audio={audioComponent}
        currentTime={currentTime}
        setCurrentTime={setCurrentTime}
        duration={duration}
      />

      <Controller
        audio={audioComponent}
        setLoop={setLoop}
        loop={loop}
        setVolumeBtn={setVolumeBtn}
        volumeBtn={volumeBtn}
        setVolume={setVolume}
        volume={volume}
        setPlayPause={setPlayPause}
        playPause={playPause}
        setCurrentTime={setCurrentTime}
      />
      <PopUpPlayList popUpPlayList={popUpPlayList} />
      <audio
        ref={audioComponent}
        loop={loop === 1 ? true : false}
        src={current?.objectURL}
        onTimeUpdate={handleCurrentTime}
        onEnded={handleOnEnded}
        hidden
        autoPlay
      />
      <div className={style.controllerArea}>
        <SpeedController audioComponent={audioComponent} />
        {/* <PitchController audio={audio} audioComponent={audioComponent} /> */}
      </div>
    </Card>
  );
}

export default Player;
