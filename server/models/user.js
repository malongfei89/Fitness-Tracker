const conn = require('./mysql-connection')

module.exports= {
  getpass(id, callback) {
    conn.query('select * from users where id = ?', id, (err, data) => {
      callback(err, data.password)
    })
  },
  adduser(input, callback) {
    conn.query('insert into users (created_at, first_name, last_name, birthday, username, password) value(?)',
      [[new Date(), input.first_name, input.last_name, input.birthday, input.username, input.password]],
      (err, data) => callback(err, data))
  },
  checkuser(input, callback) {
    conn.query('select password from users where username = ?', input.username, (err, data) => callback(err, data))
  }
}
