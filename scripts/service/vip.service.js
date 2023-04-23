const { getCookie, getCsrf } = require("./account.service");
const { HttpService } = require("./http.service");
const Http = new HttpService();
class VipCenter {
  constructor() {}
  getInfo() {
    return new Promise((resolve, reject) => {
      const url = `https://api.bilibili.com/x/vip/web/vip_center/combine`;
      Http.getThen({
        url,
        headers: {
          cookie: getCookie()
        }
      })
        .then(resp => {
          const result = resp.data;
          result ? resolve(result) : reject(result);
        })
        .catch(error => {
          $console.error(error);
          reject(error);
        });
    });
  }
}
class VipTask {
  // 大积分
  constructor() {}
  bigPointCheckIn() {
    return new Promise((resolve, reject) => {
      const url = "https://api.bilibili.com/pgc/activity/score/task/sign";
      Http.postThen({
        url,
        body: {
          csrf: getCsrf()
        },
        header: {
          cookie: $text.URLEncode(getCookie()),
          "Content-Type": "application/x-www-form-urlencoded",
          "Referer": "www.bilibili.com"
        }
      })
        .then(resp => {
          const result = resp.data;
          result
            ? resolve(result)
            : reject({
                message: "result==undefined"
              });
        })
        .catch(error => {
          $console.error(error);
          reject(error);
        });
    });
  }
}
class VipPrivilege {
  constructor() {}
  getPrivilegeStatus() {
    return new Promise((resolve, reject) => {
      const url = "https://api.bilibili.com/x/vip/privilege/my";
      Http.getThen({
        url,
        header: {
          cookie: getCookie()
        }
      })
        .then(resp => {
          const result = resp.data;
          result ? resolve(result) : reject(result);
        })
        .catch(error => {
          $console.error(error);
          reject(error);
        });
    });
  }
  receivePrivilege(type) {
    return new Promise((resolve, reject) => {
      const url = "https://api.bilibili.com/x/vip/privilege/receive";
      Http.postThen({
        url,
        body: {
          type,
          csrf: getCsrf()
        },
        header: {
          cookie: getCookie(),
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
        .then(resp => {
          const result = resp.data;
          result ? resolve(result) : reject(result);
        })
        .catch(error => {
          $console.error(error);
          reject(error);
        });
    });
  }
}
class VipService {
  constructor() {
    this.VipCenter = new VipCenter();
    this.VipPrivilege = new VipPrivilege();
    this.Task = new VipTask();
    this.VipCenterInfo = undefined;
  }
  isVip() {
    return new Promise((resolve, reject) => {
      this.VipCenter.getInfo()
        .then(result => {
          if (result.code === 0) {
            this.VipCenterInfo = result.data;
            resolve(result.data?.user.vip.vip_status === 1);
          } else {
            resolve(false);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  getVipCenterInfo() {
    return new Promise((resolve, reject) => {
      if (this.VipCenterInfo !== undefined) {
        resolve(this.VipCenterInfo);
      } else {
        this.VipCenter.getInfo()
          .then(result => {
            if (result.code === 0) {
              this.VipCenterInfo = result.data;
              resolve(result.data);
            } else {
              resolve(undefined);
            }
          })
          .catch(error => {
            reject(error);
          });
      }
    });
  }
}
module.exports = VipService;
