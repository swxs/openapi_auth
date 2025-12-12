import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/index.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Index,
    },
    {
      path: '/authorize',
      name: 'authorize',
      component: () => import('./views/authorize.vue'),
    },
    {
      path: '*',
      name: 'NotFound',
      component: () => import('./views/404.vue'),
    },
  ],
})
