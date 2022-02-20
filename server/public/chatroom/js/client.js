'use strict'

const username = document.querySelector('input#username')
const inputRoom = document.querySelector('input#room')
const btnConnect = document.querySelector('button#connect')
const outputArea = document.querySelector('textarea#output')
const inputArea = document.querySelector('textarea#input')
const btnSend = document.querySelector('button#send')

let socket, room

btnConnect.onclick = () => {
  // 创建链接 connect
  socket = io.connect()
  // 接收消息 message
  socket.on('joined', (room, socketId) => {
    btnConnect.disabled = true
    inputArea.disabled = false
    btnSend.disabled = false
  })

  socket.on('leaved', (room, socketId) => {
    btnConnect.disabled = false
    inputArea.disabled = true
    btnSend.disabled = true
  })

  socket.on('message', (room, data) => {
    outputArea.value += data + '\r'
  })
  // 发送消息 send
  room = inputRoom.value
  socket.emit('join', room)
}

btnSend.onclick = () => {
  let data = inputArea.value
  data = username.value + ': ' + data
  socket.emit('message', room, data)
}
