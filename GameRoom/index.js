const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const cors = require('cors')
app.use(cors())
const io = require("socket.io")(server, {
    //cors: true,
    //origins: "*/*",
    cors: {
        origin: "*/*",    
        methods: ["GET", "POST"]
    }
    
})
let playersArray = []   // Contains player objects {id, name, x, y} id is not sent to players
const clientCommunication = require('./clientCommunication.js')
clientCommunication.initializeClientCommunication(io, playersArray)
io.listen(3000)
console.log("listening in port 3000")