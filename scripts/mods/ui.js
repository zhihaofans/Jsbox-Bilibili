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
      allowWidget: true,
      allowApi: true
    });
    this.$ = $;
    this.Http = $.http;
    this.ModLoader = app.ModLoader;
  }
  runA(){
    $console.warn(this.App.ModLoader)
  }
  run() {
    try {
      const modLoader = this.App.ModLoader;
      modLoader.runModApi({
        modId: "user",
        apiId: "auth.is_login",
        callback: isLogin => {
          if (isLogin) {
            $ui.success("登录成功");
          } else {
            
            $ui.alert({
              title: "未登录",
              message: "World",
              actions: [
                {
                  title: "OK",
                  disabled: false, // Optional
                  handler: () => {
            
                  }
                },
                {
                  title: "Cancel",
                  handler: () => {
            
                  }
                }
              ]
            })
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
