const { ModCore } = require("CoreJS"),
  $ = require("$"),
  Next = require("Next");
class Ui extends ModCore {
  constructor(app) {
    super({
      app,
      modId: "ui",
      modName: "用户界面",
      version: "1",
      author: "zhihaofans",
      coreVersion: 11,
      //useSqlite: true,
      allowWidget: true
      //allowApi: true
    });
    this.Http = $.http;
  }
  runA() {
    $console.warn(this.App.ModLoader);
  }
  run() {
    try {
      const modLoader = this.App.ModLoader;
      modLoader.runModApi({
        modId: "vip",
        apiId: "info.is_vip",
        callback: isVip => {
          if (isVip) {
            $ui.success("尊贵的大会员你好");
          } else {
            $ui.error("你不是大会员");
          }
        }
      });
    } catch (error) {
      $console.error(error);
    }
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
      default:
    }
  }
}
module.exports = Ui;
