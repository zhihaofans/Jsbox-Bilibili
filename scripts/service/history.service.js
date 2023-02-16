const { HttpService } = require("./http.service");
const AccountService = require("./account.service");
const BilibiliApi = require("BilibiliApi");
class HistoryUtil {
  constructor() {}
}
class HistoryService {
  constructor() {
    this.AccountService = new AccountService();
    this.HttpService = new HttpService();
    this.Api = new BilibiliApi.WatchHistoryApi(this.AccountService.getCookie());
  }
  getHistoryList() {
    return new Promise((resolve, reject) => {
      this.Api.getWatchHistory().then(
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
