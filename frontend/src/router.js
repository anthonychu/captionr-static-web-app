import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import CaptionHost from './views/CaptionHost.vue'
import CaptionJoin from './views/CaptionJoin.vue'

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
      path: '/host/:meetingId/:hostKey',
      name: 'host',
      component: CaptionHost
    },
    {
      path: '/join/:meetingId',
      name: 'join',
      component: CaptionJoin,
      props: true
    }
  ]
})
