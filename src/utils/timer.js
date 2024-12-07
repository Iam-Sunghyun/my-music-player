// 초단위 시간 값 mm:ss 형식으로 변환하는 함수
const timer = (time) => {
  let min = Math.floor(time / 60) === 0 ? "0" : Math.floor(time / 60);
  let sec = Math.floor(time) % 60 === 0 ? "0" : Math.floor(time) % 60;
  if (sec < 10) sec = "0" + sec;
  if (min < 10) min = "0" + min;
  return `${min}:${sec}`;
};

export default timer;
