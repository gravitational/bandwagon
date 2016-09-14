import React from 'react';

const EndPoints = React.createClass({

  renderEndpoint(endpoint, index){
    let { urls, name, description } = endpoint;
    let $urls = urls.map( (url, key) => <div key={key}><a className="m-r-sm" href="#">{url}</a></div>);
    return (
      <div key={index}>
        <div className="m-l-sm">
          <dl className="dl-horizontal">
            <dt>
              Name:
            </dt>
            <dd>
              {name}
            </dd>
            <dt>Description:</dt>
            <dd>
              {description}
            </dd>
            <dt>Address:</dt>
            <dd>
              {$urls}
            </dd>
          </dl>
        </div>
      </div>
    )
  },

  render() {
    let { data, appName } = this.props;

    if(data.length === 0){
      return null;
    }

    let $endpoints = data.map(this.renderEndpoint);

    return (
      <div className="my-page-section-endpoints">
        <h3 className="m-b m-t">{appName} endpoints</h3>
        {$endpoints}
      </div>
    );
  }
})

export default EndPoints;
