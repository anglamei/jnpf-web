const define = require('./src/utils/define.js')

const port = process.env.port || process.env.npm_config_port || 3100 // dev port
module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: false,
  productionSourceMap: false,
  devServer: {
    port: port,
    open: false,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      '/dev': {
        target: define.APIURl,
        changeOrigin: true,
        pathRewrite: {
          '^/dev': ''
        }
      }
    }
  }
}