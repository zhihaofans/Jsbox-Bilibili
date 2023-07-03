const Http = require("./http.service");
const { getCookie } = require("./account.service");
const { hasString } = require("../util/String");
class ExampleService {
  constructor() {}
  test() {
    return new Promise((resolve, reject) => {});
  }
}

function getThen() {
  const url = "";
  return new Promise((resolve, reject) => {
    Http.getThen({
      url,
      params: {
        aaa: "bbb"
      },
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
function postThen() {
  const url = "";
  return new Promise((resolve, reject) => {
    Http.getThen({
      url,
      params: {
        aaa: "bbb"
      },
      body: {
        bbb: "aaa"
      },
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

module.exports = {
  ExampleService,
  getThen,
  postThen
};
