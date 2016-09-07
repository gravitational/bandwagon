var WebpackDevServer = require("webpack-dev-server");
var webpackConfig = require('./webpack.config.js');
var express = require('express');
var webpack = require('webpack');

var ROOT = '/';
var PORT = '3001';
var DIST_PATH = __dirname + "//dist";
var INDEX_HTML_PATH = __dirname + "//dist";

var PROXY_TARGET = 'localhost:3000';
var WEBPACK_CLIENT_ENTRY = 'webpack-dev-server/client?https://0.0.0.0:' + PORT;
var WEBPACK_SRV_ENTRY = 'webpack/hot/dev-server';

webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
webpackConfig.entry.app.unshift(WEBPACK_CLIENT_ENTRY, WEBPACK_SRV_ENTRY);
webpackConfig.entry.styles.unshift(WEBPACK_CLIENT_ENTRY, WEBPACK_SRV_ENTRY);

function getTargetOptions() {
  return {
    target: "https://"+PROXY_TARGET,
    secure: false,
    changeOrigin: true
  }
}

var compiler = webpack(webpackConfig);

var server = new WebpackDevServer(compiler, {
  proxy:{
    '/api/*': getTargetOptions()
  },
  publicPath: ROOT,
  hot: true,
  https: true,
  inline: true,
  headers: { 'X-Custom-Header': 'yes' },
  stats: 'errors-only'
});

server.app.use(ROOT, express.static(DIST_PATH));
server.app.get(ROOT +'/*', function (req, res) {
    res.sendfile(INDEX_HTML_PATH);
});

server.listen(PORT, "0.0.0.0", function() {
  console.log('Dev Server is up and running: https://location:' + PORT);
});
