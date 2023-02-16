const { hasString } = require("../util/String");
const { HttpUtil } = require("./http.service");
const BilibiliApi = require("BilibiliApi");
class UserDataService {
  constructor() {
    this.Storage = require("../util/Storage");
    this.Keychain = new this.Storage.Keychain("bilibili.user.auth");
    this.Key = {
      accesskey: "accesskey",
      cookie: "cookie",
      csrf: "csrf"
    };
  }
  clearAllData() {
    this.Keychain.remove(this.Key.cookie);
    this.Keychain.remove(this.Key.csrf);
  }
  getCookie() {
    return this.Keychain.get(this.Key.cookie);
  }
  setCookie(cookie) {
    const httpUtil = new HttpUtil();
    const resultCookie = this.Keychain.set(this.Key.cookie, cookie);
    const cookieObj = httpUtil.getCookieObject(cookie);
    const resultCsrf = this.setCsrf(cookieObj.bili_jct);
    return resultCookie && resultCsrf;
  }
  getCsrf() {
    return this.Keychain.get(this.Key.csrf);
  }
  setCsrf(csrf) {
    return this.Keychain.set(this.Key.csrf, csrf);
  }
  getAccesskey() {
    return this.Keychain.get(this.Key.accesskey);
  }
  setAccesskey(accesskey) {
    return this.Keychain.set(this.Key.accesskey, accesskey);
  }
}
class LoginService {
  constructor() {
    this.Api = new BilibiliApi.AccountLoginApi();
    this.userData = new UserDataService();
  }
  isLogin() {
    const cookie = this.userData.getCookie(),
      csrf = this.userData.getCsrf();
    return hasString(cookie) && hasString(csrf);
  }
  inportCookie() {
    return new Promise((resolve, reject) => {
      const userData = new UserDataService();
      $input.text({
        type: $kbType.text,
        placeholder: "输入cookie",
        text: userData.getCookie(),
        handler: cookie => {
          $console.info({
            cookie
          });
          if (hasString(cookie)) {
            const resultCookie = userData.setCookie(cookie);
            $console.info({
              resultCookie
            });
            resolve(resultCookie);
          } else {
            reject(false);
          }
        }
      });
    });
  }
  importCookieOld(callback) {
    const userData = new UserDataService();
    $input.text({
      type: $kbType.text,
      placeholder: "输入cookie",
      text: userData.getCookie(),
      handler: cookie => {
        $console.info({
          cookie
        });
        if (hasString(cookie)) {
          const resultCookie = userData.setCookie(cookie);
          $console.info({
            resultCookie
          });
          callback(resultCookie);
        } else {
          callback(false);
        }
      }
    });
  }
  loginByQrcode() {
    return new Promise((resolve, reject) => {
      $ui.loading(true);
      reject();
    });
  }
  logout() {
    this.userData.clearAllData();
  }
}
class AccountService {
  constructor() {
    this.LoginService = new LoginService();
    this.UserDataService = this.LoginService.userData;
  }
  checkLoginStatus(callback) {
    if (callback === undefined) {
      return this.LoginService.checkLoginStatus();
    } else {
      this.LoginService.checkLoginStatus(callback);
    }
  }
  getCookie() {
    return this.UserDataService.getCookie();
  }
  getCsrf() {
    return this.UserDataService.getCsrf();
  }
  isLogin() {
    return this.LoginService.isLogin();
  }
  importCookie() {
    return this.LoginService.inportCookie();
  }
  logout() {
    this.LoginService.logout();
  }
}
module.exports = AccountService;
