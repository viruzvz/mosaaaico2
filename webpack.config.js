const webpack = require('webpack')

const ENV = process.env.NODE_ENV || 'development'
const isProduction = ENV === 'production'

module.exports = {

  entry: {
    _css_: ['./src/css/vendors.less', './src/css/styles.less'],
    main: './src/js/index.js'
    // vendor: 'jquery'
  },

  output: {
    filename: '[name].js',
    path: isProduction ? './dist' : '/',
    publicPath: '/'
  },

  module: {
    rules: [{
      test: /\.(less|css)$/,
      loaders: isProduction
        ? ['file-loader?name=[name].css', 'extract-loader', 'css-loader', 'postcss-loader', 'less-loader']
        : [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader',
          options: {
            sourceMap: true
          }
        }, {
          loader: 'postcss-loader'
        }, {
          loader: 'less-loader',
          options: {
            sourceMap: true
          }
        }]
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
      loader: 'file-loader?name=fonts/[name]_[hash:base64:5].[ext]'
    }]
  },

  plugins: [
    new webpack.NamedModulesPlugin(),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor',
    //   minChunks: Infinity,
    //   filename: 'vendor.bundle.js'
    // }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    })
  ],

  devtool: isProduction ? '' : 'eval-source-map',

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
