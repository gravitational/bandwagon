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
var WebpackDevServer = require("webpack-dev-server");
var webpackConfig = require('./webpack.config.js');
var express = require('express');
var webpack = require('webpack');
var request = require('url');

var argv = require('optimist')
    .usage('Usage: $0 -proxy [url]')
    .demand(['proxy'])
    .argv;

var urlObj =  request.parse(argv.proxy)

console.log('Starting dev server pointing to: ' + urlObj.href);

function getTargetHostName(urlObj){
  var index = urlObj.href.indexOf(urlObj.path);
  return urlObj.href.substring(0, index);
}

var APP_PATH = urlObj.path;
var PROXY_TARGET = getTargetHostName(urlObj);
var PORT = 3001;

var DIST_PATH = __dirname + "//dist";
var INDEX_HTML_PATH = DIST_PATH;
var WEBPACK_CLIENT_ENTRY = 'webpack-dev-server/client?https://0.0.0.0:' + PORT;
var WEBPACK_SRV_ENTRY = 'webpack/hot/dev-server';

webpackConfig.devtool = 'source-map';
webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
webpackConfig.entry.app.unshift(WEBPACK_CLIENT_ENTRY, WEBPACK_SRV_ENTRY);
webpackConfig.entry.styles.unshift(WEBPACK_CLIENT_ENTRY, WEBPACK_SRV_ENTRY);
webpackConfig.output.publicPath = APP_PATH;

function getTargetOptions() {
  return {
    target: PROXY_TARGET,
    secure: false,
    changeOrigin: true,
    bypass: function(req) {
      if (
         // redirect all requests to static files to our middleware defined bellow.
         // note that we only need it to avoid issues with font handling by react hot.
         // http://stackoverflow.com/questions/34133808/webpack-ots-parsing-error-loading-fonts
         req.originalUrl.indexOf(APP_PATH+'/fonts/') !== -1 ) {
         console.log('Skipping proxy for browser request - ' + req.originalUrl);
         return req.originalUrl;
       }
   }
  }
}

var compiler = webpack(webpackConfig);

var server = new WebpackDevServer(compiler, {
  proxy: {
    '*' : getTargetOptions()
  },
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
  console.log('Dev Server is up and running: https://localhost:' + PORT + APP_PATH);
});
