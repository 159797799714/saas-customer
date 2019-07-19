import axios from 'axios'
import { Message } from 'element-ui'
import store from '../store'
import { getToken, removeToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: window.location.origin + '/api.php',
  // baseURL: 'http://saas.test.youmitu.com/api.php/',
  // baseURL: process.env.BASE_URL + (process.env.NODE_ENV === 'development' ? '' : '/api.php'), // api 的 base_url,
  timeout: 5000 // 请求超时时间
})
// request拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['authorization'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    } else {
      if (sessionStorage.Authorization) {
        config.headers['authorization'] = sessionStorage.Authorization// 让每个请求携带自定义token 请根据实际情况自行修改
      }
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    if (response.status === 200 || response.status === 201) {
      // return response
      if (response.data.code === -1) {
        removeToken()
        return false
      } else {
        return response
      }
    }
  },
  error => {
    // console.log('错误' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
