/*
Copyright 2017 Gravitational, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
var path = require('path');
var HtmlWebPackPlugin = require('html-webpack-plugin');

var outputPath = path.join(__dirname, '/dist/');
var favIconPath = path.join(__dirname, '/src/imgs/favicon.ico');

var common = {

  entry: {
    app: ['./src/index.jsx'],
    styles: ['./src/styles/index.scss']
  },

  output: {

    publicPath: '',

    path: outputPath,

    filename: '[name].[hash].js',

    chunkFilename: '[name].[chunkhash].js'
  },

  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  module: {
    loaders: [
      {
        // copies fonts to the /assets/fonts folder if used in css (url)
        test: /fonts\/(.)+\.(woff|woff2|ttf|eot|svg)/,
        loader: "url-loader?limit=10000&name=fonts/[name].[ext]"
      },
      {
        include: path.join(__dirname, 'src'),
        test: /(\.js)|(\.jsx)$/,
        exclude: /node_modules/,
        loader: 'react-hot!babel?cacheDirectory!eslint'
      },
      {
        /*
        * copies files to a given directory and insert correct URL to them
        * (css loader calls 'require' when parsing urls within CSS which then
        * executes file-loader)
        **/
        test: /\.(png|jpg|gif)$/,
        loader: "file-loader?name=/assets/img/img-[hash:6].[ext]"
      },
      {
        test: /\.scss$/,
        loader: 'style!css!sass?outputStyle=expanded'
      }
    ]
  },
  plugins:  [
    new HtmlWebPackPlugin({
      title: 'Final step',
      favicon: favIconPath,
      inject: true
    })
 ]
};

module.exports = common;
