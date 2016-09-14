import $ from 'jquery';

let apiUtils = {

  post(data){
    let cfg = {
      url: 'api/complete',
      type: 'POST',
      dataType: 'json',
      data: JSON.stringify(data)
    };

    return $.ajax(cfg);
  },

  init() {
    let cfg = {
      url: 'api/info',
      type: "GET",
      dataType: "json"
    }

    return $.ajax(cfg).then(createInfo);
  }
}

function createInfo(json){
  let { endpoints=[], app={} } = json;

  let application = {
    name: app.name || 'Application',
    version: app.version
  };

  endpoints = endpoints.map(item => {
    let { name, description, addresses } = item;
    let urls = addresses.map( addr => addr);
    return {
      name,
      description,
      urls
    }
  });

  return { endpoints, application };
}

export default apiUtils;
