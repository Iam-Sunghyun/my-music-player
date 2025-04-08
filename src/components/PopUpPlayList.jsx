import Card from "../ui/Card";
import style from "./PopUpPlayList.module.css";
import ListItem from "./ListItem";
import AddMusic from "./AddMusic";
import { useEffect, useState } from "react";

function PopUpPlayList({ popUpPlayList }) {
  const [hide, setHide] = useState(false);

  // 팝업 플레이리스트 popIn 시 포커스 방지용
  useEffect(() => {
    if (!popUpPlayList) {
      // 닫을 때 visibility를 나중에(0.3초 뒤) hidden으로 처리
      const timer = setTimeout(() => {
        setHide(true);
      }, 300); // transition 시간과 맞춰서
      return () => clearTimeout(timer);
    } else {
      // 열릴 때는 바로 보여줌
      setHide(false);
    }
  }, [popUpPlayList]);

  return (
    <Card
      className={`${style.popUpPlayList} ${popUpPlayList ? style.popUp : style.popIn}`}
      hide={hide}
    >
      <header className={style.header}>
        <p>Play List</p>
        <AddMusic />
      </header>
      <ListItem />
    </Card>
  );
}

export default PopUpPlayList;
