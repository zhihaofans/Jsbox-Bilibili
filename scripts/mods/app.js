const { ModCore } = require("CoreJS"),
  $ = require("$"),
  { Http, Storage } = require("Next");
class Launcher {
  constructor(mod) {
    this.Mod = mod;
  }
  app(mode, id) {
    $app.openURL(`bilibili://${mode}/${id}`);
  }
  video(vid) {
    this.app("video", vid);
  }
  getVideoUrl(vid) {
    return `bilibili://video/${vid}`;
  }
  live(roomid) {
    this.app("live", roomid);
  }
  space(uid) {
    this.app("space", uid);
  }
  article(id) {
    this.app("article", id);
  }
  dynamic(id) {
    this.app("following/detail", id);
  }
}
class AppLauncher extends ModCore {
  constructor(app) {
    super({
      app,
      modId: "app_launcher",
      modName: "客户端启动器",
      version: "1",
      author: "zhihaofans",
      coreVersion: 12,
      useSqlite: true,
      allowWidget: true,
      allowApi: true,
      apiList: [
        {
          apiId: "bilibili.app.user.space",
          func: ({ callback, data }) => {
            try {
              new Launcher(this).space(data.uid);
            } catch (error) {
              $console.error(error);
            } finally {
              callback(undefined);
            }
          }
        }
      ]
    });
    //    this.Http = new Http(5);
    //    this.Storage = Storage;
  }
  run() {
    try {
      this.runSqlite();
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
      default:
        callback(undefined);
    }
  }
  runSqlite() {
    const sqlite_key = "last_run_timestamp",
      lastRunTimestamp = this.SQLITE.getItem(sqlite_key);

    this.SQLITE.setItem(sqlite_key, new Date().getTime().toString());
    $console.info({
      mod: this.MOD_INFO,
      lastRunTimestamp
    });
  }
}
module.exports = AppLauncher;
