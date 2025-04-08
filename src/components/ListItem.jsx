import { useMusicList } from "../context/MusicProvider";
import style from "./ListItem.module.css";

function ListItem() {
  const { musics, setMusics, current, setCurrent, setCurrentIndex } = useMusicList();

  // 클릭된 음악 이름 Context API에 저장, 삭제
  const handleFileSelected = (e) => {
    // 2가지 이벤트 핸들러 하나의 함수에 묶어 상위 요소에 위임

    // Context에서 삭제 버튼 클릭한 음악 삭제
    if (e.target.textContent === "close") {
      const selected = musics.filter((f) => f.name === e.target.previousSibling.textContent);

      setMusics((files) => files.filter((f) => f.name !== selected[0].name));
      setCurrent(null);
      setCurrentIndex(null);

      // 세션 스토리지 특정 파일 삭제
      // const files = JSON.parse(sessionStorage.getItem("audioFiles"));
      // const parsedFile = files.filter((f) => f.name === e.target.previousSibling.textContent)[0];
      // setMusics((files) => files.filter((f) => f.name !== parsedFile.name));

      // // 선택 중인 음악이 삭제되면 current도 초기화
      // const selected = musics.filter((f) => f.name === e.target.previousSibling.textContent)[0]
      //   ?.name;
      // if (current.name === selected) {
      //   setCurrentIndex(null);
      //   setCurrent(null);
      // }

      // 현재 선택한 음악 context(current)에 저장
    } else {
      const selected = musics.filter((f) => f.name === e.target.firstChild.textContent)[0];
      setCurrent(selected);
      setCurrentIndex(musics.indexOf(selected));
    }
  };

  return (
    <ul className={style.list} onClick={handleFileSelected}>
      {musics.map((music) => {
        return (
          <li
            className={`${style.listItem} ${
              current?.name === music.name ? style.listItemSelected : ""
            }`}
            key={music.name}
          >
            <div className={style.musicDetails}>
              <p className={style.musicName}>{music.name}</p>
              {/* <p className={style.artistName}>{music.artist}</p> */}
            </div>
            {/* <p className={style.musicLength}>3:40</p> */}
            <span className="material-symbols-outlined">close</span>
          </li>
        );
      })}
    </ul>
  );
}

export default ListItem;
