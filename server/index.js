const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const bodyparser = require('body-parser')
const app = express()
const handlerequest = require('./controller/handlerequests')
const jwt = require('jsonwebtoken')
const CustomError = require('./models/CustomError')

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
app.use('/', handlerequest)
app.get('/', (req, res) => {
  res.send("Hello!")
})
app.use((err, req, res, next) => {
  console.log(err)
  if (err.name === 'CustomError') res.status(err.status).send({error: err.message})
  else res.status(500).send({error :'Internal error, please try again later!'})
})
app.listen(3000, () => console.log('Listening at port 3000'))
