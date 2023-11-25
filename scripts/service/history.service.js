const { HttpService } = require("./http.service");
const AccountService = require("./account.service");
class Favorite {
  constructor() {
    this.Cookie = AccountService.getCookie();
    this.Csrf = AccountService.getCsrf();
    this.Uid = AccountService.getUid();
    this.HttpService = new HttpService();
  }
  getFavList() {
    return new Promise((resolve, reject) => {
      const url = "https://api.bilibili.com/x/v3/fav/folder/created/list-all";
      this.HttpService.getThen({
        url,
        params: {
          up_mid: this.Uid
        },
        header: {
          cookie: this.Cookie
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
        .catch(reject);
    });
  }
  getFavContent(fav_id) {
    $console.info(fav_id);
    return new Promise((resolve, reject) => {
      const url = `https://api.bilibili.com/x/v3/fav/resource/list`;
      this.HttpService.getThen({
        url,
        params: {
          media_id: fav_id,
          ps: 20
        },
        header: {
          cookie: this.Cookie
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
        .catch(reject);
    });
  }
  cleanDieItem(favId) {
    $console.info(favId);
    return new Promise((resolve, reject) => {
      const url = `https://api.bilibili.com/x/v3/fav/resource/clean`;
      this.HttpService.postThen({
        url,
        params: {
          media_id: favId,
          csrf: this.Csrf
        },
        header: {
          cookie: this.Cookie
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
        .catch(reject);
    });
  }
}
class LaterToView {
  constructor() {
    this.Cookie = AccountService.getCookie();
    this.Csrf = AccountService.getCsrf();
    this.AccessKey = AccountService.getAccesskey();
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
          bvid
        },
        header: {
          cookie: this.Cookie,
          "Content-Type": "application/x-www-form-urlencoded"
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
  removeLaterToView(avid) {
    return new Promise((resolve, reject) => {
      const url = "https://api.bilibili.com/x/v2/history/toview/del";
      this.HttpService.postThen({
        url,
        body: {
          csrf: this.Csrf,
          avid
        },
        header: {
          cookie: this.Cookie,
          "Content-Type": "application/x-www-form-urlencoded"
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
  constructor() {
    this.Cookie = AccountService.getCookie();
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
    this.WatchHistory = new WatchHistory();
    this.LaterToView = new LaterToView();
    this.Favorite = new Favorite();
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
  getFavoriteList() {
    return this.Favorite.getFavList();
  }
  getFavoriteContent(favId) {
    return this.Favorite.getFavContent(favId);
  }
}
module.exports = HistoryService;
