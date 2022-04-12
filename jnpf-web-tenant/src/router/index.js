import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routerList = [{
    path: '/',
    redirect: '/tenant'
  },
  {
    path: '/tenant',
    name: 'tenant',
    component: resolve => require(['@/views/tenant'], resolve),
    meta: {
      title: 'JNPF多租户中心'
    }
  },
]

const router = new Router({
  mode: 'history',
  routes: routerList
})

export default router