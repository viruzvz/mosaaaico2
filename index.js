const webpack = require('webpack')
const Config = require('webpack-config').Config
const path = require('path')

module.exports = function (config) {
  const conf = new Config().extend(
    path.join(__dirname, 'config.js')
  ).merge(config)

  if (config.entry.vendor) {
    conf.merge({
      plugins: [
        new webpack.optimize.CommonsChunkPlugin({
          name: 'vendor',
          minChunks: Infinity,
          filename: 'vendor.[hash].js'
        })
      ]
    })
  }

  return conf
}
