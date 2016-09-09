import React from 'react';
import { render } from 'react-dom';
import App from './components/app.jsx';

let element = document.createElement('div');

render(( <App/> ), document.body.appendChild(element));
