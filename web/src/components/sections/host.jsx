import $ from 'jquery'
import 'jquery-validation';
import React from 'react';

const HostSection = React.createClass({

  getData(){
    let hostname = this.refs.hostname.value;
    return { hostname };
  },

  isValid(){
    return $(this.refs.form).valid();
  },

  componentDidMount(){
    $(this.refs.form).validate({
      rules:{
        hostname:{
          required: true,
        },
      },
    })
  },

  render() {
    return (
      <div className="">
        <h3 className="">Hostname</h3>
        <div className="m-t">
          <form ref="host-form">
            <div className="form-group">
              <input
                autoFocus
                type="text"
                name="hostname"
                ref="hostname"
                className="form-control required" />
              <div className="help-block">
                Please enter the hostname for this installation: e.g. "onprem.tulip.co"
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
})

module.exports = HostSection;
