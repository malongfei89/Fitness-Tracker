<template>
  <div>
    <Header>
      <template #customized1>
        <router-link class="btn btn-dark" to="/user">My Page</router-link>
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
      <router-link class="btn btn-dark btn-lg mt-2 ml-4" to="/user">Cancle</router-link>
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

export default {
  name: 'changePw',
  data () {
    return {
      error: '',
      isPasswordChanged: false,
      user: null
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
      this.error = ''
      if (document.getElementById('newPassword').value !== document.getElementById('cnewPassword').value) {
        this.error = "New password you entered doesn't match, try again!"
      } else {
        try {
          await UpdateInfo.updatePw({
            data: {
              id: this.user.id,
              password: document.getElementById('oldPassword').value,
              newPassword: document.getElementById('newPassword').value
            },
            token: this.user.token
          })
          this.isPasswordChanged = true
        } catch (error) {
          this.error = error.response.data.error
        }
      }
    }
  }
}
</script>

<style>

</style>
