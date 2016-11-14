const mosaaaico = require('mosaaaico2')

module.exports = mosaaaico({
  entry: {
    _css_: [
      './src/css/vendors.less',
      './src/css/styles.less'
    ],
    // main: './src/js/main.js',
    vendor: 'jquery'
  }
})
