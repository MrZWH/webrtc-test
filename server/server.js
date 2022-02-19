const http = require('http')
const https = require('https')
const fs = require('fs')
const express = require('express')
const serveIndex = require('serve-index')
const socketIo = require('socket.io')
const log4js = require('log4js')

var logger = log4js.getLogger();

log4js.configure({
  appenders: {
    cheese: {
      type: "file", filename: "cheese.log", layout: {
        type: 'pattern',
        pattern: '%r %p - %m'
      }
    }
  },
  categories: { default: { appenders: ["cheese"], level: "debug" } }
});

const app = express()
app.use(serveIndex('./public'))
app.use(express.static('./public'))

const option = {
  key: fs.readFileSync('./cert/1557605_www.learningrtc.cn.key'),
  cert: fs.readFileSync('./cert/1557605_www.learningrtc.cn.pem')
}

const http_server = http.createServer(app)
http_server.listen(80, '0.0.0.0')

const https_server = https.createServer(option, app)
https_server.listen(443, '0.0.0.0')

const io = socketIo.listen(https_server)
io.sockets.on('connection', (socket) => {
  socket.on('join', room => {
    socket.join(room);
    const myRoom = io.sockets.adapter.rooms[room]
    const users = Object.keys(myRoom.sockets).length

    logger.log('房间里的用户数是', users)

    // socket.emit('joined', room, socket.id)
    // socket.to(room).emit('joined', room, socket.id)
    // io.in(room).emit('joined', room, socket.id)
    socket.broadcast.emit('joined', room, socket.id)
  })
  socket.on('leave', room => {
    const myRoom = io.sockets.adapter.rooms[room]
    const users = Object.keys(myRoom.sockets).length
    logger.log('房间里的用户数是', users - 1)

    socket.leave(room);
    // socket.emit('joined', room, socket.id)
    // socket.to(room).emit('joined', room, socket.id)
    // io.in(room).emit('joined', room, socket.id)
    socket.broadcast.emit('joined', room, socket.id)
  })
})
