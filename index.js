const Config = require('webpack-config').Config
const path = require('path')

module.exports = function (config) {
  return new Config().extend(
    path.join(__dirname, 'config.js')
  ).merge(config)
}
