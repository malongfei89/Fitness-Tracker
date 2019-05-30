<template>
  <div id="app">
    <div class="row justify-content-center">
      <div v-if="getStatus.type" id="toast" @click="clearInfo" @animationend="clearInfo" :class="`bg-${getStatus.type}`" class="col-3">
        {{getStatus.message}}
      </div>
    </div>
    <router-view />
  </div>
</template>
<script>
export default {
  computed: {
    getStatus () {
      return this.$store.state.info
    }
  },
  methods: {
    clearInfo () {
      this.$store.dispatch('setInfo', { type: null, message: null })
    }
  }
}
</script>

<style>
#toast {
  position:fixed;
  z-index: 1;
  top:35px;
  padding: 15px;
  border-radius: 4px;
  text-align: center;
  color: white;
  animation-name: fadeInOut;
  animation-duration: 2s;
  animation-delay: 3s;
}
@keyframes fadeInOut {
  0% {top:35px;opacity: 0.9;}
  100% {top:20px;opacity: 0.5;}
}
</style>
