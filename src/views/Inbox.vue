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
    <div class="container">
      <h3>Inbox</h3>
      <div class="row">
        <ul class="list-group col-6">
          <li class="list-group-item">
            <div class="row">
              <div class="col-3 offset-1">From</div>
              <div class="col-3">About</div>
              <div class="col-4">When</div>
            </div>
          </li>
          <li class="list-group-item messageItem" v-for="(message, index) of allMessages" :key="index" @click="openMessage(index)">
            <div class="row align-items-center">
              <div class="col-1" v-if="!message.is_read"><i class="fas fa-circle" style="color:blue"></i></div>
              <div class="col-1" v-else><i class="fas fa-circle" style="color:white"></i></div>
              <div class="col-3">{{message.nickname || message.first_name}}</div>
              <div class="col-3">{{message.message_type}}</div>
              <div class="col-4">{{getRightDate(new Date(message.created_at))}}</div>
              <div class="col-1">
                <button class="btn" @click.stop="deleteMessage(index)">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          </li>
        </ul>
        <div class="col-3 card d-none" id="message">
          <div class="text-right">
            <button class="btn" @click="closeMessage">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="card-body">
            <div class="card-title">Dear {{user.nickname || user.first_name}},</div>
            <div id="messagedetail" class="card-text mt-2"></div>
            <div class="mt-2">
              <router-link class="btn btn-dark" :to="`/friend/${currentMessage.fromId}`">View profile</router-link>
            </div>
            <div class="mt-2" id="process-button-group" v-if="!currentMessage.process_result">
              <button class="btn-sm btn-dark" @click="acceptRequest">Accept</button>
              <button class="ml-3 btn-sm btn-dark" @click="declineRequest">Decline</button>
            </div>
            <p class="mt-2" v-else>{{currentMessage.process_result}} by you {{getRightDate(new Date(currentMessage.last_update))}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import socket from '../socketServices/socket'
import GetInfo from '../services/GetInfo'
import UpdateInfo from '../services/UpdateInfo'
import { calculateTime } from '@/services/Helper'
export default {
  name: 'inbox',
  data: () => {
    return {
      allMessages: [],
      currentMessage: {}
    }
  },
  computed: {
    user: function () {
      return this.$store.state.user
    }
  },
  async mounted () {
    try {
      this.allMessages = (await GetInfo.getMessages({
        id: this.user.id,
        token: this.user.token,
        needUnread: 0
      })).data
      socket.currentSocket.on('unexpected', (message) => {
        this.$store.dispatch('setInfo', { type: 'danger', message: message })
      })
    } catch (error) {
      this.$store.dispatch('setInfo', { type: 'danger', message: error.data.response.error })
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
    },
    getRightDate (date) {
      return calculateTime(date)
    },
    async openMessage (index) {
      const openReadMessage = this.allMessages[index].is_read
      document.getElementById('message').classList.remove('d-none')
      if (!openReadMessage) this.$set(this.allMessages[index], 'is_read', true)
      this.currentMessage = this.allMessages[index]
      this.currentMessage.index = index
      switch (this.currentMessage.message_type) {
        case 'add-friend':
          document.getElementById('messagedetail').innerHTML = `${this.currentMessage.nickname || this.currentMessage.first_name} wants to be your friend!`
          break
        case 'notification':
          if (this.currentMessage.process_result === 'accepted') {
            document.getElementById('messagedetail').innerHTML = `Congratulations! ${this.currentMessage.nickname || this.currentMessage.first_name} has accepted your ${this.currentMessage.related_to} request!`
          } else if (this.currentMessage.process_result === 'declined') {
            document.getElementById('messagedetail').innerHTML = `Unfortunately, ${this.currentMessage.nickname || this.currentMessage.first_name} has declined your ${this.currentMessage.related_to} request!`
          }
          break
        default:
          break
      }
      if (!openReadMessage) {
        try {
          await UpdateInfo.updateMessage({
            id: this.user.id,
            token: this.user.token,
            info: {
              is_read: 1,
              id: this.currentMessage.mId
            }
          })
          this.$store.state.numOfUnreadMessages--
        } catch (error) {
          this.$store.dispatch('setInfo', { type: 'danger', message: error.data.response.error })
        }
      }
    },
    async acceptRequest () {
      switch (this.currentMessage.message_type) {
        case 'add-friend': {
          try {
            await UpdateInfo.responseToRequest({
              token: this.user.token,
              data: {
                id: this.currentMessage.mId,
                type: 'add-friend',
                process_result: 'accepted',
                user_id: this.currentMessage.fromId,
                frie_id: this.user.id
              }
            })
            this.$set(this.currentMessage, 'last_update', `${new Date()}`)
            this.$set(this.currentMessage, 'process_result', 'accepted')
            this.$store.dispatch('setInfo', { type: 'success', message: `You've accepted the request from ${this.currentMessage.nickname || this.currentMessage.first_name}!` })
            this.allMessages[this.currentMessage.index].process_result = 'accepted'
            socket.currentSocket.emit('requestMade', {
              type: 'add-friend',
              decision: 'accepted',
              fromId: this.currentMessage.fromId,
              toId: this.user.id,
              id: this.currentMessage.id
            })
          } catch (error) {
            this.$store.dispatch('setInfo', { type: 'danger', message: error.data.response.error })
          }
        }
      }
    },
    async declineRequest () {
      switch (this.currentMessage.message_type) {
        case 'add-friend': {
          try {
            await UpdateInfo.responseToRequest({
              token: this.user.token,
              data: {
                id: this.currentMessage.mId,
                type: 'add-friend',
                process_result: 'declined',
                user_id: this.currentMessage.fromId,
                frie_id: this.user.id
              }
            })
            this.$set(this.currentMessage, 'last_update', `${new Date()}`)
            this.$set(this.currentMessage, 'process_result', 'declined')
            this.$store.dispatch('setInfo', { type: 'success', message: `You've declined the request from ${this.currentMessage.nickname || this.currentMessage.first_name}!` })
            this.allMessages[this.currentMessage.index].process_result = 'declined'
            socket.currentSocket.emit('requestMade', {
              type: 'add-friend',
              decision: 'declined',
              fromId: this.currentMessage.fromId,
              toId: this.user.id,
              id: this.currentMessage.id
            })
          } catch (error) {
            this.$store.dispatch('setInfo', { type: 'danger', message: error.data.response.error })
          }
        }
      }
    },
    closeMessage () {
      document.getElementById('message').classList.add('d-none')
    },
    async deleteMessage (index) {
      console.log(index)
      try {
        await UpdateInfo.deleteMessage({
          id: this.user.id,
          mId: this.allMessages[index].mId,
          token: this.user.token
        })
        if (this.currentMessage.index === index) {
          this.closeMessage()
          this.currentMessage = {}
        }
        this.allMessages.splice(index)
      } catch (error) {
        this.$store.dispatch('setInfo', {
          type: 'danger',
          message: error.response.data.error
        })
      }
    }
  }
}
</script>

<style>
.messageItem :hover{
  cursor: pointer;
}
</style>
