import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '@/views/Login'
// import Layout from '@/views/Layout'
// import Home from '@/views/Home'
// import User from '@/views/User'
// import Search from '@/views/Search'
// import SearchResult from '@/views/Search/SearchResult.vue'
// import ArticleDetail from '@/views/ArticleDetail'
// import UserEdit from '@/views/User/UserEdit.vue'
// import Chat from '@/views/Chat'
import { getToken } from '@/utils/token'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/layout/home'
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "Login" */ '@/views/Login')
  },
  {
    path: '/layout',
    component: () => import(/* webpackChunkName: "Layout" */ '@/views/Layout'),
    children: [
      {
        path: 'home',
        component: () => import(/* webpackChunkName: "Home" */ '@/views/Home'),
        meta: {
          scrollT: 0 // 保存首页离开时的位置
        }
      },
      {
        path: 'user',
        component: () => import(/* webpackChunkName: "User" */ '@/views/User')
      }
    ]
  },
  {
    path: '/search',
    component: () => import(/* webpackChunkName: "Search" */ '@/views/Search')
  },
  {
    // 搜索结果页面
    path: '/search_result/:kw',
    component: () => import(/* webpackChunkName: "SearchResult" */ '@/views/Search/SearchResult.vue')
  },
  {
    path: '/articledetail',
    component: () => import(/* webpackChunkName: "ArticleDetail" */ '@/views/ArticleDetail')
  },
  {
    path: '/useredit',
    component: () => import(/* webpackChunkName: "UserEdit" */ '@/views/User/UserEdit.vue')
  },
  {
    path: '/chat',
    component: () => import(/* webpackChunkName: "Chat" */ '@/views/Chat')
  }
]

const router = new VueRouter({
  routes
})

// 优化路由页面 - 路由守卫
// 解决：用户可以通过改地址切换到登录页面
router.beforeEach((to, from, next) => {
  // 判断用户是否登录过了 登录过了 就不用跳转了
  if (getToken()?.length > 0 && to.path === '/login') {
    // next(false) // 留在原地
    next('layout/home')
  } else {
    next() // 其他情况就放行
  }
})

export default router
