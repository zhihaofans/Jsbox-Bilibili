const { HttpService } = require("./http.service");
const { hasString } = require("../util/String");
const AccountService = require("./account.service");
const Http = new HttpService();
class VideoDownloader {
  constructor() {}
  startToDownload(url, savePath) {
    return new Promise((resolve, reject) => {
      $http.download({
        url,
        header: {
          Cookie: AccountService.getCookie(),
          referer: "https://www.bilibili.com",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
        },
        showsProgress: true, // Optional, default is true
        backgroundFetch: true, // Optional, default is false
        progress: function (bytesWritten, totalBytes) {
          const percentage = (bytesWritten * 1.0) / totalBytes;
          $console.info(`download:${percentage}`);
        },
        handler: function (resp) {
          $share.sheet(resp.data);
        }
      });
    });
  }
  downloadWebVideo(bvid, cid) {
    return new Promise((resolve, reject) => {
      const url = `https://api.bilibili.com/x/player/wbi/playurl?bvid=${bvid}&cid=${cid}&qn=120&fourk=1&fnval&128=128`;
      Http.getThen({
        url,

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
  VideoDownloader,
  downloadVideo: new VideoDownloader().downloadWebVideo,
  getVideoInfo,
  sendCoinToVideo
};
