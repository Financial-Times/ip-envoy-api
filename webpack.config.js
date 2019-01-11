const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const CURRENT_WORKING_DIR = process.cwd()

const config = {
  name: 'api',
  entry: [ path.join(CURRENT_WORKING_DIR , './app/index.js') ],
  target: 'node',
  output: {
    path: path.join(CURRENT_WORKING_DIR , '/dist/'),
    filename: 'api.generated.js',
    publicPath: '/dist/',
    libraryTarget: 'commonjs2'
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [ 'babel-loader' ]
      }
    ]
  }
}

module.exports = config