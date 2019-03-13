const conn = require('./mysql-connection')

module.exports= {
  getpass(id, callback) {
    conn.query('select * from user where id = ?', id, (err, data) => {
      callback(err, data.password)
    })
  },
  adduser(input, callback) {
    conn.query('insert into users (created_at, username, password) value(?)',
      [new Date(), input.username, input.password],
      (err, data) => callback(err, data))
  }
}