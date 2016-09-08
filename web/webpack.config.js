var path = require('path');
var HtmlWebPackPlugin = require('html-webpack-plugin');
var CleanWebPackPlugin = require('clean-webpack-plugin');

var outputPath = path.join(__dirname, '/dist/');

var common = {

  entry: {

    // entry point to main app
    app: ['./src/index.jsx'],

    styles: ['./src/styles/index.scss']
  },

  output: {

    path: outputPath,

    filename: '[name].[hash].js',

    chunkFilename: '[name].[chunkhash].js'
  },

  module: {
    loaders: [
      {
        // copies fonts to the /assets/fonts folder if used in css (url)
        test: /fonts\/(.)+\.(woff|woff2|ttf|eot|svg)/,
        loader: "url-loader?limit=10000&name=/assets/fonts/[name].[ext]"
      },
      {
        // js loader
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
        /*
        * loads CSS for the rest of the app by ignores vendor folder.
        **/
        test: /\.scss$/,
        loader: 'style!css!sass?outputStyle=expanded'
      }
    ]
  },
  plugins:  [
    new CleanWebPackPlugin([outputPath],{
        dry: false
    }),
    new HtmlWebPackPlugin({
      inject: true,
      title: 'Gravitational Installer Extenension App'
    })
 ]
};

common.devtool = 'source-map';

module.exports = common;
