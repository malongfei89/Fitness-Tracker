const user = require('../user')
const express = require('express')
const app = express.Router()

app.post('/register', (req, res) => {
  user.adduser(req.body, (err, data) => {
    if (err) res.status(400).send({
      error: 'The email is already in use!'
    })
    else res.send(data)
  })
})
app.post('/login', (req, res) => {
  user.checkuser(req.body, (err, data) => {
    if (err) res.status(400).send(err.sqlMessage)
    else res.send(data)
  })
})
