const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const cors = require('cors')
app.use(cors())
const io = require("socket.io")(server, {
    cors: true,
    origins: "*/*"
})
let playersJSON = {
    playersArray: []
}
const uuid = require('uuid').v4
io.on('connection', (socket) => {
    console.log('a user connected')
    //here should be message to matchmaker about new player count and maybe message to other clients about someone joining
    const name = uuid()
    socket.emit("name", { name })
    playersJSON = { playersArray: playersJSON.playersArray.concat({ name: name, x: 0, y: 0 }) }
    socket.on('disconnect', () => {
        //here should be message to matchmaker about new player count and maybe message to other clients about someone disconnecting
        //also remove player from array
        console.log('user disconnected')
    })
    socket.on("positionChange", (response) => {
        playersJSON = { playersArray: playersJSON.playersArray.map(player => player.name == response.name ? response : player) }

    })
})

setInterval(() => {
    io.volatile.emit("positionsChange", playersJSON)
}, 500)

io.listen(3000)