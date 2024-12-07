import { useEffect, useRef, useState } from "react";
import { useMusicList } from "../context/MusicProvider";

// useAudioContext.js에서 Tone.js를 사용하도록 변경
export default function useAudioContext({ audioComponent }) {
  const audioSourceRef = useRef(null); // MediaElementAudioSourceNode 저장
  const [audioContext, setAudioContext] = useState(null); // AudioContext 저장
  const [analyser, setAnalyser] = useState(null); // AnalyserNode 저장
  const { current } = useMusicList();

  const initAudioContext = () => {
    const context = new (window.AudioContext || window.webkitAudioContext)();

    const analyserNode = context.createAnalyser(); // AnalyserNode 생성
    analyserNode.fftSize = 512;

    setAudioContext(context);
    setAnalyser(analyserNode);
  };

  useEffect(() => {
    if (current && !audioContext && !analyser) {
      initAudioContext();
    }
  }, [audioComponent, audioContext, analyser, current]);

  useEffect(() => {
    if (audioContext && analyser && audioComponent.current) {
      if (!audioSourceRef.current) {
        const source = audioContext.createMediaElementSource(audioComponent.current);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        audioSourceRef.current = source;
      }
    }
  }, [audioContext, analyser, audioComponent]);

  return {
    // audioSourceRef,
    // audioContext,
    analyser,
  };
}
