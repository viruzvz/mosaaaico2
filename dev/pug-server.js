var pug = require('pug')
var sanitize = require('sanitize-filename')
var express = require('express')
var utils = require('../utils')

module.exports = function (app) {
  app.use('/~', express.static('./node_modules'))

  app.get('/', function (req, res, next) {
    req.url = '/index.html'
    next()
  })

  app.get(/[.](le|sc)ss$/, function (req, res, next) {
    res.redirect(req.url.replace(/(le|sc)ss$/, 'css'))
  })

  app.get('/:page.html', function (req, res) {
    res.set('Content-Type', 'text/html')

    var filename = sanitize(req.params.page)
    var htmlFile = `./src/${filename}.html`
    var pugFile = `./src/${filename}.pug`

    if (utils.fileExists(htmlFile)) {
      res.sendFile(htmlFile, { root: utils.resolveApp('.') })
    } else if (utils.fileExists(pugFile)) {
      var template = pug.compileFile(pugFile)
      res.send(template({
        require: require
      }))
    } else {
      res.status(404).send(`Nem ${htmlFile} nem ${pugFile} foram encontrados...`)
    }
  })
}
