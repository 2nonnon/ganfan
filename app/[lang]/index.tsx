'use client'

import {
  useEffect, useRef, useState,
} from 'react'

import { type Socket, io } from 'socket.io-client'
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@/types/socketCustomTypes'
import type { Dictionary } from '@/dictionaries'
import useUserMedia from '@/hooks/useUserMedia'

export default function Home({ dictionary }: {
  dictionary: Dictionary
}): JSX.Element {
  const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null)
  const video = useRef<HTMLVideoElement>(null)

  const [message, setMessages] = useState<string[]>([])

  useEffect(() => {
    if (!socket) {
      const socketIns = io('https://ganfan-flame.vercel.app', {
        path: '/api/socket/io',
        addTrailingSlash: false,
        withCredentials: true,
      })

      socketIns.on('connect', () => {
        console.log('connected')
      })

      socketIns.on('hello', (msg: string) => {
        console.log('hello', msg)
        setMessages([...message, msg])
      })

      socketIns.on('userServerConnection', () => {
        console.log('a user connected (client)')
      })

      socketIns.on('userServerDisconnection', (socketid: string) => {
        console.log('a user disconnected (client)', socketid)
      })

      setSocket(socketIns)
    }

    return () => {
      if (socket) {
        socket.disconnect()
        setSocket(null)
      }
    }
  }, [])

  const handleClick = () => {
    socket?.emit('hello', 'Hello Kitty')
  }

  const [constraints] = useState({ audio: true, video: true })

  const [stream, , setActive] = useUserMedia(constraints)

  useEffect(() => {
    if (stream && video.current) {
      video.current.srcObject = stream

      video.current.onloadedmetadata = function () {
        video.current?.play()
      }
    }
  }, [stream])

  const startCapture = () => {
    setActive(true)
  }

  const endCapture = () => {
    setActive(false)
  }

  return (
    <>
      <div>{dictionary[404].title}</div>
      <div>
        {message.map((msg, i) => <div key={i}>{msg}</div>)}
      </div>
      <video muted width={500} height={300} ref={video}></video>
      <button
        onClick={handleClick}
      >
          Send Hello {'"'}Kitty{'"'}
      </button>
      <button onClick={startCapture}>start capture</button>
      <button onClick={endCapture}>end capture</button>
    </>
  )
}
