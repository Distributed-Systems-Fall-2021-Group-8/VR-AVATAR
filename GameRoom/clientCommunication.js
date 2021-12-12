const { emit } = require("nodemon")

const initializeClientCommunication = (io, playersArray) => {

    io.on('connection', (socket) => {
        //here should be message to matchmaker about new player count and maybe message to other clients about someone joining
        //newPlayer = { id: socket.id, name: socket.handshake.query.name, x: socket.handshake.query.x, y: socket.handshake.query.y }
        //playersArray = playersArray.concat(newPlayer)
        //console.log(`user ${JSON.stringify(newPlayer)} connected`)
        console.log(`user ${socket.handshake.address} connected`)
        socket.on('disconnect', () => {
            //here should be message to matchmaker about new player count and maybe message to other clients about someone disconnecting
            disconnectedPlayer = playersArray.filter(player => player.id == socket.id)
            playersArray = playersArray.filter(player => player.id != socket.id)
            io.emit("playerLeave", { playerID: socket.id })
            console.log(`user ${JSON.stringify({ ...disconnectedPlayer, ip: socket.handshake.address })} disconnected`)
        })
        socket.on("playerJoin", (response) => {
            //playersArray = playersArray.map(player => player.id == socket.id ? { ...player, name: response.name, y: response.y, x: response.x } : player)
            if(playersArray.filter(player => player.id == socket.id).length == 0) {
                newPlayer = { id: socket.id, name: response.name, x: response.x, y: response.y }
                playersArray = playersArray.concat(newPlayer)
                let playersJSON = { playersArray }
                socket.emit("joinPlayersList", playersJSON)
                io.emit("playerJoin", newPlayer)
            }
           
        })
        socket.on("positionChange", (response) => {
            playersArray = playersArray.map(player => player.id == socket.id ? { ...player, y: response.y, x: response.x } : player)

        })
        socket.on("sendChatMessage", (response) => {
            io.emit("receiveChatMessage", response)
        })
    })

    setInterval(() => {
        let playersJSON = { playersArray }
        io.emit("positionsChange", playersJSON)
    }, 500)
}

module.exports = { initializeClientCommunication }