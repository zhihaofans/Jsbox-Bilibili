const AccountService = require("./account.service");
const { HttpService } = require("./http.service");
const Http = new HttpService();
class VipCenter {
  constructor(cookie) {
    this.Cookie = cookie;
  }
  getInfo() {
    return new Promise((resolve, reject) => {
      const url = `https://api.bilibili.com/x/vip/web/vip_center/combine`;
      Http.getThen({
        url,
        headers: {
          cookie: this.Cookie
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
class VipPrivilege {
  constructor(cookie) {
    this.Cookie = cookie;
    this.Csrf = new AccountService().getCsrf();
  }
  getPrivilegeStatus() {
    return new Promise((resolve, reject) => {
      const url = "https://api.bilibili.com/x/vip/privilege/my";
      Http.getThen({
        url,
        headers: {
          cookie: this.Cookie
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
      const url = "https://api.bilibili.com/x/vip/privilege/my";
      Http.getThen({
        url,
        params: {
          type,
          csrf: this.Csrf
        },
        headers: {
          cookie: this.Cookie
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
    this.Cookie = new AccountService().getCookie();
    this.VipCenter = new VipCenter(this.Cookie);
    this.VipPrivilege = new VipPrivilege(this.Cookie);
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
