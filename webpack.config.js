'use strict'

// Modules
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ProvidePlugin = require('webpack/lib/ProvidePlugin')

/**
 * Env
 * Get npm lifecycle event to identify the environment
 */
const ENV = process.env.npm_lifecycle_event
const isTest = ENV === 'test' || ENV === 'test-watch'
const isProd = ENV === 'build' || process.env.NODE_ENV == 'production'

/**
 * Path to the client application
 * @type {string}
 */
const clientApp = `${__dirname}/client`
const clientAppPort = 9000 || process.env.PORT

module.exports = function makeWebpackConfig () {
  /**
   * Config
   * Reference: http://webpack.github.io/docs/configuration.html
   * This is the object where all configuration gets set
   */
  const config = {}

  /**
   * Set client port */
  config.port = clientAppPort;

  /**
   * Entry
   * Reference: http://webpack.github.io/docs/configuration.html#entry
   * Should be an empty object if it's generating a test build
   * Karma will set this when it's a test build
   */
  config.entry = isTest ? {} : {
    app: `${clientApp}/app/app.js`,
  }

  /**
   * Output
   * Reference: http://webpack.github.io/docs/configuration.html#output
   * Should be an empty object if it's generating a test build
   * Karma will handle setting it up for you when it's a test build
   */
  config.output = isTest ? {} : {
    // Absolute output directory
    path: `${clientApp}/dist`,

    // Output path from the view of the page
    // Uses webpack-dev-server in development
    publicPath: isProd ? '/' : `http://localhost:${clientAppPort}/`,

    // Filename for entry points
    // Only adds hash in build mode
    filename: isProd ? '[name].[hash].js' : '[name].bundle.js',

    // Filename for non-entry points
    // Only adds hash in build mode
    chunkFilename: isProd ? '[name].[hash].js' : '[name].bundle.js',
  }

  /**
    * External libraries
    */
  // config.externals = {
  //   'angular': 'angular'
  // }

  /**
   * Devtool
   * Reference: http://webpack.github.io/docs/configuration.html#devtool
   * Type of sourcemap to use per build type
   */
  if (isTest) {
    config.devtool = 'inline-source-map'
  } else if (isProd) {
    config.devtool = 'source-map'
  } else {
    config.devtool = 'eval-source-map'
    config.progress = true
  }

  /**
   * Loaders
   * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
   * List: http://webpack.github.io/docs/list-of-loaders.html
   * This handles most of the magic responsible for converting modules
   */

  // Initialize module
  config.module = {
    preLoaders: [],
    loaders: [{
      // JS LOADER
      // Reference: https://github.com/babel/babel-loader
      // Transpile .js files using babel-loader
      // Compiles ES6 and ES7 into ES5 code
      // Reference: https://github.com/shanhaichik/webpack-require-loader
      test: /\.js$/,
      loaders: ['babel', 'required?import[]=angular'],
      exclude: /node_modules/,
    }, {
      // JSON LOADER
      // Reference: https://github.com/webpack/json-loader
      test: /\.json$/,
      loader: 'json',
      exclude: /node_modules/,
    }, {
      // CSS LOADER
      // Reference: https://github.com/webpack/css-loader
      // Allow loading css through js
      //
      // Reference: https://github.com/postcss/postcss-loader
      // Postprocess your css with PostCSS plugins
      test: /\.css$/,
      // Reference: https://github.com/webpack/extract-text-webpack-plugin
      // Extract css files in production builds
      //
      // Reference: https://github.com/webpack/style-loader
      // Use style-loader in development.
      loader: isTest ? 'null' : ExtractTextPlugin.extract('style', 'css?sourceMap!postcss'),
    }, {
      // LESS LOADER
      test: /\.less$/,
      loader: isTest ? 'null' : ExtractTextPlugin.extract('style', 'css?sourceMap!postcss!less?sourceMap'),
    }, {
      // ASSET LOADER
      // Reference: https://github.com/webpack/file-loader
      // Copy png, jpg, jpeg, gif, svg, woff, woff2, ttf, eot files to output
      // Rename the file using the asset hash
      // Pass along the updated reference to your code
      // You can add here any file extension you want to get copied to your output
      test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'file',
    }, {
      // HTML LOADER
      // Reference: https://github.com/webpack/raw-loader
      // Allow loading html through js
      test: /\.html$/,
      exclude: [
        /\.template\.html/,
      ],
      loader: 'ngtemplate?relativeTo=client/app/components/!html',
    }, {
      // JADE LOADER
      // Reference: https://github.com/bline/jade-html-loader
      // Allow loading jade through js
      test: /\.jade$/,
      loader: 'ngtemplate?relativeTo=client/app/components/!html!jade-html-loader',
    }],
  }

  // ISPARTA LOADER
  // Reference: https://github.com/ColCh/isparta-instrumenter-loader
  // Instrument JS files with Isparta for subsequent code coverage reporting
  // Skips node_modules and files that end with .test.js
  if (isTest) {
    config.module.preLoaders.push({
      test: /\.js$/,
      exclude: [
        /node_modules/,
        /\.spec\.js$/,
      ],
      loader: 'isparta-instrumenter',
    })
  }

  /**
   * PostCSS
   * Reference: https://github.com/postcss/autoprefixer-core
   * Add vendor prefixes to your css
   */
  config.postcss = [
    autoprefixer({
      browsers: ['last 2 version'],
    }),
  ]

  /**
   * Plugins
   * Reference: http://webpack.github.io/docs/configuration.html#plugins
   * List: http://webpack.github.io/docs/list-of-plugins.html
   */
  config.plugins = [
    new ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    })
  ]

  // Skip rendering index.html in test mode
  if (!isTest) {
    // Reference: https://github.com/ampedandwired/html-webpack-plugin
    // Render index.template.html
    config.plugins.push(
      new HtmlWebpackPlugin({
        template: `${clientApp}/index.template.html`,
        inject: 'body',
      }),

      // Reference: https://github.com/webpack/extract-text-webpack-plugin
      // Extract css files
      // Disabled when in test mode or not in build mode
      new ExtractTextPlugin('[name].[hash].css', {disable: !isProd})
    )
  }

  // Add build specific plugins
  if (isProd) {
    config.plugins.push(
      // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
      // Only emit files when there are no errors
      // new webpack.NoErrorsPlugin(),

      // Reference: http://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
      // Dedupe modules in the output
      new webpack.optimize.DedupePlugin(),

      // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
      // Minify all javascript, switch loaders to minimizing mode
      new webpack.optimize.UglifyJsPlugin()
    )
  }

  /**
   * Dev server configuration
   * Reference: http://webpack.github.io/docs/configuration.html#devserver
   * Reference: http://webpack.github.io/docs/webpack-dev-server.html
   */
  config.devServer = {
    contentBase: `${clientApp}/dist`,
    inline: true,
    open: true,
    port: clientAppPort,
    stats: {
      colors: true,
    },
  }

  return config
}()
