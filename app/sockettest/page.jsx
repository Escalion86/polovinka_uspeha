'use client'

import { useEffect, useState } from 'react'
import io from 'socket.io-client'

let socket

export default function SocketTestPage() {
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

    return () => {
      socket?.off('update-input')
      socket?.disconnect()
    }
  }, [])

  const onChangeHandler = (e) => {
    const value = e.target.value
    setInput(value)
    socket?.emit('input-change', value)
  }

  return (
    <input
      placeholder="Type something"
      value={input}
      onChange={onChangeHandler}
    />
  )
}
