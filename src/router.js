import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home'
import Register from './views/Register'
import Login from '@/views/Login'
import User from '@/views/User'
import MyProfile from '@/views/MyProfile'
import ChangePw from '@/views/ChangePw'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/user',
      name: 'user',
      component: User
    },
    {
      path: '/myProfile',
      name: 'myProfile',
      component: MyProfile
    },
    {
      path: '/changePw',
      name: 'changePw',
      component: ChangePw
    }
  ]
})
