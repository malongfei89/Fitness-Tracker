const conn = require('./mysql-connection')

module.exports= {
  getPass(id, callback) {
    conn.query('select * from users where id = ?', id, (err, data) => callback(err, data.password))
  },
  addUser(input, callback) {
    conn.query('insert into users (created_at, username, password) value(?)',
      [[new Date(), input.username, input.password]],
      (err, data) => callback(err, data))
  },
  checkUser(input, callback) {
    conn.query('select password from users where username = ?', input.username, (err, data) => callback(err, data))
  },
  changePw(input, callback) {
    conn.query('select id from users where username = ?', input.username, (err, data) => {
      if (err) throw err
      else
        conn.query('update users set password = ? where (id = ?)', [input.newPassword, data[0].id], (err, data) => callback(err, data))
    })
  },
  addFriend(input, callback) {
    conn.query('select * from friends where users2_id = ? and frie_id = ?', [input.user_id, input.frie_id], (err, data) => {
      if (err) throw err
      else {
        if (data.length === 0)
          conn.query('insert into friends (created_at, users2_id, frie_id) value(?)', [[new Date(), input.user_id, input.frie_id]], (err, data) => callback(err, data))
          else callback({error: "You two are already friends!"})
      }
    })
  },
  removeFriend(input, callback) {
    conn.query('delete from friends where users2_id = ? and frie_id = ?', [input.user_id, input.frie_id], (err, data) => callback(err, data))
  }
}
