const { ModCore } = require("CoreJS"),
  $ = require("$"),
  Next = require("Next");
class Example extends ModCore {
  constructor(app) {
    super({
      app,
      modId: "example",
      modName: "例子",
      version: "8",
      author: "zhihaofans",
      coreVersion: 11,
      useSqlite: true,
      allowWidget: true,
      allowApi: true
    });
    this.$ = $;
    this.Http = $.http;
    this.Storage = Next.Storage;
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
