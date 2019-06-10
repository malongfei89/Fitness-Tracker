import Api from './Api'

export default {
  getInfo (credentials) {
    return Api().get(`/user/${credentials.data}`, { headers: { 'Authorization': 'Bearer ' + credentials.token } })
  },
  getExerciseTypes (credentials) {
    return Api().get('/addPost', { headers: { 'Authorization': 'Bearer ' + credentials } })
  },
  getUserInfo (credentials) {
    return Api().get(`/searchFriend`, { params: { toId: credentials.toId, fromId: credentials.fromId }, headers: { 'Authorization': 'Bearer ' + credentials.token } })
  },
  getFriendInfo (credentials) {
    return credentials.recordInfo ? Api().get(`/friend/${credentials.id}`, { params: { ...credentials.recordInfo }, headers: { 'Authorization': 'Bearer ' + credentials.token } }) : Api().get(`/friend/${credentials.id}`, { headers: { 'Authorization': 'Bearer ' + credentials.token } })
  },
  getMessages (credentials) {
    return Api().get(`/user/${credentials.id}/inbox`, { params: { needUnread: credentials.needUnread }, headers: { 'Authorization': 'Bearer ' + credentials.token } })
  }
}
