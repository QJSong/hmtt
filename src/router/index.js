import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login'
import Layout from '@/views/Layout'
import Home from '@/views/Home'
import User from '@/views/User'
import Search from '@/views/Search'
import SearchResult from '@/views/Search/SearchResult.vue'
import ArticleDetail from '@/views/ArticleDetail'
import UserEdit from '@/views/User/UserEdit.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/layout/home'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/layout',
    component: Layout,
    children: [
      {
        path: 'home',
        component: Home
      },
      {
        path: 'user',
        component: User
      }
    ]
  },
  {
    path: '/search',
    component: Search
  },
  {
    // 搜索结果页面
    path: '/search_result/:kw',
    component: SearchResult
  },
  {
    path: '/articledetail',
    component: ArticleDetail
  },
  {
    path: '/useredit',
    component: UserEdit
  }
]

const router = new VueRouter({
  routes
})

export default router
