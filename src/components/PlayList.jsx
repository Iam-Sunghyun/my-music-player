import { useEffect, useState } from "react";
import Card from "../ui/Card";
import AddMusic from "./AddMusic";
import ListItem from "./ListItem";
import style from "./PlayList.module.css";
import { useMusicList } from "../context/MusicProvider";

function PlayList() {
  const { musics, setMusics } = useMusicList(); // 음악 목록과 업데이트 함수 가져오기

  // 드래그 중일 때 실행 (파일이 드롭 가능한 상태로 변경)
  const handleDragOver = (e) => {
    e.preventDefault(); // 기본 이벤트 방지
  };

  // 파일이 드롭되었을 때 실행
  const handleDrop = (e) => {
    e.preventDefault(); // 기본 이벤트 방지(파일이 브라우저에서 열리는 것을 막음)

    const files = e.dataTransfer.files; // 드롭된 파일 목록 가져오기 -> DataTransfer 객체는 드래그 형태나 드래그 데이터 (하나 이상의 아이템), 각 드래그 아이템의 종류 (MIME 종류) 와 같은 드래그 이벤트의 상태를 담고 있다.

    // 파일이 있을 경우 처리
    if (files.length > 0) {
      const fileList = Array.from(files); // FileList를 배열로 변환
      const newFiles = [];

      fileList.forEach((file) => {
        if (!file) return; // 유효한 파일인지 확인

        // 오디오 파일인지 확인
        if (!file.type.startsWith("audio/")) {
          alert("오디오 파일만 업로드 가능합니다.");
          return;
        }

        // 기존에 추가된 음악과 중복인지 검사
        if (musics.some((music) => music.name === file.name)) return;

        // 새로운 음악 파일 객체 생성
        newFiles.push({
          name: file.name,
          type: file.type,
          size: file.size,
          objectURL: URL.createObjectURL(file), // 브라우저에서 사용할 수 있는 객체 URL 생성
        });
      });

      // 새로운 파일이 있다면 상태 업데이트
      if (newFiles.length > 0) {
        setMusics((prevFiles) => [...prevFiles, ...newFiles]);
      }
    }
  };

  return (
    <Card className={style.playListCard}>
      {/* 드래그 앤 드롭 이벤트를 적용할 플레이리스트 영역 */}
      <div
        className={style.playListBody}
        onDragOver={handleDragOver} // 드래그 중일 때
        // // onDragLeave={handleDragLeave} // 드래그 영역을 벗어날 때
        onDrop={handleDrop} // 파일이 드롭될 때
      >
        {/* 헤더 부분 */}
        <header className={style.header}>
          <p>Play List</p>
          <AddMusic /> {/* 음악 추가 버튼 */}
        </header>
        <ListItem /> {/* 음악 리스트 출력 */}
      </div>
    </Card>
  );
}

export default PlayList;
