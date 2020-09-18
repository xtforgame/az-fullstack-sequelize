var path = require('path');
var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var gulpConfig = require('../../.azdata/gulp-config');

var baseFolderName = '.';
var projRoot  = path.resolve(__dirname, '../..');

var commonConfig = gulpConfig.getSubmodule('commonLibrary');
var commonConfigJsEntryFolder = commonConfig.joinPathByKeys(['entry', 'js']);

var serverConfig = gulpConfig.getSubmodule('server');
var serverJsEntryFolder = serverConfig.joinPathByKeys(['entry', 'js']);
var serverJsEntryFilename = serverConfig.joinPathByKeys(['entry', 'js', 'filename']);
var serverJsPublicFolder = serverConfig.joinPathByKeys(['entry', 'static']);
var serverJsOutputFolder = serverConfig.joinPathByKeys(['output', 'default']);
serverJsEntryFilename = serverJsEntryFolder + '/index.ts'

module.exports = function({ mode }) {
  return {
    mode,
    target: 'node', // in order to ignore built-in modules like path, fs, etc. 
    externals: [nodeExternals()],
    devtool: 'inline-source-map',
    entry: {
      app: [
        '@babel/polyfill',
        path.resolve(projRoot, serverJsEntryFilename),
      ],
    },
    output: {
      // path: path.resolve(projRoot, serverJsPublicFolder),
      path: path.resolve(projRoot, serverJsOutputFolder),
      pathinfo: mode === 'development',
      filename: baseFolderName + '/[name].js',
      publicPath: '/',
    },
    resolve: {
      // extensions: ['', '.jsx', '.js', '.scss', '.css', '.json', '.md'],
      alias: {
        '@material-ui/styles': path.resolve(projRoot, 'node_modules', '@material-ui/styles'),
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          include: [
            path.resolve(projRoot, serverJsEntryFolder),
            path.resolve(projRoot, commonConfigJsEntryFolder),
          ],
          use: [{
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets: [
                ['@babel/preset-env', {
                  targets: {
                    browsers: ['defaults', 'not dead'],
                  },
                }],
                '@babel/typescript',
                '@babel/preset-react',
              ],
              plugins: [
                ['@babel/proposal-decorators', { decoratorsBeforeExport: true }],
                '@babel/proposal-class-properties',
                '@babel/proposal-object-rest-spread',
              ],
            },
          }],
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader',
          ],
        },
        {
          test: /\.(jpg|png|gif)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          use: [{
            loader: 'file-loader',
            options: {
              name: baseFolderName + '/images/[name].[ext]',
            },
          }],
        },
        {
          test: /\.(woff|woff2|eot|ttf|svg)(\?v=\d+\.\d+\.\d+)?$/,
          use: [{
            loader: 'file-loader',
            options: {
              // name: baseFolderName + '/fonts/[name].[ext]',
              name: baseFolderName + '/fonts/[hash].[ext]',
            },
          }],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({'process.env': {'NODE_ENV': JSON.stringify(mode)}}),
      // new CopyWebpackPlugin([
      //   {
      //     from: path.resolve(projRoot, serverJsPublicFolder),
      //     to: path.resolve(projRoot, serverJsOutputFolder),
      //   },
      // ]),
      // new HtmlWebpackPlugin({
      //   chunks: ['app'],
      //   template: path.resolve(projRoot, serverJsEntryFolder, 'index.html'),
      //   filename: 'index.html',
      // }),
    ],
  };
};
