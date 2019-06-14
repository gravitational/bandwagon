/*
Copyright 2019 Gravitational, Inc.

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

import localStorage, { BearerToken } from './localStorage';
import api from './api';

const TOKEN_CHECKER_INTERVAL = 15 * 1000; //  every 15 sec

let sesstionCheckerTimerId = null;

const session = {

  logout() {
    this._stopTokenChecker();
    console.log('session has expired');
  },

  // ensureSession verifies that token is valid and starts
  // periodically checking and refreshing the token.
  ensureSession(){
    this._stopTokenChecker();

    if(!this.isValid()){
      this.logout();
      return;
    }

    if(this._shouldRenewToken()){
      this._renewToken()
        .then(() => {
          this._startTokenChecker();
        })
        .catch(this.logout.bind(this));

    }else{
      this._startTokenChecker();
    }
  },

  isValid(){
    if (process.env.NODE_ENV !== 'production'){
      return true;
    }

    return this._timeLeft() > 0;
  },

  _getBearerToken(){
    let token = null;
    try{
      token = this._extractBearerTokenFromHtml();
      if (token) {
        localStorage.setBearerToken(token)
      } else {
        token = localStorage.getBearerToken();
      }

    }catch(err){
      window.console.error('Cannot find bearer token', err);
    }

    return token;
  },

  _extractBearerTokenFromHtml() {
    // length of the serialized empty token
    const emptyTokenLength = 20;
    const el = document.querySelector('[name=grv_bearer_token]');
    let token = null;
    if (el !== null) {
      let encodedToken = el.content || '';
      if (encodedToken.length > emptyTokenLength) {
        let decoded = window.atob(encodedToken);
        let json = JSON.parse(decoded);
        token = new BearerToken(json);
      }

      // remove token from HTML as it will be renewed with a time
      // and stored in the localStorage
      el.parentNode.removeChild(el);
    }

    return token;
  },

  _shouldRenewToken(){
    /*
    * increase the threshold value for slow connections to avoid
    * access-denied response due to concurrent renew token request
    * made from another tab.
    */
    return this._timeLeft() < TOKEN_CHECKER_INTERVAL * 1.5;
  },

  _renewToken(){
    return api.post('/proxy/v1/webapi/sessions/renew')
      .then(this._receiveBearerToken.bind(this))
  },

  _receiveBearerToken(json){
    const token = new BearerToken(json);
    localStorage.setBearerToken(token);
  },

  _timeLeft(){
    const token = this._getBearerToken();
    if (!token) {
      return 0;
    }

    let { expiresIn, created } = token;
    if(!created || !expiresIn){
      return 0;
    }

    expiresIn = expiresIn * 1000;
    const delta = created + expiresIn - new Date().getTime();
    return delta;
  },

  _startTokenChecker(){
    this._stopTokenChecker();
    sesstionCheckerTimerId = setInterval(()=> {
      // verify valid session
      this.ensureSession();
    }, TOKEN_CHECKER_INTERVAL);
  },

  _stopTokenChecker(){
    clearInterval(sesstionCheckerTimerId);
    sesstionCheckerTimerId = null;
  }
}

export default session;