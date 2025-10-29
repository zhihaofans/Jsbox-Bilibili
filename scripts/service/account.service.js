const { hasString } = require("../util/String");
const {
  getCookieObject,
  getThen,
  postThen,
  queryCookieByStr
} = require("./http.service");
const UrlUtil = require("../util/Url");
class UserDataService {
  constructor() {
    this.Keychain = require("../util/Storage").Keychain("bilibili.user.auth");
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
  getCookieKey(key) {
    return queryCookieByStr("," + this.getCookie(), key);
  }
  getCookie() {
    const result = this.Keychain.get(this.Key.cookie);
    return result;
  }
  setCookie(cookie) {
    if (cookie === undefined || cookie.length == 0) {
      return false;
    }
    const resultCookie = this.Keychain.set(this.Key.cookie, cookie);
    return resultCookie;
  }
  getCsrf() {
    return this.getCookieKey("bili_jct");
  }
  getAccesskey() {
    return this.Keychain.get(this.Key.accesskey);
  }
  setAccesskey(accesskey) {
    return this.Keychain.set(this.Key.accesskey, accesskey);
  }
  getSESSDATA() {
    return this.getCookieKey("SESSDATA");
  }
  getUid() {
    return this.getCookieKey("DedeUserID");
  }
}
class LoginService {
  constructor() {
    //this.HttpService = new HttpService();
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
  getQrcodeKey() {
    return new Promise((resolve, reject) => {
      const url =
        "https://passport.bilibili.com/x/passport-login/web/qrcode/generate";
      getThen({
        url
      })
        .then(resp => {
          const result = resp.data;
          if (result.code === 0) {
            resolve(result.data);
          } else {
            reject(result);
          }
        })
        .catch(fail => {
          reject(fail);
        });
    });
  }
  loginByQrcode(qrcode_key) {
    return new Promise((resolve, reject) => {
      const url = `https://passport.bilibili.com/x/passport-login/web/qrcode/poll?qrcode_key=${qrcode_key}`;
      getThen({
        url
      })
        .then(resp => {
          const result = resp.data;

          $console.info(resp.response.headers);
          if (result.code === 0) {
            const { code, url } = result.data;
            if (code === 0) {
              const urlPar = UrlUtil.getParameters(url),
                Cookies = resp.response.headers["Set-Cookie"];
              this.userData.setCookie(Cookies);
              $console.info({
                urlPar,
                Cookies
              });
            }
            resolve(result.data);
          } else {
            reject(result);
          }
        })
        .catch(fail => {
          reject(fail);
        });
    });
  }
  logout() {
    this.userData.clearAllData();
  }
}

const UserData = new UserDataService(),
  Login = new LoginService();
function checkLoginDataStatus() {
  let failCount = 0;
  const accessKey = UserData.getAccesskey(),
    cookie = UserData.getCookie(),
    uid = UserData.getUid(),
    csrf = UserData.getCsrf(),
    result = {
      count: failCount,
      data: {
        access_key: {
          value: accessKey,
          fail: false
        },
        cookie: {
          value: cookie,
          fail: false
        },
        csrf: {
          value: csrf,
          fail: false
        },
        uid: {
          value: uid,
          fail: false
        }
      }
    };
  if (!hasString(accessKey)) {
    failCount += 1;
    result.data.access_key.fail = true;
  }
  if (!hasString(cookie)) {
    failCount += 1;
    result.data.cookie.fail = true;
  }
  if (!hasString(csrf)) {
    failCount += 1;
    result.data.csrf.fail = true;
  }
  if (!hasString(uid)) {
    failCount += 1;
    result.data.uid.fail = true;
  }
  result.count = failCount;
  $console.info({
    result
  });
  return result;
}
const accountService = {
  getCookie: () => UserData.getCookie(),
  setCookie: _cookie => UserData.setCookie(_cookie),
  getCsrf: () => UserData.getCsrf(),
  setCsrf: _csrf => UserData.setCsrf(_csrf),
  getSESSDATA: () => UserData.getSESSDATA(),
  getUid: () => UserData.getUid(),
  getAccesskey: () => UserData.getAccesskey(),
  setAccesskey: accesskey => UserData.setAccesskey(accesskey),
  importCookieAndCsrf: (_cookie, _csrf) => {
    return UserData.setCookie(_cookie) && UserData.setCsrf(_csrf);
  },
  isLogin: () => Login.isLogin(),
  checkLoginStatus: checkLoginDataStatus,
  getQrcodeKey: () => Login.getQrcodeKey(),
  loginByQrcode: _qrcodeKey => Login.loginByQrcode(_qrcodeKey),
  logout: () => Login.logout(),
  checkLoginDataStatus
};
module.exports = accountService;
