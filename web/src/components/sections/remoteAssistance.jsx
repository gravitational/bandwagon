import React from 'react';

const RemoteAssistance = React.createClass({

  onChangeRemoteAssitance(){
  },

  render() {
    let value = 0;
    let options =  [
        {
          value: 0,
          title: 'Enable remote assistance to allow vendor team to support your infrastructure.'
        },

        {
          value: 1,
          title: 'Disable remote assistance to turn off remote access to your infrastructure for vendor support team.'
        }
      ]

    return (
      <div>
        <h3>Remote Assistance</h3>
        <div className="m-l-md m-t">
          <RadioGroup options={options} value={value} onChange={this.onChangeRemoteAssitance}/>
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

  getInitialState(){
    let currentValue = this.props.value;
    return {currentValue};
  },

  onChange(option){
    this.props.onChange(option.value);
    this.setState({currentValue: option.value });
  },

  render() {
    let {options} = this.props;
    let {currentValue} = this.state;

    let $options = options.map((option, index) => {
      let {value, title} = option;
      return (
        <label key={index} className="grv-control-radio">
          <span>{title}</span>
          <input type="radio" name="radio"
            onChange={this.onChange.bind(this, option)}
            checked={value === currentValue}/>
          <div className="grv-control-radio-indicator"></div>
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
