/*
Copyright 2018 Gravitational, Inc.

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

import $ from 'jquery';
import localStorage, { KeysEnum, BearerToken } from './storageUtils';
import api from './apiUtils';

const TOKEN_CHECKER_INTERVAL = 15 * 1000; //  every 15 sec

let sesstionCheckerTimerId = null;

const session = {

  logout() {
    this.clear();
    api.logout();
  },

  clear(){
    this._stopSessionChecker();
    localStorage.unsubscribe(receiveMessage)
    localStorage.setBearerToken(null);
    localStorage.clear();
  },

  ensureSession(){
    this._stopSessionChecker();
    this._ensureLocalStorageSubscription();

    const token = this._getBearerToken();
    if(!token){
      return $.Deferred().reject(new Error("expired session"));
    }

    if(this._shouldRenewToken()){
      return this._renewToken().done(this._startSessionChecker.bind(this));
    }

    this._startSessionChecker();
    return $.Deferred().resolve(token)
  },

  _getBearerToken(){
    let token = null;
    try{
      token = localStorage.getBearerToken();
    }catch(err){
      console.error('Cannot find bearer token', err);
    }

    return token;
  },

  _shouldRenewToken(){
    if(this._getIsRenewing()){
      return false;
    }

    return this._timeLeft() < TOKEN_CHECKER_INTERVAL * 1.5;
  },

  _renewToken(){
    this._setAndBroadcastIsRenewing(true);
    return api.renewToken()
      .then(this._receiveBearerToken.bind(this))
      .fail(this.logout.bind(this))
      .always(()=>{
        this._setAndBroadcastIsRenewing(false);
      })
  },

  _receiveBearerToken(json){
    const token = new BearerToken(json);
    localStorage.setBearerToken(token);
  },

  _setAndBroadcastIsRenewing(value){
    this._setIsRenewing(value);
    localStorage.broadcast(KeysEnum.TOKEN_RENEW, value);
  },

  _setIsRenewing(value){
    this._isRenewing = value;
  },

  _getIsRenewing(){
    return !!this._isRenewing;
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
    let delta = created + expiresIn - new Date().getTime();
    return delta;
  },

  // subscribe to localStorage changes from other tabs
  _ensureLocalStorageSubscription(){
    localStorage.subscribe(receiveMessage);
  },

  _startSessionChecker(){
    this._stopSessionChecker();
    sesstionCheckerTimerId = setInterval(()=> {
      // calling ensureSession() will again invoke _startSessionChecker
      this.ensureSession();
    }, TOKEN_CHECKER_INTERVAL);
  },

  _stopSessionChecker(){
    clearInterval(sesstionCheckerTimerId);
    sesstionCheckerTimerId = null;
  }
}

function receiveMessage(event){
  const { key, newValue } = event;

  // check if local storage has been cleared from another tab
  if(localStorage.getBearerToken() === null){
    session.logout();
  }

  // renewToken has been invoked from another tab
  if(key === KeysEnum.TOKEN_RENEW && !!newValue){
    session._setIsRenewing(JSON.parse(newValue));
  }
}

export default session;