const { HttpService } = require("./http.service");
const AccountService = require("./account.service");
class UserInfoService {
  constructor() {
    this.HttpService = new HttpService();
    this.AccountService = new AccountService();
  }
  getNavData(rawData = false) {
    return new Promise((resolve, reject) => {
      const url = "http://api.bilibili.com/x/web-interface/nav"
      try {
        $console.info("trystart");
        this.HttpService.getCallback({
          url,
          header: {
            cookie: this.AccountService.getCookie()
          },
          callback: data => {
            $console.info("trycall");
            if (data === undefined || data.code !== 0) {
              resolve(rawData === true ? data : undefined);
            } else {
              resolve(rawData === true ? data : data.data);
            }
            $console.info("trycallend");
          }
        });
        $console.info("try");
      } catch (error) {
        $console.error(error);
        reject(error);
      }
    });
  }
  getNavDataOld(callback, rawData = false) {
    const url = "http://api.bilibili.com/x/web-interface/nav"
      
    try {
      this.HttpService.getCallback({
        url,
        header: {
          cookie: this.AccountService.getCookie()
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
class UserService {
  constructor() {
    this.UserInfo = new UserInfoService();
  }
  checkLoginStatus() {
    return new Promise((resolve, reject) => {
      try {
        this.UserInfo.getNavData(true).then(
          result => {
            $console.info("checkLoginStatus.then");
            if (result === undefined) {
              reject({
                message: "result===undefined"
              });
            } else if (result.code !== 0) {
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
}
module.exports = UserService;
