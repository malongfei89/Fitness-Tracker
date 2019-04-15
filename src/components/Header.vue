<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <router-link class="navbar-brand" to="/">Fitness Tracker</router-link>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item">
          <slot name="customized1"></slot>
        </li>
        <li class="nav-item">
          <slot name="customized2"></slot>
        </li>
      </ul>
      <slot></slot>
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
