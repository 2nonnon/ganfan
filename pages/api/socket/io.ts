import { Server } from 'socket.io'
import type { NextApiRequest } from 'next'
import type {
  ClientToServerEvents,
  NextApiResponseWithSocket,
  ServerToClientEvents,
} from '@/types/socketCustomTypes'

const ioHandler = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (!res.socket.server.io) {
    console.log('*First use, starting socket.io')

    const io = new Server<ClientToServerEvents, ServerToClientEvents>(
      res.socket.server,
      {
        path: '/api/socket/io',
        addTrailingSlash: false,
        cors: {
          origin: 'https://ganfan-flame.vercel.app',
          methods: ['GET', 'POST'],
          credentials: true,
        },
      },
    )

    io.on('connection', (socket) => {
      console.log('A user connected', socket.id)

      socket.broadcast.emit('userServerConnection')

      socket.on('hello', (msg) => {
        console.log('hello', msg)

        socket.emit('hello', msg)
        socket.broadcast.emit('hello', msg)
      })

      socket.on('disconnect', () => {
        console.log('A user disconnected', socket.id)

        socket.broadcast.emit('userServerDisconnection', socket.id)
      })
    })

    res.socket.server.io = io
  }

  res.end()
}

export const config = {
  api: {
    bodyParser: false,
  },
}

export default ioHandler
