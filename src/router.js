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
    path: '/check-email',
    name: 'check-email',
    component: () => import('./views/check-email.vue'),
  },
  {
    path: '/verify-email',
    name: 'verify-email',
    component: () => import('./views/verify-email.vue'),
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('./views/forgot-password.vue'),
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: () => import('./views/reset-password.vue'),
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
