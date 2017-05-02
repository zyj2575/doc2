var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var StatsPlugin = require('stats-webpack-plugin')
var loadersByExtension = require('./config/loadersByExtension')
var marked = require('marked')

function getIp () {
  return '127.0.0.1'
}

function MinimizeFalsePlugin (options) {
  this.options = Object.assign({test: /\.js($|\?)/i}, options)
}

MinimizeFalsePlugin.prototype.apply = function (compiler) {
  compiler.plugin('compilation', function (compilation) {
    compilation.plugin('normal-module-loader', function (context) {
      context.minimize = false
    })
  })
}

module.exports = function (options) {
  var buildPath = options.buildPath || path.join(__dirname, 'build')

  var entry = {
    index: './config/reactApp'
  }
  var loaders = {
    'jsx': options.hotComponents ? ['react-hot-loader', 'babel-loader?stage=0'] : 'babel-loader?stage=0',
    'js': {
      loader: 'babel-loader?stage=0',
      include: [path.join(__dirname, 'doc'), path.join(__dirname, 'component')]
    },
    'json': 'json-loader',
    'coffee': 'coffee-loader',
    'json5': 'json5-loader',
    'txt': 'raw-loader',
    'png|jpg|jpeg|gif|svg': 'url-loader?limit=10',
    'woff|woff2': 'url-loader?limit=100000',
    'ttf|eot': 'file-loader',
    'wav|mp3': 'file-loader',
    'html': 'html-loader',
    'md|markdown': ['html-loader', 'markdown-loader', 'markdown-code-highlight-loader']
  }
  var cssLoader = options.minimize ? 'css-loader?module' : 'css-loader?module&localIdentName=[path][name]---[local]---[hash:base64:5]'
  var stylesheetLoaders = {
    'css': cssLoader,
    'less': [cssLoader, 'less-loader'],
    'styl': [cssLoader, 'stylus-loader'],
    'scss|sass': [cssLoader, 'sass-loader'],
    'gscss': ['css-loader', 'sass-loader']
  }
  var additionalLoaders = [
    // { test: /some-reg-exp$/, loader: "any-loader" }
  ]
  var alias = {}
  var aliasLoader = {}
  var externals = {
    jquery: 'jQuery',
    fastclick: 'FastClick',
    lodash: '_',
    bluebird: 'Promise'
  }
  var modulesDirectories = ['web_modules', 'node_modules']
  var extensions = ['', '.web.js', '.js', '.jsx']
  var root = path.join(__dirname, 'doc')
  var publicPath = options.devServer ? 'http://' + getIp() + ':3333/_assets/' : '/static/'
  var output = {
    path: path.join(buildPath, options.prerender ? 'prerender' : 'public'),
    publicPath: publicPath,
    filename: '[name]' + ((options.longTermCaching && !options.prerender) ? '-[chunkhash]' : '') + '.js',
    chunkFilename: (options.devServer ? '[id]' : '[name]') + (options.longTermCaching && !options.prerender ? '-[chunkhash]' : '') + '.js',
    sourceMapFilename: 'debugging/[file].map',
    libraryTarget: options.prerender ? 'commonjs2' : undefined,
    pathinfo: options.debug || options.prerender
  }
  var excludeFromStats = [
    /node_modules[\\/]react(-router)?[\\/]/,
    /node_modules[\\/]items-store[\\/]/
  ]
  var plugins = [
    new webpack.PrefetchPlugin('react'),
    new webpack.PrefetchPlugin('react/lib/ReactComponentBrowserEnvironment')
  ]
  if (options.prerender) {
    plugins.push(new StatsPlugin(path.join(buildPath, 'stats.prerender.json'), {
      chunkModules: true,
      exclude: excludeFromStats
    }))
    aliasLoader['react-proxy$'] = 'react-proxy/unavailable'
    aliasLoader['react-proxy-loader$'] = 'react-proxy-loader/unavailable'
    externals.push(
      /^react(\/.*)?$/,
      /^reflux(\/.*)?$/,
      'superagent',
      'async'
    )
    plugins.push(new webpack.optimize.LimitChunkCountPlugin({maxChunks: 1}))
  } else {
    plugins.push(new StatsPlugin(path.join(buildPath, 'stats.json'), {
      chunkModules: true,
      exclude: excludeFromStats
    }))
  }
  if (options.commonsChunk) {
    plugins.push(new webpack.optimize.CommonsChunkPlugin({
      names: ['commons'],
      children: true,
      minChunks: 2
      // async: true,
    }))
  }
  var asyncLoader = {
    test: [].map(function (name) {
      return path.join(__dirname, 'doc', 'route-handlers', name)
    }),
    loader: options.prerender ? 'react-proxy-loader/unavailable' : 'react-proxy-loader'
  }

  Object.keys(stylesheetLoaders).forEach(function (ext) {
    var stylesheetLoader = stylesheetLoaders[ext]
    if (Array.isArray(stylesheetLoader)) stylesheetLoader = stylesheetLoader.join('!')
    if (options.prerender) {
      stylesheetLoaders[ext] = stylesheetLoader.replace(/^css-loader/, 'css-loader/locals')
    } else if (options.separateStylesheet) {
      stylesheetLoaders[ext] = ExtractTextPlugin.extract('style-loader', stylesheetLoader)
    } else {
      stylesheetLoaders[ext] = 'style-loader!' + stylesheetLoader
    }
  })
  if (options.separateStylesheet && !options.prerender) {
    plugins.push(new ExtractTextPlugin('[name]' + (options.longTermCaching ? '-[contenthash]' : '') + '.css'))
  }
  if (options.minimize && !options.prerender) {
    plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        compressor: {
          warnings: false,
          drop_console: true
        }
      }),
      new webpack.optimize.DedupePlugin(),
      new MinimizeFalsePlugin()
    )
  }
  if (options.minimize) {
    plugins.push(
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        }
      }),
      new webpack.NoErrorsPlugin()
    )
  }

  marked.Renderer.prototype.table = function (header, body) {
    return '<table  class="table table-bordered table-striped js-options-table">\n' +
      '<thead>\n' + header + '</thead>\n' + '<tbody>\n' + body + '</tbody>\n' + '</table>\n'
  }

  var webpackConfig = {
    entry: entry,
    output: output,
    target: options.prerender ? 'node' : 'web',
    module: {
      loaders: [asyncLoader].concat(loadersByExtension(loaders)).concat(loadersByExtension(stylesheetLoaders)).concat(additionalLoaders)
    },
    devtool: options.devtool,
    debug: options.debug,
    resolveLoader: {
      root: path.join(__dirname, 'node_modules'),
      alias: aliasLoader
    },
    externals: externals,
    resolve: {
      root: root,
      modulesDirectories: modulesDirectories,
      extensions: extensions,
      alias: alias
    },
    plugins: plugins,
    devServer: {
      stats: {
        cached: false,
        exclude: excludeFromStats
      }
    },
    markdownLoader: {
      markedOptions: {
        renderer: new marked.Renderer(),
        gfm: true,
        tables: true,
        breaks: true,
        pedantic: false,
        sanitize: true,
        smartLists: true,
        smartypants: false
      }
    }
  }
  return webpackConfig
}
