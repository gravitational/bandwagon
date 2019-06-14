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

import localStorage from './localStorage';

const defaultCfg = {
  credentials: 'same-origin',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json; charset=utf-8'
  }
}

/**
 * api is a wrapper on top of native fetch API which ensures that correct
 * headers and parameters are set for each type of request.
 */
const api = {

  submitUser(request){
    return api.post('./api/complete', request);
  },

  get(url){
    return api.fetchJson(url);
  },

  post(url, data){
    return api.fetchJson(url, {
      body: JSON.stringify(data),
      method: 'POST'
    });
  },

  delete(url, data){
    return api.fetchJson(url, {
      body: JSON.stringify(data),
      method: 'DELETE'
    });
  },

  put(url, data){
    return api.fetchJson(url, {
      body: JSON.stringify(data),
      method: 'PUT'
    });
  },

  fetchJson(url, params) {
    return new Promise((resolve, reject) => {
      this.fetch(url, params)
        .then(parseJSON)
        .then(response => {
          if (response.ok) {
            return resolve(response.json);
          }

          const err = new Error(response.json.message);
          err.status = response.status;
          return reject(err);
        })
        .catch(err => {
          reject(err);
        })
    });
  },

  fetch(url, params = {}) {
    const options = {
      ...defaultCfg,
      ...params
    };

    options.headers = {
      ...options.headers,
      ...getAuthHeaders()
    }

    // native call
    return fetch(url, options);
  },
}

function parseJSON(response) {
  return new Promise((resolve, reject) => {
    return response
      .json()
      .then(json => resolve({status: response.status, ok: response.ok, json}))
      .catch(err => reject(err))
  });
}

function getAuthHeaders() {
  const accessToken = getAccessToken();
  const csrfToken = getXCSRFToken();
  return {
    'X-CSRF-Token': csrfToken,
    'Authorization': `Bearer ${accessToken}`
  }
}

function getXCSRFToken() {
  const metaTag = document.querySelector('[name=grv_csrf_token]');
  return metaTag ? metaTag.content : '';
}

function getAccessToken() {
  const bearerToken = localStorage.getBearerToken() || {};
  return bearerToken.accessToken;
}

export default api;

