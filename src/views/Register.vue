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
        this.id = data.data.insertId
        this.$store.dispatch('setInfo', { type: 'success', message: `Congratulations! You have successfully registered! Your FitnessID is ${this.id}! You can
          log-in now!` })
      } catch (error) {
        this.$store.dispatch('setInfo', { type: 'danger', message: error.response.data.error })
      }
    }
  }
}
</script>

<style scoped>
</style>
