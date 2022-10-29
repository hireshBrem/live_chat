import { Server } from 'socket.io'

const SocketHandler = async (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
    console.log("Dwd")
  } else {
    console.log('Socket is initializing')

    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on('connection', socket => {

      socket.on("join-room", (id, name) => {
        socket.join(id)
        console.log(`User ${name}, has joined with room ID: ${id}.`)
      })

      socket.on("send-msg", (id, currentMsgs, msg) => {
        socket.in(id).emit("display-msg", [...currentMsgs, msg])
        console.log(`All clients in room ${id}, have been sent a message: ${msg}`)
      })

    })
  }
  // console.log(process.env.DEBUG)
  res.end()
}

export default SocketHandler
