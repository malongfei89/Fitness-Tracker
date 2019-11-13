const conn = require('./mysql-connection')
const bcrypt = require('bcrypt')
const SALTROUND = 10
const CustomError = require('./CustomError')

module.exports= {
  // look for a user by its username
  findUserByUsername(username) {
    return conn.query('select password, id, first_name, last_name, nickname, birthday, user_icon from users where username = ?', username)
  },
  checkIfFriends (toId, fromId) {
    return conn.query('select id from friends where users2_id=? and frie_id=?',[toId, fromId])
  },
  //get user profile
  getUserInfo(id) {
    return conn.query('select id, first_name, last_name, nickname, birthday, user_icon from users where id=?', id)
  },
  //get username
  getUsername(id){
    return conn.query('select username from users where id =?', id)
  },
  //get friend posts
  getUserRecords(id) {
    return conn.query('select records.id, records.created_at, type, amount from records join exercise on records.exer_id = exercise.id where user_id = ?;', id)
  },
  //get thumb-up and comments related to post
  async getUserRecordsCT(id) {
    /*return conn.query(`select id, thumbup_user_id, records_id from thumbup_to_records where records_id = any(select records.id from records where user_id = ?);
      select comments_to_records.id, first_name, comment_user_id, comment_text, records_id from comments_to_records join users on comment_user_id = users.id where records_id = any(select records.id from records where user_id = ?);`,
      [id, id])*/
    let finalResults = []
    try {
      const results = await conn.query('select id from records where user_id =?', id)
      for(let index in results){
        finalResults[index] ={}
        finalResults[index].thumbUps = await conn.query('select id, thumbup_user_id from thumbup_to_records where records_id = ?', results[index].id)
        finalResults[index].comments = await conn.query('select comments_to_records.id, first_name, comment_user_id, comment_text from comments_to_records join users on comment_user_id = users.id where records_id = ? limit 5', results[index].id)
        finalResults[index].numOfComments = (await conn.query('select count(*) as total from comments_to_records where records_id = ?', results[index].id))[0].total
      }
      //console.log(finalResults)
      return finalResults
    } catch(error) {throw error}
  },
  getMoreComments(recordId, start){
    return conn.query('select comments_to_records.id, first_name, comment_user_id, comment_text, records_id from comments_to_records join users on comment_user_id = users.id where records_id =? limit ?,5', [recordId, start])
  },
  addUserRecordsCT(input) {
    if (input.type === 'thumbUp')
      return conn.query('insert into thumbup_to_records (created_at, records_id, thumbup_user_id) value(?)',
      [[new Date(), input.records_id, input.user_id]])
    if (input.type === 'comment')
      return conn.query('insert into comments_to_records (created_at, records_id, comment_user_id, comment_text) value(?)',
      [[new Date(), input.records_id, input.comment_user_id, input.comment_text]])
  },
  deleteUserRecordsCT(input) {
    if (input.type === 'thumbUp')
      return conn.query(`delete from thumbup_to_records where id=?;`, [input.id])
    if (input.type === 'comment') 
      return conn.query(`delete from comments_to_records where id = ?;`, [input.id])
  },
  //after login in, grab information about the user
  getInfo(id) {
    return conn.query(`select * from (select user_id, records.id, records.created_at, type, amount from records join exercise on records.exer_id = exercise.id) as allrecords where allrecords.user_id=?;
      select nickname, first_name, last_name, user_icon, frie_id from (select frie_id from friends where users2_id =?) as allfriends join users on allfriends.frie_id=users.id;
      select created_at, records.user_id from (select frie_id from friends where users2_id =?) as allfriends join records where allfriends.frie_id = records.user_id;`,
      [id, id, id])
  },
  //register
  async addUser(input) {
    const hash = await bcrypt.hash(input.password, SALTROUND)
    return conn.query('insert into users (created_at, username, password) value(?)',[[new Date(), input.username, hash]])
  },
  //reset password
  async resetPassword(input) {
    const hash = await bcrypt.hash(input.newPassword, SALTROUND)
    return conn.query('update users set password = ? where username = ?', [hash, input.username])
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
  addrecords(input) {
    return conn.query(`insert into records (created_at, user_id, exer_id, amount) value(?);`,
      [[new Date(), input.id, input.exer_id, input.amount]])
  },
  async addMessage(input) {
    const checkIfMExists = await conn.query('select id, process_result from user_message_records where from_id = ? and to_id = ? and message_type = ?', [input.fromId, input.toId, input.mType])
    let length = checkIfMExists.length
    switch(input.mType){
      case 'add-friend':  
        let checkIfFriends = await conn.query('select id from friends where users2_id=? and frie_id=?', [input.fromId, input.toId])
        if(checkIfFriends.length > 0) throw new Error('You can\'t send the request because you guys are already friends!')
        else if(length && checkIfMExists[length-1].process_result === 'null') throw new Error('The request has been sent to the user. Please wait for user\'s response')
        break
    }
    return conn.query('insert into user_message_records (created_at, from_id, to_id, message_type) value(?)',
    [[new Date(), input.fromId, input.toId, input.mType]])
  },
  addNotification(input) {
    return conn.query('insert into user_message_records (created_at, from_id, to_id, message_type, process_result, related_to) value(?)',
    [[new Date(), input.toId, input.fromId, 'notification', input.decision, input.id]])
  },
  getMessages(id, needUnread, startId) {
    if(needUnread) {
      if(!startId) return conn.query('select count(*) as total from user_message_records where to_id = ? and is_read = 0', id)
      else return conn.query(`select related_to, user_message_records.id as mId, user_message_records.created_at, user_message_records.last_update, first_name, nickname, users.id as fromId, process_result,
        is_read, message_type from users join user_message_records on users.id = user_message_records.from_id where to_id = ? and is_read = 0 and user_message_records.id > ?`, [id, startId])
    } else return conn.query(`select related_to, user_message_records.id as mId, user_message_records.created_at, user_message_records.last_update, first_name, nickname, users.id as fromId, process_result,
    is_read, message_type from users join user_message_records on users.id = user_message_records.from_id where to_id = ? order by user_message_records.id desc`, id)
  },
  updateMessage(input) {
    if(input.is_read !== undefined && !input.process_result) return conn.query('update user_message_records set is_read = ? where id=?', [input.is_read, input.id])
    else if(input.process_result) return conn.query('update user_message_records set process_result = ? where id=?', [input.process_result, input.id])
  },
  deleteMessage(mId) {
    return conn.query('delete from user_message_records where id = ?', mId)
  },
  async addFriend(input) {
    const data = await conn.query('select * from friends where users2_id = ? and frie_id = ?', [input.user_id, input.frie_id])
    if (data.length === 0)
      return conn.query(`insert into friends (created_at, users2_id, frie_id) value(?);
        insert into friends (created_at, users2_id, frie_id) value(?);`,
        [[new Date(), input.user_id, input.frie_id ],[new Date(), input.frie_id, input.user_id ]])
    else throw new CustomError('You guys are already friends!', 404)
  },
  removeFriend(input) {
    return conn.query(`delete from friends where users2_id = ? and frie_id = ?;
      delete from friends where frie_id = ? and users2_id = ?;`,
      [input.user_id, input.frie_id, input.user_id, input.frie_id])
  }
}