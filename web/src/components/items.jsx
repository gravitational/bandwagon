import React from 'react';

const MSG_ERROR_DEFAULT = 'Whoops, something went wrong.';

const PageIndicator = React.createClass({

  render() {
    let { isLoading, isError } = this.props;

    if(isError){
      return (
        <div className="my-page-indicator-error">
          <div><i className="fa fa-frown-o"></i> </div>
          <h1>{MSG_ERROR_DEFAULT}</h1>
        </div>
      )
    }

    if(isLoading){
      return (
        <div className="my-page-indicator sk-spinner sk-spinner-three-bounce">
          <div className="sk-bounce1" />
          <div className="sk-bounce2" />
          <div className="sk-bounce3" />
        </div>
      );
    }

    return <div>{this.props.children}</div>;
  }

});

export {
  PageIndicator
}
