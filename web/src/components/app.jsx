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
import React from 'react';
import Form from './form';
import apiUtils from '../utils/apiUtils';
import session from '../utils/sessionUtils';
import { PageIndicator } from './items';

const App = React.createClass({

  getInitialState() {
    return {
      application: {},
      isLoading: true,
      isLoadingError: false,
      errorText: ''
    }
  },

  componentDidMount(){
    session.ensureSession()
    .then(() => apiUtils.init())
    .done(this.handleLoadingComplete)
    .fail(this.handleLoadingError);
  },

  handleFormSubmitted(){
    // backend will redirect a user to a cluster page
    window.location.reload();
  },

  handleLoadingComplete(info){
    this.setState({
      ...info,
      isLoading: false
    })
  },

  handleLoadingError(err){
    let errorText = apiUtils.getErrorText(err);
    this.setState({isLoadingError: true, errorText})
  },

  render() {
    let {
      isLoadingError,
      isLoading,
      application,
      errorText
    } = this.state;

    return (
      <div className="my-page container">
        <PageIndicator isLoading={isLoading} isError={isLoadingError} errorText={errorText}>
          <Form application={application} onSubmitted={this.handleFormSubmitted} />
        </PageIndicator>
      </div>
    );
  }
});

export default App;
