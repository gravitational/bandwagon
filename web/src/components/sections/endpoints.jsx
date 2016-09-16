import React from 'react';

const EndPoints = React.createClass({

  renderEndpoint(endpoint, index){
    let { urls, name, description } = endpoint;
    let $urls = urls.map( (url, key) => <div key={key}><a className="m-r-sm" href="#">{url}</a></div>);
    return (
      <div key={index} className="my-page-section-endpoints-item">
        <div>{name}</div>
        <div className="text-muted no-margins">
          <small>{description}</small>
        </div>
        <div>{$urls}</div>
      </div>
    )
  },

  render() {
    let { data } = this.props;

    if(data.length === 0){
      return null;
    }

    let $endpoints = data.map(this.renderEndpoint);

    return (
      <div className="my-page-section-endpoints">
        <h3 className="m-b m-t">Application endpoints</h3>
        <div className="my-page-section-endpoints-items m-l-sm">
          {$endpoints}
        </div>
      </div>
    );
  }
})

export default EndPoints;
