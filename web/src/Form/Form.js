/*
Copyright 2019 Gravitational, Inc.

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

import React from 'react';
import PropTypes from 'prop-types';
import InputField from './InputField';
import Button from './Button';
import Alert from './Alert';

export default function Form({ onSubmit }) {
  const formRef = React.useRef();
  const [ email, setEmail ] = React.useState('');
  const [ password, setPassword] = React.useState('');
  const [ status, setStatus] = React.useState({
    value: '',
    message: ''
  });

  function onBtnClick(e){
    e.preventDefault();
    if(!formRef.current.reportValidity()){
      return;
    }

    const request = { email, password };
    setStatus({ value: 'processing'});
    onSubmit(request)
      .catch(err => {
        setStatus({ value: 'error', message: err.message});
      })
  }

  function onChangePassword(e){
    setPassword(e.target.value);
  }

  function onChangeEmail(e){
    setEmail(e.target.value);
  }

  const btnDisabled = status.value === 'processing';

  return (
    <form ref={formRef}>
      <h1> Create Cluster Admin </h1>
      { status.value === 'error' && ( <Alert> {status.message} </Alert>) }
      <InputField autoFocus required label="User Name" value={email} onChange={onChangeEmail} />
      <InputField className="mb-3" required minLength="6" type="password" label="Create Password" value={password} onChange={onChangePassword} />
      <Button disabled={btnDisabled} type="button" onClick={onBtnClick} >
        Create User
      </Button>
    </form>
  );
}

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired
}