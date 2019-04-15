import Api from './Api'

export default {
  getInfo (credentials) {
    return Api().post('/user', credentials.data, { headers: { 'Authorization': 'Bearer ' + credentials.token } })
  }
}
