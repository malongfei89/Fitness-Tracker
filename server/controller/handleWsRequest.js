const user = require('../models/user')
module.exports = (socket) => {
  console.log('user connected')
  socket.on('disconnect', () => {
      console.log('user disconnected')
  })
  socket.on('newRequest', async (data) => {
    try {
      await user.addMessage(data)
      socket.broadcast.emit('newMessage', data.toId)
    } catch(error){
      socket.emit('duplicateRequest', error.message)
    }
  })
  socket.on('requestMade', async (data) => {
    try {
      await user.addNotification(data)
      socket.broadcast.emit('newResponse', data.fromId)
    } catch(error){
      socket.emit('unexpected', 'Internal error, please try again later!')
    }
  })
}
