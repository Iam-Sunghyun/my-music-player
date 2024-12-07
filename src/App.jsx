import style from "./App.module.css";
import Player from "./components/Player";
import PlayList from "./components/PlayList";

function App() {
  return (
    <main className={style.wrapper}>
      {/* <span className="material-symbols-outlined">menu</span> */}
      <Player />
      <PlayList />
    </main>
  );
}

export default App;