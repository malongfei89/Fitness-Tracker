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
        <li class="nav-item">
          <slot name="customized3"></slot>
        </li>
        <li class="nav-item">
          <slot name="customized4"></slot>
        </li>
      </ul>
      <router-link id="inbox" class="btn btn-dark pop-up" :to="`/user/${user.id}/inbox`">
        <i class="far fa-envelope fa-2x" style="position:relative"><i class="fas fa-asterisk fa-xs" v-if="numOfUnreadMessages" id="star" style="font-size:0.75rem"></i></i>
        <span class="pop-up-text" id="mypopup">You have a new message</span>
      </router-link>
      <slot></slot>
      <button type="button" class="btn btn-dark" @click="logout">Log out</button>
    </div>
  </nav>
</template>

<script>
import GetInfo from '../services/GetInfo'
import socket from '../socketServices/socket'
import store from '../store'
import { setTimeout } from 'timers'
export default {
  name: 'Header',
  computed: {
    user: function () {
      return this.$store.state.user
    },
    numOfUnreadMessages: function () {
      return this.$store.state.numOfUnreadMessages
    }
  },
  async mounted () {
    try {
      const newUnread = (await GetInfo.getMessages({
        id: this.user.id,
        token: this.user.token,
        needUnread: 1
      })).data
      if (newUnread[0].total) this.$store.dispatch('setnumOfUnreadMessages', newUnread[0].total)
      socket.currentSocket.on('newMessage', (id) => {
        if (store.state.user.id === id) {
          this.$store.state.numOfUnreadMessages++
          let popUp = document.getElementById('mypopup')
          popUp.classList.add('show')
          setTimeout(() => {
            popUp.classList.remove('show')
          }, 3000)
        }
      })
      socket.currentSocket.on('newResponse', (id) => {
        if (store.state.user.id === id) {
          this.$store.state.numOfUnreadMessages++
          let popUp = document.getElementById('mypopup')
          popUp.classList.add('show')
          setTimeout(() => {
            popUp.classList.remove('show')
          }, 3000)
        }
      })
    } catch (error) {
      this.$store.dispatch('setInfo', {
        type: 'danger',
        message: error.response.data.error
      })
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('setUser', {
        token: null,
        id: null,
        first_name: '',
        last_name: '',
        nickname: '',
        birthday: null,
        user_icon: ''
      })
      this.$store.dispatch('setnumOfUnreadMessages', 0)
      this.$store.commit('setRedirectRoute', {
        name: null,
        id: null
      })
      this.$router.push('/')
    }
  }
}
</script>

<style>
.pop-up {
  color:white;
  display:inline-block;
  position: relative;
}
 .pop-up-text {
  visibility: hidden;
  width: 160px;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 8px 0;
  position: absolute;
  z-index: 2;
  top: 95%;
  left: 50%;
  margin-left: -80px;
}
.pop-up-text::after {
  content: "";
  position: absolute;
  bottom: 88%;
  left: 48%;
  margin-left: -5px;
  border-width: 8px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}
#star {
  visibility: visible;
  position:absolute;
  left:80%;
  top:3%;
  color:red;
}
.show {
  visibility: visible;
  -webkit-animation: fadeIn 1s;
  animation: fadeInout 3s
}
@-webkit-keyframes fadeIn {
  0% {opacity: 0;}
  100% {opacity: 1;}
}
@keyframes fadeIn {
  0% {opacity: 0;}
  100% {opacity: 1;}
}
</style>
