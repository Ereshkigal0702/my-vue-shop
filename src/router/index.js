import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Roles from '../components/rights/Roles.vue'
import Rights from '../components/rights/Rights.vue'
import Categories from '../components/goods/categories.vue'
import Params from '../components/goods/params.vue'
import Goods from '../components/goods/goods.vue'
import Add from '../components/goods/Add.vue'
import Order from '../components/order/order.vue'
import Report from '../components/report/Report'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  redirect: '/login'
}, {
  path: '/login',
  component: Login
}, {
  path: '/home',
  component: Home,
  redirect: '/welcome',
  children: [{
    path: '/welcome',
    component: Welcome
  }, {
    path: '/users',
    component: Users
  }, {
    path: '/roles',
    component: Roles
  }, {
    path: '/rights',
    component: Rights
  }, {
    path: '/categories',
    component: Categories
  }, {
    path: '/params',
    component: Params
  }, {
    path: '/goods',
    component: Goods
  }, {
    path: '/goods/add',
    component: Add
  }, {
    path: '/orders',
    component: Order
  }, {
    path: '/reports',
    component: Report
  }]
}]

const router = new VueRouter({
  routes
})

// 挂载路由守卫方法
// to 将要访问的路径  from 从哪个路径跳转而来  next 放行函数
// next使用有两种形式 直接next()放行函数  next(path)强制跳转到某一个路径上
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
