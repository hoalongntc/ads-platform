import gulp from 'gulp'
import nodemon from 'gulp-nodemon'
import eslint from 'gulp-eslint'
import rename from 'gulp-rename'
import clean from 'gulp-clean'
import loopbackAngular from 'gulp-loopback-sdk-angular'
import runSequence from 'run-sequence'
import webpack from 'webpack'
import webpackConfig from './webpack.config.js'
import WebpackDevServer from 'webpack-dev-server'

const serverConfig = require('./server/config.json');
const debugEnabled = process.env.DEBUG_API
const apiUrl = process.env.API_URL || `http://${serverConfig.host || '0.0.0.0'}:${serverConfig.port || '3000'}${serverConfig.restApiRoot || '/api'}`
const babelNode = './node_modules/.bin/babel-node'
const exec = debugEnabled ? `${babelNode} --debug` : `${babelNode}`

// ESLint configuration
gulp.task('lint', () => gulp
  .src([
    // 'client/**/*.js',
    'common/**/*.js',
    'server/**/*.js',
    'client/app/**/*.js',
  ])
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError())
)

// This task wraps around the three tasks below
gulp.task('loopback', (cb) => runSequence(
  'loopback:before',
  'loopback:codegen',
  'loopback:after',
  cb)
)

// Set the ENV env var to 'codegen' to skip some boot scripts.
gulp.task('loopback:before', () => {
  global.originalEnv = process.env.ENV
  process.env.ENV = 'codegen'
})

// Restore the original value of the ENV env var store by the loopback:before script
gulp.task('loopback:after', () => {
  process.env.ENV = global.originalEnv
})

// The actual generation of the LoopBack Angular SDK
gulp.task('loopback:codegen', () => gulp
  .src('./server/server.js')
  .pipe(loopbackAngular({ apiUrl: apiUrl }))
  .pipe(rename('lb-services.js'))
  .pipe(gulp.dest('./client/lib'))
)

// Serve the LoopBack server with nodemon
gulp.task('serve', () => nodemon({
  exec,
  script: 'server/server.js',
  watch: [ 'server/', 'common/' ],
  ext: 'js json',
  tasks: [ 'lint' ]
}))

// Clean webpack
gulp.task('webpack:clean', () => gulp
  .src('client/dist', {read: false})
  .pipe(clean())
)

// Webpack client
gulp.task('webpack:build', ['webpack:clean'], (callback) => webpack(
  webpackConfig, (err, stats) => {
    if(err) throw err;
    callback()
  })
)

gulp.task("webpack:dev-server", function(callback) {
  // modify some webpack config options
  var myConfig = Object.create(webpackConfig);
  myConfig.devtool = "eval";
  myConfig.debug = true;

  // Start a webpack-dev-server
  new WebpackDevServer(webpack(myConfig), {
    publicPath: '/',
    stats: {
      colors: true
    }
  }).listen(myConfig.port, "localhost", function(err) {
    if (err) throw err;
  });
});

// The default tasks
gulp.task('default', [
  'lint',
  'loopback',
  'serve'
])

// Build
gulp.task('build', [
  'lint',
  'loopback',
  'webpack:build'
])
