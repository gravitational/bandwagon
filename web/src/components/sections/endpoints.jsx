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
