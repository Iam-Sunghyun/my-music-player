import Card from "../ui/Card";
import AddMusic from "./AddMusic";
import ListItem from "./ListItem";
import style from "./PlayList.module.css";

function PlayList() {
  return (
    <Card className={style.playList}>
      <header className={style.header}>
        <p>Play List</p>
        <AddMusic />
      </header>
      <ListItem />
    </Card>
  );
}

export default PlayList;
