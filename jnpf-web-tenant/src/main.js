import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui'
import './assets/scss/common.scss'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI);
Vue.prototype.$ajax = axios;

// 批量引入组件
import components from './components'
Vue.use(components)

// 添加实例属性
Object.assign(Vue.prototype, {
  define: require('./utils/define'), // 常量
})

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')