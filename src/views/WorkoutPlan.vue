<template>
  <div>
    <Header>
      <template #customized1>
        <router-link class="nav-link" active-class="active" :to="`/user/${user.id}`">My Page</router-link>
      </template>
      <template #customized2>
        <router-link class="nav-link" active-class="active" to="/myProfile">My Profile</router-link>
      </template>
      <router-link class="btn btn-dark" to="/changePw">Change Password</router-link>
    </Header>
  </div>
</template>
<script>
export default {
  data: function () {
    return {}
  },
  computed: {
    user: function () {
      return this.$store.state.user
    }
  }
}
</script>

<style>

</style>
