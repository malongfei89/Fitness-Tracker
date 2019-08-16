import Api from './Api'

export default {
  getInfo (credential) {
    return Api().get(`/user/${credential.data}`, { headers: { 'Authorization': 'Bearer ' + credential.token } })
  },
  getExerciseTypes (credential) {
    return Api().get('/addPost', { headers: { 'Authorization': 'Bearer ' + credential } })
  },
  getUserInfo (credential) {
    return Api().get(`/searchFriend`, { params: { toId: credential.toId, fromId: credential.fromId }, headers: { 'Authorization': 'Bearer ' + credential.token } })
  },
  getFriendInfo (credential) {
    return credential.recordInfo ? Api().get(`/friend/${credential.id}`, { params: { ...credential.recordInfo }, headers: { 'Authorization': 'Bearer ' + credential.token } }) : Api().get(`/friend/${credential.id}`, { headers: { 'Authorization': 'Bearer ' + credential.token } })
  },
  getMessages (credential) {
    return Api().get(`/user/${credential.id}/inbox`, { params: { needUnread: credential.needUnread, startId: credential.startId }, headers: { 'Authorization': 'Bearer ' + credential.token } })
  }
}
