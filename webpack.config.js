var path = require('path');
var HtmlWebPackPlugin = require('html-webpack-plugin');
var CleanWebPackPlugin = require('clean-webpack-plugin');

var outputPath = path.join(__dirname, '/src/client/build/');

var common = {
  /*
  * note that the key name of the 'entry' resolves to file name (output)
  * app.js, vendor.js, etc
  **/
  entry: {

    // entry point to main app
    app: ['./src/client/index.jsx'],

    styles: ['./src/client/styles/index.scss']
  },

  output: {
    // used by loaders to generate various URLs within CSS, JS based off publicPath
    //publicPath: '/',
    //
    path: outputPath,

    /*
    * format of the output file names. [name] stands for 'entry' keys
    * defined in the 'entry' section
    **/

    filename: '[name].[hash].js',

    // chunk file name format
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
      title: 'Gravitational Installer Extenension App',
      appMountId: 'app'
     })
 ]
};

common.devtool = 'source-map';
common.cache = true;

module.exports = common;
