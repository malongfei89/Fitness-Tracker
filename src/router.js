import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home'
import Register from './views/Register'
import Login from '@/views/Login'
import User from '@/views/User'
// import MyProfile from '@/views/MyProfile'
// import ChangePw from '@/views/ChangePw'
// import SearchFriend from '@/views/SearchFriend'
// import AddPost from '@/views/AddPost'
import Inbox from '@/views/Inbox'
// import Friend from '@/views/Friend'
import store from './store'
// import WorkoutPlan from '@/views/WorkoutPlan'
// import ForgetPassword from '@/views/ForgetPassword'
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
      component: () => import(/* webpackChunkName: "friend" */ './views/Friend.vue')
    },
    {
      path: '/myProfile',
      name: 'myProfile',
      component: () => import(/* webpackChunkName: "myProfile" */ './views/MyProfile.vue')
    },
    {
      path: '/changePw',
      name: 'changePw',
      component: () => import(/* webpackChunkName: "changePw" */ './views/ChangePw.vue')
    },
    {
      path: '/searchFriend',
      name: 'searchFriend',
      component: () => import(/* webpackChunkName: "searchFriend" */ './views/SearchFriend.vue')
    },
    {
      path: '/addPost',
      name: 'addPost',
      component: () => import(/* webpackChunkName: "addPost" */ './views/AddPost.vue')
    },
    {
      path: '/user/:id/inbox',
      name: 'inbox',
      component: Inbox
    },
    {
      path: '/user/:id/workoutPlan',
      name: 'workoutPlan',
      component: () => import(/* webpackChunkName: "workoutPlan" */ './views/WorkoutPlan.vue')
    },
    {
      path: '/forgetPW',
      name: 'forgetPassword',
      component: () => import(/* webpackChunkName: "forgetPassword" */ './views/ForgetPassword.vue')
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
