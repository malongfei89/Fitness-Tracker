<template>
  <div>
    <Header>
      <template #customized1>
        <router-link class="nav-link" active-class="active" to="/myProfile">MyProfile</router-link>
      </template>
      <router-link class="btn btn-dark" to="/changePw">Change Password</router-link>
      <button type="button" class="btn btn-dark" @click="logout">Log out</button>
    </Header>
    <p class="display-4 ml-4">Welcome back {{greetname()}} !</p>
    <div class="row">
      <div class="card col-5 ml-5">
        <div class="row bg-secondary">
          <div class="col-8">
            <h2>My work-out records</h2>
          </div>
          <div class="col-4 text-right">
            <button title="New Record" class="btn">
              <span><i class="fas fa-plus"></i></span>
            </button>
          </div>
        </div>
        <ol class="list-group ml-2">
          <li class="" v-for="post in posts" :key="post.id">
            <div class="row">
              <span class="lead font-weight-bold col-8">
                You did {{post.type}} for {{post.amount}}.
              </span>
              <small class="text-right col-4">
                {{calculateTime(new Date(post.created_at))}}
              </small>
            </div>
          </li>
        </ol>
      </div>
      <div class="col-5 offset-1">
        <div class="row bg-secondary">
          <div class="col">
            <h2>My Friends</h2>
          </div>
          <div class="col text-right">
            <button title="Add friend" class="btn">
              <span><i class="fas fa-plus"></i></span>
            </button>
          </div>
        </div>
        <ol class="list-group ml-2">
          <li class="" v-for="friend in friends" :key="friend.frie_id">
            <span class="lead font-weight-bold col-8">
              {{friend.frie_id}}
            </span>
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import GetInfo from '../services/GetInfo'
import Header from '@/components/Header'
export default {
  name: 'user',
  data: function () {
    return {
      user: {},
      posts: [],
      friends: []
    }
  },
  components: {
    Header
  },
  async mounted () {
    this.user = this.getUser()
    const info = (await GetInfo.getInfo({
      data: {
        id: this.user.id
      },
      token: this.user.token
    })).data
    this.posts = info[0]
    this.friends = info[1]
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
    greetname () {
      if (this.user.first_name == null) {
        return 'user'
      } else return this.user.first_name
    },
    calculateTime (date) {
      var diff = Date.now() - date.getTime()
      const day = 1000 * 60 * 60 * 24
      var numOfYears = Math.floor(diff / day / 365)
      var numOfMonths = Math.floor(diff / day / 30)
      var numOfDays = Math.floor(diff / day)
      if (numOfYears > 0) {
        if (numOfYears === 1) {
          return (numOfYears + ' year ago.')
        } else return (numOfYears + ' years ago.')
      } else if (numOfMonths > 0) {
        if (numOfMonths === 1) {
          return (numOfMonths + ' month ago.')
        } else return (numOfMonths + ' months ago.')
      } else if (numOfDays >= 0) {
        if (numOfDays === 0) {
          return ' today.'
        } else if (numOfDays === 1) {
          return ' yesterday.'
        } else return (numOfDays + ' days ago.')
      }
    }
  }
}
</script>

<style>

</style>
