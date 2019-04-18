<template>
  <div>
    <Header>
      <template #customized1>
        <router-link class="nav-link" active-class="active" to="/register">Register</router-link>
      </template>
      <template #customized2>
        <router-link class="nav-link" active-class="active" to="/login">Log in<span class="sr-only">(current)</span></router-link>
      </template>
    </Header>
    <form class="container mt-4">
      <div class="form-group form-group-lg">
        <label class="col-form-label-lg">Email address</label>
        <input
          type="email"
          v-model="email"
          class="form-control"
          aria-describedby="emailHelp"
          placeholder="Enter email"
        >
        <small
          id="emailHelp"
          class="form-text text-muted"
        >We'll never share your email with anyone else.</small>
      </div>
      <div class="form-group form-group-lg">
        <label class="col-form-label-lg">Password</label>
        <input type="password" v-model="password" class="form-control" placeholder="Password">
        <small style="color:red">{{error}}</small>
      </div>
      <button type="button" @click="login" class="btn btn-dark btn-lg">Log in</button>
    </form>
  </div>
</template>

<script>
import Header from '@/components/Header'
import AuthenticationService from '@/services/AuthenticationService'
export default {
  name: 'login',
  components: {
    Header
  },
  data () {
    return {
      email: '',
      password: '',
      error: null
    }
  },
  methods: {
    async login () {
      this.error = null
      try {
        const response = await AuthenticationService.login({
          username: this.email,
          password: this.password
        })
        this.$store.dispatch('setUser', {
          token: response.data.token,
          id: response.data.id,
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          nickname: response.data.nickname,
          birthday: response.data.birthday,
          user_icon: response.data.user_icon
        })
        this.$router.push({ name: 'user', params: { id: response.data.id } })
      } catch (error) {
        this.error = error.response.data.error
      }
    }
  }
}
</script>

<style>
</style>
