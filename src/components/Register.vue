<template>
  <div>
    <Header />
    <form v-if="!registerSucceeded" class="container mt-4">
      <div class="form-group form-group-lg">
        <label class="col-form-label-lg">Email address</label>
        <input type="email" v-model="email" class="form-control" aria-describedby="emailHelp" placeholder="Enter email">
        <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
      </div>
      <div class="form-group form-group-lg">
        <label class="col-form-label-lg">Password</label>
        <input type="password" v-model="password" class="form-control" placeholder="Password">
        <small id="passwordHelpBlock" class="form-text text-muted">Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
        </small>
        <small style="color:red">{{error}}</small>
      </div>
      <button type="button" @click="register" class="btn btn-primary btn-lg">Register</button>
    </form>
    <p class="text-center display-4" v-else>Congratulations! You have successfully registered! You can <span><router-link to="/login">log-in</router-link></span> now!</p>
  </div>
</template>

<script>
import AuthenticationService from '../services/AuthenticationService'
import Header from '@/components/Header'
export default {
  name: 'register',
  data () {
    return {
      email: '',
      password: '',
      registerSucceeded: false,
      error: null
    }
  },
  components: {
    Header
  },
  methods: {
    async register () {
      this.error = null
      try {
        await AuthenticationService.register({
          username: this.email,
          password: this.password
        })
      } catch (error) {
        this.error = error.response.data.error
      } finally {
        if (this.error === null) this.registerSucceeded = true
      }
    }
  }
}
</script>

<style scoped>

</style>
