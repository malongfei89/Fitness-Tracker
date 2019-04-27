import Api from './Api'

export default {
  getInfo (credentials) {
    return Api().get(`/user/${credentials.data}`, { headers: { 'Authorization': 'Bearer ' + credentials.token } })
  },
  getExerciseTypes (credentials) {
    return Api().get('/addPost', { headers: { 'Authorization': 'Bearer ' + credentials } })
  },
  getUserInfo (credentials) {
    return Api().get(`/searchFriend`, { params: { id: credentials.id }, headers: { 'Authorization': 'Bearer ' + credentials.token } })
  },
  getFriendInfo (credentials) {
    return Api().get(`/friend/${credentials.id}`, { headers: { 'Authorization': 'Bearer ' + credentials.token } })
  }
}