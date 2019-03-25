const user = require('../models/user')
const express = require('express')
const app = express.Router()
const bcrypt = require('bcrypt')

app.post('/register', (req, res) => {
  user.addUser(req.body, (err, data) => {
    if (err)
      res.status(403).send({
        error: 'The email is already in use!'
      })
    else res.send(data)
  })
})
app.post('/changepw', (req, res) => {
  user.changePw(req.body, (err, data) => {
    if (err) res.status(400).send(err)
    else res.send(data)
  })
})
app.post('/login', (req, res) => {
  user.checkUser(req.body, (err, data) => {
    if (err) res.status(400).send(err.sqlMessage)
    else {
      bcrypt.compare(req.body.password, data[0].password, (err, isMatch) => {
        if (isMatch) res.send(data[0])
        else res.status(400).send({
          error: 'Invalid log in credential!'
        })
      })
    }
  })
})
app.post('/addfriend', (req, res) => {
  user.addFriend(req.body, (err, data) => {
    if (err) res.status(400).send({error: err.error})
    else res.send(data)
  })
})
app.delete('/removefriend', (req, res) => {
  user.removeFriend(req.body, (err, data) => {
    if (err) res.status(400).send({error: err.sqlMessage})
    else res.send(data)
  })
})
module.exports = app
