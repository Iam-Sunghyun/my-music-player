import { useMusicList } from "../context/MusicProvider";
import style from "./TopBar.module.css";

function TopBar({ popUpPlayList, setPopUpPlayList, popUpEqualizer, setPopUpEqualizer }) {
  const { current, currentIndex, musics } = useMusicList();

  return (
    <div className={style.topBar}>
      <span
        onClick={() => {
          setPopUpEqualizer((bool) => !bool);
          if (popUpPlayList) {
            setPopUpPlayList(false);
          }
        }}
        className={`material-symbols-outlined ${popUpEqualizer ? style.clicked : null}`}
      >
        tune
      </span>
      <p>
        {current ? currentIndex + 1 : ""} / {musics.length}
      </p>
      <span
        onClick={() => {
          setPopUpPlayList((bool) => !bool);
          if (popUpEqualizer) {
            setPopUpEqualizer(false);
          }
        }}
        id={style.moreMusic}
        className={`material-symbols-outlined ${popUpPlayList ? style.clicked : null}`}
      >
        queue_music
      </span>
    </div>
  );
}

export default TopBar;
