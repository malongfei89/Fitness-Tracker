<template>
  <div>
    <Header>
      <template #customized1>
        <router-link class="nav-link" :to="`/user/${userInformation.id}`">My Page</router-link>
      </template>
      <template #customized2>
        <button class="btn btn-dark" @click="needUpdate">Edit Profile</button>
      </template>
      <router-link class="btn btn-dark" to="/changePw">Change Password</router-link>
    </Header>
    <div v-if="!isUpdated" class="container form-group mt-4">
      <h2>Please tell your friends more about you!</h2>
      <label for="usericon">User Icon:</label>
      <input class="form-check-input-inline ml-4" id="user_icon" value="fas fa-hiking ml-2 fa-2x" type="radio" >
      <i class="fas fa-hiking ml-2 fa-2x"></i>
      <input class="form-check-input-inline ml-4" id="user_icon" value="fas fa-dumbbell ml-2 fa-2x" type="radio" >
      <i class="fas fa-dumbbell ml-2 fa-2x"></i>
      <input class="form-check-input-inline ml-4" id="user_icon" value="fas fa-running ml-2 fa-2x" type="radio" >
      <i class="fas fa-running ml-2 fa-2x"></i>
      <input class="form-check-input-inline ml-4" id="user_icon" value="fas fa-swimmer ml-2 fa-2x" type="radio" >
      <i class="fas fa-swimmer ml-2 fa-2x"></i>
      <br>
      <label for="nickname">Nickname</label>
      <input type="text" :value="userInformation.nickname" id="nickname" class="form-control" aria-describedby="helpId">
      <small id="helpId" class="text-muted">How do you want your friends to call you</small>
      <br>
      <label for="first_name">First Name</label>
      <input type="text" :value="userInformation.first_name" id="first_name" class="form-control">
      <label for="last_name">Last Name</label>
      <input type="text" :value="userInformation.last_name" id="last_name" class="form-control">
      <label for="birthday">Birthday</label>
      <input type="date" :value="userInformation.birthday" id="birthday" class="form-control">
      <button class="btn btn-dark btn-lg mt-2" type="button" @click="updateProfile">Submit</button>
      <router-link class="btn btn-dark btn-lg mt-2 ml-4" :to="`/user/${userInformation.id}`">Cancle</router-link>
    </div>
    <div v-else class="container form-group mt-4">
      <h2 v-if="userInformation.nickname === null">Want your friend to know you more? Press the button on the top to edit your file</h2>
      <label class="mt-2">FitnessID:</label>
      <input type="text" :value="userInformation.id" readonly class="form-control" aria-describedby="helpId">
      <p>User Icon</p>
      <i :class="userInformation.user_icon"></i>
      <br>
      <label class="mt-2">Nickname</label>
      <input type="text" :value="userInformation.nickname" readonly class="form-control" aria-describedby="helpId">
      <br>
      <label>First Name</label>
      <input type="text" :value="userInformation.first_name" readonly class="form-control">
      <label>Last Name</label>
      <input type="text" :value="userInformation.last_name" readonly class="form-control">
      <label>Birthday</label>
      <input type="date" :value="getRightDate" readonly class="form-control">
    </div>
  </div>
</template>

<script>
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
      isUpdated: true
    }
  },
  computed: {
    getRightDate: function () {
      if (this.userInformation.birthday == null) return
      return this.userInformation.birthday.split('T')[0]
    }
  },
  mounted () {
    this.userInformation = this.getUser()
  },
  methods: {
    ...mapActions([
      'setUser'
    ]),
    ...mapGetters([
      'getUser'
    ]),
    needUpdate () {
      this.isUpdated = false
      this.userInformation.birthday = this.getRightDate
    },
    async updateProfile () {
      try {
        const { token, id } = this.userInformation
        const newInfo = {
          id: id,
          user_icon: document.getElementById('user_icon').value,
          nickname: document.getElementById('nickname').value,
          first_name: document.getElementById('first_name').value,
          last_name: document.getElementById('last_name').value,
          birthday: document.getElementById('birthday').value
        }
        /* [
          document.getElementById('user_icon').value,
          document.getElementById('nickname').value,
          document.getElementById('first_name').value,
          document.getElementById('last_name').value,
          document.getElementById('birthday').value
        ]
        if (newInfo.some(element => element === '')) {
          this.error = 'Please fill in all fields!'
          return
        } */
        if (!Object.keys(newInfo).every(key => newInfo[key])) {
          this.$store.dispatch('setInfo', { type: 'danger', message: 'Please fill in all fields' })
          return
        }
        await UpdateInfo.updateProfile({
          data: newInfo,
          token: token
        })
        this.setUser({
          id: id,
          token: token,
          ...newInfo
        })
        this.isUpdated = true
        this.$store.dispatch('setInfo', { type: 'success', message: 'Congratulations! You\'ve successfully updated your profile!' })
      } catch (error) {
        this.$store.dispatch('setInfo', { type: 'danger', message: error.response.data.error })
      }
    }
  }
}
</script>

<style>

</style>
