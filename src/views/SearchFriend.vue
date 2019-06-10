<template>
  <div>
    <Header>
      <template #customized1>
        <router-link class="nav-link" active-class="active" :to="`/user/${user.id}`">My Page</router-link>
      </template>
      <template #customized2>
        <router-link class="nav-link" active-class="active" to="/myProfile">My Profile</router-link>
      </template>
      <router-link class="btn btn-dark" to="/changePw">Change Password</router-link>
    </Header>
    <div v-if="!findUserSucessfully" class="form-group container mt-4">
      <label for="id">Please enter FitnessID:</label>
      <clearableInput type="text" v-model="targetId" @resetValue="targetId = ''" placeholder="Enter Fitness ID"></clearableInput>
      <div class="mt-4">
        <button class="btn btn-dark btn-lg" @click="searchFriend">Search</button>
        <router-link class="btn btn-dark btn-lg ml-5" :to="`/user/${user.id}`">Cancle</router-link>
      </div>
    </div>
    <div v-else class="form-group container mt-4">
      <label for="id">FitnessID</label>
      <input readonly type="number" class="form-control" id="id" :value="target.id">
      <br>
      <label for="user_icon">User_icon</label>
      <i :class="target.user_icon" id="user_icon"></i>
      <br>
      <label for="nickname">Nickname</label>
      <input readonly type="text" class="form-control" id="nickname" :value="target.nickname">
      <label for="name">Name</label>
      <input readonly type="text" class="form-control" id="name" :value="`${target.first_name} ${target.last_name}`">
      <label for="birthday">Birthday</label>
      <input readonly type="date" class="form-control" id="birthday" :value="getRightDate">
      <br>
      <button class="btn btn-dark btn-lg mt-5" @click="addFriend">Add</button>
      <router-link class="btn btn-dark btn-lg mt-5 ml-5" :to="`/user/${user.id}`">Cancle</router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import GetInfo from '@/services/GetInfo'
import socket from '@/socketServices/socket'

export default {
  data () {
    return {
      target: {},
      targetId: '',
      findUserSucessfully: false
    }
  },
  computed: {
    getRightDate: function () {
      if (this.target.birthday == null) return
      return this.target.birthday.split('T')[0]
    },
    user: function () {
      return this.$store.state.user
    }
  },
  name: 'searchFriend',
  methods: {
    ...mapGetters(['getUser']),
    async searchFriend () {
      if (this.targetId === '' || parseInt(this.targetId) === this.user.id) {
        this.$store.dispatch('setInfo', { type: 'danger', message: 'FitnessID can\'t be empty or your FitnessID!' })
        return
      }
      try {
        this.target = (await GetInfo.getUserInfo({
          toId: parseInt(this.targetId),
          fromId: this.user.id,
          token: this.user.token
        })).data
        this.$router.push({ name: 'searchFriend', query: { id: this.targetId } })
        this.findUserSucessfully = true
      } catch (error) {
        this.$store.dispatch('setInfo', { type: 'danger', message: error.response.data.error })
      }
    },
    async addFriend () {
      socket.currentSocket.emit('newRequest', {
        fromId: this.user.id,
        toId: parseInt(this.targetId),
        mType: 'add-friend'
      })
      socket.currentSocket.on('duplicateRequest', (error) => {
        this.$store.dispatch('setInfo', { type: 'danger', message: error })
        this.$router.push(`/user/${this.user.id}`)
      })
      /* await UpdateInfo.addFriend({
        data: {
          user_id: this.user.id,
          frie_id: parseInt(this.targetId)
        },
        token: this.user.token
      }) */
      this.$store.dispatch('setInfo', { type: 'success', message: 'A request has been sent to the user successfully!' })
      this.$router.push(`/user/${this.user.id}`)
    }
  }
}
</script>

<style>

</style>
