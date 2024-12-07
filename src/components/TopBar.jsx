import { useState } from "react";
import { useMusicList } from "../context/MusicProvider";
import style from "./TopBar.module.css";

function TopBar({ popUpPlayList, setPopUpPlayList }) {
  const { current, currentIndex, musics } = useMusicList();
  const [dropDown, setDropDown] = useState(false);

  return (
    <div className={style.topBar}>
      <span onClick={() => setDropDown((bool) => !bool)} className="material-symbols-outlined">
        {dropDown ? "expand_less" : "expand_more"}
      </span>
      <p>
        {current ? currentIndex + 1 : ""} / {musics.length}
      </p>
      <span
        onClick={() => setPopUpPlayList((bool) => !bool)}
        id={style.moreMusic}
        className={`material-symbols-outlined ${popUpPlayList ? style.clicked : null}`}
      >
        queue_music
      </span>
    </div>
  );
}

export default TopBar;
