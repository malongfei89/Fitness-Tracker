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
      <v-select type="number" v-model="targetId" @search="searchFriend" :options="returnedUserInfoId"></v-select>
      <div class="mt-4">
        <button class="btn btn-dark btn-lg" @click="friendProfile">Search</button>
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
      <input readonly type="date" class="form-control" id="birthday" :value="getRightDate2">
      <small style="color:red">{{error}}</small>
      <br>
      <button class="btn btn-dark btn-lg mt-5" @click="addFriend">Add</button>
      <router-link class="btn btn-dark btn-lg mt-5 ml-5" :to="`/user/${user.id}`">Cancle</router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import GetInfo from '@/services/GetInfo'
import UpdateInfo from '@/services/UpdateInfo'
export default {
  data () {
    return {
      target: {},
      targetId: '',
      user: {},
      findUserSucessfully: false,
      returnedUserInfo: [],
      returnedUserInfoId: []
    }
  },
  computed: {
    getRightDate: function () {
      if (this.returnedUserInfo.birthday == null) return
      return this.returnedUserInfo.birthday.split('T')[0]
    },
    getRightDate2: function () {
      if (this.target.birthday == null) return
      return this.target.birthday.split('T')[0]
    }
  },
  mounted () {
    this.user = this.getUser()
  },
  name: 'searchFriend',
  methods: {
    ...mapGetters(['getUser']),
    /* async searchFriend () {
      if (this.targetId === '' || parseInt(this.targetId) === this.user.id) {
        toastr.error("FitnessID can't be empty or your FitnessID!") || (this.error = "FitnessID can't be empty or your FitnessID!")
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
    }, */
    async searchFriend (search) {
      if (search !== '') {
        try {
          this.returnedUserInfo = (await GetInfo.getUserInfo({
            id: parseInt(search),
            token: this.user.token
          })).data
          this.returnedUserInfoId = this.returnedUserInfo.map(user => parseInt(user.id))
        } catch (error) {
          this.$store.dispatch('setInfo', { type: 'danger', message: error.response.data.error })
        }
      }
    },
    friendProfile () {
      this.target = this.returnedUserInfo.filter(user => user.id === this.targetId)[0]
      this.$router.push({ name: 'searchFriend', query: { id: this.targetId } })
      this.findUserSucessfully = true
    },
    async addFriend () {
      try {
        await UpdateInfo.addFriend({
          data: {
            user_id: this.user.id,
            frie_id: parseInt(this.targetId)
          },
          token: this.user.token
        })
        this.$store.dispatch('setInfo', { type: 'danger', message: 'It\'s been added to your friend list successfully!' })
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
