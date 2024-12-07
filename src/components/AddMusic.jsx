import { useEffect } from "react";
import { useMusicList } from "../context/MusicProvider";

function AddMusic() {
  const { musics, setMusics } = useMusicList();

  // 파일을 선택했다면 context에 추가
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    // 같은 제목의 음악이 있다면 return
    if (musics.some((music) => music.name === file.name)) {
      return;
    }
    if (file) {
      const fileWithObjectURL = {
        name: file.name,
        type: file.type,
        size: file.size,
        // URL.createObjectURL(file) -> 주어진 객체를 가리키는 URL을 DOMString으로 반환. 해당 URL은 자신을 생성한 창의 document가 사라지면 함께 무효화된다.
        objectURL: URL.createObjectURL(file),
      };

      setMusics((prevFiles) => [...prevFiles, fileWithObjectURL]);

      // 파일 삭제 후 동일한 파일 재업로드 시 onchange 이벤트가 발생하지 않는 문제 방지를 위해 이전 value null로 초기화
      e.target.value = null;
    }
  };

  useEffect(() => {
    sessionStorage.setItem("audioFiles", JSON.stringify(musics));
  }, [musics]);

  return (
    <>
      {/* input[type='file'] 커스텀 디자인 */}
      <input
        onChange={handleFileChange}
        id="add-music"
        name="add-music"
        type="file"
        accept="audio/*"
      />
      <label htmlFor="add-music">
        <span className="material-symbols-outlined">add_circle</span>
      </label>
    </>
  );
}

export default AddMusic;
