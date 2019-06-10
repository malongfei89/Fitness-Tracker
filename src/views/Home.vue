<template>
  <div>
    <Header v-if="hasUser.id">
      <template #customized1>
        <router-link class="nav-link" active-class="active" :to="`/user/${hasUser.id}`">My Page</router-link>
      </template>
      <template #customized2>
        <router-link class="nav-link" active-class="active" to="/myProfile">My Profile</router-link>
      </template>
      <router-link class="btn btn-dark" to="/changePw">Change Password</router-link>
    </Header>
    <nav v-else class="navbar navbar-expand-lg navbar-dark bg-dark">
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
    <p class="display-3">Welcome to Fitness Tracker!</p>
    <div class="text-center">
      <p class="lead">Here you can Track your exercise record and share with your friends through your fingertip!</p>
      <img src="https://crhsbaitline.com/wp-content/uploads/2018/03/all-sports-1.png" alt="">
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
  computed: {
    hasUser: function () {
      return this.$store.state.user
    }
  }
}
</script>
