var React = require('react');

var App = React.createClass({
  render() {
    return (
      <div className="my-page">
        <div className="container">
          <div className="row">
            <div className="col-md-8 col-md-offset-1">
              <div className="row">
                <div className="col-sm-12">
                  <div className="my-installer-header"></div>
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

module.exports = App;
