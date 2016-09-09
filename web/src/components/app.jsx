import React from 'react';
import UserSection from './sections/user.jsx';
import RemoteAssistanceSection from './sections/remoteAssistance.jsx';
import EndPoints from './sections/endpoints.jsx';
import apiUtils from './../utils/apiUtils';
import { PageIndicator } from './items.jsx';

const App = React.createClass({

  getInitialState() {
    return {
      isError: false,
      isLoading: true,
      isProcessing: false
    }
  },

  componentDidMount(){
    apiUtils.init()
      .done(this.makeReady)
      .fail(this.makeFailed);
  },

  makeReady(){
    this.setState({isLoading: false})
  },

  makeFailed(){
    this.setState({isError: true})
  },

  makeProcessing(){
    this.setState({isProcessing: true});
  },

  onFinish(e){
    e.preventDefault();
    this.refs.userSections.isValid()
    this.makeProcessing();
  },

  render() {
    let { isProcessing, isLoading, isError } = this.state;

    let btnClass = `btn btn-primary block ${isProcessing ? "disabled" : ""}`;

    return (
      <div className="my-page container">
        <PageIndicator isLoading={isLoading} isError={isError}>
          <div className="my-page-header text-center">
            <div className="text-center">
              <h1>Congratulations, you are almost there!</h1>
            </div>
          </div>
          <div className="my-page-section">
            <EndPoints/>
          </div>
          <div className="my-page-section">
            <UserSection ref="userSections"/>
          </div>
          <div className="my-page-section">
            <RemoteAssistanceSection/>
          </div>
          <div className="my-page-section">
            <div className="text-center">
              <a
                onClick={this.onFinish}
                style={{width: "150px", margin: '0 auto'}}
                className={btnClass}>
                {
                  isProcessing ?
                    <i className="fa fa-cog fa-spin fa-lg"></i>
                    : <span>Finish</span>
                  }
              </a>
            </div>
          </div>
        </PageIndicator>
      </div>
    );
  }
})

/*



<div className="m-l-sm">
  <dl className="dl-horizontal">
    <dt>
      user:
    </dt>
    <dd>
      admin@gravitational.com
    </dd>
    <dt>password:</dt>
    <dd>
      FFdsfsf3#$fd
    </dd>
  </dl>
</div>

var App = React.createClass({
  render() {
    return (
      <div className="my-page">
        <div className="container">
          <div className="row">
            <div className="col-md-8 col-md-offset-1">
              <div className="row">
                <div className="col-sm-12">
                  <div className="my-page-header"></div>
                </div>
              </div>
              <div className="my-installer-content m-t-xl border-right">
                <div>
                  <div className="m-t">
                    <h2>This is last and final step</h2>
                    <form className="m-l m-t-lg"></form>
                  </div>
                  <div className="row m-b-lg">
                    <div className="col-sm-6">
                      <div className="col-sm-6 pull-right">
                        <button className="btn m-t-xl pull-right btn-block btn-primary">
                          <div>
                            <span>Continue</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="my-installer-hints m-t-lg">
                <h3>About this step</h3>
                <div className="text-muted m-t">
                  <div>
                    <p>This is last step.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
})

*/

export default App;
