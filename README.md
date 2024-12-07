# tech

- React
- css-modules
- context API
- sessionStorage
- audio web api
- tone.js(피치 시프팅)

# 기능

## 반응형(미디어 쿼리) ✅ ->

플레이 리스트를 하나의 컴포넌트로 재사용하려 했으나(화면이 축소됐을 떄 하단 슬라이드 리스트, 큰 화면 그냥 리스트) display 속성이 동일하게 적용되어 반응형 페이지 생성에 문제가 생기게 됨. 따라서 플레이 리스트의 내부 리스트만 컴포넌트로 추출하여 재사용하고 껍데기는 따로 생성해주었다.

## 플레이 리스트 음악 추가/삭제 ✅ ->

음악 데이터, 현재 인덱스 sessionStorage, context API에 저장, context의 경우 래퍼 컴포넌트 따로 분리하여 관리

## 음악 삭제 시 문제 ✅ ->

1. 방금 추가한 음악을 삭제후 동일한 음악을 다시 추가했을 시 추가되지 않는 문제 발생.

   -> input[type="file"] 요소에 같은 파일을 업로드 했을 시 onChange 이벤트가 발생하지 않는다. 따라서 event.target.value를 null로 초기화해주어 동일한 파일이 업로드 되어도 onChange 이벤트가 트리거 되도록 해줌.

2. URL.createObjectURL()로 생성한 URL이 새로고침 혹은 사이트 재접속 하면(해당 페이지의 document가 사라지면) 무효화되는 문제

   -> 일단 localStorage에서 sessionStorage로 변경

## 음악 루프, 셔플 ✅

## 볼륨 조절, 노래 이전, 후로 넘기기 ✅

## 컨트롤바, 커스텀 프로그레스바, 타이머 ✅

## 오디오 비주얼라이저 ✅

<!-- 절차 디테일 필요 -->

### 오디오 비주얼라이저 구현 시 문제

InvalidStateError: Failed to execute 'createMediaElementSource' on 'AudioContext': HTMLMediaElement already connected previously to a different MediaElementSourceNode.
at... 에러 발생.

### 원인

InvalidStateError는 동일한 HTMLAudioElement(여기서는 `<audio>` 태그)가 이미 다른 MediaElementAudioSourceNode에 연결되어 있을 때 발생합니다. Web Audio API에서 하나의HTMLAudioElement는 단 하나의 MediaElementAudioSourceNode에만 연결될 수 있습니다. 이를 해결하려면 AudioContext와 MediaElementAudioSourceNode의 연결 상태를 관리하거나, 새 연결을 생성할 때 기존 연결을 해제해야 합니다.

-> + audioRef.current가 context.createMediaElementSource로 이미 연결된 상태에서 다시 연결을 시도. + 파일 업로드 시마다 새로운 AudioContext나 MediaElementSourceNode를 생성하면서 충돌.

### HTMLMediaElement ?

HTMLMediaElement는 HTML에서 `<audio>`나 `<video>` 태그와 같은 미디어 요소를 나타내는 객체입니다. 이는 오디오/비디오 파일을 재생하는 데 사용됩니다.

- 주요 특징

브라우저 기본 제공 기능. 파일 재생, 일시정지, 속도 제어 등의 작업 가능. 음향 데이터를 직접 조작할 수는 없음.

- 생성 방법

```
<audio id="myAudio" controls>
<source src="audio-file.mp3" type="audio/mp3">
</audio>

const audioElement = document.getElementById('myAudio');
audioElement.play(); // 재생
audioElement.pause(); // 일시 정지
```

### MediaElementSourceNode ?

MediaElementSourceNode는 Web Audio API의 객체로, HTMLMediaElement에서 오디오 데이터를 가져와 오디오 그래프에 연결할 수 있도록 합니다. 이를 통해 오디오 데이터를 분석하거나 조작할 수 있습니다.

- 주요 특징

  Web Audio API의 일부. HTMLMediaElement의 소리를 오디오 그래프에 연결하여 필터링, 분석 가능. 하나의 HTMLMediaElement는 **하나의 MediaElementSourceNode** 와만 연결 가능.

- 생성 방법

  AudioContext의 createMediaElementSource() 메서드를 사용하여 만듭니다:

```
const audioElement = document.getElementById('myAudio');
const audioContext = new AudioContext();

// MediaElementSourceNode 생성
const sourceNode = audioContext.createMediaElementSource(audioElement);

// 소리를 오디오 컨텍스트 출력으로 연결
sourceNode.connect(audioContext.destination);
```

### 해결 전 코드

```
import { useEffect, useRef, useState } from "react";
import style from "./AudioVisualizer.module.css";
import { useMusicList } from "../context/MusicProvider";

function AudioVisualizer({ audio }) {
  const { current } = useMusicList();
  const canvasRef = useRef();
  const [audioContext, setAudioContext] = useState(null); // Web Audio API 컨텍스트
  const [analyser, setAnalyser] = useState(null); // 주파수 분석기
  // const [source, setSource] = useState(null); // MediaElementAudioSourceNode 저장

  useEffect(() => {
    // Web Audio API 초기화
    // audio.current -> HTMLMediaElement 객체(<audio> 태그 )
    if (audio.current) {
      const context = audioContext; // 크로스 브라우저 지원을 위해 두 가지 버전 모두 포함
      const analyserNode = analyser; // 분석기 생성

      const source = context.createMediaElementSource(audio?.current); // MediaElementSourceNode 생성
      // -> Web Audio API에서 하나의 HTMLMediaElement는 단 하나의 MediaElementSourceNode에만 연결될 수 있다. 중복 연결 시 에러 발생

      source.connect(analyserNode);
      analyserNode.connect(context.destination);

      analyserNode.fftSize = 256; // FFT 크기 설정 (시각화의 해상도에 영향)
      setAudioContext(context);
      setAnalyser(analyserNode);
    }
  }, []);

  function drawVisualizer() {
    if (!analyser || !canvasRef?.current) return;

    const canvas = canvasRef?.current;
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
        ctx.fillStyle = rgb(0, 0, ${barHeight + 140});
        ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
        x += barWidth + 1;
      }

      requestAnimationFrame(draw);
    };
    draw();
  }

  useEffect(() => {
    drawVisualizer();
  }, [analyser]);

  return (
    <canvas
      className={${style.audioVisualizer}}
      ref={canvasRef}
      width={280}
      height={230}
    ></canvas>
  );
}

export default AudioVisualizer;

```

### 해결 후 코드

```
import { useEffect, useRef, useState } from "react";
import style from "./AudioVisualizer.module.css";
import { useMusicList } from "../context/MusicProvider";

function AudioVisualizer({ audio }) {
  const { current } = useMusicList();
  const canvasRef = useRef();
  const audioSourceRef = useRef(null); // MediaElementSourceNode를 추적
  const [audioContext, setAudioContext] = useState(null);
  const [analyser, setAnalyser] = useState(null);

  useEffect(() => {
    if (audio.current && !audioContext) {
      // Web Audio API 초기화
      const context = new (window.AudioContext || window.webkitAudioContext)();
      const analyserNode = context.createAnalyser();

      analyserNode.fftSize = 256; // FFT 크기 설정 (시각화의 해상도에 영향)

      setAudioContext(context);
      setAnalyser(analyserNode);
    }
  }, [audio, audioContext]);

  useEffect(() => {
    if (audioContext && analyser && audio.current) {
      // 기존 MediaElementSourceNode 해제 방지
      if (!audioSourceRef.current) {
        const source = audioContext.createMediaElementSource(audio.current);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        audioSourceRef.current = source; // 연결된 소스 저장
      }
    }
  }, [audioContext, analyser, audio]);

  const drawVisualizer = () => {
    if (!analyser || !canvasRef?.current) return;

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
        ctx.fillStyle = `rgb(0, 0, ${barHeight + 140})`;
        ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
        x += barWidth + 1;
      }

      requestAnimationFrame(draw);
    };
    draw();
  };

  useEffect(() => {
    drawVisualizer();
  }, [analyser]);

  return (
    <canvas
      className={`${style.audioVisualizer}`}
      ref={canvasRef}
      width={280}
      height={230}
    ></canvas>
  );
}

export default AudioVisualizer;
```

### 수정 내용

1. audioSourceRef 추가

   useRef를 사용해 MediaElementAudioSourceNode를 저장.
   audioContext.createMediaElementSource가 중복 호출되지 않도록 기존 소스를 재사용.

2. useEffect 조건부 실행

   audioSourceRef.current를 확인하여 이미 연결된 경우 추가 생성 방지.

3. AudioContext와 AnalyserNode 분리 초기화

   audioContext와 analyser는 별도의 useState로 관리하여 초기화 순서 문제 방지.

## AnalyserNode 연결 문제

```
const source = audioContext.createMediaElementSource(audio.current);
```

위 코드에서 useRef로 저장한 `<audio>` 요소(audio.current)가 아닌 new Audio로 생성한 객체를 전달하여 AnalyserNode가 오디오 데이터를 제대로 수집하지 못해 비주얼라이저가 제대로 출력되지 않음. `<audio>` 요소를 전달해줌으로서 해결

## 음악 속도 조절 ✅

1. Web Audio API와 Tone.js 혼합 사용하여 충돌 발생. -> Tonejs는 로드 시 AudioContext를 자체적으로 생성함. 따라서 Web Audio API에서 생성한 AudioContext와 충돌 발생. Tone.js

## 음악 높낮이(pitch) 조절 ❌

음 높낮이를 조절(pitch shifting)하려면 **타임 스트레칭(Time Stretching)**과 **주파수 이동(Frequency Shifting)**을 사용해야 합니다. 이는 Web Audio API의 기본 제공 노드로는 어렵고, 복잡한 신호 처리가 필요합니다.

### 가능한 방법:

1. DSP(Digital Signal Processing) 라이브러리 사용:

```
   Pitch.js
   Tone.js
   Sonic.js
```

2. AudioWorkletProcessor로 직접 구현:

FFT(고속 푸리에 변환) 또는 Phase Vocoder 알고리즘을 사용하여 신호를 분석하고 재구성합니다.
Web Audio API에서는 매우 낮은 레벨에서 작업해야 하므로 복잡도가 높습니다.

## Edge, Opera 브라우저에서 재생 안되는 문제 ❌

## 오디오 파일

URL.createObjectURL()로 생성한 URL은 blob:으로 시작하며 이는 브라우저의 메모리 내에서 동적으로 생성된 URL이다. 따라서 브라우저가 종료되면 무효화 된다.
