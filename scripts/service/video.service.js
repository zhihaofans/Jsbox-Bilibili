const { HttpService } = require("./http.service");
const { hasString } = require("../util/String");
const AccountService = require("./account.service");
const Http = new HttpService();
class VideoDownloader {
  constructor() {}
  downloadWebVideo(bvid, cid) {
    return new Promise((resolve, reject) => {
      const url = `https://api.bilibili.com/x/player/playurl`;
      Http.getThen({
        url,
        params: {
          bvid,
          cid,
          fourk: 1,
          fnval: 16,
          fnver: 0
        },
        header: {
          Cookie: AccountService.getCookie()
        }
      })
        .then(result => {
          $console.info({
            bvid,
            cid,
            downloadWebVideo: result.data
          });
          resolve(result.data);
        })
        .catch(reject);
    });
  }
  getCidList(bvid) {}
}
function getVideoInfo(videoId) {
  return new Promise((resolve, reject) => {
    if (!hasString(videoId)) {
      reject(undefined);
    } else {
      const url = `https://api.bilibili.com/x/web-interface/view`;
      Http.getThen({
        url,
        params: {
          bvid: videoId
        },
        header: {
          cookie: AccountService.getCookie()
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
          } else if (data) {
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
function sendCoinToVideo(bvid) {
  return new Promise((resolve, reject) => {
    if (!hasString(bvid)) {
      reject({
        message: "need bvid"
      });
    } else {
      const url = `https://api.bilibili.com/x/web-interface/coin/add`;
      Http.postThen({
        url,
        body: {
          bvid,
          multiply: 2
        },
        header: {
          cookie: AccountService.getCookie()
        }
      })
        .then(result => {
          const data = result.data;
          if (data === undefined) {
            $console.error({
              getVideoInfo: bvid,
              data
            });
            reject(undefined);
          } else if (data) {
            $console.info({
              getVideoInfo: bvid,
              data
            });
            resolve(data);
          }
        })
        .catch(error => reject(error));
    }
  });
}
module.exports = {
  downloadVideo: new VideoDownloader().downloadWebVideo,
  getVideoInfo,
  sendCoinToVideo
};
