<template>
  <div>
    <Header />
    <form class="container mt-4">
    <div class="form-group form-group-lg">
      <label class="col-form-label-lg">Email address</label>
      <input type="email" v-model="email" class="form-control" aria-describedby="emailHelp" placeholder="Enter email">
      <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
    </div>
    <div class="form-group form-group-lg">
      <label class="col-form-label-lg">Password</label>
      <input type="password" v-model="password" class="form-control" placeholder="Password">
      <small style="color:red">{{error}}</small>
    </div>
    <button type="button" @click="login" class="btn btn-primary btn-lg">Log in</button>
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
        await AuthenticationService.login({
          username: this.email,
          password: this.password
        })
      } catch (error) {
        this.error = error.response.body.error
      }
    }
  }
}
</script>

<style>

</style>
