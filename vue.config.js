
module.exports = {
    publicPath: '/~mal1/fitness-tracker/',
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