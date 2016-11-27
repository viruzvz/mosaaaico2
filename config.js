const webpack = require('webpack')
const glob = require('glob')
const path = require('path')
const _ = require('lodash')
const utils = require('./utils')
const FilterStyleStubs = require('./filterStyleStubs.js')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const ENV = process.env.NODE_ENV || 'development'
const port = Number(process.env.PORT) || 8000
const isProduction = ENV === 'production'

const lessLoaders = [
  'style',
  'css?sourceMap',
  'postcss',
  'less?sourceMap'
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
  const chunks = [
    'js/vendors', 'css/vendors',
    'js/main', 'css/main',
    'js/' + filename, 'css/' + filename
  ]
  return new HtmlWebpackPlugin({
    template: template,
    filename: filename + '.html',
    chunks,
    chunksSortMode: (a, b) => {
      return chunks.indexOf(a.names[0]) > chunks.indexOf(b.names[0]) ? 1 : -1
    }
  })
})

const plugins = [new webpack.NoErrorsPlugin()].concat(htmls)

if (isProduction) {
  plugins.push(new ExtractTextPlugin('[name].[contenthash:5].css'))
  plugins.push(new FilterStyleStubs())

  if (utils.fileExists('./src/assets')) {
    plugins.push(new CopyWebpackPlugin([
      { from: './src/assets', to: 'assets' }
    ]))
  }
} else {
  // plugins.push(new webpack.NamedModulesPlugin())
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
    publicPath: isProduction ? '/' : `http://localhost:${port}/`,
    hotUpdateMainFilename: '[hash]/update.json',
    hotUpdateChunkFilename: '[hash]/js/[id].update.js'
  },

  entry: _.assign({}, styles, scripts),

  module: {
    loaders: [{
      test: /\.(less|css)$/,
      loader: isProduction ? ExtractTextPlugin.extract(lessLoaders.slice(1)) : lessLoaders.join('!')
    }, {
      test: /\.json$/,
      loader: 'json'
    }, {
      test: /\.(pug|jade)$/,
      loader: 'pug?pretty'
    }, {
      test: /\.(svg|woff|ttf|eot|woff2)(\?.*)?$/i,
      loader: 'file?name=css/fonts/[name]_[hash:base64:5].[ext]'
    }]
  },

  postcss: function (ctx) {
    return [
      require('autoprefixer')({
        browsers: ['last 3 version', 'ie >= 10']
      })
    ]
  },

  // ainda não é possível importar .less direito pelo mainField
  // resolve: {
  //   mainFields: ['less', 'main']
  // },

  plugins,

  devtool: isProduction ? '' : 'eval-source-map',

  devServer: {
    contentBase: './src',
    publicPath: '/',
    port
  }
}
