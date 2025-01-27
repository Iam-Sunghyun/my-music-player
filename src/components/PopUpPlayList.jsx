import Card from "../ui/Card";
import style from "./PopUpPlayList.module.css";
import ListItem from "./ListItem";
import AddMusic from "./AddMusic";

function PopUpPlayList({ popUpPlayList }) {
  return (
    <Card className={`${style.popUpPlayList} ${popUpPlayList ? style.popUp : style.popIn}`}>
      <header className={style.header}>
        <p>Play List</p>
        <AddMusic />
      </header>
      <ListItem />
    </Card>
  );
}

export default PopUpPlayList;
