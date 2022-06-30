const app = require('express')()
const socket = require('socket.io')
let server = null
let io = null

app.all('/init', (req, res) => {
  if (!server) {
    server = res.socket.server
    io = socket(server)

    io.on('connection', function (socket) {
      console.log('Made socket connection');

      socket.on('ev', msg => {
        socket.broadcast.emit('ev', msg);
      });

      socket.on('disconnect', () => console.log('disconnected'))
    })
  }

  res.json({ msg: 'server is set' })
})

module.exports = app
