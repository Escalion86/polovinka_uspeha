import { useEffect, useState } from 'react'
import io from 'socket.io-client'
let socket

const Home = () => {
  const [input, setInput] = useState('')

  useEffect(() => {
    const socketInitializer = async () => {
      await fetch('/api/websocket')
      socket = io()

      socket.on('connect', () => {
        console.log('connected')
      })

      socket.on('update-input', (msg) => {
        setInput(msg)
      })
    }

    socketInitializer()
  }, [])

  const onChangeHandler = (e) => {
    const value = e.target.value
    setInput(value)
    socket.emit('input-change', value)
  }

  return (
    <input
      placeholder="Type something"
      value={input}
      onChange={onChangeHandler}
    />
  )
}

export default Home
