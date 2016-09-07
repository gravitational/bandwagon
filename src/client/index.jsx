var React = require('react');
var render = require('react-dom').render;
var { Router, Route } = require('react-router');
var { browserHistory } = require('react-router');
var App = require('./components/app.jsx');

var app = document.createElement('div');
document.body.appendChild(app);

render((
  <Router history={browserHistory}>
    <Route path="/" component={App} />
  </Router>
), app);
