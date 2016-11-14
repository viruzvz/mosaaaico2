var spawn = require('cross-spawn')
var binPath = spawn.sync('npm', ['bin']).stdout.toString().trim()
var path = require('path')
var rimraf = require('rimraf')
var cwd = path.resolve('.')
var script = process.argv[2]

var result


switch (script) {
  case 'build':
    process.env.NODE_ENV = 'production'
    rimraf.sync(path.join(cwd, 'dist'))
    result = runScript('webpack -p --progress')
    rimraf.sync('dist/_css_.*.js')
    process.exit(result)
    break

  case 'dev':
    process.env.NODE_ENV = 'development'
    result = runScript('webpack-dev-server --inline --hot --progress')
    process.exit(result)
    break
}

function runScript (command) {
  command = command.split(' ')
  var result = spawn.sync(
    path.join(binPath, command[0]), command.slice(1),
    { stdio: 'inherit' }
  )
  return result.status
}
