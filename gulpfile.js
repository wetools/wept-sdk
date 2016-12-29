var path = require('path')
var growl = require('growl')
var serve = require('gulp-live-serve')
var livereload = require('gulp-livereload')
var webpack = require('webpack')
var webpackStream = require('webpack-stream');
var WebpackDevServer = require('webpack-dev-server')
var gulp = require('gulp')
var webpackConfig = require('./webpack.config')

// example index
var exampleFiles = ['example/*.css', 'example/bundle.js', 'example/index.html']
var main = './example/index.js'
var myConfig = Object.assign({}, webpackConfig, {
  entry: main,
  output: {
    filename: 'bundle.js',
  },
  debug: true,
  devtool: 'cheap-module-eval-source-map',
  watch: true
})

// test entry file
var testIndex = './test/test.js'
var port = 8080

gulp.task('build', ['serve'], function () {
  livereload.listen({
    start: true
  })
  // reload on file change
  var watcher = gulp.watch(exampleFiles)
  watcher.on('change', function (e) {
    livereload.changed(e.path)
    growl(path.basename(e.path))
  })

  return gulp.src('example/index.js')
    .pipe(webpackStream(myConfig))
    .pipe(gulp.dest('example'))
})

// static server
gulp.task('serve', serve({
  root: __dirname,
  middlewares: []
}))

gulp.task('test', function (callback) {
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

gulp.task('default', ['build'])
