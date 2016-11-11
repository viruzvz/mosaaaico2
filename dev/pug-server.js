var path = require('path')
var pug = require('pug')

module.exports = function (app) {
  app.get('/:page.html', function (req, res) {
    var template = pug.compileFile(
      path.join('./src/pug', req.params.page + '.pug')
    )
    res.set('Content-Type', 'text/html')
    res.send(template({
      require: require
    }))
  })
}
