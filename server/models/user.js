const conn = require('./mysql-connection')
const bcrypt = require('bcrypt')
const SALTROUND = 10

module.exports= {
  findUser(username, callback) {
    conn.query('select * from users where username = ?', username, (err, data) => callback(err, data))
  }, 
  addUser(input, callback) {
    bcrypt.hash(input.password, SALTROUND, (err, hash) => {
      conn.query('insert into users (created_at, username, password) value(?)',
      [[new Date(), input.username, hash]],
      (err, data) => callback(err, data)
    )
    })
  },
  checkUser(input, callback) {
    conn.query('select password from users where username = ?', input.username, (err, data) => callback(err, data))
  },
  changePw(input, callback) {
    conn.query('select password from users where id = ?', input.id, (err, data) => {
      if (err) callback({error: err.sqlMessage})
      else
        bcrypt.compare(input.password, data[0].password, (err, isMatch) => {
          if (isMatch) 
            bcrypt.hash(input.newPassword, SALTROUND, (err, hash) => {
              conn.query('update users set password = ? where (id = ?)', [hash, input.id], (err, data) => callback(err, data))
            })
          else callback({error:"The old password you entered doesn't match our record!"})
        })
    })
  },
  addFriend(input, callback) {
    conn.query('select * from friends where users2_id = ? and frie_id = ?', [input.user_id, input.frie_id], (err, data) => {
      if (err) callback({error: err.sqlMessage})
      else {
        if (data.length == 0)
          conn.query('insert into friends (created_at, users2_id, frie_id) value(?)', [[new Date(), input.user_id, input.frie_id]], (err, data) => callback(err, data))
        else callback({error: "You two are already friends!"})
      }
    })
  },
  removeFriend(input, callback) {
    conn.query('delete from friends where users2_id = ? and frie_id = ?', [input.user_id, input.frie_id], (err, data) => callback(err, data))
  }
}
