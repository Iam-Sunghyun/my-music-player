import { useEffect, useRef, useState } from "react";
import { useMusicList } from "../context/MusicProvider";

// useAudioContext.js: AudioContext 및 AnalyserNode를 관리하는 커스텀 훅
export default function useAudioContext(audioElement) {
  const audioSourceRef = useRef(null); // 오디오 컨텍스트 소스(MediaElementAudioSourceNode) 저장

  const [audioContext, setAudioContext] = useState(null); // AudioContext 저장
  const [analyser, setAnalyser] = useState(null); // AnalyserNode 저장
  const { current } = useMusicList(); // 현재 재생 중인 음악이 있는지 확인용 Context 상태

  // AudioContext 및 AnalyserNode를 생성하는 함수
  const initAudioContext = () => {
    // audioContext가 존재하지 않을 경우에만 실행
    if (!audioContext) {
      // 1. AudioContext 생성 (브라우저 호환성을 위해 window.AudioContext와 window.webkitAudioContext(-> 구형 크롬, safari용) 모두 지원)
      const context = new (window.AudioContext || window.webkitAudioContext)();

      // 2. AnalyserNode 생성
      const analyserNode = context.createAnalyser();
      analyserNode.fftSize = 512; // FFT 크기를 설정 (시각화의 해상도에 영향을 줌) : fftSize 속성은 unsigned long 값이고 주파수 영역 데이터를 얻기 위해 고속 푸리에 변환(FFT)을 수행할 때 사용될 샘플에서의 window 사이즈를 나타낸다.

      // 3. 생성된 AudioContext와 AnalyserNode를 상태에 저장
      setAudioContext(context);
      setAnalyser(analyserNode);
    }
  };

  // 음악을 선택한 상태에서 audioContext와 analyser가 없는 경우 AudioContext 및 AnalyserNode를 초기화하는 effect -> 사용자 상호작용 없이 AudioContext 생성 불가능하므로 현재 음악 선택 후 AudioContext 생성하도록 함.
  useEffect(() => {
    if (current && !audioContext && !analyser) {
      initAudioContext();
    }
  }, [audioContext, analyser, current]);

  // AudioContext와 AnalyserNode를 Audio 요소에 연결
  useEffect(() => {
    if (audioContext && analyser && audioElement.current) {
      // audioSourceRef(MediaElementAudioSourceNode)가 초기화되지 않은 경우 -> 오디오 컨텍스트 소스가 생성되지 않은 경우 실행
      if (!audioSourceRef.current) {
        // 1. 오디오 컨텍스트 소스(MediaElementAudioSourceNode) 생성
        const source = audioContext.createMediaElementSource(audioElement.current);

        // 2. 분석될 오디오 소스(MediaElementAudioSourceNode)에 분석기(AnalyserNode) 연결
        source.connect(analyser);
        // 3. analyser에 AudioContext.detination(오디오 컨텍스트 종착점 -> 보통 스피커를 가리킴) 연결
        analyser.connect(audioContext.destination);

        // 4. 생성된 MediaElementAudioSourceNode를 Ref에 저장
        audioSourceRef.current = source;
      }
    }
  }, [audioContext, analyser, audioElement]);

  return {
    // analyser를 반환하여 오디오 시각화 및 분석에 사용
    analyser,
  };
}
