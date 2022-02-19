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

## socket.io 聊天室实现

socket.io 是 websocket 超集，底层使用的是 tcp 协议，保证消息的可靠传输

### 服务端消息处理

- socket.emit() 给本次链接发送消息
- io.in(room).emit() 给某个房间内所有人发送消息
- socket.to(room).emit() 除本链接外，给某个房间内所有人发送消息
- socket.broadcast.emit() 除本链接外，给所有人发送消息

### 客户端消息处理

发送 action 命令，还有两个数据
Server: socket.emit('action', data1, data2);
Client: socket.on('action', function(data1, data2) {});

发送了 action 命令，在 emit 方法中包含回调函数
Server: socket.emit('action', data1, function(arg1, arg2){...});
Client: socket.on('action', function(data1, fn) {fn('a','b')});

## WebRTC 信令服务器
