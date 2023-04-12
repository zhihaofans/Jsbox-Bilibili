const { HttpService } = require("./http.service");
const AccountService = require("./account.service");
class LaterToView {
  constructor(cookie, csrf) {
    this.Cookie = cookie;
    this.Csrf = csrf;
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
    this.AccountService = new AccountService();
    this.HttpService = new HttpService();
    this.WatchHistory = new WatchHistory(this.AccountService.getCookie());
    this.LaterToView = new LaterToView(
      this.AccountService.getCookie(),
      this.AccountService.getCsrf()
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
}
module.exports = HistoryService;
