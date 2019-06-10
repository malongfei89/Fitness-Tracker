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
    <div class="container row mt-4">
    <div class="col-6 card offset-1">
      <div class="row bg-secondary">
        <h2 class="ml-2">{{friendProfile.first_name}}'s work-out records</h2>
      </div>
      <ol v-if="friendRecord.length !== 0" class="list-group ml-2">
        <li v-for="(record, index) in friendRecord" :key="index">
          <div class="row">
            <span class="lead font-weight-bold col-8">
              {{friendProfile.first_name}} did {{record.type}} for {{record.amount}}.
            </span>
            <small class="text-right col-4 mt-2">
              Posted {{displayTime(new Date(record.created_at))}}
            </small>
          </div>
          <div class="row mt-2">
            <div class="col-2 offset-1">
              <button class=" btn btn-link" @click="changeThumbUp(record)">
                <span >
                <i :class="[record.thumbUpIcon]"> {{record.thumbUps.length}}</i>
                </span>
              </button>
            </div>
            <button @click="record.showComment = !record.showComment" class="col-2 btn btn-link">
              <span>
                <i class="far fa-comment-dots"> {{record.numOfComments}}</i>
              </span>
            </button>
          </div>
            <div v-if="record.showComment" class="card">
              <div class="row mt-2">
                <span class="col-2"><i :class="`${user.user_icon}`">:</i></span>
                <div class="col-9">
                  <textarea :id="`textArea${index}`" v-model="record.newComment" @input="updateHeight" @keydown.enter.exact="postNewComment(record, index)" @keydown.ctrl.enter.exact="record.newComment += '\n'" placeholder="write a comment" style="resize:none" class="form-control"></textarea>
                  <small>press Enter to post.</small>
                </div>
              </div>
              <div class="ml-5 row align-items-center">
                <ul class="col list-group list-group-flush">
                  <li class="list-group-item" v-for="(comment, index2) of record.comments" :key="index2">
                    {{comment.first_name}}: {{comment.comment_text}}
                    <button class="btn ml-2" v-if="comment.first_name == user.first_name" @click="deleteComment(record, index2)">
                     <i class="fas fa-trash-alt fa-sm"/>
                    </button>
                  </li>
                </ul>
                <div class="w-100"></div>
                <button v-if="record.comments.length < record.numOfComments" class="col btn btn-link text-center" @click="getMoreComments(record, record.comments.length)">more comments</button>
              </div>
            </div>
        </li>
      </ol>
        <h2 v-else>
        {{friendProfile.first_name}} has no work-out record yet.</h2>
    </div>
    <div class="col-4 form-group offset-1">
      <label for="id">FitnessID</label>
      <input readonly type="number" class="form-control" id="id" :value="friendProfile.id">
      <br>
      <label for="user_icon">User_icon</label>
      <i :class="friendProfile.user_icon" id="user_icon"></i>
      <br>
      <label for="nickname">Nickname</label>
      <input readonly type="text" class="form-control" id="nickname" :value="friendProfile.nickname">
      <label for="name">Name</label>
      <input readonly type="text" class="form-control" id="name" :value="`${friendProfile.first_name} ${friendProfile.last_name}`">
      <label for="birthday">Birthday</label>
      <input readonly type="date" class="form-control" id="birthday" :value="getRightDate">
    </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import GetInfo from '../services/GetInfo'
import UpdateInfo from '../services/UpdateInfo'
import { calculateTime } from '@/services/Helper'

export default {
  name: 'friend',
  data: () => {
    return {
      friendProfile: {},
      friendRecord: []
    }
  },
  computed: {
    getRightDate: function () {
      if (this.friendProfile.birthday == null) return
      return this.friendProfile.birthday.split('T')[0]
    },
    user: function () {
      return this.$store.state.user
    }
  },
  async beforeMount () {
    const alias = this
    try {
      const friendInfo = (await GetInfo.getFriendInfo({
        id: parseInt(this.$route.params.id),
        token: this.user.token
      })).data
      this.friendProfile = friendInfo[0][0]
      this.friendRecord = friendInfo[1]
      this.friendRecord.forEach(function (record, index) {
        alias.$set(record, 'comments', friendInfo[2][index].comments)
        alias.$set(record, 'numOfComments', friendInfo[2][index].numOfComments)
        alias.$set(record, 'thumbUps', friendInfo[2][index].thumbUps)
        alias.$set(record, 'showComment', false)
        alias.$set(record, 'newComment', '')
        if (record.thumbUps.find(thumbUp => thumbUp.thumbup_user_id === alias.user.id)) {
          // two different ways to add new properties to an object
          Object.defineProperties(record, {
            'hasThumbUp': { value: true, writable: true, enumerable: true },
            'thumbUpIcon': { value: 'fas fa-thumbs-up', writable: true, enumerable: true }
          })
          // alias.$set(record, 'hasThumbUp', true)
          // alias.$set(record, )
        } else {
          alias.$set(record, 'hasThumbUp', false)
          alias.$set(record, 'thumbUpIcon', 'far fa-thumbs-up')
        }
      })
    } catch (error) {
      this.$store.dispatch('setInfo', { type: 'danger', message: error.response.data.error })
    }
  },
  methods: {
    ...mapGetters(['getUser']),
    displayTime (date) {
      return calculateTime(date)
    },
    async changeThumbUp (record) {
      record.hasThumbUp = !record.hasThumbUp
      const userId = this.user.id
      if (record.hasThumbUp) {
        try {
          let returnedId = (await UpdateInfo.addRecordCT({
            id: this.friendProfile.id,
            data: {
              type: 'thumbUp',
              records_id: record.id,
              user_id: userId
            },
            token: this.user.token
          })).id
          record.thumbUps.push({
            id: returnedId,
            thumbup_user_id: userId,
            records_id: record.id
          })
          record.thumbUpIcon = 'fas fa-thumbs-up'
        } catch (error) {
          this.$store.dispatch('setInfo', { type: 'danger', message: error.response.data.error })
        }
      } else {
        let index = record.thumbUps.findIndex(thumbUp => thumbUp.thumbup_user_id === userId)
        try {
          await UpdateInfo.deleteRecordCT({
            id: this.friendProfile.id,
            token: this.user.token,
            CTId: {
              id: record.thumbUps[index].id,
              type: 'thumbUp'
            }
          })
          record.thumbUpIcon = 'far fa-thumbs-up'
          record.thumbUps.splice(index, 1)
        } catch (error) {
          this.$store.dispatch('setInfo', { type: 'danger', message: error.response.data.error })
        }
      }
    },
    updateHeight () {
      let allTextArea = document.getElementsByTagName('textarea')
      for (let tx of allTextArea) {
        tx.style.height = 'auto'
        tx.style.height = tx.scrollHeight + 'px'
      }
    },
    async postNewComment (record, index) {
      record.newComment = record.newComment.trim()
      if (record.newComment !== '') {
        /* let returnedId = (await UpdateInfo.addRecordCT({
          data: {
            type: 'comment',
            records_id: record.id,
            comment_user_id: this.user.id,
            comment_text: record.newComment
          },
          token: this.user.token
        })).id
        record.comments.push({
          id: returnedId,
          comment_text: record.newComment,
          first_name: this.user.first_name,
          comment_user_id: this.user.id,
          records_id: record.id
        }) */
        try {
          await UpdateInfo.addRecordCT({
            data: {
              type: 'comment',
              records_id: record.id,
              comment_user_id: this.user.id,
              comment_text: record.newComment
            },
            token: this.user.token
          })
          record.numOfComments++
          record.newComment = ''
          document.getElementsByTagName('textarea')[index].setAttribute('style', 'height:40px;resize:none;')
        } catch (error) {
          this.$store.dispatch('setInfo', { type: 'danger', message: error.response.data.error })
        }
      }
    },
    /* goToNewLine (record, index) {
      record.newComment += '\n'
      let currentEl = document.getElementsByTagName('textarea')[index]
      currentEl.style.height = 'auto'
      currentEl.style.height = currentEl.scrollHeight + 'px'
    } */
    async deleteComment (record, index) {
      if (confirm('Do you mean that you want to delete this comment?')) {
        try {
          await UpdateInfo.deleteRecordCT({
            id: this.friendProfile.id,
            token: this.user.token,
            CTId: {
              id: record.comments[index].id,
              type: 'comment'
            }
          })
          record.numOfComments--
          record.comments.splice(index, 1)
        } catch (error) {
          this.$store.dispatch('setInfo', { type: 'danger', message: error.response.data.error })
        }
      }
    },
    async getMoreComments (record, start) {
      try {
        let moreComments = (await GetInfo.getFriendInfo({
          id: this.friendProfile.id,
          token: this.user.token,
          recordInfo: {
            id: record.id,
            offset: start
          }
        })).data
        for (let comment of moreComments) record.comments.push(comment)
      } catch (error) {
        this.$store.dispatch('setInfo', { type: 'danger', message: error.response.data.error })
      }
    }
  }
}
</script>

<style>

</style>
