const conn = require('./mysql-connection')
const bcrypt = require('bcrypt')
const SALTROUND = 10
const CustomError = require('./CustomError')

module.exports= {
  //look for a user by its username
  findUserByUsername(username) {
    return conn.query('select * from users where username = ?', username)
  },
  findUserById(id) {
    return conn.query('select * from users where id = ?', id)
  },
  //after login in, grab information about the user
  getInfo(id) {
    return conn.query('select * from (select user_id, records.id, records.created_at, type, amount from records join exercise on records.exer_id = exercise.id) as allrecords where allrecords.user_id=?;select nickname, first_name, last_name, user_icon, frie_id from (select frie_id from friends where users2_id =?) as allfriends join users on allfriends.frie_id=users.id; select created_at from (select frie_id from friends where users2_id =?) as allfriends join records where allfriends.frie_id = records.user_id;', [id, id, id])
  },
  //register
  async addUser(input) {
    const hash = await bcrypt.hash(input.password, SALTROUND)
    return conn.query('insert into users (created_at, username, password) value(?)',[[new Date(), input.username, hash]])
  },
  //update personal information
  updateUser(input) {
    return conn.query('update users set user_icon = ?,nickname = ?, first_name=?, last_name=?, birthday=? where (id=?)', [input.user_icon, input.nickname, input.first_name, input.last_name, input.birthday, input.id])
  },
  //recover password
  checkUser(input) {
    return conn.query('select password from users where username = ?', input.username)
  },
  //update password
  async changePw(input) {
    //get user password based on id
    const data = await conn.query('select password from users where id = ?', input.id)
    const isMatch = await bcrypt.compare(input.password, data[0].password)
    if (isMatch) {
      const hash = await bcrypt.hash(input.newPassword, SALTROUND)
      return conn.query('update users set password = ? where (id = ?)', [hash, input.id])
    }
    else throw new CustomError('The old password is incorrect!', 401)
  },
  getExerciseTypes() {
    return conn.query('select id, type from exercise')
  },
  addPost(input) {
    return conn.query('insert into records (created_at, user_id, exer_id, amount) value(?)', [[new Date(), input.id, input.exer_id, input.amount]])
  },
  async addFriend(input) {
    const data = await conn.query('select * from friends where users2_id = ? and frie_id = ?', [input.user_id, input.frie_id])
    if (data.length === 0)
      return conn.query('insert into friends (created_at, users2_id, frie_id) value(?)', [[new Date(), input.user_id, input.frie_id]])
    else throw new CustomError('You guys are already friends!', 404)
  },
  removeFriend(input) {
    return conn.query('delete from friends where users2_id = ? and frie_id = ?', [input.user_id, input.frie_id])
  }
}
