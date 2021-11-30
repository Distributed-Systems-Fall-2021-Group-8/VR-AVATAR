import React, { useState, useEffect, useRef } from "react"
import socketIOClient from "socket.io-client"

const App = () => {
  const [connected, setConnected] = useState("")
  const [position, setPosition] = useState({ "x": 0, "y": 0 })
  const [players, setPlayers] = useState([])
  const [chat, setChat] = useState([])
  const [chatMessage, setChatMessage] = useState("")
  const [name, setName] = useState((Math.random() + 1).toString(36).substring(7))// eslint-disable-line
  const [timer, setTimer] = useState(null)
  const socketRef = useRef()
  useEffect(() => {
    socketRef.current = socketIOClient("http://localhost:3000", { query: `name=${name}&x=${position.x}&y=${position.y}` })
    return () => socketRef.current.disconnect()
  }, []) // eslint-disable-line
  useEffect(() => {
    socketRef.current.on("connect", data => {
      setConnected("yes")
    })
    socketRef.current.on("positionsChange", (response) => {
      setPlayers(response.playersArray)
    })
    socketRef.current.on("receiveChatMessage", (response) => {
      setChat([...chat, response])
    })
  }, [chat, players])

  useEffect(() => {
    if (socketRef.current) {
      if (timer) {
        clearInterval(timer)
      }
      const newTimer = setInterval(() => {
        socketRef.current.volatile.emit("positionChange", { x: position.x, y: position.y })
      }, 500)
      setTimer(newTimer)
    }
  }, [name, position]) // eslint-disable-line
  const submitChatMessage = (e) => {
    e.preventDefault()
    socketRef.current.emit("sendChatMessage", { content: chatMessage, name })
  }
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
      <div>Chat: </div>
      <ul>
        {chat.map(message =>
          <li>
            {`${message.content} -${message.name}`}
          </li>
        )}
      </ul>
      <form onSubmit={submitChatMessage}>
        <input type="text" name="content" onChange={e => setChatMessage(e.target.value)} />
        <input type="submit" value="send" />
      </form>
    </div>
  )
}

export default App
