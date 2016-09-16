import React from 'react';
import UserSection from './sections/user.jsx';
import RemoteAssistanceSection from './sections/remoteAssistance.jsx';
import EndPoints from './sections/endpoints.jsx';
import apiUtils from './../utils/apiUtils';
import { PageIndicator } from './items.jsx';

const App = React.createClass({

  getInitialState() {
    return {
      application: {},
      endpoints: [],
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

  handleSubmitError(err){
    let errorMessage = err.responseJSON ? err.responseJSON.message : 'Unknown error';
    this.setState({
      errorMessage,
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
      application
    } = this.state;

    let $errorMsg = null;
    let $btnContent = <span>Finish</span>;
    let btnClass = `btn btn-primary block my-page-btn-submit ${isSubmitting ? "disabled" : ""}`;

    // show server error
    if(isSubmittingError){
      $errorMsg = <label className="error">{errorMessage}</label>
    }

    // show loading indicator inside the button
    if(isSubmitting){
      $btnContent = <i className="fa fa-cog fa-spin fa-lg" />
    }

    return (
      <div className="my-page container">
        <PageIndicator isLoading={isLoading} isError={isLoadingError}>
          <div className="my-page-header text-center">
            <div className="text-center">
              <h2>Congratulations!</h2>
              <h2 className="m-t-sm">You have successfully installed</h2>
              <h2 className="m-t-sm">
                <span>{application.name}</span> <small>ver.{application.version}</small>
              </h2>
            </div>
          </div>
          <div className="my-page-section">
            <EndPoints app={application} data={endpoints}/>
          </div>
          <div className="my-page-section">
            <UserSection ref="userSection"/>
          </div>
          <div className="my-page-section">
            <RemoteAssistanceSection ref="remoteAssistanceSection"/>
          </div>
          <div className="my-page-section">
            <div className="text-center">
              <a onClick={this.onSubmit} className={btnClass}>
                {$btnContent}
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
