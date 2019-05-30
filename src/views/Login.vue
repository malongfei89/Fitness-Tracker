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
        <ClearableInput
          type="email"
          v-model="email"
          placeholder="Enter email"
          @resetValue="email = ''"/>
        <small
          id="emailHelp"
          class="form-text text-muted"
        >We'll never share your email with anyone else.</small>
      </div>
      <div class="form-group form-group-lg">
        <label class="col-form-label-lg">Password</label>
        <ClearableInput
          type="password"
          v-model="password"
          placeholder="Password"
          @resetValue="password = ''"/>
      </div>
      <div class="row ml-1">
        <button type="button" @click="login" class="btn btn-dark btn-lg col-1">Log in</button>
        <button type="button" @click="fbLogin" class="btn btn-dark btn-lg offset-1">Log in with Facebook</button>
      </div>
    </form>
  </div>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'
import * as fb from '@/services/FacebookLogin'
// import toastr from 'toastr'
// import { mapGetters } from 'vuex'
export default {
  name: 'login',
  data () {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    async login () {
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
        const redirectRoute = this.$store.getters.getRedirectRoute
        if (redirectRoute.name) {
          if (redirectRoute.id === response.data.id) {
            this.$router.push({ name: redirectRoute.name, params: { id: redirectRoute.id } })
          } else this.$router.push({ name: 'user', params: { id: response.data.id } })
        } else this.$router.push({ name: 'user', params: { id: response.data.id } })
      } catch (error) {
        this.$store.dispatch('setInfo', { type: 'danger', message: error.response.data.error })
        // toastr.error(error.response.data.error) || (this.error = error.response.data.error)
      }
    },
    async fbLogin () {
      const data = await fb.FbLogin()
      console.log(data)
    }
  }
}
</script>

<style>
</style>
