const webpack = require('webpack')
const ENV = process.env.NODE_ENV || 'development'
const isProduction = ENV === 'production'

module.exports = {
  output: {
    filename: isProduction ? '[name].[hash].js' : '[name].js',
    path: isProduction ? './dist' : void 0,
    publicPath: isProduction ? '/' : `http://0.0.0.0:${process.env.PORT || 8000}/`
  },

  module: {
    rules: [{
      test: /\.(less|css)$/,
      loaders: isProduction
        ? ['file-loader?name=[name].[hash:base64:5].css', 'extract-loader', 'css-loader', 'postcss-loader', 'less-loader']
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
    new webpack.NoErrorsPlugin()
  ].concat(isProduction ? [] : [
    new webpack.NamedModulesPlugin()
  ]),

  devtool: isProduction ? '' : 'eval-source-map',

  devServer: {
    contentBase: './src',
    publicPath: '/',
    compress: true,
    port: Number(process.env.PORT) || 8000,
    setup: function (app) {
      require('./dev/pug-server')(app)
    }
  }
}
