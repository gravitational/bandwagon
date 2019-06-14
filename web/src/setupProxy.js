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


/**
 * These mocks are used in development mode to serve sample data
 */

module.exports = function(app) {

  app.post('/api/complete', function (req, res, next) {
    res.send({status: 'success' });
  })

  app.post('/proxy/v1/webapi/sessions/renew', function (req, res, next) {
    res.send({ token: '2379020672', expires_in: '599' });
  })

};
