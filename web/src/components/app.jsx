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
