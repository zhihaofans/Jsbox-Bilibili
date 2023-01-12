const { Http } = require("Next");
class HttpKit {
  constructor(timeout) {
    this.Http = new Http(timeout || 5);
    this.DEBUG = false;
  }
  setDebug(isDebug) {
    this.DEBUG = isDebug === true;
  }
  get({ url, params, header, callback = result => {} }) {
    this.Http.getAsync({
      url,
      params,
      header,
      handler: resp => {
        if (this.DEBUG) {
          //          $console.info({
          //            _FILE: "http.js",
          //            _FUNCTION: "HttpKit.get",
          //            url,
          //            params,
          //            header,
          //            resp
          //          });
        }
        if (resp.error) {
          if (this.DEBUG) $console.error(resp.error);
          callback(undefined);
        } else {
          callback(resp.data);
        }
      }
    });
  }
  post({ url, params, body, header, callback = result => {} }) {
    this.Http.postAsync({
      url,
      params,
      body,
      header,
      handler: resp => {
        if (this.DEBUG) {
          $console.info({
            _FILE: "http.js",
            _FUNCTION: "HttpKit.post",
            url,
            params,
            body,
            header,
            resp
          });
        }
        if (resp.error) {
          if (this.DEBUG) $console.error(resp.error);
          callback(undefined);
        } else {
          callback(resp.data);
        }
      }
    });
  }
}
module.exports = HttpKit;
