import { useEffect, useRef } from "react";
import style from "./AudioVisualizer.module.css";

function AudioVisualizer({ analyser }) {
  const canvasRef = useRef();

  useEffect(() => {
    const drawVisualizer = () => {
      if (!analyser || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const barWidth = (canvas.width / bufferLength) * 2.5;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = dataArray[i];
          ctx.fillStyle = "#4cc9fe";
          ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
          x += barWidth + 1;
        }

        requestAnimationFrame(draw);
      };

      draw();
    };

    drawVisualizer();
  }, [analyser]);

  return <canvas ref={canvasRef} width={250} height={180} className={style.audioVisualizer} />;
}

export default AudioVisualizer;
