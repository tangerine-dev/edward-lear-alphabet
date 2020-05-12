import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/Dedication.vue')
    },
    {
      path: '/letter-menu',
      name: 'letter-menu',
      component: () => import(/* webpackChunkName: "LetterMenu" */ './views/TheMenu.vue')
    },
    {
      path: '/page/:letter',
      name: 'alphabet-page',
      component: () => import(/* webpackChunkName: "AlphabetPage" */ './views/AlphabetPage.vue')
    },
    {
      path: '*',
      name: '404',
      component: () => import(/* webpackChunkName: "LetterMenu" */ './views/The404.vue')
    }
  ]
})
