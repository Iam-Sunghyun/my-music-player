import { useMusicList } from "../context/MusicProvider";
import style from "./SongDetails.module.css";

function SongDetails() {
  const { current } = useMusicList();
  return (
    <div className={style.songDetails}>
      <p className={style.name}>{current?.name}</p>
      {/* <p className={style.artist}>artist</p> */}
    </div>
  );
}

export default SongDetails;
