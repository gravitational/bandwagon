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
import Form from './form.jsx';
import Confirmation from './confirmation.jsx';
import apiUtils from './../utils/apiUtils';
import { PageIndicator } from './items.jsx';

const App = React.createClass({

  getInitialState() {
    return {
      application: {},
      endpoints: [],
      isFormSumbitted: false,
      isLoading: true,
      isLoadingError: false
    }
  },

  componentDidMount(){
    apiUtils.init()
      .done(this.handleLoadingComplete)
      .fail((this.handleLoadingError));
  },

  handleFormSubmitted(){
    this.setState({
      isFormSumbitted: true
    });
  },

  handleLoadingComplete(info){
    this.setState({
      ...info,
      isLoading: false
    })
  },

  handleLoadingError(){
    this.setState({isLoadingError: true})
  },

  render() {
    let {
      isLoadingError,
      isLoading,
      isFormSumbitted,
      endpoints,
      application
    } = this.state;

    let $pageContent = null;

    if(isFormSumbitted){
      $pageContent = <Confirmation application={application} endpoints={endpoints} />
    }else{
      $pageContent = <Form application={application} onSubmitted={this.handleFormSubmitted} />
    }

    return (
      <div className="my-page container">
        <PageIndicator isLoading={isLoading} isError={isLoadingError}>
          {$pageContent}
        </PageIndicator>
      </div>
    );
  }
});

export default App;
