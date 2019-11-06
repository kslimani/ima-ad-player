// Webpack 4 configuration
const path = require('path')
const webpack = require('webpack')
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const NotifierPlugin = require('webpack-build-notifier')

var name = 'ima-ad-player'
var outputFile, plugins = [], optimization = {}

if (process.env.npm_lifecycle_event === 'dist') {
  outputFile = name + '.min.js'
  optimization.minimizer = [
    new UglifyJsPlugin({
      cache: true,
      parallel: true,
      uglifyOptions: {
        output: {
          comments: false,
        },
      }
    }),
  ]
} else {
  outputFile = name + '.js'
  optimization.minimize = false
}

plugins.push(new NotifierPlugin({
  title: outputFile,
}))

module.exports = {
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: outputFile,
    library: 'ImaAdPlayer',
    libraryTarget: 'umd',
  },
  optimization: optimization,
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader'
        },
        include: [
          path.resolve(__dirname, 'src')
        ],
      },
    ],
  },
  plugins: plugins,
  devServer: {
    contentBase: [
      path.resolve(__dirname, "public"),
    ],
    disableHostCheck: true,
    compress: true,
    host: "0.0.0.0",
    // public: "www.acme.com",
    port: 8080
  }
}
