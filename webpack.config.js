const webpack = require('webpack')
const path = require('path')
const glob = require('glob')
const HtmlPlugin = require('html-webpack-plugin')

const ENV = process.env.NODE_ENV || 'development'
const isProduction = ENV === 'production'

module.exports = {

  entry: [
    './src/js/index.js',
    './src/css/vendors.less',
    './src/css/styles.less'
  ],

  output: {
    filename: isProduction ? '[name].js' : 'bundle.js',
    path: isProduction ? './dist' : '/',
    publicPath: '/'
  },

  module: {
    rules: [
      {
        test: /\.(less|css)$/,
        loaders: isProduction
          ? ['file?name=[name].css', 'extract', 'css', 'postcss', 'less']
          : [{
            loader: 'style'
          }, {
            loader: 'css',
            options: {
              sourceMap: true
            }
          }, {
            loader: 'postcss'
          }, {
            loader: 'less',
            options: {
              sourceMap: true
            }
          }]
      }, {
        test: /\.json$/,
        loader: 'json'
      }, {
        test: /\.(pug|jade)$/,
        loader: 'pug'
      }, {
        test: /\.(svg|woff|ttf|eot|woff2)(\?.*)?$/i,
        loader: 'file?name=fonts/[name]_[hash:base64:5].[ext]'
      }
    ]
  },

  plugins: [
    new webpack.NamedModulesPlugin()
  ].concat(
    glob.sync('src/*.{pug,html}').map(template => {
      return new HtmlPlugin({
        template,
        inject: true,
        filename: path.basename(template).replace(/pug$/, 'html')
      })
    })
  ),

  devtool: isProduction ? '' : 'cheap-eval-source-map',

  devServer: {
    contentBase: './src',
    publicPath: '/',
    compress: true,
    port: process.env.PORT || 8000,
    _setup: function (app) {
      require('./dev/pug-server')(app)
    }
  }

}
