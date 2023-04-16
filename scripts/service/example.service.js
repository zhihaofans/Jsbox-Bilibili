const { HttpService, HttpUtil } = require("./http.service");
const httpService = new HttpService();
const { getCookie } = require("./account.service");
const { hasString } = require("../util/String");
class ExampleService {
  constructor() {}
  test() {
    return Promise.resolve();
  }
}
class HttpExampleService {
  constructor() {}
  getCallback(callback, rawData = false) {
    const url = "";
    httpService.getCallback({
      url,
      params: {},
      header: {
        cookie: getCookie()
      },
      callback: data => {
        if (data === undefined || data.code !== 0) {
          $console.error({
            _: "getNavData",
            data
          });
          callback(rawData === true ? data : undefined);
        } else {
          $console.info({
            _: "getNavData",
            data
          });
          callback(rawData === true ? data : data.data);
        }
      }
    });
  }
}

module.exports = {
  ExampleService,
  HttpExampleService
};
