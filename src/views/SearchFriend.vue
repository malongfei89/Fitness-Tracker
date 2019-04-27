<template>
  <div>
    <Header>
      <template #customized1>
        <router-link class="btn btn-dark" :to="`/user/${user.id}`">My page</router-link>
      </template>
      <router-link class="btn btn-dark" to="/changePw">Change Password</router-link>
    </Header>
    <div v-if="!findUserSucessfully" class="form-group container mt-4">
      <label for="id">Please enter FitnessID:</label>
      <input type="number" v-model="targetId" class="form-control" id="id">
      <small style="color:red">{{error}}</small>
      <div class="mt-4">
        <button class="btn btn-dark btn-lg" @click="searchFriend">Search</button>
        <router-link class="btn btn-dark btn-lg ml-5" :to="`/user/${user.id}`">Cancle</router-link>
      </div>
    </div>
    <div v-else-if="!addFriendSucessfully" class="form-group container mt-4">
      <label for="id">FitnessID</label>
      <input readonly type="number" class="form-control" id="id" :value="returnedUserInfo.id">
      <br>
      <label for="user_icon">User_icon</label>
      <i :class="this.returnedUserInfo.user_icon" id="user_icon"></i>
      <br>
      <label for="nickname">Nickname</label>
      <input readonly type="text" class="form-control" id="nickname" :value="returnedUserInfo.nickname">
      <label for="name">Name</label>
      <input readonly type="text" class="form-control" id="name" :value="`${returnedUserInfo.first_name} ${returnedUserInfo.last_name}`">
      <label for="birthday">Birthday</label>
      <input readonly type="date" class="form-control" id="birthday" :value="getRightDate">
      <small style="color:red">{{error}}</small>
      <br>
      <button class="btn btn-dark btn-lg mt-5" @click="addFriend">Add</button>
      <router-link class="btn btn-dark btn-lg mt-5 ml-5" :to="`/user/${user.id}`">Cancle</router-link>
    </div>
    <div v-else class="container text-center">
      <h1>It's been added to your friend list successfully!</h1>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header'
import { mapGetters } from 'vuex'
import GetInfo from '@/services/GetInfo'
import UpdateInfo from '@/services/UpdateInfo'

export default {
  data () {
    return {
      targetId: '',
      user: {},
      error: '',
      findUserSucessfully: false,
      returnedUserInfo: {},
      addFriendSucessfully: false
    }
  },
  computed: {
    getRightDate: function () {
      if (this.returnedUserInfo.birthday == null) return
      return this.returnedUserInfo.birthday.split('T')[0]
    }
  },
  mounted () {
    this.user = this.getUser()
  },
  name: 'searchFriend',
  components: { Header },
  methods: {
    ...mapGetters(['getUser']),
    async searchFriend () {
      if (this.targetId === '' || parseInt(this.targetId) === this.user.id) {
        this.error = "FitnessID can't be empty or your FitnessID!"
        return
      }
      try {
        this.error = ''
        this.returnedUserInfo = (await GetInfo.getUserInfo({
          id: parseInt(this.targetId),
          token: this.user.token
        })).data
        this.$router.push({ name: 'searchFriend', query: { id: this.targetId } })
        this.findUserSucessfully = true
      } catch (error) {
        this.error = error.response.data.error
      }
    },
    async addFriend () {
      try {
        this.error = ''
        await UpdateInfo.addFriend({
          data: {
            user_id: this.user.id,
            frie_id: parseInt(this.targetId)
          },
          token: this.user.token
        })
        this.addFriendSucessfully = true
      } catch (error) {
        this.error = error.response.data.error
      }
    }
  }
}
</script>

<style>

</style>
