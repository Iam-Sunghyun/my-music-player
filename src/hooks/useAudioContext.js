import { useEffect, useRef, useState } from "react";
import * as Tone from "tone";

// useAudioContext.js에서 Tone.js를 사용하도록 변경
export default function useAudioContext({ audioComponent }) {
  const audioSourceRef = useRef(null); // MediaElementAudioSourceNode 저장
  const [audioContext, setAudioContext] = useState(null); // AudioContext 저장
  const [analyser, setAnalyser] = useState(null); // AnalyserNode 저장

  useEffect(() => {
    if (audioComponent.current && !audioContext) {
      const context = new (window.AudioContext || window.webkitAudioContext)();

      const analyserNode = context.createAnalyser(); // AnalyserNode 생성
      analyserNode.fftSize = 512;

      setAudioContext(context);
      setAnalyser(analyserNode);
    }
  }, [audioComponent, audioContext]);

  useEffect(() => {
    if (audioContext && analyser && audioComponent.current) {
      if (!audioSourceRef.current) {
        const source = audioContext.createMediaElementSource(audioComponent.current); // MediaElementAudioSourceNode 생성

        source.connect(analyser); // AnalyserNode 연결
        analyser.connect(audioContext.destination); // AudioDestinationNode 연결
        audioSourceRef.current = source;
      }
    }
  }, [audioContext, analyser, audioComponent]);

  return {
    audioSourceRef,
    audioContext,
    analyser,
  };
}
