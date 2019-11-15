import io from 'socket.io-client'
export default {
  currentSocket: null,
  create: () => {
    return io('http://ec2-3-134-94-92.us-east-2.compute.amazonaws.com:3000')
  }
}
