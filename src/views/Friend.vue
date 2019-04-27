<template>
  <div>
    <Header>
      <template #customized1>
        <router-link class="btn btn-dark" :to="`/user/${user.id}`">My page</router-link>
      </template>
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
            <div class="row">
              <button class="col-2 offset-1 btn btn-link" @click="changeThumbUp(record)"><span >
                <i :class="`${record.thumbUpIcon}`"></i>
              </span></button>
              <div class="mt-3">
              <p>{{record.rightThumbUp.length}}</p></div>
              <button class="col-2 offset-1 btn btn-link"><span>
                <i class="far fa-comment-dots"></i>
              </span></button>
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
import Header from '@/components/Header'
import { mapGetters } from 'vuex'
import GetInfo from '../services/GetInfo'
import UpdateInfo from '../services/UpdateInfo'
import { calculateTime } from '@/services/Helper'

export default {
  name: 'friend',
  data: () => {
    return {
      user: {},
      friendProfile: {},
      friendRecord: []
    }
  },
  computed: {
    getRightDate: function () {
      if (this.friendProfile.birthday == null) return
      return this.friendProfile.birthday.split('T')[0]
    }
  },
  async beforeMount () {
    const alias = this
    this.user = this.getUser()
    const friendInfo = (await GetInfo.getFriendInfo({
      id: parseInt(this.$route.params.id),
      token: this.user.token
    })).data
    this.friendProfile = friendInfo[0][0]
    this.friendRecord = friendInfo[1]
    this.friendRecord.forEach(function (record) {
      alias.$set(record, 'rightComment', friendInfo[2][1].filter(comment => comment.records_id === record.id))
      alias.$set(record, 'rightThumbUp', friendInfo[2][0].filter(thumbUp => thumbUp.records_id === record.id))
      if (record.rightThumbUp.find(thumbUp => thumbUp.thumbup_user_id === alias.user.id)) {
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
  },
  components: {
    Header
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
        await UpdateInfo.addRecordCT({
          id: this.friendProfile.id,
          data: {
            records_id: record.id,
            user_id: userId
          },
          token: this.user.token
        })
        record.rightThumbUp.push({
          thumbup_user_id: userId,
          records_id: record.id
        })
        record.thumbUpIcon = 'fas fa-thumbs-up'
      } else {
        let index = record.rightThumbUp.findIndex(thumbUp => thumbUp.thumbup_user_id === userId)
        await UpdateInfo.deleteRecordCT({
          id: this.friendProfile.id,
          CTId: {
            targetRecord: record.rightThumbUp[index].records_id,
            targetUser: record.rightThumbUp[index].thumbup_user_id
          },
          token: this.user.token
        })
        record.thumbUpIcon = 'far fa-thumbs-up'
        record.rightThumbUp.splice(index, 1)
      }
    }
  }
}
</script>

<style>

</style>
