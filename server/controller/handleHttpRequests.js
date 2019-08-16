const user = require('../models/user')
const express = require('express')
const app = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const CustomError = require('../models/CustomError')
const sendEmail = require('../models/sendEmail')
const ramdomatic = require('randomatic')
require('dotenv').config()

//reset password
app.patch('/forgetPW', async (req, res, next) => {
  try {
    const changePwHTML = '<h1>You just changed your password!<h1><br /><h2>Fitness Tracker Team</h2>'
    await user.resetPassword(req.body)
    res.sendStatus(200)
    await sendEmail.sendEmail(process.env.EMAIL_USER, req.body.username, 'Password Changed','', changePwHTML)
  } catch (error) {
    next(error)
  }  
})
//check if the email exists in our system or send code to the email
app.get('/forgetPW', async (req, res, next) => {
  if(req.query.needCode){
    let code = ramdomatic('0', 6)
    console.log(code)
    let htmlContent = `<h1>Fitness Tracker Team</h1><h2>Here is your verification code for resetting password:</h2><h3 style="text-align: center;">${code}<h3>`
    await sendEmail.sendEmail(process.env.EMAIL_USER, req.query.username, 'Forget password','', htmlContent)
    res.send(code)
  } else{
    try{
      let result = await user.findUserByUsername(req.query.username)
      if (!result[0]) {
        throw new CustomError('This email has not been registered yet!', 404)
      } else {
        res.sendStatus(200)
      }
    } catch (error) {
      next(error)
    }
  }
})
//search a user by ID
app.get('/searchFriend', async (req, res, next) => {
  try {const checkResult = await user.checkIfFriends(req.query.toId, req.query.fromId)
    // console.log(checkResult)
    if(checkResult[0]) throw new CustomError('You guys are already friends!', 404)
    user.getUserInfo(req.query.toId)
    .then(data => {
      // console.log(data)
      if (!data[0]) throw new CustomError('There is no such user in our system!', 404)
      res.send(data[0])
    })
    .catch(next)
  } catch(error) { next(error) }
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
    data = await user.getMessages(req.params.id, parseInt(req.query.needUnread), req.query.startId)
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
app.patch('/changePw', async (req, res, next) => {
  try {
    const changePwHTML = '<h1>You just changed your password!<h1><br /><p>Fitness Tracker Team</p>'
    await user.changePw(req.body)
    await sendEmail.sendEmail('longfeim89@gmail.com', 'dsa@gmail.com', 'Password Changed','Password Changed', changePwHTML)
    res.sendStatus(200)
  } catch (error) {
    next(error)
  }  
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
        const { password, ...info } = data[0]
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
