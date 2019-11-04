const path = require('path')

module.exports = {
    outputDir: path.resolve(__dirname, './server/public'),
    publicPath: '/',
    devServer: {
        proxy: {
            '/': {
                target: 'http://localhost:3000'
            }
        }
    },
    configureWebpack:{
        optimization: {
          splitChunks: {
            minSize: 10000,
            maxSize: 250000,
          }
        }
      },
    chainWebpack: (config) => {
        config.resolve.symlinks(false)
      },
      productionSourceMap: false
}