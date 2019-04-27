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
            <router-link title="New Record" class="btn" to="/addPost">
              <span><i class="fas fa-plus"></i></span>
            </router-link>
          </div>
        </div>
        <ol v-if="posts.length !== 0" class="list-group ml-2">
          <li v-for="post in posts" :key="post.id">
            <div class="row">
              <span class="lead font-weight-bold col-8">
                You did {{post.type}} for {{post.amount}}.
              </span>
              <small class="text-right col-4 mt-1">
                Posted {{displayTime(new Date(post.created_at))}}
              </small>
            </div>
          </li>
        </ol>
        <h3 v-else class="text-center">Don't have any work-out record yet?<br>Press + to add some and share with your friend!</h3>
      </div>
      <div class="col-5 offset-1">
        <div class="row bg-secondary">
          <div class="col">
            <h2>My Friends</h2>
          </div>
          <div class="col text-right">
            <router-link title="Add friend" class="btn" to="/searchFriend">
              <span><i class="fas fa-plus"></i></span>
            </router-link>
          </div>
        </div>
        <small class="font-italic">click on names to view friend page</small>
        <ul class="list-group list-group-flush mt-2">
          <li class="list-group-item" v-for="(friend, index) in friends" :key="friend.frie_id">
            <div class="row">
              <div class="col-1 text-left mt-2"><p>{{index + 1}}.</p></div>
              <div class="col-1">
              <i v-if="friend.user_icon !== null" :class="`${friend.user_icon} fa-sm`"></i>
              </div>
              <div class="col-3 offset-1"><router-link class="btn btn-light" :to="`/friend/${friend.frie_id}`">{{friend.nickname || friend.first_name}}</router-link>
            </div>
            <div class="col-5">
            <p class="mt-2">Last post: {{recentPostDate(friend.frie_id)}}</p>
            </div><div class="col-1 text-right">
              <button class="btn" @click="deleteFriend(friend.frie_id, index)">
                <span><i class="fas fa-times fa-2x" title="delete friend"></i></span>
              </button>
            </div></div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import GetInfo from '../services/GetInfo'
import UpdateInfo from '../services/UpdateInfo'
import Header from '@/components/Header'
import toastr from 'toastr'
import { calculateTime } from '@/services/Helper'
export default {
  name: 'user',
  data () {
    return {
      user: {},
      posts: [],
      friends: [],
      activeStatus: []
    }
  },
  computed: {
  },
  components: {
    Header
  },
  async mounted () {
    this.user = this.getUser()
    const info = (await GetInfo.getInfo({
      data: this.user.id,
      token: this.user.token
    })).data
    this.posts = info[0]
    this.friends = info[1]
    this.activeStatus = info[2]
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
      if (this.user.first_name === null) {
        return 'user'
      } else return this.user.first_name
    },
    displayTime (date) {
      return calculateTime(date)
    },
    recentPostDate (id) {
      let minn = this.activeStatus.filter(data => data.user_id === id)
      if (minn[0] === undefined) {
        return 'N/A'
      }
      let min = this.activeStatus.filter(data => data.user_id === id).sort().reverse()[0]
      return this.displayTime(new Date(min.created_at))
    },
    async deleteFriend (id, index) {
      if (confirm('Are you sure you want to remove this friend?')) {
        try {
          await UpdateInfo.deleteFriend({
            id: this.user.id,
            frie_id: id,
            token: this.user.token
          })
          this.friends.splice(index, 1)
        } catch (error) {
          toastr.error(error.response.data.error)
        }
      }
    }
  }
}
</script>

<style>

</style>
