import Api from './Api'

export default {
  updateProfile (credential) {
    return Api().post('/myProfile', credential.data, { headers: { 'Authorization': 'Bearer ' + credential.token } })
  },
  updatePw (credential) {
    return Api().patch('/changePw', credential.data, { headers: { 'Authorization': 'Bearer ' + credential.token } })
  },
  addPost (credential) {
    return Api().post('/addPost', credential.data, { headers: { 'Authorization': 'Bearer ' + credential.token } })
  },
  deleteFriend (credential) {
    return Api().delete(`/user/${credential.id}`, { params: { id: credential.frie_id }, headers: { 'Authorization': 'Bearer ' + credential.token } })
  },
  deleteRecordCT (credential) {
    return Api().patch(`/friend/${credential.id}`, credential.CTId, { headers: { 'Authorization': 'Bearer ' + credential.token } })
  },
  addRecordCT (credential) {
    return Api().post(`/friend/${credential.id}`, credential.data, { headers: { 'Authorization': 'Bearer ' + credential.token } })
  },
  responseToRequest (credential) {
    return Api().post(`/user/${credential.data.frie_id}/inbox`, credential.data, { headers: { 'Authorization': 'Bearer ' + credential.token } })
  },
  updateMessage (credential) {
    return Api().patch(`/user/${credential.id}/inbox`, credential.info, { headers: { 'Authorization': 'Bearer ' + credential.token } })
  },
  deleteMessage (credential) {
    return Api().delete(`/user/${credential.id}/inbox`, { params: { mId: credential.mId }, headers: { 'Authorization': 'Bearer ' + credential.token } })
  }
}
