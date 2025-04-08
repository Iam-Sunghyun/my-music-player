import { useEffect, useRef, useState } from "react";
import { useMusicList } from "../context/MusicProvider";
// Web Audio API를 이용한 오디오 시각화: https://developer.mozilla.org/ko/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API

const EQ_FREQUENCIES = [60, 170, 310, 600, 1000, 3000, 6000]; // 이퀄라이저 주파수 음역대

// # Web Audio API를 사용한 코드
export default function useAudioContext(audioElement) {
  const audioSourceRef = useRef(null); // 오디오 컨텍스트 소스(MediaElementAudioSourceNode) 저장

  const [audioContext, setAudioContext] = useState(null); // AudioContext 저장
  const [analyser, setAnalyser] = useState(null); // AnalyserNode 저장
  const [panner, setPanner] = useState(null);
  const [filters, setFilters] = useState(EQ_FREQUENCIES);
  const { current } = useMusicList(); // 현재 재생 중인 음악이 있는지 확인용 Context 상태

  // 오디오 컨텍스트, analyserNode, StereoPannerNode, 이퀄라이저 필터 생성하는 함수
  const initAudioContext = () => {
    // audioContext가 존재하지 않을 경우에만 실행
    if (!audioContext) {
      // 1. AudioContext 생성 (브라우저 호환성을 위해 window.AudioContext와 window.webkitAudioContext(-> 구형 크롬, safari용) 모두 지원)
      const context = new (window.AudioContext || window.webkitAudioContext)();

      // 2. AnalyserNode 및 StereoPannerNode 생성
      const analyserNode = context.createAnalyser();
      const pan = new StereoPannerNode(context, { pan: 0 });
      analyserNode.fftSize = 512; // FFT 크기를 설정 (시각화의 해상도에 영향을 줌) : fftSize 속성은 unsigned long 값이고 주파수 영역 데이터를 얻기 위해 고속 푸리에 변환(FFT)을 수행할 때 사용될 샘플에서의 window 사이즈를 나타낸다.

      // 3. 이퀄라이저 필터 생성
      const filterArr = EQ_FREQUENCIES.map((freq) => {
        const filter = context.createBiquadFilter();
        filter.type = "peaking"; // 피킹 필터 사용
        filter.frequency.value = freq;
        filter.Q.value = 1; // Q 값 조정 가능
        filter.gain.value = 0; // 초기값 (dB)
        return filter;
      });

      // 4. 오디오 컨텍스트 및 오디오 노드들 상태 저장
      setAudioContext(context);
      setAnalyser(analyserNode);
      setPanner(pan);
      setFilters(filterArr);
    }
  };

  // 음악을 선택한 상태에서 audioContext가 없는 경우 AudioContext 및 각종 오디오 노드들을 초기화하는 effect -> 사용자 상호작용 없이 AudioContext 생성 혹은 활성화 불가능하므로 현재 음악 선택 후 AudioContext 생성하도록 하기 위함.
  useEffect(() => {
    if (current && !audioContext) {
      initAudioContext();
    }
  }, [current]);

  // 생성된 오디오 노드들 연결하는 effect
  useEffect(() => {
    if (audioContext && analyser && panner && filters) {
      // 오디오 소스 노드가 생성되지 않은 경우 실행
      if (!audioSourceRef.current) {
        // 1. 오디오 소스 노드(MediaElementAudioSourceNode) 생성
        const source = audioContext.createMediaElementSource(audioElement.current);
        // 2. 이퀄라이저 필터들을 체인으로 연결
        source.connect(filters[0]); // 첫 번째 필터를 오디오 소스에 연결
        for (let i = 0; i < filters.length - 1; i++) {
          filters[i].connect(filters[i + 1]); // 각 필터를 연결
        }

        // 3. 마지막 필터를 analyser 및 panner에 연결 후 출력 장치에 연결
        filters[filters.length - 1].connect(analyser);

        analyser.connect(panner);
        panner.connect(audioContext.destination);

        // 4. Ref에 오디오 소스 저장(중복 생성 방지)
        audioSourceRef.current = source;
      }
    }
  }, [audioContext, analyser, panner, filters]);

  return {
    analyser,
    panner,
    audioContext,
    // audioSourceRef,
    filters,
  };
}
