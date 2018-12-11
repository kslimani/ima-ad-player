// Webpack 4 configuration
const path = require('path')
const webpack = require('webpack')
const NotifierPlugin = require('webpack-build-notifier')

var minify, outputFile, plugins = []

if (process.env.npm_lifecycle_event === 'dist') {
  outputFile = 'ima-ad-player.min.js'
  minify = true
} else {
  outputFile = 'ima-ad-player.js'
  minify = false // Do not minify ES5 compiled module
}

plugins.push(new NotifierPlugin({
  title: outputFile,
}))

module.exports = {
  entry: path.resolve(__dirname, 'src/index.js'),
  optimization: {
    minimize: minify,
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: outputFile,
    library: 'ImaAdPlayer',
    libraryTarget: 'umd',
  },
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
    port: 8080
  }
}
