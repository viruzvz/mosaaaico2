#!/usr/bin/env node

var spawn = require('cross-spawn')
var rimraf = require('rimraf')
var path = require('path')
var fs = require('fs')
var utils = require('../utils')
var script = process.argv[2]
// var isPublic = process.argv[3] === 'public'

var builderDirectory = fs.realpathSync(__dirname)

var config = utils.fileExists(utils.resolveApp('webpack.config.js'))
  ? [] : ['--config', path.resolve(builderDirectory, '../default.js')]
// config = ['--host', (isPublic ? '0.0.0.0' : 'localhost')].concat(config)

var result
switch (script) {
  case 'build':
    process.env.NODE_ENV = 'production'
    rimraf.sync('./dist')
    result = spawn.sync(
      './node_modules/webpack/bin/webpack.js',
      ['-p', '--progress'].concat(config),
      { stdio: 'inherit' }
    )
    rimraf.sync('./dist/css/*.js')
    process.exit(result.status)
    break

  case 'dev':
    process.env.NODE_ENV = 'development'
    result = spawn.sync(
      './node_modules/webpack-dev-server/bin/webpack-dev-server.js',
      ['--inline', '--watch', '--progress', '--colors'].concat(config),
      { stdio: 'inherit' }
    )
    process.exit(result.status)
    break

  default:
    console.log('Unknown script "' + script + '".')
    console.log('Perhaps you need to update react-scripts?')
    break
}

