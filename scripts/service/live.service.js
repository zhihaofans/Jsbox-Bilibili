const $ = require("$");
const { HttpService } = require("./http.service");
const AccountService = require("./account.service");
class LiveService {
  constructor() {
    this.Http = new HttpService();
  }
  checkIn() {
    return new Promise((resolve, reject) => {
      const url = "https://api.live.bilibili.com/rc/v1/Sign/doSign";
      try {
        $console.info("trystart");
        this.Http.getThen({
          url,
          header: {
            cookie: AccountService.getCookie()
          }
        })
          .then(resp => {
            if (resp.error) {
              reject(resp.error);
            } else {
              resolve(resp.data);
            }
          })
          .catch(fail => reject(fail));
        $console.info("try");
      } catch (error) {
        $console.error(error);
        reject(error);
      }
    });
  }
  getUserInfo() {
      return new Promise((resolve, reject) => {
        const url = "https://api.live.bilibili.com/xlive/web-ucenter/user/get_user_info";
        try {
          $console.info("trystart");
          this.Http.getThen({
            url,
            header: {
              cookie: AccountService.getCookie()
            }
          })
            .then(resp => {
              if (resp.error) {
                reject(resp.error);
              } else {
                resolve(resp.data);
              }
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
module.exports = LiveService;
