const webpack = require('webpack')
const Config = require('webpack-config').Config
const path = require('path')
const dlv = require('dlv')

module.exports = function (config) {
  const conf = new Config().extend(
    path.join(__dirname, 'config.js')
  ).merge(config)

  if (dlv(config, 'entry.vendors')) {
    conf.merge({
      plugins: [
        new webpack.optimize.CommonsChunkPlugin({
          name: 'vendors',
          minChunks: Infinity,
          filename: 'js/vendors.[hash].js'
        })
      ]
    })
  }

  return conf
}
