import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home'
import Register from './views/Register'
import Login from '@/views/Login'
import User from '@/views/User'
import MyProfile from '@/views/MyProfile'
import ChangePw from '@/views/ChangePw'
import SearchFriend from '@/views/SearchFriend'
import AddPost from '@/views/AddPost'
import Inbox from '@/views/Inbox'
import Friend from '@/views/Friend'
import store from './store'
import WorkoutPlan from '@/views/WorkoutPlan'
import ForgetPassword from '@/views/ForgetPassword'
Vue.use(Router)

const router = new Router({
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
      path: '/user/:id',
      name: 'user',
      component: User
    },
    {
      path: '/friend/:id',
      name: 'friend',
      component: Friend
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
    },
    {
      path: '/searchFriend',
      name: 'searchFriend',
      component: SearchFriend
    },
    {
      path: '/addPost',
      name: 'addPost',
      component: AddPost
    },
    {
      path: '/user/:id/inbox',
      name: 'inbox',
      component: Inbox
    },
    {
      path: '/user/:id/workoutPlan',
      name: 'workoutPlan',
      component: WorkoutPlan
    },
    {
      path: '/forgetPW',
      name: 'forgetPassword',
      component: ForgetPassword
    }
  ]
})
router.beforeEach((to, from, next) => {
  const user = store.state.user
  const allowedEndPoint = ['home', 'login', 'register', 'forgetPassword']
  if (!allowedEndPoint.includes(to.name) && user.id === null) {
    store.dispatch('setRedirectRoute', {
      name: to.name,
      id: to.params.id
    })
    return next('login')
  }
  next()
})
export default router
