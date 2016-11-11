var webpack = require('webpack')
var path = require('path')

const ENV = process.env.NODE_ENV || 'development'

module.exports = {

  entry: [
    './src/js/index.js',
    './src/css/vendors.less',
    './src/css/styles.less'
  ],

  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, '/dist'),
    publicPath: '/'
  },

  module: {
    rules: [{
      test: /\.(less|css)$/,
      use: ENV === 'production'
        ? ['file?name=[name].css', 'extract', 'css', 'less']
        : ['style', 'css?sourceMap', 'less?sourceMap']
    }, {
      test: /\.json$/,
      loader: 'json'
    }, {
      test: /\.(svg|woff|ttf|eot|woff2)(\?.*)?$/i,
      loader: 'file?name=fonts/[name]_[hash:base64:5].[ext]'
    }]
  },

  plugins: [
    new webpack.NamedModulesPlugin()
  ],

  devtool: ENV === 'development' ? '' : 'cheap-eval-source-map',

  devServer: {
    contentBase: './src',
    publicPath: '/',
    compress: true,
    port: process.env.PORT || 8000,
    setup: function (app) {
      require('./dev/pug-server')(app)
    }
  }

}
