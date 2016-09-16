var WebpackDevServer = require("webpack-dev-server");
var webpackConfig = require('./webpack.config.js');
var express = require('express');
var webpack = require('webpack');

var APP_PATH = '/web/site/alexeyk-9-15-1/complete/';
var PORT = '3001';
var PROXY_TARGET = 'portal.gravitational.io';

var DIST_PATH = __dirname + "//dist";
var INDEX_HTML_PATH = DIST_PATH;
var WEBPACK_CLIENT_ENTRY = 'webpack-dev-server/client?https://0.0.0.0:' + PORT;
var WEBPACK_SRV_ENTRY = 'webpack/hot/dev-server';

webpackConfig.devtool = 'source-map';
webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
webpackConfig.entry.app.unshift(WEBPACK_CLIENT_ENTRY, WEBPACK_SRV_ENTRY);
webpackConfig.entry.styles.unshift(WEBPACK_CLIENT_ENTRY, WEBPACK_SRV_ENTRY);
webpackConfig.output.publicPath = APP_PATH;

function getTargetOptions(suffix) {
  suffix = suffix || '';
  return {
    target: "https://"+PROXY_TARGET + suffix,
    secure: false,
    changeOrigin: true
  }
}

var compiler = webpack(webpackConfig);
var proxy = {};

proxy[APP_PATH+'/api/*'] = getTargetOptions();
proxy['/web/portal/*'] = getTargetOptions();

var server = new WebpackDevServer(compiler, {
  proxy: proxy,
  publicPath: APP_PATH,
  hot: true,
  https: true,
  inline: true,
  headers: { 'X-Custom-Header': 'yes' },
  stats: 'errors-only'
});

server.app.use(APP_PATH, express.static(DIST_PATH));
server.app.get(APP_PATH+'/*', function (req, res) {
  res.sendfile(INDEX_HTML_PATH);
});

server.listen(PORT, "0.0.0.0", function() {
  console.log('Dev Server is up and running: https://localhost:' + PORT);
});
