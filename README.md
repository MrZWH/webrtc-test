# webRTC

## MediaStream

### 方法

- MediaStream.addTrack()
- MediaStream.removeTrack()
- MediaStream.getVideoTracks()
- MediaStream.getAudioTracks()

### 事件

- MediaStream.onaddtrack
- MediaStream.onremovetrack
- MediaStream.onended

## MediaRecoder 录制媒体流

## getDisplayMedia 捕获桌面

```js
var promise = navigator.mediaDevices.getDisplayMedia(constraints);
```

浏览器输入 edge://flags/#enable-experimental-web-platform 开启实验属性
