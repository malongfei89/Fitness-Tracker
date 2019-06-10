const express = require('../node_modules/express')
const app = express()
const morgan = require('../node_modules/morgan')
const cors = require('../node_modules/cors')
const bodyparser = require('../node_modules/body-parser')
const handleHttpRequest = require('./controller/handleHttpRequests')
const handleWsRequest = require('./controller/handleWsRequest')
const jwt = require('../node_modules/jsonwebtoken')
const CustomError = require('./models/CustomError')
const server = require('http').Server(app)
const io = require('../node_modules/socket.io')(server)

server.listen(3000, () => console.log('Listening at port 3000'))
io.on('connection', handleWsRequest)
/* io.on('connection', (socket) => {
  console.log(socket.id)
}) */
app.use(morgan('combined'))
app.use(cors())
app.use(bodyparser.json())
app.use((req, res, next) => {
  try {
    const token = (req.headers.authorization || '').split(' ')[1]
    jwt.verify(token, process.env.Secret)
    next()
  } catch (error) {
    const allowedActions = ['POST/register', 'POST/login']
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
