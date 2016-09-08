import $ from 'jquery';
import 'jquery-validation';
import React from 'react';
import LinkedStateMixin from 'react-addons-linked-state-mixin';

const UserSection = React.createClass({

  mixins: [LinkedStateMixin],

  getInitialState() {
    return {
      psw: '',
      pswConfirmed: ''
    }
  },

  getPassword(){
    return this.state.psw;
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
                  <label>User Name</label>
                  <input
                    disabled
                    value="admin"
                    name="email"
                    className="form-control required"
                    placeholder="Email"/>
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    autoFocus
                    ref="password"
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Password" />
                </div>
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    name="passwordConfirmed"
                    className="form-control"
                    placeholder="Password confirm"/>
                </div>
              </div>
            </form>
          </div>
      </div>
    );
  }
})

export default UserSection;
