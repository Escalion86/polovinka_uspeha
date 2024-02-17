// const { WebSocketServer } = require('ws')
// const http = require('http')
// const url = require('url')

// const server = http.createServer()
// const wsServer = new WebSocketServer({ server })
// const PORT = 8000

// wsServer.on('connection', (connection, request) => {
//   const { username } = url.parse(request.url, true).query
//   console.log({ username })
// })

// server.listen(PORT, () => {
//   console.log('Сервер запущен')
// })
import { Server } from 'socket.io'

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on('connection', (socket) => {
      socket.on('input-change', (msg) => {
        socket.broadcast.emit('update-input', msg)
      })
    })
  }
  res.end()
}

export default SocketHandler
