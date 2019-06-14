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

import React from 'react';
import service from './services/api';
import session from './services/session';
import Form from './Form';
import './assets/ubuntu/style.css';
import './assets/icomoon/style.css'
import './App.css';

function App() {

  React.useEffect(() => {
    // keeps the session alive
    session.ensureSession();
  }, []);

  function onSubmit(request){
    // create a user
    return service.submitUser(request).then(() => {
      // reload the page to let the backend to redirect a user
      // to cluster UI
      window.location.reload();
    })
  }

  return (
    <div className="App">
      <div className="LeftPanel">
        <Form onSubmit={onSubmit}/>
      </div>
      <div className="RightPanel">
        <div className="About">
          <h3> About this step</h3>
          <p> Create credentials for the cluster administrator.</p> <br/>
          <p> The cluster administrator will be able to setup SSO and 2FA for this cluster.</p>
        </div>
      </div>
    </div>
  );
}

export default App;