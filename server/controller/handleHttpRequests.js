const user = require('../models/user')
const express = require('express')
const app = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const CustomError = require('../models/CustomError')

//search a user by ID
app.get('/searchFriend', async (req, res, next) => {
  try {const checkResult = await user.checkIfFriends(req.query.toId, req.query.fromId)
    // console.log(checkResult)
    if(checkResult[0]) throw new CustomError('You guys are already friends!', 404)
    user.getUserInfo(req.query.toId)
    .then(data => {
      console.log(data)
      if (!data[0]) throw new CustomError('There is no such user in our system!', 404)
      res.send(data[0])
    })
    .catch(next)
  } catch(error) { next(error) }
})
app.get('/searchFriend', (req, res, next) => {
  //console.log(req.query.id)
  user.getUserInfo2(req.query)
  .then(data => {
    if (!data.length) throw new CustomError('The user is either not in our system or already your friend!', 404)
    else {
      let results = data.map(user => {
        const { created_at, last_update, username, password, ...result } = user
        return result
      })
      res.send(results)
    }
  })
  .catch(next)
})
app.post('/searchFriend', (req, res, next) => {
  user.addFriend(req.body)
  .then(() => res.sendStatus(200))
  .catch(next)
})
app.get('/friend/:id', async (req, res, next) => {
  try {
    if (!req.query.id) {
      let data=[]
      data[0] = await user.getUserInfo(req.params.id)
      data[1] = await user.getUserRecords(req.params.id)
      data[2] = await user.getUserRecordsCT(req.params.id)
      res.send(data)
    } else {
      let data = await user.getMoreComments(req.query.id, parseInt(req.query.offset))
      res.send(data)
    }
  } catch(error) {next(error)}
})
app.patch('/friend/:id', (req, res, next) => {
  user.deleteUserRecordsCT(req.body)
  .then(() => res.sendStatus(200))
  .catch(next)
})
app.post('/friend/:id', (req, res, next) => {
  user.addUserRecordsCT(req.body)
  .then((data) => res.send({id: data.insertId}))
  .catch(next)
})
app.delete('/user/:id', (req, res, next) => {
  user.removeFriend({
    frie_id: req.query.id,
    user_id: req.params.id})
  .then(() => res.sendStatus(200))
  .catch(next)
})
//retrive user's detail information
app.get('/user/:id', (req, res, next) => {
  user.getInfo(req.params.id)
  .then(data => res.send(data))
  .catch(next)
})
//get unread messages or all messages
app.get('/user/:id/inbox', async (req, res, next) => {
  try {
    data = await user.getMessages(req.params.id, parseInt(req.query.needUnread))
    res.send(data)
  } catch(error) {next(error)}
})
//process response to message
app.post('/user/:id/inbox', (req, res, next) => {
  switch (req.body.type) {
    case 'add-friend': {
      if (req.body.process_result === 'accepted') {
        user.addFriend(req.body)
        .then(() => {
          user.updateMessage(req.body)
          .then(() => res.sendStatus(200))
          .catch(next)
        })
        .catch(next)
      } else {
        user.updateMessage(req.body)
        .then(() => res.sendStatus(200))
        .catch(next)
      }
    }
  }
})
//update message
app.patch('/user/:id/inbox', (req, res, next) => {
  user.updateMessage(req.body)
  .then(() => res.sendStatus(200))
  .catch(next)
})
//delete messagee
app.delete('/user/:id/inbox', (req, res, next) => {
  user.deleteMessage(req.query.mId)
  .then(() => res.sendStatus(200))
  .catch(next)
})
//update user profile
app.post('/myProfile', (req, res, next) => {
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
  .then((data) => res.send(data))
  .catch(err => {
    if (err.code === 'ER_DUP_ENTRY')
      next(new CustomError('Email address is in use, pick a different one!', 403))
    else next(err)
  })
})
app.post('/login', (req, res, next) => {
  user.findUserByUsername(req.body.username) 
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
app.get('/addPost', (req, res, next) => {
  user.getExerciseTypes()
  .then((data) => res.send(data))
  .catch(next)
})
app.post('/addPost', (req, res, next) => {
  user.addrecords(req.body)
  .then(() => res.sendStatus(200))
  .catch(next)
})

module.exports = app
