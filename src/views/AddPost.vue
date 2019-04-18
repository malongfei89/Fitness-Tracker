<template>
  <div>
    <Header>
      <template #customized1>
        <router-link class="btn btn-dark" :to="`/user/${user.id}`">My page</router-link>
      </template>
      <router-link class="btn btn-dark" to="/changePw">Change Password</router-link>
    </Header>
    <div class="form-group container mt-4" v-if="!updateSucessfully">
      <label for="">What have you done?</label>
      <select class="custom-select" v-model="newPost.type">
          <option v-for="type in exerciseTypes" :key="type.id" :value="type">{{type.type}}</option>
      </select>
      <label for="">How much have you done that?</label>
      <div class="row">
        <div class="col-5">
          <select class="custom-select" v-model="newPost.unit">
            <option value="time">Time</option>
            <option value="sets">Set(s)</option>
          </select>
          <small id="helpId" class="form-text text-muted">Unit</small>
        </div>
        <div class="col-6 input-group mb-4">
          <input type="text" v-model="newPost.amount" class="form-control" aria-describedby="helpId">
          <div v-if="newPost.unit === 'time'" class="input-group-append">
            <span class="input-group-text"> Hour(s)</span>
          </div>
          <div v-if="newPost.unit === 'sets'" class="input-group-append">
            <span class="input-group-text"> Set(s)</span>
          </div>
        </div>
      </div>
      <small style="color:red">{{error}}</small>
      <div class="mt-4">
        <button class="btn btn-dark btn-lg" @click="addNewPost">Submit</button>
        <router-link class="btn btn-dark btn-lg ml-5" :to="`/user/${user.id}`">Cancle</router-link>
      </div>
    </div>
    <div v-else class="text-center mt-4">
      <h1>Congratulations! It's been added!</h1>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header'
import { mapGetters } from 'vuex'
import GetInfo from '../services/GetInfo'
import UpdateInfo from '../services/UpdateInfo'

export default {
  data: () => {
    return {
      newPost: {
        type: {},
        unit: '',
        amount: ''
      },
      user: {},
      exerciseTypes: null,
      error: '',
      updateSucessfully: false
    }
  },
  async mounted () {
    this.user = this.getUser()
    this.exerciseTypes = (await GetInfo.getExerciseTypes(this.user.token)).data
  },
  name: 'addPost',
  components: { Header },
  methods: {
    ...mapGetters(['getUser']),
    addNewPost () {
      if (!Object.keys(this.newPost).every(key => !!this.newPost[key])) {
        this.error = 'Please fill in all fields!'
        return
      }
      this.error = ''
      UpdateInfo.addPost({
        data: {
          id: this.user.id,
          exer_id: this.newPost.type.id,
          amount: this.newPost.amount
        },
        token: this.user.token
      })
      this.updateSucessfully = true
    }
  }
}
</script>

<style>

</style>
