import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router.js';
import App from './App.vue'
import './styles/common.scss'
// import { url } from '@/config'
import '@/mock/'
//注册自定义组件
import './components/'
//导入主题文件
import '@/theme/index.js'
Vue.config.productionTip = false

// Vue.prototype.url = url;

// 添加实例属性
Object.assign(Vue.prototype, {
  define: require('@/utils/define') // 常量
})

Vue.use(window.AVUE, {
  size: 'mini'
});
Vue.use(ElementUI);
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
