const { ModCore } = require("CoreJS"),
  $ = require("$"),
  Next = require("Next");
  class PopularVideo {
    constructor(modModule) {
      this.Module = modModule;
    }}
class Video extends ModCore {
  constructor(app) {
    super({
      app,
      modId: "video",
      modName: "视频",
      version: "1",
      author: "zhihaofans",
      coreVersion: 11,
      useSqlite: true,
      allowApi: true
    });
    this.Http = Next.Http;
    this.Storage = Next.Storage;
  }
  run() {
    $ui.success("run");
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
}
module.exports = Video;
