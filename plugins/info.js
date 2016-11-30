function Info () { }

Info.prototype.apply = function (compiler) {
  compiler.plugin('compilation', function (compilation, params) {
    compilation.plugin('succeed-module', function (module) {
      console.log('succeed module')
      console.log(module.resource)
    })
  })
}

module.exports = Info
