import Api from './Api'

export default {
  register (credential) {
    return Api().post('/register', credential)
  },
  login (credential) {
    return Api().post('/login', credential)
  },
  checkIfUserExists (username) {
    return Api().get('/forgetPW', { params: { username: username } })
  },
  sendCode (username) {
    return Api().get('/forgetPW', { params: { username: username, needCode: true } })
  },
  resetPassword (credential) {
    return Api().patch('/forgetPW', { username: credential.username, newPassword: credential.newPassword })
  }
}
