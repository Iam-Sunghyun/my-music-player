import { useEffect, useRef } from "react";
import style from "./AudioVisualizer.module.css";

// AudioVisualizer 컴포넌트: 오디오 시각화를 담당하는 컴포넌트
function AudioVisualizer({ analyser }) {
  const canvasRef = useRef(); // canvas 요소를 참조하기 위한 ref 생성

  useEffect(() => {
    const drawVisualizer = () => {
      // analyser나 canvas가 없으면 함수 종료
      if (!analyser || !canvasRef.current) return;

      const canvas = canvasRef.current; // canvas DOM 요소 참조
      const ctx = canvas.getContext("2d"); // canvas의 2D 렌더링 컨텍스트 생성
      const bufferLength = analyser.frequencyBinCount; // 주파수 데이터의 크기 (FFT 해상도에 따라 다름)
      const dataArray = new Uint8Array(bufferLength); // 주파수 데이터를 저장할 배열 생성

      // 시각화를 위한 함수
      const draw = () => {
        analyser.getByteFrequencyData(dataArray); // analyser로부터 현재 주파수 데이터를 가져와 dataArray(Uint8Array)에 저장

        // 캔버스를 초기화
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 2.5; // 각 막대의 너비 계산
        let x = 0; // 막대의 x 좌표 초기화

        // 주파수 데이터로 막대를 그리기
        for (let i = 0; i < bufferLength; i++) {
          const barHeight = dataArray[i]; // 데이터 값에 따라 막대 높이 설정
          ctx.fillStyle = "#4cc9fe"; // 막대의 색상 설정
          ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2); // fillStyle로 지정한 스타일의 막대 그리기 -> fillRect(x, y, width, height)
          x += barWidth + 0.5; // 다음 막대의 x 좌표로 이동
        }

        // 애니메이션 루프 실행
        // window.requestAnimationFrame() 메서드는 브라우저에게 수행하기를 원하는 애니메이션을 알리고
        // 다음 리페인트 바로 전에 브라우저가 애니메이션을 업데이트할 지정된 함수를 호출하도록 요청합니다.
        // 이 메서드는 리페인트 이전에 호출할 인수로 콜백을 받습니다.
        // 다음 리페인트에서 다른 프레임을 애니메이션 적용할려면 콜백 루틴이 반드시 스스로
        // requestAnimationFrame()을 호출해야 합니다. requestAnimationFrame()은 하나의 장면입니다.
        // - MDN
        requestAnimationFrame(draw);
      };

      draw(); // 시각화 함수 실행
    };

    drawVisualizer(); // 시각화 초기화
  }, [analyser]); // analyser가 변경될 때마다 실행

  // 시각화 될 canvas 요소 렌더링
  return <canvas ref={canvasRef} width={250} height={200} className={style.audioVisualizer} />;
}

export default AudioVisualizer;
