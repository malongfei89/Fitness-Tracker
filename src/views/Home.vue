<template>
  <div>
    <Header>
      <template #customized1>
        <router-link v-if="hasUser" class="nav-link" active-class="active" :to="`/user/${user.id}`">My Page</router-link>
        <router-link v-else class="nav-link" active-class="active" to="/register">Register</router-link>
      </template>
      <template #customized2 v-if="!hasUser">
        <router-link class="nav-link" active-class="active" to="/login">Log in<span class="sr-only">(current)</span></router-link>
      </template>
      <button v-else class="btn btn-dark" @click="logout">Log out</button>
    </Header>
    <p class="display-3">Welcome to Fitness Tracker!</p>
    <div class="text-center">
      <p class="lead">Here you can Track your exercise record and share with your friends through your fingertip!</p>
      <img src="https://crhsbaitline.com/wp-content/uploads/2018/03/all-sports-1.png" alt="">
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Header from '@/components/Header'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'home',
  data () {
    return {
      user: {}
    }
  },
  computed: {
    hasUser: function () {
      return this.user.id !== null
    }
  },
  mounted () {
    this.user = this.getUser()
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
    }
  }
}
</script>
