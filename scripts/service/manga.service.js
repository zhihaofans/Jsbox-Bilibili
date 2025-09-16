const { HttpService } = require("./http.service");
const httpService = new HttpService();
const { getCookie } = require("./account.service");
const { hasString } = require("../util/String");
class MangaService {
  constructor() {}
  getCouponsList() {
    return new Promise((resolve, reject) => {
      const url = "https://manga.bilibili.com/twirp/user.v1.User/GetCoupons";
          try {
            $console.info("trystart");
            httpService
              .postThen({
                url,
                params: {
                  platform: "android"
                },
                header: {
                  cookie: getCookie()
                }
              })
              .then(result => {
                $console.info("mangacheckin");
                resolve(result.data);
                $console.info("mangacheckin", "end");
              })
              .catch(fail => reject(fail));
            $console.info("try");
          } catch (error) {
            $console.error(error);
            reject(error);
          }
    });
  }
}
class HttpExampleService {
  constructor() {}
  getCallback(callback, rawData = false) {
    const url = "";
    httpService.getCallback({
      url,
      params: {},
      header: {
        cookie: getCookie()
      },
      callback: data => {
        if (data === undefined || data.code !== 0) {
          $console.error({
            _: "getNavData",
            data
          });
          callback(rawData === true ? data : undefined);
        } else {
          $console.info({
            _: "getNavData",
            data
          });
          callback(rawData === true ? data : data.data);
        }
      }
    });
  }
}
function checkin() {
  return new Promise((resolve, reject) => {
    const url = "https://manga.bilibili.com/twirp/activity.v1.Activity/ClockIn";
    try {
      $console.info("trystart");
      httpService
        .postThen({
          url,
          params: {
            platform: "android"
          },
          header: {
            cookie: getCookie()
          }
        })
        .then(result => {
          $console.info("mangacheckin");
          resolve(result.data);
          $console.info("mangacheckin", "end");
        })
        .catch(fail => reject(fail));
      $console.info("try");
    } catch (error) {
      $console.error(error);
      reject(error);
    }
  });
}
module.exports = {
  checkin
};
