import firebase from './firebase/firebase'
import Vue from 'vue'
import Router from 'vue-router'

import Home from './views/Home.vue'
import Login from './views/Login.vue'
import SignUp from './views/SignUp.vue'
import Calendar from './views/Calendar.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        isHome: true
      }
    },
    {
      path: '/connexion',
      name: 'Login',
      component: Login
    },
    {
      path: '/inscription',
      name: 'SignUp',
      component: SignUp
    },
    {
      path: '/calendrier',
      name: 'calendar',
      component: Calendar,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isHome = to.matched.some(record => record.meta.isHome)

  if (!isHome && requiresAuth && !currentUser) next('connexion')
  else if (!isHome && !requiresAuth && currentUser) next('calendrier')
  else next()
})

export default router
