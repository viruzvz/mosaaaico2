const webpack = require('webpack')
const glob = require('glob')
const path = require('path')
const _ = require('lodash')
const utils = require('./utils')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

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
  return ['css/' + path.basename(_.replace(/less$/, 'css'), '.css'), _]
}))

// setar todos os arquivos de scripts em src/js
const scripts = _.fromPairs(glob.sync('./src/js/*.js').map(_ => {
  return ['js/' + path.basename(_, '.js'), _]
}))

// setar todos os htmls de estilos em src
const htmls = glob.sync('./src/*.{html,pug}').map(template => {
  const filename = path.basename(template).replace(/\.(html|pug)$/, '')
  return new HtmlWebpackPlugin({
    template: template,
    filename: filename + '.html',
    chunks: [
      'js/main', 'css/main',
      'js/vendors', 'css/vendors',
      'js/' + filename, 'css/' + filename
    ]
  })
})

const plugins = [new webpack.NoErrorsPlugin()].concat(htmls)

if (isProduction) {
  plugins.push(new ExtractTextPlugin('[name].[contenthash:5].css'))

  if (utils.fileExists('./src/assets')) {
    plugins.push(new CopyWebpackPlugin([
      { from: './src/assets', to: 'assets' }
    ]))
  }
} else {
  plugins.push(new webpack.NamedModulesPlugin())
}

if (scripts['js/vendors']) {
  plugins.push(
    new webpack.optimize.CommonsChunkPlugin({
      name: 'js/vendors',
      minChunks: Infinity,
      filename: 'js/vendors.[hash:5].js'
    })
  )
}

module.exports = {
  output: {
    filename: '[name].[hash:5].js',
    path: isProduction ? './dist' : void 0,
    // publicPath: isProduction ? '/' : `http://${os.hostname()}:${port}/`
    publicPath: isProduction ? '/' : `http://localhost:${port}/`
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
      loader: 'pug-loader?pretty'
    }, {
      test: /\.(svg|woff|ttf|eot|woff2)(\?.*)?$/i,
      loader: 'file-loader?name=css/fonts/[name]_[hash:base64:5].[ext]'
    }]
  },

  plugins,

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
