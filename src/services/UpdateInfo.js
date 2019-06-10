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
  deleteFriend (credentials) {
    return Api().delete(`/user/${credentials.id}`, { params: { id: credentials.frie_id }, headers: { 'Authorization': 'Bearer ' + credentials.token } })
  },
  deleteRecordCT (credentials) {
    return Api().patch(`/friend/${credentials.id}`, credentials.CTId, { headers: { 'Authorization': 'Bearer ' + credentials.token } })
  },
  addRecordCT (credentials) {
    return Api().post(`/friend/${credentials.id}`, credentials.data, { headers: { 'Authorization': 'Bearer ' + credentials.token } })
  },
  responseToRequest (credentials) {
    return Api().post(`/user/${credentials.data.frie_id}/inbox`, credentials.data, { headers: { 'Authorization': 'Bearer ' + credentials.token } })
  },
  updateMessage (credentials) {
    return Api().patch(`/user/${credentials.id}/inbox`, credentials.info, { headers: { 'Authorization': 'Bearer ' + credentials.token } })
  },
  deleteMessage (credentials) {
    return Api().delete(`/user/${credentials.id}/inbox`, { params: { mId: credentials.mId }, headers: { 'Authorization': 'Bearer ' + credentials.token } })
  }
}
