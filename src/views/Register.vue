<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <router-link class="navbar-brand" to="/">Fitness Tracker</router-link>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <router-link class="nav-link" active-class="active" to="/register">Register</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" active-class="active" to="/login">Log in<span class="sr-only">(current)</span></router-link>
          </li>
        </ul>
      </div>
    </nav>
    <form class="container mt-4">
      <div class="form-group form-group-lg">
        <label class="col-form-label-lg">Email address</label>
        <ClearableInput
          autocomplete = "off"
          placeholder="Enter email"
          type="email"
          v-model="email" @resetValue="email = ''"/>
        <small
          id="emailHelp"
          class="form-text text-muted"
        >We'll never share your email with anyone else.</small>
      </div>
      <div class="form-group form-group-lg">
        <label class="col-form-label-lg">Password</label>
        <ClearableInput
          autocomplete = "off"
          type="password"
          v-model="password"
          placeholder="Password"
          @resetValue="password = ''"/>
        <small
          id="passwordHelpBlock"
          class="form-text text-muted"
        >Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.</small>
      </div>
      <button type="button" @click="register" class="btn btn-dark btn-lg">Register</button>
    </form>
  </div>
</template>

<script>
import AuthenticationService from '../services/AuthenticationService'
import { setTimeout } from 'timers'
export default {
  name: 'register',
  data () {
    return {
      email: '',
      password: '',
      id: null
    }
  },
  methods: {
    async register () {
      if (!this.email || !this.password) {
        this.$store.dispatch('setInfo', { type: 'danger', message: 'Please fill in all fields' })
        return
      }
      try {
        const data = await AuthenticationService.register({
          username: this.email,
          password: this.password
        })
        const alias = this
        this.id = data.data.insertId
        this.$store.dispatch('setInfo', { type: 'success', message: `Congratulations! You have successfully registered! Your FitnessID is ${this.id}! You can
          log-in now!` })
        setTimeout(() => {
          alias.$router.push('/login')
        }, 1000)
      } catch (error) {
        this.$store.dispatch('setInfo', { type: 'danger', message: error.response.data.error })
      }
    }
  }
}
</script>

<style scoped>
</style>
