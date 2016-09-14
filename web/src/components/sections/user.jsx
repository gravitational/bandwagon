import $ from "jquery"
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
        <h3 className="">Create Admin User</h3>
        <div className="m-l-sm m-t">
          <form ref="form">
            <div className="m-l-sm">
              <div className="form-group">
                <input
                  autoFocus
                  type="email"
                  name="email"
                  ref="email"
                  className="form-control required"
                  placeholder="Email"/>
              </div>
              <div className="form-group">
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
            </div>
          </form>
        </div>
      </div>
    );
  }
})

module.exports = UserSection;
