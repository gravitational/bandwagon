import React from 'react';

const EndPoints = React.createClass({

  renderEndpoint(endpoint, index){
    let { urls, name, description } = endpoint;
    let $urls = urls.map( (url, key) => <div key={key}><a href={url} target="_blank">{url}</a></div>);
    return (
      <div key={index} className="my-page-section-endpoints-item">
        <strong>{name}</strong>
        <div className="text-muted">{description}</div>
        <div className="m-t-xs">{$urls}</div>
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
        <h3 className="m-t">Please save below information for your future reference.</h3>
        <div className="my-page-section-endpoints-items">
          {$endpoints}
        </div>
      </div>
    );
  }
})

export default EndPoints;
