'use strct'

const videoplay = document.querySelector('video#player')
const audioSource = document.querySelector('select#audioSource')
const audioOutput = document.querySelector('select#audioOutput')
const videoSource = document.querySelector('select#videoSource')


function gotMediaStream(stream) {
  videoplay.srcObject = stream
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
        width: 640,
        height: 480,
        // 帧率
        frameRater: 30,
        // 前后置摄像头 前置 user 后置 env
        facingMode: 'enviroment',
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

videoSource.onchange = start;
