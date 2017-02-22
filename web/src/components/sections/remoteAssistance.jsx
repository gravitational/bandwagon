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
import React from 'react';

const enabled = '0'

const options = [
  {
    value: enabled,
    title: 'Enable remote assistance to allow vendor team to support your infrastructure.'
  },
  {
    value: '1',
    title: 'Disable remote assistance to turn off remote access to your infrastructure for vendor support team.'
  }
]

const RemoteAssistance = React.createClass({

  isEnabled() {
    return this.state.value === enabled;
  },

  getInitialState(){
    return {
      value: enabled
    }
  },

  onChangeRemoteAssitance(value) {
    this.setState({
      value
    })
  },

  render() {
    return (
      <div>
        <h3>Remote Assistance</h3>
        <div className="m-t">
          <RadioGroup
            options={options}
            value={this.state.value}
            onChange={this.onChangeRemoteAssitance}
          />
        </div>
      </div>
    );
  }
})

const RadioGroup = React.createClass({

  propTypes: {
    options: React.PropTypes.array.isRequired,
    value: React.PropTypes.string
  },

  getInitialState() {
    let currentValue = this.props.value;
    return {currentValue};
  },

  onChange(option) {
    this.props.onChange(option.value);
    this.setState({currentValue: option.value});
  },

  render() {
    let { options } = this.props;
    let { currentValue } = this.state;

    let $options = options.map((option, index) => {
      let {value, title} = option;
      return (
        <label key={index} className="grv-control-radio">
          <span>{title}</span>
          <input type="radio" name="radio"
            onChange={this.onChange.bind(this, option)}
            checked={value === currentValue}
          />
          <div className="grv-control-radio-indicator" />
        </label>
      )
    });

    return (
      <div>
        {$options}
      </div>
    );
  }
})

export default RemoteAssistance;
