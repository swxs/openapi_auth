import { createRouter, createWebHistory } from 'vue-router'
import Index from './views/index.vue'

const routes = [
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
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('./views/404.vue'),
  },
]

export default createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})
