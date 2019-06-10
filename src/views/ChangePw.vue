<template>
  <div>
    <Header>
      <template #customized1>
        <router-link class="nav-link" active-class="active" :to="`/user/${user.id}`">My Page</router-link>
      </template>
      <template #customized2>
        <router-link class="nav-link" active-class="active" to="/myProfile">My Profile</router-link>
      </template>
    </Header>
    <div class="container form-group mt-5">
      <label for="oldPassword">Please enter current password</label>
      <input type="password" class="form-control" id="oldPassword">
      <label for="newPassword">Please enter new password</label>
      <input type="password" class="form-control" id="newPassword">
      <label for="cnewPassword">Please confirm new password</label>
      <input type="password" class="form-control" id="cnewPassword">
      <button type="button" class="btn btn-dark btn-lg mt-2" @click="updatePw">Submit</button>
      <router-link class="btn btn-dark btn-lg mt-2 ml-4" :to="`/user/${user.id}`">Cancle</router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UpdateInfo from '@/services/UpdateInfo'
export default {
  name: 'changePw',
  data () {
    return {
      user: {}
    }
  },
  mounted () {
    this.user = this.getUser()
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
        this.$store.dispatch('setInfo', { type: 'danger', message: 'Please fill in all fields' })
        return
      }
      if (newPassword1 !== newPassword2) {
        this.$store.dispatch('setInfo', { type: 'danger', message: 'New password you entered doesn\'t match, try again!' })
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
        this.$store.dispatch('setInfo', { type: 'success', message: 'Congrats! You\'ve successfully changed your password, please use your new password to log in next time!' })
        this.$router.push(`/user/${this.user.id}`)
      } catch (error) {
        this.$store.dispatch('setInfo', { type: 'danger', message: error.response.data.error })
      }
    }
  }
}
</script>

<style>

</style>
