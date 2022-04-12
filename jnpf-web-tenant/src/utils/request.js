import axios from 'axios'
import { Message } from 'element-ui'
import define from '@/utils/define'


// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: false, // send cookies when cross-domain requests
  timeout: define.timeout, // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {

    if (config.method == 'get') {
      config.params = config.data
    }
    let timestamp = Date.parse(new Date()) / 1000
    if (config.url.indexOf('?') > -1) {
      config.url += `&n=${timestamp}`
    } else {
      config.url += `?n=${timestamp}`
    }
    return config
  },
  error => {
    // do something with request error
    if (process.env.NODE_ENV === 'development') {
      console.log(error) // for debug
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
        type: 'error'
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