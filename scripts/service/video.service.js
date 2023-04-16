const { HttpService } = require("./http.service");
const { hasString } = require("../util/String");
const AccountService = require("./account.service");
class VideoInfoService {
  constructor() {
    this.HttpService = new HttpService();
    this.AccountService = new AccountService();
  }
  getVideoInfo(videoId, callback) {
    if (!hasString(videoId)) {
      callback(undefined);
    } else {
      const url = `https://api.bilibili.com/x/web-interface/view`;
      this.HttpService.getCallback({
        url,
        params: {
          bvid: videoId
        },
        header: {
          cookie: this.AccountService.getCookie()
        },
        callback: data => {
          if (data === undefined) {
            $console.error({
              getVideoInfo: videoId,
              data
            });
            callback(undefined);
          } else {
            $console.info({
              getVideoInfo: videoId,
              data
            });
            callback(data);
          }
        }
      });
    }
  }
}
module.exports = {
  VideoInfoService
};
