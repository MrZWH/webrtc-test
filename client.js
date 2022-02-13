'use strct'

const videoplay = document.querySelector('video#player')
// const audioplay = document.querySelector('audio#audioplayer')

const divConstraints = document.querySelector('div#constraints')

// devices
const audioSource = document.querySelector('select#audioSource')
const audioOutput = document.querySelector('select#audioOutput')
const videoSource = document.querySelector('select#videoSource')
// filter
const filtersSelect = document.querySelector('select#filter')

// picture
const snapshot = document.querySelector('button#snapshot')
const picture = document.querySelector('canvas#picture')
picture.width = 320;
picture.height = 240;

// record
const recvideo = document.querySelector('video#recplayer')
const btnRecord = document.querySelector('button#record')
const btnPlay = document.querySelector('button#recplay')
const btnDownload = document.querySelector('button#download')

// 二进制数组
let buffer;

let mediaRecorder;

// 这里的 stream 就是 MediaStream
function gotMediaStream(stream) {
  window.stream = stream

  videoplay.srcObject = stream

  const videoTrack = stream.getVideoTracks()[0]
  const videoConstraints = videoTrack.getSettings();
  divConstraints.textContent = JSON.stringify(videoConstraints, null, 2);

  // 用于只获取音频
  // audioplay.srcObject = stream
  return navigator.mediaDevices.enumerateDevices();
}

function gotDevices(deviceInfos) {

  deviceInfos.forEach(function (deviceInfo) {
    const option = document.createElement('option')
    option.text = deviceInfo.label;
    option.value = deviceInfo.deviceId;

    if (deviceInfo.kind === 'audioinput') {
      audioSource.appendChild(option)
    } else if (deviceInfo.kind === 'audiooutput') {
      audioOutput.appendChild(option)
    } else if (deviceInfo.kind === 'videoinput') {
      videoSource.appendChild(option)
    }
  })
}

function handleError(err) {
  console.log('getUserMedia error: ', err);
}

function start() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.log('getUserMedia is not supported');
    return;
  } else {
    const deviceId = videoSource.value
    let constrants = {
      video: {
        // width: 640,
        // height: 480,
        // 帧率
        // frameRater: 10,
        // 前后置摄像头 前置 user 后置 env
        facingMode: 'environment',
        deviceId: deviceId || undefined
      },
      // volume 音量 0 ~ 1
      // sampleRate 采样率
      // sampleSize 位深
      // echoCancellation 回音
      // autoGainControl 音量自动增强
      // noiseSuppression 降噪
      // latency 延迟大小
      // channelCount 单双声道
      // deviceID 
      // groupID 同一个物理设备
      audio: {
        noiseSuppression: true,
        echoCancellation: true
      }
    }
    navigator.mediaDevices.getUserMedia(constrants)
      .then(gotMediaStream)
      .then(gotDevices)
      .catch(handleError)
  }
}

start();

videoSource.onchange = start;

filtersSelect.onchange = function () {
  videoplay.className = filtersSelect.value
}

snapshot.onclick = function () {
  picture.className = filtersSelect.value
  picture.getContext('2d').drawImage(videoplay, 0, 0, picture.width, picture.height)
}

function handleDataAvailable(e) {
  if (e && e.data && e.data.size > 0) {
    buffer.push(e.data);
  }
}

function startRecord() {
  buffer = []

  const options = {
    mimeType: 'video/webm;codecs=vp8'
  }

  if (!MediaRecorder.isTypeSupported(options.mimeType)) {
    console.error(options.mimeType + '不支持');
    return
  }

  try {
    mediaRecorder = new MediaRecorder(window.stream, options)
  } catch (error) {
    console.error('创建 MediaRecorder 失败', error);
    return
  }

  mediaRecorder.ondataavailable = handleDataAvailable
  mediaRecorder.start(10)

}

function stopRecord() {
  mediaRecorder.stop()
}

btnRecord.onclick = () => {
  if (btnRecord.textContent === '开始录制') {
    startRecord()
    btnRecord.textContent = '停止录制'
    btnPlay.disabled = true;
    btnDownload.disabled = true;
  } else {
    stopRecord()
    btnRecord.textContent = '开始录制'
    btnPlay.disabled = false;
    btnDownload.disabled = false;
  }
}

btnPlay.onclick = () => {
  const blob = new Blob(buffer, {
    type: 'video/webm'
  })

  recvideo.src = window.URL.createObjectURL(blob)
  recvideo.srcObject = null;
  recvideo.controls = true;
  recvideo.play()
}

btnDownload.onclick = () => {
  const blob = new Blob(buffer, {
    type: 'video/wbem'
  })

  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url;
  a.style.display = 'none'
  a.download = 'aaa.webm'
  a.click()
}
