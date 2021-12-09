
const initializeClientCommunication = (io, playersArray) => {
    
    io.on('connection', (socket) => {
        //here should be message to matchmaker about new player count and maybe message to other clients about someone joining
        newPlayer = { id: socket.id, name: socket.handshake.query.name, x: socket.handshake.query.x, y: socket.handshake.query.y }
        playersArray = playersArray.concat(newPlayer)
        console.log(`user ${JSON.stringify(newPlayer)} connected`)
        socket.on('disconnect', () => {
            //here should be message to matchmaker about new player count and maybe message to other clients about someone disconnecting
            disconnectedPlayer = playersArray.filter(player => player.id == socket.id)
            playersArray = playersArray.filter(player => player.id != socket.id)
            console.log(`user ${JSON.stringify(disconnectedPlayer)} disconnected`)
        })
        socket.on("initialize", (response) => {
            playersArray = playersArray.map(player => player.id == socket.id ? { ...player, name: response.name, y: response.y, x: response.x } : player)

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
        io.volatile.emit("positionsChange", playersJSON)
    }, 500)
}

module.exports = { initializeClientCommunication }