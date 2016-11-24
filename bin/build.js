#!/usr/bin/env node

var spawn = require('cross-spawn')
var rimraf = require('rimraf')
var script = process.argv[2]
// var args = process.argv.slice(3)

var result
switch (script) {
  case 'build':
    process.env.NODE_ENV = 'production'
    rimraf.sync('./dist')
    result = spawn.sync(
      './node_modules/webpack/bin/webpack.js',
      ['-p', '--progress'],
      { stdio: 'inherit' }
    )
    rimraf.sync('./dist/_css_.*.js')
    process.exit(result.status)
    break

  case 'dev':
    process.env.NODE_ENV = 'development'
    result = spawn.sync(
      './node_modules/webpack-dev-server/bin/webpack-dev-server.js',
      ['--inline', '--hot', '--progress'],
      { stdio: 'inherit' }
    )
    process.exit(result.status)
    break

  default:
    console.log('Unknown script "' + script + '".')
    console.log('Perhaps you need to update react-scripts?')
    break
}

// var appDirectory = fs.realpathSync(process.cwd())
// function resolveApp (relativePath) {
//   return path.resolve(appDirectory, relativePath)
// }
