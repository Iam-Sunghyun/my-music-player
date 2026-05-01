# 사용 기술

- React
- css-modules
- context API
- Web Audio API
- canvas API
- vite
- react-hot-toast
  <!-- - tone.js(피치 시프팅) -->

# 동기

<!-- 실행 시 바로 재생할 수 있게 기본 음악 1~2개 정도 추가하기 -->

평소 가사가 없는 lofi 음악을 자주 듣기 때문에 음악 플레이어를 만들어 보고 싶었다.

음악을 추가하고 재생하는 기본적인 앱을 만든 후 좀 더 깊이 있게 만들고 싶어져 비주얼라이저와 이퀄라이저 기능을 추가하였다.

구글 검색으로 디자인을 참고했고 기능 구현은 직접 하였다.

가장 익숙하고 많이 사용되는 React를 사용해 UI를 구현하였고 CSS Modules를 사용하여 순수 CSS의 감을 잃지 않고자 하였다.

또한 Web Audio API와 sessionStorage를 사용하여 브라우저에서 제공되는 기능들을 경험할 수 있었다.

# 기능

## popUp 메뉴들(이퀄라이저, 플레이리스트) tap 키 눌렀을 때 밖으로 빠져나오는 현상 ✅

<!-- *** 미해결 *** -->

transition과 transform을 통해 메뉴를 하단에서 부드럽게 끌어올리는 효과를 주기 위해 display: none, visibility: hidden이 아닌 상태로 숨겨져 있었음. 따라서 탭 키를 누르면 포커스 되어 밖으로 빠져 나와버리는 현상 발생 ->
useEffect와 타이머를 이용해 popIn(메뉴 닫기) 시 0.3초 뒤 visibility: hidden 되게 만들어 부드럽게 내려서 사라지는 효과는 보여지고, 다 사라졌을 시 hidden되어 포커스는 잡히지 않게 만듦.

## 드래그앤드롭 파일 업로드 ✅

<!--  -->

## canvas API 기본적인 사용법

<!--  -->

## requestAnimationFrame 사용법

<!--  -->

## 반응형(미디어 쿼리) ✅ ->

<!-- 플레이 리스트를 하나의 컴포넌트로 재사용하려 했으나(화면이 축소됐을 떄 하단 슬라이드 리스트, 큰 화면 그냥 리스트) display 속성이 동일하게 적용되어 반응형 페이지 생성에 문제가 생기게 됨. 따라서 플레이 리스트의 내부 리스트만 컴포넌트로 추출하여 재사용하고 껍데기는 따로 생성해주었다. -->

## 플레이 리스트 음악 추가/삭제 ✅ ->

음악 리스트, 현재 선택된 음악 관련 정보는 sessionStorage, context API에 저장하여 관리하였으며 Context의 경우 가독성을 위해 래퍼 컴포넌트 따로 분리하여 주었다.

## 음악 삭제 시 문제 ✅ ->

1. 방금 추가한 음악을 삭제후 동일한 음악을 다시 추가했을 시 추가되지 않는 문제 발생.

   -> input[type="file"] 요소에 같은 파일을 업로드 하면 onChange 이벤트가 발생하지 않는다. 따라서 파일 sessionStorage에 저장 후 input[type="file"]의 값을 가리키는 event.target.value를 null로 초기화해주어 동일한 파일이 삭제 후 다시 업로드 되어도 onChange 이벤트가 발생하지 않는 일이 없도록 해주었다.

2. URL.createObjectURL()로 생성한 blob URL이 새로고침 혹은 사이트 재접속 하면(해당 페이지의 document가 사라지면) 무효화되는 문제

   -> localStorage에서 sessionStorage로 변경

## 음악 루프, 셔플 ✅

## 볼륨 조절, 노래 이전, 후로 넘기기 ✅

## 컨트롤바, 커스텀 프로그레스바, 타이머 ✅

## 오디오 비주얼라이저 및 이퀄라이저✅

<!-- 절차 디테일 필요 -->

1. 음악을 폴더로부터 추가하고 선택.
2. 음악 선택 시 useAudioContext 커스텀 훅 내에 오디오 컨텍스트(window.AudioContext)와 오디오 이퀄라이저 노드(좌우 밸런스, 특정 주파수 값 조절 노드), 비주얼라이저를 위한 주파수 데이터를 담고있는 분석기 노드를 생성하는 useEffect 조건문 실행.
3. 오디오 노드들이 생성되면 useAudioContext내에 오디오 그래프를 생성하고 모두 연결하는 useEffect 조건문 실행.
4. 오디오 노드들을 state에 저장하여 불필요하게 재생성 되지 않도록 하고 마지막에 return하여 필요한 컴포넌트에서 값을 조절할 수 있게 하였다.

### 에러

InvalidStateError: Failed to execute 'createMediaElementSource' on 'AudioContext': HTMLMediaElement already connected previously to a different MediaElementSourceNode.
at... 에러 발생.

### 원인

InvalidStateError는 동일한 HTMLAudioElement(`<audio>` 요소)가 이미 다른 오디오 소스 노드(MediaElementAudioSourceNode)에 연결되어 있을 때 발생한다. Web Audio API에서 하나의 `<audio>`(HTMLAudioElement)는 단 하나의 오디오 소스 노드(MediaElementAudioSourceNode)에 연결될 수 있다.

이를 해결하려면 오디오 컨텍스트(AudioContext)와 오디오 소스 노드(MediaElementAudioSourceNode)의 여러번 연결되지 않게 관리하거나, 새 연결을 생성할 때 기존 연결을 해제해야 한다.

정리 -> 음악이 변경될 때마다 오디오 소스 노드(MediaElementAudioSourceNode)가 생성 되었던 것을 useEffect 내에 조건문을 사용해 처음 한번만 생성하도록 수정

### HTMLMediaElement ?

HTMLMediaElement는 HTML에서 `<audio>`나 `<video>` 태그와 같은 미디어 요소를 나타내는 객체이다. 이는 오디오/비디오 파일을 재생하는 데 사용됨.

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

### MediaElementAudioSourceNode ?

MediaElementAudioSourceNode는 Web Audio API의 객체로, HTMLAudioElement에서 오디오 데이터를 가져와 오디오 소스 노드를 생성한다. 이를 통해 오디오 데이터를 분석하거나 조작이 가능해진다.

- 주요 특징

  Web Audio API의 일부. HTMLMediaElement의 소리를 오디오 그래프에 연결하여 필터링, 분석 가능. 하나의 HTMLMediaElement는 **하나의 MediaElementSourceNode 와만 연결 가능.**

- 생성 방법

  AudioContext의 createMediaElementSource() 메서드를 사용하여 생성 가능하다.

```
const audioElement = document.getElementById('myAudio');
const audioContext = new AudioContext();

// MediaElementSourceNode 생성
const sourceNode = audioContext.createMediaElementSource(audioElement);

// 소리를 오디오 컨텍스트 출력으로 연결
sourceNode.connect(audioContext.destination);
```

<!--
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

   audioContext와 analyser는 별도의 useState로 관리하여 초기화 순서 문제 방지. -->

<!-- ## AnalyserNode 연결 문제 ✅

`audioContext.createMediaElementSource()` 메서드에 `<audio>` 요소가 아닌 `new Audio()`로 생성한 객체를 전달하여 AnalyserNode가 오디오 주파수 데이터를 제대로 수집하지 못해 비주얼라이저가 제대로 출력되지 않음.

`<audio>` 요소를 전달 해줌으로서 해결. -->

## 음악 속도 조절 ✅

HTMLMediaElement playBackRate 프로퍼티를 통해 속도 조절.

## 배포 시 AudioContext가 사용자 상호작용 이전에 생성되어 음악이 재생되지 않는 문제 ✅

음악을 추가하고 음악을 선택한 이후(사용자 상호작용 후)에 AudioContext 생성하도록 하여 해결.

## 오디오 파일

URL.createObjectURL()로 생성한 URL은 blob:으로 시작하며 이는 브라우저의 메모리 내에서 동적으로 생성된 URL이다. 따라서 브라우저가 종료되거나 document가 사라지면(새로고침) 무효화 된다.
