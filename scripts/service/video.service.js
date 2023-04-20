const { HttpService } = require("./http.service");
const { hasString } = require("../util/String");
const AccountService = require("./account.service");
class VideoInfoService {
  constructor() {
    this.HttpService = new HttpService();
    this.AccountService = new AccountService();
  }
  getVideoInfo(videoId) {
    return new Promise((resolve, reject) => {
      if (!hasString(videoId)) {
        reject(undefined);
      } else {
        const url = `https://api.bilibili.com/x/web-interface/view`;
        this.HttpService.getThen({
          url,
          params: {
            bvid: videoId
          },
          header: {
            cookie: this.AccountService.getCookie()
          }
        })
          .then(result => {
            const data = result.data;
            if (data === undefined) {
              $console.error({
                getVideoInfo: videoId,
                data
              });
              reject(undefined);
            } else if(data){
              $console.info({
                getVideoInfo: videoId,
                data
              });
              resolve(data);
            }
          })
          .catch(error => reject(error));
      }
    });
  }
}
module.exports = {
  VideoInfoService
};
