const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const bodyparser = require('body-parser')
const handleHttpRequest = require('./controller/handleHttpRequests')
const handleWsRequest = require('./controller/handleWsRequest')
const jwt = require('jsonwebtoken')
const CustomError = require('./models/CustomError')
const server = require('http').Server(app)
const io = require('socket.io')(server)
const fs = require('fs')
const history = require('connect-history-api-fallback')

server.listen(3000, () => console.log('Listening at port 3000'))
// app.use(express.static(__dirname + "/public"))
app.get('/', (req, res) => {

})
io.on('connection', handleWsRequest)
/* io.on('connection', (socket) => {
  console.log(socket.id)
}) */
app.use(morgan('combined'))
app.use(cors())
app.use(history())
app.use(bodyparser.json())
app.use((req, res, next) => {
  try {
    // console.log(req.path)
    const token = (req.headers.authorization || '').split(' ')[1]
    jwt.verify(token, process.env.Secret)
    next()
  } catch (error) {
    const allowedActions = ['POST/register', 'POST/login', 'GET/forgetPW', 'PATCH/forgetPW']
  
    if (!allowedActions.includes(req.method + req.path)) next(new CustomError('Log in required!', 401))
    next()
  }
})
app.use('/', handleHttpRequest)
app.use((err, req, res, next) => {
  if (err.name === 'CustomError') res.status(err.status).send({error: err.message})
  else {
    console.log(err.message)
    res.status(500).send({error :'Internal error, please try again later!'})
  }
})
