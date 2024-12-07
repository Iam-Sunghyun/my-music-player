import { createContext, useContext, useMemo, useState } from "react";

const MusicContext = createContext(null);
// const musics = [
//   {
//     name: "song-1",
//     artist: "artist-1",
//     img: "music-1",
//     src: "music-1",
//   },
//   {
//     name: "song-2",
//     artist: "artist-2",
//     img: "music-2",
//     src: "music-2",
//   },
//   {
//     name: "song-3",
//     artist: "artist-3",
//     img: "music-3",
//     src: "music-3",
//   },
//   {
//     name: "song-4",
//     artist: "artist-1",
//     img: "music-1",
//     src: "music-1",
//   },
//   {
//     name: "song-5",
//     artist: "artist-2",
//     img: "music-2",
//     src: "music-2",
//   },
//   {
//     name: "song-6",
//     artist: "artist-3",
//     img: "music-3",
//     src: "music-3",
//   },
//   {
//     name: "song-7",
//     artist: "artist-1",
//     img: "music-1",
//     src: "music-1",
//   },
//   {
//     name: "song-8",
//     artist: "artist-2",
//     img: "music-2",
//     src: "music-2",
//   },
//   {
//     name: "song-9",
//     artist: "artist-3",
//     img: "music-3",
//     src: "music-3",
//   },
// ];

function MusicProvider({ children }) {
  const [musics, setMusics] = useState([]);
  const [current, setCurrent] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);

  // const value = useMemo(() => ({
  //   musics,
  //   setMusics,
  //   current,
  //   setCurrent,
  //   currentIndex,
  //   setCurrentIndex,
  // }), []);

  return (
    <MusicContext.Provider
      value={{ musics, setMusics, current, setCurrent, currentIndex, setCurrentIndex }}
    >
      {children}
    </MusicContext.Provider>
  );
}

function useMusicList() {
  const context = useContext(MusicContext);
  if (context === undefined) {
    return new Error("컨텍스트를 참조할 수 없습니다.");
  }
  return context;
}

export { useMusicList, MusicProvider };
