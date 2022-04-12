
// 开发环境接口配置
const APIURl = 'http://192.168.0.146:30006'

module.exports = {
  APIURl: APIURl,
  timeout: process.env.NODE_ENV === 'development' ? 1000000 : 1000000,
  comUrl: process.env.VUE_APP_BASE_API
}