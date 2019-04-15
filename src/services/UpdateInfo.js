import Api from './Api'

export default {
  updateProfile (credentials) {
    return Api().patch('/myProfile', credentials.data, { headers: { 'Authorization': 'Bearer ' + credentials.token } })
  },
  updatePw (credentials) {
    return Api().patch('/changePw', credentials.data, { headers: { 'Authorization': 'Bearer ' + credentials.token } })
  }
}
