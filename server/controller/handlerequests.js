const user = require('../models/user')
const express = require('express')
const app = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const CustomError = require('../models/CustomError')

//search a user by username
app.get('/user/:username', (req, res, next) => {
  user.findUser(req.params.username)
  .then(data => {
    if (!data[0]) throw new CustomError('There is no such user in our system!', 404)
    else res.send(data)
  })
  .catch(next)
})
//retrive user's detail information
app.post('/user', (req, res, next) => {
  user.getInfo(req.body.id)
  .then(data => res.send(data))
  .catch(next)
})
//update user profile
app.patch('/myProfile', (req, res, next) => {
  user.updateUser(req.body)
  .then(() => res.sendStatus(200))
  .catch(next)
})
//change password
app.patch('/changePw', (req, res, next) => {
  user.changePw(req.body)
  .then(() => res.sendStatus(200))
  .catch(next)
})
app.post('/register', (req, res, next) => {
  user.addUser(req.body)
  .then(() => res.sendStatus(200))
  .catch(err => {
    if (err.code === 'ER_DUP_ENTRY')
      next(new CustomError('Email address is in use, pick a different one!', 403))
    else next(err)
  })
})
app.post('/login', (req, res, next) => {
  user.findUser(req.body.username) 
  .then(data => {
    if (!data[0]) {
      throw new CustomError('Invalid log in credential!', 403)
    } else {
      bcrypt.compare(req.body.password, data[0].password)
      .then(isMatch => {
        if (isMatch) {
        const token = jwt.sign({user: data[0].id}, process.env.Secret,{
          expiresIn: '3 days'
        })
        const { created_at, last_update, username, password, ...info } = data[0]
        res.send({
          token: token,
          ...info
        })
        } else {
        throw new CustomError('Invalid log in credential!', 403)
        }
      })
      .catch(next)
    }
  })
  .catch(next)
})
app.post('/addfriend', (req, res, next) => {
  user.addFriend(req.body)
  .then(() => res.sendStatus(200))
  .catch(next)
})
app.delete('/removefriend', (req, res) => {
  user.removeFriend(req.body)
  .then(() => res.sendStatus(200))
  .catch(next)
})
module.exports = app
