<template>
  <div class="container">
  <form>
  <div class="form-group form-group-lg">
    <label>Email address</label>
    <input type="email" v-model="email" class="form-control" aria-describedby="emailHelp" placeholder="Enter email">
    <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
  </div>
  <div class="form-group form-group-lg">
    <label>Password</label>
    <input type="password" v-model="password" class="form-control" placeholder="Password">
  </div>
  <div>
    <p style="color:red">{{err}}</p>
  </div>
  <button type="button" @click="Register" class="btn btn-primary btn-lg">Register</button>
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
      err: null
    }
  },
  methods: {
    async Register () {
      this.err = null
      try {
        await AuthenticationService.register({
          email: this.email,
          password: this.password
        })
      } catch (error) {
        this.err = error.response.data
      }
    }
  }
}
</script>

<style scoped>

</style>
