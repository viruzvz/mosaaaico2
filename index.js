const webpack = require('webpack')
const Config = require('webpack-config').Config
const path = require('path')
const dlv = require('dlv')

module.exports = function (config) {
  return new Config().extend(
    path.join(__dirname, 'config.js')
  ).merge(config)
}
