import io from 'socket.io-client'
export default {
  currentSocket: null,
  create: () => {
    return io('localhost:3000')
  }
}
