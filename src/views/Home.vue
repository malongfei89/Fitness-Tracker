<template>
  <div>
    <Header />
    <Welcome />
  </div>
</template>

<script>
// @ is an alias to /src
import Welcome from '@/components/Welcome.vue'
import Header from '@/components/Header.vue'
export default {
  name: 'home',
  components: {
    Welcome,
    Header
  }
}
</script>
