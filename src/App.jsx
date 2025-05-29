import style from "./App.module.css";
import Player from "./components/Player";
import PlayList from "./components/PlayList";
import "wicg-inert";

function App() {
  return (
    <main className={style.wrapper}>
      <Player />
      <PlayList />
    </main>
  );
}

export default App;
