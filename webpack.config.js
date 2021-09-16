// Webpack 4 configuration
const path = require('path')
const TerserPlugin = require('terser-webpack-plugin');
const NotifierPlugin = require('webpack-build-notifier')

var name = 'ima-ad-player'
var outputFile, plugins = [], optimization = {}

if (process.env.npm_lifecycle_event === 'dist') {
  outputFile = name + '.min.js'
  optimization.minimizer = [
    new TerserPlugin(),
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
    library: {
      type: 'umd',
      name: 'ImaAdPlayer',
      export: 'default',
    },
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
    static: [
      path.resolve(__dirname, "public"),
    ],
    // firewall: false,
    compress: true,
    host: '0.0.0.0',
    port: 8080
  }
}
