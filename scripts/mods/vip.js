const { ModCore } = require("CoreJS"),
  $ = require("$"),
  Next = require("Next");
class UserInfo {
  constructor(mod) {
    this.Mod = mod;
  }
  isVip(callback) {
    this.Mod.App.ModLoader.runModApi({
      modId: "user",
      apiId: "space.myinfo",
      callback: data => {
        if (data == undefined) {
          callback(undefined);
        } else {
          callback(data.vip.status == 1);
        }
      }
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
        if (isVip) {
          $ui.success("尊贵的大会员你好");
        } else {
          $ui.error("你不是大会员");
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
      default:
        callback(undefined);
    }
  }
}
module.exports = Vip;
