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
import $ from 'jquery'
import 'jquery-validation';
import React from 'react';

const UserSection = React.createClass({

  getData(){
    let password = this.refs.password.value;
    let email = this.refs.email.value;
    return { password, email };
  },

  isValid(){
    return $(this.refs.form).valid();
  },

  componentDidMount(){
    $(this.refs.form).validate({
      rules:{
        password:{
          minlength: 6,
          required: true
        },
        passwordConfirmed:{
          required: true,
          equalTo: this.refs.password
        }
      },

      messages: {
        passwordConfirmed: {
          minlength: $.validator.format('Enter at least {0} characters'),
          equalTo: 'Enter the same password as above'
        }
      }
    })
  },

  render() {
    return (
      <div className="">
        <h3 className="">Admin User</h3>
        <div className="m-t">
          <form ref="form">
            <div className="form-group">
              <input
                autoFocus
                type="email"
                name="email"
                ref="email"
                className="form-control required"
                placeholder="Email"/>
              <div className="help-block">
                Please create your credentials for the Installer Administration User. The Admin User has access to the Installer, can provision additional nodes and upgrade the cluster.
              </div>
            </div>
            <div className="form-group m-t">
              <input
                ref="password"
                type="password"
                name="password"
                className="form-control"
                placeholder="Password" />
            </div>
            <div className="form-group">
              <input
                type="password"
                name="passwordConfirmed"
                className="form-control"
                placeholder="Re-enter password"/>
            </div>
          </form>
        </div>
      </div>
    );
  }
})

module.exports = UserSection;
