const webpack = require('webpack')
const glob = require('glob')
const path = require('path')
const _ = require('lodash')
const utils = require('./utils')
const FilterStyleStubs = require('./plugins/filterStyleStubs.js')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const ENV = process.env.NODE_ENV || 'development'
const port = Number(process.env.PORT) || 8000
const isProduction = ENV === 'production'

const stylesLoaders = [
  'file?name=styles/[name].css',
  'extract',
  // 'style',
  'css?sourceMap',
  'postcss'
]
const lessLoaders = stylesLoaders.concat(['less?sourceMap'])
const sassLoaders = stylesLoaders.concat(['resolve-url', 'sass?sourceMap'])

// setar todos os arquivos de estilos em src/styles
const styles = _.fromPairs(glob.sync('./src/styles/*.{less,scss,css}').map(_ => {
  return ['styles/' + path.basename(_.replace(/(le|sc)ss$/, 'css'), '.css'), _]
}))

// setar todos os arquivos de scripts em src/js
const scripts = _.fromPairs(glob.sync('./src/js/*.js').map(_ => {
  return ['js/' + path.basename(_, '.js'), _]
}))

// const pages = _.fromPairs(glob.sync('./src/pages/*.{pug,html}').map(_ => {
//   return [path.basename(_.replace(/pug$/, 'html'), '.html'), _]
// }))

// setar todos os htmls de estilos em src
const htmls = glob.sync('./src/*.{html,pug}').map(template => {
  const filename = path.basename(template).replace(/\.(html|pug)$/, '')
  return new HtmlWebpackPlugin({
    template: template,
    filename: filename + '.html',
    inject: false,
    chunks: []
  })
})

var plugins = [
  new webpack.NoErrorsPlugin()
]

if (isProduction) {
  plugins = plugins.concat(htmls)
  plugins.push(new FilterStyleStubs())
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    output: {
      comments: false
    },
    compress: {
      warnings: false
    }
  }))

  if (utils.fileExists('./src/assets')) {
    plugins.push(new CopyWebpackPlugin([
      { from: './src/assets', to: 'assets' }
    ]))
  }
}

if (scripts['js/vendors']) {
  plugins.push(
    new webpack.optimize.CommonsChunkPlugin({
      name: 'js/vendors',
      minChunks: Infinity,
      filename: 'js/vendors.js'
    })
  )
}

module.exports = {
  output: {
    filename: '[name].js',
    path: isProduction ? './dist' : void 0,
    // publicPath: isProduction ? '/' : `http://${os.hostname()}:${port}/`
    publicPath: isProduction ? '/' : `http://localhost:${port}/`
  },

  entry: _.assign({}, styles, scripts),

  module: {
    loaders: [{
      test: /\.(css)$/,
      loader: isProduction ? ExtractTextPlugin.extract(stylesLoaders) : stylesLoaders.join('!')
    }, {
      test: /\.(less)$/,
      loader: lessLoaders.join('!')
    }, {
      test: /\.(scss)$/,
      loader: sassLoaders.join('!')
    }, {
      test: /\.json$/,
      loader: 'json'
    }, {
      test: /\.(pug|jade)$/,
      loader: 'pug?pretty&root=' + utils.resolveApp('./node_modules')
    }, {
      test: /\.(svg|woff|ttf|eot|woff2)(\?.*)?$/i,
      loader: isProduction
        ? 'file?name=fonts/[name]_[hash:5].[ext]'
        : 'file?name=fonts/[name].[ext]'
    }]
  },

  postcss: function (ctx) {
    return [
      require('autoprefixer')({
        browsers: ['last 3 version', 'ie >= 10']
      })
    ]
  },

  plugins,

  devtool: isProduction ? '' : 'eval',

  devServer: {
    contentBase: './src',
    publicPath: '/',
    port,
    stats: {
      timings: true,
      chunkModules: false,
      chunks: false
    },
    setup: function (app) {
      require('./dev/pug-server')(app)
    }
  }
}
