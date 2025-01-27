import { createContext, useContext, useState } from "react";

const MusicContext = createContext(null);

// 음악 리스트, 현재 선택된 음악, 현재 선택된 음악의 인덱스를 제공하는 Context
function MusicProvider({ children }) {
  const [musics, setMusics] = useState([]);
  const [current, setCurrent] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);

  return (
    <MusicContext.Provider
      value={{ musics, setMusics, current, setCurrent, currentIndex, setCurrentIndex }}
    >
      {children}
    </MusicContext.Provider>
  );
}

// MusicContext를 참조하기 위한 커스텀 훅
function useMusicList() {
  const context = useContext(MusicContext);
  // 컨텍스트가 생성되지 않은 경우 에러 처리
  if (context === undefined) {
    return new Error("컨텍스트를 참조할 수 없습니다.");
  }
  return context;
}

// 내보내기
export { useMusicList, MusicProvider };
