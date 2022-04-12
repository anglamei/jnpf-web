// 开发环境接口配置
const APIURl = 'http://192.168.0.25:30000'

module.exports = {
  apiURI: APIURl,
  comUploadUrl: process.env.VUE_APP_BASE_API + '/api/visualdev/DataScreen/Images/',
  comUrl: process.env.VUE_APP_BASE_API,
  staticPath: process.env.NODE_ENV === 'development' ? '' : '/dataV'
}