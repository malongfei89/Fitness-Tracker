<template>
  <div v-if="!validEmail" class="container mt-4">
    <form>
      <div class="row align-items-center justify-content-center">
        <div class="col-auto">
          <label for="email">Your email address:</label>
        </div>
        <div class="col-4" >
          <ClearableInput id="email" type="email" @resetValue="email = null" v-model="email"/>
        </div>
      </div>
      <div class="row">
        <div class="col-3 offset-5 mt-3">
          <div class="row justify-content-around">
            <button class="btn btn-dark" @click.prevent="initForgetPassword">Submit</button>
            <button class="btn btn-dark" @click.prevent="goBack">Cancle</button>
          </div>
        </div>
      </div>
    </form>
  </div>
  <div v-else-if="!validCode">
    <form>
      <div class="row align-items-center justify-content-center">
        <div class="col-auto">
          <label for="code">Your verification code:</label>
        </div>
        <div class="col-4" >
          <ClearableInput id="code" type="number" @resetValue="code = null" v-model="code"/>
        </div>
      </div>
      <div class="row">
        <div class="col-3 offset-5 mt-3">
          <div class="row justify-content-around">
            <button class="btn btn-dark" @click.prevent="verifyCode">Submit</button>
            <router-link class="btn btn-dark" to="/login">Cancle</router-link>
          </div>
        </div>
      </div>
    </form>
  </div>
  <div v-else>
    <form>
      <div class="row align-items-center justify-content-center">
        <div class="col-auto">
          <label for="newPassword">Enter new password:</label>
        </div>
        <div class="col-4" >
          <ClearableInput id="newPassword" type="password" @resetValue="newPassword = null" v-model="newPassword"/>
        </div>
      </div>
      <div class="row align-items-center justify-content-center mt-3">
        <div class="col-auto">
          <label for="newPassword2">Confirm new password:</label>
        </div>
        <div class="col-4" >
          <ClearableInput id="newPassword2" type="password" @resetValue="newPassword2 = null" v-model="newPassword2"/>
        </div>
      </div>
      <div class="row">
        <div class="col-3 offset-5 mt-3">
          <div class="row justify-content-around">
            <button class="btn btn-dark" @click.prevent="changePassword">Submit</button>
            <router-link class="btn btn-dark" to="/login">Cancle</router-link>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import AuthenticationService from '../services/AuthenticationService'
export default {
  name: 'forgetPassword',
  data: () => {
    return {
      attempts: 0,
      startTime: null,
      email: null,
      code: null,
      generatedCode: null,
      newPassword: null,
      newPassword2: null,
      validEmail: false,
      validCode: false
    }
  },
  methods: {
    async initForgetPassword () {
      try {
        await AuthenticationService.checkIfUserExists(this.email)
        this.validEmail = true
        this.$store.dispatch('setInfo', { type: 'info', message: 'A verification code has been sent to the email you just entered, please check and enter it to verify!' })
        this.generatedCode = (await AuthenticationService.sendCode(this.email)).data
        this.startTime = new Date()
      } catch (error) {
        this.$store.dispatch('setInfo', { type: 'danger', message: error.response.data.error })
        this.email = null
      }
    },
    goBack () {
      this.$router.go(-1)
    },
    verifyCode () {
      // code is valid for 10 mins
      let period = (Date.now() - this.startTime.getTime()) / 600000
      this.attempts++
      if (period > 10 || this.attempts >= 3) {
        this.$store.dispatch('setInfo', { type: 'danger', message: 'You\'ve reached the limit. Please ask for another verification code!' })
        this.attempts = 0
        this.code = this.email = this.generatedCode = this.startTime = null
        this.validEmail = false
      } else if (parseInt(this.code) === this.generatedCode) {
        this.validCode = true
        this.$store.dispatch('setInfo', { type: 'info', message: 'Verification succeed, you can change your password now!' })
      } else {
        this.$store.dispatch('setInfo', { type: 'danger', message: 'Code doesn\'t match, please try again!' })
        this.code = null
      }
    },
    async changePassword () {
      if (this.newPassword === this.newPassword2) {
        await AuthenticationService.resetPassword({
          username: this.email,
          newPassword: this.newPassword
        })
        this.$store.dispatch('setInfo', { type: 'success', message: 'Password has been changed successfully. Log in with new credential!' })
        this.$router.push({
          name: 'login'
        })
      } else {
        this.$store.dispatch('setInfo', { type: 'danger', message: 'The password you entered doesn\'t match, please re-enter them.' })
        this.newPassword = this.newPassword2 = null
      }
    }
  }
}
</script>

<style>

</style>
