var fs = require('fs')
var path = require('path')

var appDirectory = fs.realpathSync(process.cwd())

module.exports.resolveApp = function (relativePath) {
  return path.resolve(appDirectory, relativePath)
}

module.exports.fileExists = function (filePath) {
  try {
    fs.accessSync(filePath, fs.constants.F_OK)
    return true
  } catch (e) {
    return false
  }
}
