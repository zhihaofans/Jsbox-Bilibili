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
  return new Promise((resolve, reject) => {
    const url = "";
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
  return new Promise((resolve, reject) => {
    const url = "";
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
function getEmoteInfo({ emoteId, business }) {
  return new Promise((resolve, reject) => {
    const url = "https://api.bilibili.com/x/emote/package";
    Http.getThen({
      url,
      params: {
        business: business || "reply", //reply：评论区dynamic：动态
        ids: emoteId
      }
      //      header: {
      //        cookie: getCookie()
      //      }
    })
      .then(result => {
        resolve(result.data);
      })
      .catch(fail => reject(fail));
  });
}
function getAllEmoteList(business) {
  return new Promise((resolve, reject) => {
    const url = "https://api.bilibili.com/x/emote/user/panel/web";
    Http.getThen({
      url,
      params: {
        business: business || "reply"
      },
      header: {
        cookie: getCookie()
      }
    })
      .then(resp => {
        const result = resp.data;
        if (result.code === 0) {
          resolve(result.data);
        } else {
          reject(result);
        }
      })
      .catch(fail => reject(fail));
  });
}
module.exports = {
  ExampleService,
  getThen,
  postThen,
  getAllEmoteList,
  getEmoteInfo
};
