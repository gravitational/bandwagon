import $ from 'jquery';

let apiUtils = {

  init(){
    let dfd = $.Deferred();

    setTimeout(()=>{
      dfd.resolve();
    }, 1000);

    return dfd;

  }
}

export default apiUtils;
