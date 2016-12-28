var webpack = require('webpack')
var WebpackDevServer = require('webpack-dev-server')
var gulp = require('gulp')
var webpackConfig = require('./webpack.config')
// test entry file
var testIndex = './test/test.js'
var port = 8080

gulp.task('webpack:test', function (callback) {
  var entry = [
    'stack-source-map/register.js',
    'webpack-dev-server/client?http://localhost:' + port,
    'webpack/hot/dev-server',
    'mocha!' + testIndex
  ]

  var config = Object.create(webpackConfig)
  config.entry = entry
  config.plugins = config.plugins || []
  // webpack need this to send request to webpack-dev-server
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
  // must have
  config.output.path = __dirname
  var compiler = webpack(config)
  var server = new WebpackDevServer(compiler, {
    stats: 'errors-only',
    publicPath: '/',
    inline: true,
    historyApiFallback: false,
  })
  server.listen(port, 'localhost', callback)
})

gulp.task('default', ['webpack:test'])
