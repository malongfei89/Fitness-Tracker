import Api from './Api'

export default {
  register (credential) {
    Api().post('/register', credential)
  }
}
