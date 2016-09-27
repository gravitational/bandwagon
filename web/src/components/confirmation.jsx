import React from 'react';
import EndPoints from './sections/endpoints.jsx';

const Confirmation = React.createClass({

  propTypes: {
    application: React.PropTypes.object.isRequired,
    endpoints: React.PropTypes.array.isRequired
  },

  render() {
    let { application, endpoints } = this.props;
    return (
      <div>
        <div className="my-page-header text-center">
          <div className="text-center">
            <h2><span>{application.name}</span> is ready to use.</h2>
          </div>
        </div>
        <div className="my-page-section">
          <EndPoints app={application} data={endpoints}/>
        </div>
      </div>
    );
  }
});

export default Confirmation;
