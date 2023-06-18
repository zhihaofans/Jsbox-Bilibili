const { HttpService } = require("./http.service");
const AccountService = require("./account.service");
class LaterToView {
  constructor(cookie, csrf, access_key) {
    this.Cookie = cookie;
    this.Csrf = csrf;
    this.AccessKey = access_key;
    this.HttpService = new HttpService();
  }
  getLaterToView() {
    return new Promise((resolve, reject) => {
      const url = `https://api.bilibili.com/x/v2/history/toview`;
      this.HttpService.getThen({
        url,
        headers: {
          cookie: this.Cookie
        }
      })
        .then(resp => {
          const result = resp.data;
          if (result !== undefined || result.code == 0) {
            resolve(result.data);
          } else {
            reject(result);
          }
        })
        .catch(error => {
          $console.error(error);
          reject(error);
        });
    });
  }
  addLaterToView(bvid) {
    return new Promise((resolve, reject) => {
      const url = "https://api.bilibili.com/x/v2/history/toview/add";
      this.HttpService.postThen({
        url,
        body: {
          csrf: this.Csrf,
          bvid,
          access_key: this.AccessKey
        },
        headers: {
          cookie: this.Cookie
        }
      })
        .then(resp => {
          const result = resp.data;
          if (result !== undefined || result.code === 0) {
            resolve(result);
          } else {
            reject(result);
          }
        })
        .catch(error => {
          $console.error(error);
          reject(error);
        });
    });
  }
}
class WatchHistory {
  constructor(cookie) {
    this.Cookie = cookie;
    this.HttpService = new HttpService();
  }
  getWatchHistory(pageSize = 30) {
    return new Promise((resolve, reject) => {
      const url = `https://api.bilibili.com/x/web-interface/history/cursor?ps=${pageSize}`;
      this.HttpService.getThen({
        url,
        headers: {
          cookie: this.Cookie
        }
      })
        .then(resp => {
          const result = resp.data;
          if (result !== undefined || result.code == 0) {
            resolve(result.data);
          } else {
            reject(result);
          }
        })
        .catch(error => {
          $console.error(error);
          reject(error);
        });
    });
  }
}
class HistoryService {
  constructor() {
    this.LOGIN_DATA = {
      ACCESSKEY: AccountService.getAccesskey(),
      COOKIE: AccountService.getCookie(),
      CSRF: AccountService.getCsrf()
    };
    $console.info(this.LOGIN_DATA);
    this.HttpService = new HttpService();
    this.WatchHistory = new WatchHistory(
      this.LOGIN_DATA.COOKIE,
      this.LOGIN_DATA.CSRF
    );
    this.LaterToView = new LaterToView(
      this.LOGIN_DATA.COOKIE,
      this.LOGIN_DATA.CSRF,
      this.LOGIN_DATA.ACCESSKEY
    );
  }
  getLaterToViewList() {
    return new Promise((resolve, reject) => {
      this.LaterToView.getLaterToView().then(
        result => {
          $console.info({
            _: "getLaterToView",
            result
          });
          if (result === undefined) {
            reject(undefined);
          } else {
            resolve(result);
          }
        },
        fail => {
          reject(fail);
        }
      );
    });
  }
  getHistoryList() {
    return new Promise((resolve, reject) => {
      this.WatchHistory.getWatchHistory().then(
        result => {
          $console.info({
            _: "getHistoryList",
            result
          });
          if (result === undefined) {
            reject(undefined);
          } else {
            resolve(result);
          }
        },
        fail => {
          reject(fail);
        }
      );
    });
  }
  addLaterToView(bvid) {
    return this.LaterToView.addLaterToView(bvid);
  }
}
module.exports = HistoryService;
