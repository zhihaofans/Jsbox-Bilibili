const { ModCore } = require("CoreJS"),
  $ = require("$"),
  Next = require("Next");
class AppApi {
  constructor(mod) {
    this.Mod = mod;
  }
  getCookie(callback) {
    this.Mod.App.ModLoader.runModApi({
      modId: "user",
      apiId: "auth.get_cookie",
      callback: cookie => {
        callback(cookie);
      }
    });
  }
}
class UserInfo {
  constructor(mod) {
    this.Mod = mod;
    this.AppApi = new AppApi(mod);
  }
  isVip(callback) {
    this.Mod.App.ModLoader.runModApi({
      modId: "user",
      apiId: "space.myinfo",
      callback: data => {
        if (data == undefined || data.vip == undefined) {
          callback(undefined);
        } else {
          callback(data.vip.status == 1);
        }
      }
    });
  }
}
class VipPrivilege {
  constructor(mod) {
    this.Mod = mod;
    this.Http = new Next.Http(5);
    this.AppApi = new AppApi(mod);
  }
  getPrivilegeStatus(callback) {
    this.AppApi.getCookie(cookie => {
      if (cookie == undefined) {
        callback(undefined);
      } else {
        const header = { cookie },
          url = "https://api.bilibili.com/x/vip/privilege/my",
          handler = resp => {
            const { data, error, response } = resp;

            if (error) {
              $console.error(error);
              callback();
            } else {
              callback(data);
            }
          };
        this.Http.getAsync({
          url,
          header,
          handler
        });
      }
    });
  }
  receivePrivilege(typeId, callback) {
    this.AppApi.getCookie(cookie => {
      const bili_jct = cookie.bili_jct,
        url = `https://api.bilibili.com/x/vip/privilege/receive?type=${typeId}&csrf=${bili_jct}`,
        handler = resp => {
          const { data, error, response } = resp;
          console.info({
            data,
            response
          });
          if (error) {
            $console.error(error);
            callback();
          } else {
            callback(data);
          }
        };
      this.Http.postAsync({
        url,
        handler
      });
    });
  }
}
class Vip extends ModCore {
  constructor(app) {
    super({
      app,
      modId: "vip",
      modName: "大会员",
      version: "1",
      author: "zhihaofans",
      coreVersion: 11,
      useSqlite: true,
      allowWidget: true,
      allowApi: true
    });
  }
  run() {
    try {
      new UserInfo(this).isVip(isVip => {
        if (isVip == true) {
          $ui.success("尊贵的大会员你好");
        } else {
          $ui.error("你不是大会员或未登录");
        }
      });
    } catch (error) {
      $console.error(error);
    }
    //$ui.success("run");
  }
  runWidget(widgetId) {
    $widget.setTimeline({
      render: ctx => {
        return {
          type: "text",
          props: {
            text: widgetId || "Hello!"
          }
        };
      }
    });
  }
  runApi({ apiId, data, callback }) {
    $console.info({
      apiId,
      data,
      callback
    });
    switch (apiId) {
      case "info.is_vip":
        new UserInfo(this).isVip(callback);
        break;
      case "privilege.get_status":
        new VipPrivilege(this).getPrivilegeStatus(callback);
        break;
      case "privilege.receive_privilege":
        new VipPrivilege(this).receivePrivilege(data.typeId, callback);

        break;
      default:
        callback(undefined);
    }
  }
}
module.exports = Vip;
