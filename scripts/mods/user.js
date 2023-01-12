const { ModCore } = require("CoreJS"),
  $ = require("$"),
  Next = require("Next"),
  ListViewKit = new Next.ListView();
class UserData {
  constructor(keychain) {
    this.Keychain = keychain;
    this.KeychainKey = {
      cookie: "user.login.cookie",
      uid: "user.login.uid"
    };
  }
  cookie(newCookie) {
    if (newCookie != undefined && Object.keys(newCookie).length > 0) {
      this.Keychain.set(this.KeychainKey.cookie, JSON.stringify(newCookie));
    }
    const nowCookie = this.Keychain.get(this.KeychainKey.cookie);
    return nowCookie ? JSON.parse(nowCookie) : undefined;
  }
  isLogin() {
    return $.hasString(this.uid()) && this.cookie() != undefined;
  }
  uid(newUid) {
    if ($.string.hasString(newUid)) {
      this.Keychain.set(this.KeychainKey.uid, newUid);
    }
    return this.Keychain.get(this.KeychainKey.uid);
  }
  csrf() {
    const cookie = this.cookie();
    if (cookie === undefined || cookie.csrf === undefined) {
      return undefined;
    } else {
      return cookie.csrf;
    }
  }
  clearData() {
    this.Keychain.remove(this.KeychainKey.uid);
    this.Keychain.remove(this.KeychainKey.cookie);
  }
}
class UserInfo {
  constructor(keychain) {
    this.Http = $.http;
    this.Data = new UserData(keychain);
  }
  async mySpaceInfo() {
    const url = "http://api.bilibili.com/x/space/myinfo",
      header = { cookie: this.Data.cookie() },
      timeout = 5,
      res = await this.Http.get({
        url,
        header,
        timeout
      }),
      result = res.data;
    $console.info({
      _: "mySpaceInfo",
      header,
      result
    });
    if (result && result.code == 0) {
      return result.data;
    }
    return undefined;
  }
}
class UserLogin {
  constructor(http, keychain) {
    this.Http = http || $.http;
    this.Data = new UserData(keychain);
  }
  async getWebLoginKey() {
    const url = "https://passport.bilibili.com/qrcode/getLoginUrl",
      header = {},
      timeout = 5,
      res = await this.Http.get({
        url,
        header,
        timeout
      }),
      result = res.data;
    $console.info({
      result
    });
    if (result && result.status == true && result.code == 0) {
      const ts = result.ts,
        qrcodeData = result.data,
        { oauthKey, url } = qrcodeData;
      return { oauthKey, qrcode: $qrcode.encode(url), url, ts };
    }
    return undefined;
  }
  isLogin() {
    return this.Data.uid().length > 0 && this.Data.cookie().length > 0;
  }
  async login() {
    $ui.loading(true);
    const loginKey = await this.getWebLoginKey();
    $console.info({
      loginKey
    });
    if (loginKey !== undefined) {
      const menuList = ["查看二维码", "已扫二维码"],
        didSelect = index => {
          switch (index) {
            case 0:
              $quicklook.open({
                image: loginKey.qrcode
              });
              break;
            case 1:
              this.loginByWebOauthkey(loginKey.oauthKey);
              break;
          }
        };
      $ui.loading(false);
      ListViewKit.renderSimpleText("二维码登录", menuList, didSelect);
      $.info("login");
    } else {
      $ui.loading(false);
      $ui.error("获取二维码登录凭证失败");
    }
  }
  async loginByWebOauthkey(oauthkey) {
    if (oauthkey != undefined && oauthkey.length > 0) {
      const timeout = 5,
        url = `https://passport.bilibili.com/qrcode/getLoginInfo?oauthKey=${oauthkey}`,
        resp = await this.Http.post({
          url,
          timeout
        });
      if (resp.data) {
        const result = resp.data,
          response = resp.response,
          headers = response.headers;
        if (result.status) {
          $console.info(headers);
          const scanTs = result.ts,
            setCookie = headers["Set-Cookie"],
            //DedeUserID
            DedeUserID_left = setCookie.indexOf("DedeUserID=") + 11,
            DedeUserID_right = setCookie.indexOf(";", DedeUserID_left + 1),
            DedeUserID = setCookie.substring(DedeUserID_left, DedeUserID_right),
            //DedeUserID__ckMd5
            DedeUserID__ckMd5_left =
              setCookie.indexOf("DedeUserID__ckMd5=") + 18,
            DedeUserID__ckMd5_right = setCookie.indexOf(
              ";",
              DedeUserID__ckMd5_left + 1
            ),
            DedeUserID__ckMd5 = setCookie.substring(
              DedeUserID__ckMd5_left,
              DedeUserID__ckMd5_right
            ),
            //SESSDATA
            SESSDATA_left = setCookie.indexOf("SESSDATA=") + 9,
            SESSDATA_right = setCookie.indexOf(";", SESSDATA_left + 1),
            SESSDATA = setCookie.substring(SESSDATA_left, SESSDATA_right),
            //bili_jct
            bili_jct_left = setCookie.indexOf("bili_jct=") + 9,
            bili_jct_right = setCookie.indexOf(";", bili_jct_left + 1),
            bili_jct = setCookie.substring(bili_jct_left, bili_jct_right),
            //cookie
            cookie = { DedeUserID, DedeUserID__ckMd5, SESSDATA, bili_jct },
            cookieSuccess = this.Data.cookie(cookie),
            uidSuccess = this.Data.uid(DedeUserID);
          $console.info({
            cookie,
            cookieSuccess,
            scanTs,
            uidSuccess
          });
          if (this.Data.isLogin()) {
            $ui.success("登录成功，请返回或重新打开");
          } else {
            $ui.error("登录失败，空白cookie");
          }
          return cookie;
        } else {
          $ui.error(result.message);
          return undefined;
        }
      }
    } else {
      return undefined;
    }
  }
  logout() {
    this.Data.clearData();
  }
}
class UserMod extends ModCore {
  constructor(app) {
    super({
      app,
      modId: "user",
      modName: "用户模块",
      version: "1",
      author: "zhihaofans",
      coreVersion: 12,
      useSqlite: true,
      allowApi: true,
      apiList: [
        {
          apiId: "user.auth.get_cookie",
          func: ({ callback }) => callback(new UserData(this.Keychain).cookie())
        },
        {
          apiId: "user.auth.get_uid",
          func: ({ callback }) => callback(new UserData(this.Keychain).uid())
        },
        {
          apiId: "user.auth.is_login",
          func: ({ callback }) =>
            callback(new UserData(this.Keychain).isLogin())
        },
        {
          apiId: "user.auth.login",
          func: () => new UserLogin(this.Http, this.Keychain).login()
        },
        {
          apiId: "user.auth.logout",
          func: () => new UserLogin(this.Http, this.Keychain).logout()
        },
        {
          apiId: "user.space.myinfo",
          func: ({ callback }) =>
            callback(new UserInfo(this.Keychain).mySpaceInfo())
        }
      ]
    });
    this.$ = $;
    this.Http = $.http;
    this.UserLogin = new UserLogin(this.Http, this.Keychain);
  }
  run() {
    try {
      const isLogin = new UserData(this.Keychain).isLogin();
      $console.info("isLogin=" + isLogin);
      if (isLogin == false) {
        this.UserLogin.login();
      } else {
        $ui.success("登录成功");
      }
    } catch (error) {
      $console.error(error);
    }
  }
  runApi({ apiId, data, callback }) {
    $console.info({
      apiId,
      data,
      callback
    });
    switch (apiId) {
      default:
        callback(undefined);
    }
    return;
  }
}
module.exports = UserMod;
