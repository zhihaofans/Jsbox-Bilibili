const { ModCore } = require("CoreJS"),
  $ = require("$"),
  { Http, Storage } = require("Next");
class Example extends ModCore {
  constructor(app) {
    super({
      app,
      modId: "example",
      modName: "例子",
      version: "10",
      author: "zhihaofans",
      coreVersion: 12,
      useSqlite: true,
      allowWidget: true,
      allowApi: true
    });
    this.Http = new Http(5);
    this.Storage = Storage;
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
module.exports = Example;
