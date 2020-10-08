import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/css/styles.css'
import 'font-awesome/css/font-awesome.css'
import axios from 'axios'
import ZkTable from 'vue-table-with-tree-grid'

// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.config.productionTip = false

Vue.component('tree-table', ZkTable)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
