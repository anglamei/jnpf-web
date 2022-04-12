import axios from 'axios'
import { Message } from 'element-ui'
import { getUrlParam } from './utils'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000,
})

// request interceptor
service.interceptors.request.use(
  config => {
    config.headers['Authorization'] = getUrlParam('token')
    if (config.method === 'get') {
      config.params = config.data
    } else { }
    return config
  },
  error => {
    if (process.env.NODE_ENV === 'development') {
      console.log(error)
    }
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 200) {
      Message({
        message: res.msg || '请求出错，请重试',
        type: 'error',
        duration: 1500
      })
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    if (process.env.NODE_ENV === 'development') {
      console.log(error) // for debug
    }
    Message({
      message: '请求出错，请重试',
      type: 'error',
      duration: 1500
    })
    return Promise.reject(error)
  }
)

export default service