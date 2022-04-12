import Router from 'vue-router';
import Vue from 'vue';
Vue.use(Router)
const vueRouter = new Router({
  mode: 'history',
  base: '/DataV',
  routes: [
    {
      path: '/build/',
      name: 'newBuild',
      component: () => import( /* webpackChunkName: "page" */ '@/page/build')
    },
    {
      path: '/build/:id',
      name: 'build',
      component: () => import( /* webpackChunkName: "page" */ '@/page/build')
    },
    {
      path: '/view/:id',
      name: 'view',
      component: () => import( /* webpackChunkName: "page" */ '@/page/view')
    }
  ]
})
export default vueRouter;