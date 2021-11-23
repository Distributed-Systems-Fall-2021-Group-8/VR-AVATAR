import React, { useState, useEffect } from "react"
import socketIOClient from "socket.io-client"

const App = () => {
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState("")
  const [position, setPosition] = useState({ "x": 0, "y": 0 })
  const [players, setPlayers] = useState([])
  const [name, setName] = useState("")
  const [timer, setTimer] = useState(null)
  useEffect(() => {
    const socket = socketIOClient("http://localhost:3000")
    socket.on("connect", data => {
      setConnected("yes")
    })
    socket.on("name", (response) => {
      setName(response.name)
    })
    socket.on("positionsChange", (response) => {
      setPlayers(response.playersArray)
    })
    setSocket(socket)
  }, [])
  useEffect(() => {
    if (socket) {
      if (timer) {
        clearInterval(timer)
      }
      const newTimer = setInterval(() => {
        socket.volatile.emit("positionChange", { name, x: position.x, y: position.y })
      }, 500)
      setTimer(newTimer)
    }
  }, [socket, name, position]) // eslint-disable-line
  return (
    <div>
      <div>Connected: {connected} and name: {name}</div>
      <div>Own Position: x: {position.x} y:{position.y}</div>
      <button onClick={() => setPosition({ x: position.x, y: (position.y + 1) })}>Up</button>
      <button onClick={() => setPosition({ x: position.x, y: (position.y - 1) })}>Down</button>
      <button onClick={() => setPosition({ x: (position.x - 1), y: (position.y) })}>Left</button>
      <button onClick={() => setPosition({ x: (position.x + 1), y: (position.y) })}>Right</button>
      <div>All positions: </div>
      <table>
        <thead>
          <tr>
            <th>name</th>
            <th>x</th>
            <th>y</th>
          </tr>
        </thead>
        <tbody>
          {players.map(player =>
            <tr>
              <td>{player.name}</td>
              <td>{player.x}</td>
              <td>{player.y}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default App
