const webpack = require('webpack')
const glob = require('glob')
const path = require('path')
const _ = require('lodash')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const ENV = process.env.NODE_ENV || 'development'
const port = Number(process.env.PORT) || 8000
const isProduction = ENV === 'production'

const lessLoaders = [
  { loader: 'style-loader' },
  { loader: 'css-loader', query: { sourceMap: true } },
  { loader: 'postcss-loader' },
  { loader: 'less-loader', query: { sourceMap: true } }
]

// setar todos os arquivos de estilos em src/css
const styles = _.fromPairs(glob.sync('./src/css/*.{less,css}').map(_ => {
  return [path.basename(_).replace(/less$/, 'css'), _]
}))

const scripts = _.fromPairs(glob.sync('./src/js/*.js').map(_ => {
  return [path.basename(_), _]
}))

// setar todos os htmls de estilos em src
const htmls = glob.sync('./src/*.{html,pug}').map(template => {
  const filename = path.basename(template).replace(/\.(html|pug)$/, '')
  return new HtmlWebpackPlugin({
    template: template,
    filename: filename + '.html',
    chunks: _.uniq(['main.js', 'main.css', 'vendors.css', filename + '.js', filename + '.css'])
  })
})

module.exports = {
  output: {
    filename: isProduction ? 'js/[name].[hash].js' : 'js/[name].js',
    path: isProduction ? './dist' : void 0,
    publicPath: isProduction ? '/' : `http://0.0.0.0:${port}/`
  },

  entry: _.assign({}, styles, scripts),

  module: {
    rules: [{
      test: /\.(less|css)$/,
      loaders: isProduction
        ? ExtractTextPlugin.extract({ loader: ['css-loader', 'postcss-loader', 'less-loader'] })
        : lessLoaders
    }, {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }, {
      test: /\.(pug|jade)$/,
      loader: 'pug-loader'
    }, {
      test: /\.(svg|woff|ttf|eot|woff2)(\?.*)?$/i,
      loader: 'file-loader?name=css/fonts/[name]_[hash:base64:5].[ext]'
    }]
  },

  plugins: [
    new webpack.NoErrorsPlugin()
  ].concat(htmls).concat(isProduction ? [
    new ExtractTextPlugin('css/[name].[contenthash].css')
  ] : [
    new webpack.NamedModulesPlugin()
  ]),

  devtool: isProduction ? '' : 'eval-source-map',

  devServer: {
    contentBase: './src',
    publicPath: '/',
    compress: true,
    port,
    setup: function (app) {
      require('./dev/pug-server')(app)
    }
  }
}
