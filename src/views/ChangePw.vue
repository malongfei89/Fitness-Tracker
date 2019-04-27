<template>
  <div>
    <Header>
      <template #customized1>
        <router-link class="btn btn-dark" :to="`/user/${user.id}`">My Page</router-link>
      </template>
    </Header>
    <div class="container form-group mt-5" v-if='!isPasswordChanged'>
      <label for="oldPassword">Please enter current password</label>
      <input type="password" class="form-control" id="oldPassword">
      <label for="newPassword">Please enter new password</label>
      <input type="password" class="form-control" id="newPassword">
      <label for="cnewPassword">Please confirm new password</label>
      <input type="password" class="form-control" id="cnewPassword">
      <div class="row mt-2 ml-2">
        <small style="color:red">{{error}}</small>
      </div>
      <button type="button" class="btn btn-dark btn-lg mt-2" @click="updatePw">Submit</button>
      <router-link class="btn btn-dark btn-lg mt-2 ml-4" :to="`/user/${user.id}`">Cancle</router-link>
    </div>
    <div v-else class="container text-center mt-5">
      <h1>Congrats! You've successfully changed your password, please use your new password to log in next time!</h1>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header'
import { mapGetters } from 'vuex'
import UpdateInfo from '@/services/UpdateInfo'
import toastr from 'toastr'
export default {
  name: 'changePw',
  data () {
    return {
      error: '',
      isPasswordChanged: false,
      user: {}
    }
  },
  mounted () {
    this.user = this.getUser()
  },
  components: {
    Header
  },
  methods: {
    ...mapGetters([
      'getUser'
    ]),
    async updatePw () {
      const oldPassword = document.getElementById('oldPassword').value
      const newPassword1 = document.getElementById('newPassword').value
      const newPassword2 = document.getElementById('cnewPassword').value
      if (!oldPassword || !newPassword1 || !newPassword2) {
        toastr.error('Please fill in all fields') || (this.error = 'Please fill in all fields')
        return
      }
      if (newPassword1 !== newPassword2) {
        this.error = "New password you entered doesn't match, try again!"
        return
      }
      try {
        await UpdateInfo.updatePw({
          data: {
            id: this.user.id,
            password: oldPassword,
            newPassword: newPassword1
          },
          token: this.user.token
        })
        this.isPasswordChanged = true
      } catch (error) {
        toastr.error(error.response.data.error) || (this.error = error.response.data.error)
      }
    }
  }
}
</script>

<style>

</style>
