import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/main.scss'
import 'bootstrap/dist/js/bootstrap.bundle'
import vSelect from 'vue-select'
import ClearableInput from './components/ClearableInput'
import Header from '@/components/Header'
import socket from './socketServices/socket'
Vue.config.productionTip = false
Vue.component('v-select', vSelect)
Vue.component('ClearableInput', ClearableInput)
Vue.component('Header', Header)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

socket.currentSocket = socket.create()
