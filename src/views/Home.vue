<template>
  <div>
    <Header />
    <p class="display-3">Welcome to Fitness Tracker!</p>
    <div class="text-center">
      <p class="lead">Here you can Track your exercise record and share with your friends through your fingertip!</p>
      <img src="https://crhsbaitline.com/wp-content/uploads/2018/03/all-sports-1.png" alt="">
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Header from '@/components/Header.vue'
export default {
  name: 'home',
  components: {
    Header
  }
}
</script>
