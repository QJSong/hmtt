// 封装axios 网络请求
import theAxios from 'axios'
import router from '@/router'
import { Notify } from 'vant'
import { getToken } from './token'

const axios = theAxios.create({
  baseURL: 'http://toutiao.itheima.net',
  timeout: 20000 // 20秒超时 时间（请求超过20秒无响应 直接判定超时）
})

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // ?. 可选链操作符，如果前面对象没有length，整个表达式原地返回undefined
  if (getToken()?.length > 0 && config.headers.Authorization === undefined) {
    config.headers.Authorization = `Bearer ${getToken()}`
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response
}, function (error) {
  console.log(error)
  // 对响应错误做点什么
  if (error.response.status === 401) {
    Notify({ type: 'warning', message: '身份过期了' })
    // 这里不能使用 this.$router 因为this不是vue组件对象无法调用$router
    router.replace('/login')
  }

  return Promise.reject(error)
})

//
export default ({ url, method = 'GET', params = {}, data = {}, headers = {} }) => {
  return axios({
    url,
    method,
    params,
    data,
    headers
  })
}
