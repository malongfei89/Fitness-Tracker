const user = require('../models/user')
let numOfSocket = 0
module.exports = (socket) => {
  numOfSocket++
  console.log(numOfSocket + ' connected')
  socket.on('disconnect', () => {
    numOfSocket--
      console.log(numOfSocket + ' connected')
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
