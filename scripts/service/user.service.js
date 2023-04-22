const Http = require("./http.service");
const HttpService = new Http.HttpService();
const AccountService = require("./account.service");
const accountService = new AccountService();
const cookie = accountService.getCookie();
class UserInfoService {
  constructor() {
    this.AccountService = new AccountService();
  }
  getNavData(rawData = false) {
    return new Promise((resolve, reject) => {
      const url = "http://api.bilibili.com/x/web-interface/nav";
      try {
        $console.info("trystart");
        HttpService.getThen({
          url,
          header: {
            cookie
          }
        })
          .then(data => {
            $console.info("trycall");
            resolve(rawData === true ? data : data?.data);
            $console.info("trycallend");
          })
          .catch(fail => reject(fail));
        $console.info("try");
      } catch (error) {
        $console.error(error);
        reject(error);
      }
    });
  }
  getNavDataOld(callback, rawData = false) {
    const url = "http://api.bilibili.com/x/web-interface/nav";
    try {
      HttpService.getCallback({
        url,
        header: {
          cookie
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
    } catch (error) {
      $console.error(error);
    }
  }
}

const UserInfo = new UserInfoService();
function checkLoginStatus() {
  return new Promise((resolve, reject) => {
    try {
      UserInfo.getNavData().then(
        result => {
          $console.info("checkLoginStatus.then");
          if (result === undefined) {
            reject({
              message: "result===undefined"
            });
          } else if (result.code !== 0) {
            // 如果未登录则自动清空登录数据
            //this.userData.clearAllData();
          }
          resolve(result.code === 0);
          $console.info("checkLoginStatus.end");
        },
        fail => {
          $console.error({
            UserServicecheckLoginStatus: fail
          });
          reject(fail);
        }
      );
    } catch (error) {
      $console.error(error);
      reject(error);
    }
  });
}
function getNavData(rawData = false) {
  return new Promise((resolve, reject) => {
    const url = "http://api.bilibili.com/x/web-interface/nav";
    try {
      $console.info("trystart");
      this.HttpService.getThen({
        url,
        header: {
          cookie
        }
      })
        .then(data => {
          $console.info("trycall");
          resolve(rawData === true ? data : data?.data);
          $console.info("trycallend");
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
  checkLoginStatus,
  getNavData
};
