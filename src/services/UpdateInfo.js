import Api from './Api'

export default {
  updateProfile (credentials) {
    return Api().post('/myProfile', credentials.data, { headers: { 'Authorization': 'Bearer ' + credentials.token } })
  },
  updatePw (credentials) {
    return Api().patch('/changePw', credentials.data, { headers: { 'Authorization': 'Bearer ' + credentials.token } })
  },
  addPost (credentials) {
    return Api().post('/addPost', credentials.data, { headers: { 'Authorization': 'Bearer ' + credentials.token } })
  },
  addFriend (credentials) {
    return Api().post('/searchFriend', credentials.data, { headers: { 'Authorization': 'Bearer ' + credentials.token } })
  },
  deleteFriend (credentials) {
    return Api().delete(`/user/${credentials.id}`, { params: { id: credentials.frie_id }, headers: { 'Authorization': 'Bearer ' + credentials.token } })
  },
  deleteRecordCT (credentials) {
    return Api().patch(`/friend/${credentials.id}`, credentials.CTId, { headers: { 'Authorization': 'Bearer ' + credentials.token } })
  },
  addRecordCT (credentials) {
    return Api().post(`/friend/${credentials.id}`, credentials.data, { headers: { 'Authorization': 'Bearer ' + credentials.token } })
  }
}
