const define = require('./src/utils/define.js')
const fs = require('fs')


module.exports = {
  publicPath: '/DataV',
  outputDir: 'dist',
  runtimeCompiler: true,
  lintOnSave: false,
  // 跨域
  devServer: {
    open: false,
    port: 8100,
    overlay: {
      warnings: false,
      errors: true
    },
    // 接口转发
    proxy: {
      '/dev': {
        target: define.apiURI,
        changeOrigin: true,
        pathRewrite: {
          '^/dev': ''
        }
      }
    }
  },

  chainWebpack: (config) => {
    //忽略的打包文件
    config.externals({
      'vue': 'Vue',
      'vue-router': 'VueRouter',
      'vuex': 'Vuex',
      'axios': 'axios',
      'element-ui': 'ELEMENT',
    })
  }
}