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
  let { endpoints=[], appName } = json;

  endpoints = endpoints.map(item => {
    let { name, description, addresses } = item;
    let urls = addresses.map( addr => addr);
    return {
      name,
      description,
      urls
    }
  });

  return { endpoints, appName };
}

export default apiUtils;
