var pug = require('pug')
var sanitize = require('sanitize-filename')
var fs = require('fs')

module.exports = function (app) {
  app.get('/', function (req, res, next) {
    req.url = '/index.html'
    next()
  })

  app.get('/:page.html', function (req, res) {
    res.set('Content-Type', 'text/html')

    var filename = sanitize(req.params.page)
    var htmlFile = `./src/${filename}.html`
    var pugFile = `./src/${filename}.pug`

    if (fileExists(htmlFile)) {
      res.sendFile(htmlFile)
    } else if (fileExists(pugFile)) {
      var template = pug.compileFile(pugFile)
      res.send(template({
        require: require
      }))
    } else {
      res.status(404).send(`Nem ${htmlFile} nem ${pugFile} foram encontrados...`)
    }
  })
}

var fileExists = function (filepath) {
  try {
    fs.accessSync(filepath, fs.constants.F_OK)
    return true
  } catch (e) {
    return false
  }
}
