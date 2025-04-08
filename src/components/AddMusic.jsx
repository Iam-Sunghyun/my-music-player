import { useMusicList } from "../context/MusicProvider";

function AddMusic() {
  const { musics, setMusics } = useMusicList(); // 음악 목록과 상태 업데이트 함수 가져오기

  // 파일이 선택되었을 때 실행되는 함수
  const addMusicHandler = (e) => {
    const fileList = Array.from(e.target.files); // FileList를 배열로 변환
    const newFiles = [];

    fileList.forEach((file) => {
      if (!file) return; // 파일이 유효한지 확인

      // 오디오 파일인지 확인
      if (!file.type.startsWith("audio/")) {
        alert("오디오 파일만 업로드 가능합니다.");
        return;
      }

      // 기존 목록에 같은 이름의 파일이 있는지 검사 (중복 방지)
      if (musics.some((music) => music.name === file.name)) return;

      // 새로운 파일 객체 생성
      newFiles.push({
        name: file.name,
        type: file.type,
        size: file.size,
        objectURL: URL.createObjectURL(file), // 브라우저에서 사용할 수 있는 객체 URL 생성
      });
    });

    // 새로운 파일이 추가된 경우에만 상태 업데이트
    if (newFiles.length > 0) {
      setMusics((prevFiles) => [...prevFiles, ...newFiles]);
    }

    // 동일한 파일을 다시 업로드할 수 있도록 input 값을 초기화
    e.target.value = "";
  };

  //  음악 리스트를 sessionStorage에 저장하는 기능
  // useEffect(() => {
  //   sessionStorage.setItem("audioFiles", JSON.stringify(musics));
  // }, [musics]);

  return (
    <>
      {/* 음악 파일 업로드 input (multiple 속성으로 여러 개 업로드 가능) */}
      <input
        onChange={addMusicHandler} // 파일이 선택되었을 때 실행
        id="add-music"
        name="add-music"
        type="file"
        accept="audio/*" // 오디오 파일만 허용
        multiple // 여러 개의 파일 업로드 허용
      />
      {/* 커스텀 버튼 스타일을 위한 label */}
      <label htmlFor="add-music">
        <span className="material-symbols-outlined">add_circle</span>
      </label>
    </>
  );
}

export default AddMusic;
