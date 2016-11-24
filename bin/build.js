#!/usr/bin/env node

var fs = require('fs')
var path = require('path')
var appDirectory = fs.realpathSync(process.cwd())

function resolveApp (relativePath) {
  return path.resolve(appDirectory, relativePath)
}

console.log(resolveApp('webpack.config.js'))
