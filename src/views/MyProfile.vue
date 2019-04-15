<template>
  <div>
    <Header>
      <template #customized1>
        <router-link class="nav-link" active-class="active" to="/user">My Page</router-link>
      </template>
      <template #customized2>
        <button class="btn btn-dark" @click="needUpdate">Edit Profile</button>
      </template>
      <router-link class="btn btn-dark" to="/changePw">Change Password</router-link>
      <button type="button" class="btn btn-dark" @click="logout">Log out</button>
    </Header>
    <div v-if="!isUpdated" class="container form-group mt-4">
        <h2>Please tell your friends more about you!</h2>
        <label for="usericon">User Icon:</label>
        <input class="form-check-input-inline ml-4" required value="fas fa-hiking ml-2 fa-2x" type="radio" v-model="userInformation.user_icon" >
        <i class="fas fa-hiking ml-2 fa-2x"></i>
        <input class="form-check-input-inline ml-4" required value="fas fa-dumbbell ml-2 fa-2x" type="radio" v-model="userInformation.user_icon">
        <i class="fas fa-dumbbell ml-2 fa-2x"></i>
        <input class="form-check-input-inline ml-4" required value="fas fa-running ml-2 fa-2x" type="radio" v-model="userInformation.user_icon">
        <i class="fas fa-running ml-2 fa-2x"></i>
        <input class="form-check-input-inline ml-4" required value="fas fa-swimmer ml-2 fa-2x" type="radio" v-model="userInformation.user_icon">
        <i class="fas fa-swimmer ml-2 fa-2x"></i>
        <br>
        <label for="nickname">Nickname</label>
        <input type="text" required v-model="userInformation.nickname" id="nickname" class="form-control" aria-describedby="helpId">
        <small id="helpId" class="text-muted">How do you want your friends to call you</small>
        <br>
        <label for="first_name">First Name</label>
        <input type="text" required v-model="userInformation.first_name" id="first_name" class="form-control">
        <label for="last_name">Last Name</label>
        <input type="text" required v-model="userInformation.last_name" id="last_name" class="form-control">
        <label for="birthday">Birthday</label>
        <input type="date" required v-model="userInformation.birthday" id="birthday" class="form-control">
        <input class="btn btn-dark btn-lg mt-2" type="button" value="Submit" @click="updateProfile">
        <small style="color:red">{{error}}</small>
    </div>
    <div v-else class="container form-group mt-4">
      <h2 v-if="hasUpdates">Congratulations! You've successfully updated your profile!</h2>
      <h2 v-if="this.userInformation.nickname == null">Want your friend to know you more? Press the button on the top to edit your file</h2>
      <p>User Icon</p>
      <i :class="this.userInformation.user_icon"></i>
      <br>
      <label class="mt-2">Nickname</label>
      <input type="text" :value="userInformation.nickname" readonly id="nickname" class="form-control" aria-describedby="helpId">
      <br>
      <label>First Name</label>
      <input type="text" :value="userInformation.first_name" readonly id="first_name" class="form-control">
      <label>Last Name</label>
      <input type="text" :value="userInformation.last_name" readonly id="last_name" class="form-control">
      <label>Birthday</label>
      <input type="date" :value="getRightDate" readonly id="birthday" class="form-control">
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header'
import { mapActions, mapGetters } from 'vuex'
import UpdateInfo from '@/services/UpdateInfo'

export default {
  name: 'myProfile',
  data () {
    return {
      userInformation: {
        token: null,
        id: null,
        first_name: '',
        last_name: '',
        nickname: '',
        birthday: '',
        user_icon: ''
      },
      error: null,
      isUpdated: true,
      hasUpdates: false
    }
  },
  computed: {
    getRightDate: function () {
      if (this.userInformation.birthday == null) return
      return this.userInformation.birthday.split('T')[0]
    }
  },
  async mounted () {
    this.userInformation = this.getUser()
  },
  components: {
    Header
  },
  methods: {
    ...mapActions([
      'setUser'
    ]),
    ...mapGetters([
      'getUser'
    ]),
    logout () {
      this.setUser({
        token: null,
        id: null,
        first_name: '',
        last_name: '',
        nickname: '',
        birthday: null,
        user_icon: ''
      })
      this.$router.push('/')
    },
    needUpdate () {
      this.isUpdated = false
    },
    changePw () {
    },
    async updateProfile () {
      try {
        this.error = null
        const { token, ...userInfo } = this.userInformation
        await UpdateInfo.updateProfile({
          data: { ...userInfo },
          token: token
        })
        this.setUser(this.userInformation)
        this.isUpdated = true
        this.hasUpdates = true
      } catch (error) {
        this.error = error.response.data.error
      }
    }
  }
}
</script>

<style>

</style>
