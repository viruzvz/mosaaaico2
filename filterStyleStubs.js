function FilterStyleStubs () { }

const mask = /^[/]css[/].*[.]js$/

FilterStyleStubs.prototype.apply = function (compiler) {
  compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-alter-asset-tags', function (tags, callback) {
      tags.body = tags.body.filter(tag => !tag.attributes.src.match(mask))
      callback(null, tags)
    })
  })
}

module.exports = FilterStyleStubs
