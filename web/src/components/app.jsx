import React from 'react';
import UserSection from './sections/user.jsx';
import RemoteAssistanceSection from './sections/remoteAssistance.jsx';
import EndPoints from './sections/endpoints.jsx';
import apiUtils from './../utils/apiUtils';
import { PageIndicator } from './items.jsx';

const App = React.createClass({

  getInitialState() {
    return {
      appName: 'Application',
      endpoints: null,
      errorMessage: 'Error',
      isLoading: true,
      isLoadingError: false,
      isSubmitting: false,
      isSubmittingError: false
    }
  },

  componentDidMount(){
    apiUtils.init()
      .done(this.handleLoadingComplete)
      .fail((this.handleLoadingError));
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

  handleSubmitComplete(){
    // reloading the page will automatically redirect to the site
    window.location.reload();
  },

  handleSubmitError(){
    this.setState({
      errorMessage: 'Error',
      isSubmitting: false,
      isSubmittingError: true})
  },

  makeProcessing(){
    this.setState({
      isSubmittingError: false,
      isSubmitting: true
    });
  },

  onSubmit(e){
    e.preventDefault();
    if(this.refs.userSection.isValid()){
      this.makeProcessing();

      let userData = this.refs.userSection.getData();
      let support = this.refs.remoteAssistanceSection.isEnabled();
      let data = {
        ...userData,
        support
      }

      apiUtils.post(data)
        .done(this.handleSubmitComplete)
        .fail(this.handleSubmitError)
    }
  },

  render() {
    let {
      errorMessage,
      isSubmitting,
      isSubmittingError,
      isLoadingError,
      isLoading,
      endpoints,
      appName
    } = this.state;

    let btnClass = `btn btn-primary block my-page-btn-submit ${isSubmitting ? "disabled" : ""}`;
    let $errorMsg =  isSubmittingError ? <label className="error">{errorMessage}</label> : null;

    return (
      <div className="my-page container">
        <PageIndicator isLoading={isLoading} isError={isLoadingError}>
          <div className="my-page-header text-center">
            <div className="text-center">
              <h1>Congratulations, you are almost there!</h1>
            </div>
          </div>
          <div className="my-page-section">
            <EndPoints appName={appName} data={endpoints}/>
          </div>
          <div className="my-page-section">
            <UserSection ref="userSection"/>
          </div>
          <div className="my-page-section">
            <RemoteAssistanceSection ref="remoteAssistanceSection"/>
          </div>
          <div className="my-page-section">
            <div className="text-center">
              <a
                onClick={this.onSubmit}
                className={btnClass}>
                {
                  isSubmitting ?
                    <i className="fa fa-cog fa-spin fa-lg"></i>
                    : <span>Finish</span>
                  }
              </a>
              {$errorMsg}
            </div>
          </div>
        </PageIndicator>
      </div>
    );
  }
});

export default App;
