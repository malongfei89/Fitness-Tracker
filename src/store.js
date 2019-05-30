import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    user: {
      token: null,
      id: null,
      first_name: '',
      last_name: '',
      nickname: '',
      birthday: '',
      user_icon: ''
    },
    redirectRoute: {
      name: null,
      id: null
    },
    info: {
      type: null,
      message: null
    }
  },
  getters: {
    getUser: state => state.user,
    getRedirectRoute: state => state.redirectRoute,
    getInfo: state => state.info
  },
  mutations: {
    setUser (state, user) {
      state.user.id = user.id
      state.user.token = user.token
      state.user.first_name = user.first_name
      state.user.last_name = user.last_name
      state.user.user_icon = user.user_icon
      state.user.nickname = user.nickname
      state.user.birthday = user.birthday
    },
    setRedirectRoute (state, toRoute) {
      state.redirectRoute.name = toRoute.name
      state.redirectRoute.id = toRoute.id
    },
    setInfo (state, info) {
      state.info.type = info.type
      state.info.message = info.message
    }
  },
  actions: {
    setUser ({ commit }, user) {
      commit('setUser', user)
    },
    setRedirectRoute ({ commit }, toRoute) {
      commit('setRedirectRoute', toRoute)
    },
    setInfo ({ commit }, info) {
      commit('setInfo', info)
    }
  }
})
