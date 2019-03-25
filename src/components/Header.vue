<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <router-link class="navbar-brand" to="/">Fitness Tracker</router-link>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" >
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
</template>

<script>
export default {
  name: 'Header'
}
</script>

<style>

</style>
