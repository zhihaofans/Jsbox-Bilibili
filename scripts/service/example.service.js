const httpService = require("./http.service");
const { getCookie } = require("./account.service");
const { hasString } = require("../util/String");
class ExampleService {
  constructor() {}
  test() {
    return new Promise((resolve, reject) => {});
  }
}
class HttpExampleService {
  constructor() {}
  getThen() {
    const url = "";
    return new Promise((resolve, reject) => {
      httpService.Http.getThen({
        url,
        header: {
          cookie: getCookie()
        }
      })
        .then(result => {
          resolve(result.data);
        })
        .catch(fail => reject(fail));
    });
  }
  postThen() {
    const url = "";
    return new Promise((resolve, reject) => {
      httpService.Http.getThen({
        url,
        header: {
          cookie: getCookie()
        }
      })
        .then(result => {
          resolve(result.data);
        })
        .catch(fail => reject(fail));
    });
  }
}

module.exports = {
  ExampleService,
  HttpExampleService
};
