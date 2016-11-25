module.exports = (ctx) => {
  return {
    plugins: [
      require('autoprefixer')({ browsers: 'last 2 versions' })
    ]
  }
}
