const { ModCore } = require("CoreJS"),
  $ = require("$"),
  Next = require("Next");
class PopularVideo {
  constructor(mod) {
    this.Mod = mod;
    this.ApiManager = mod.ApiManager;
  }
}
class VideoInfo {
  constructor(mod) {
    this.Mod = mod;
    this.ApiManager = mod.ApiManager;
  }
  getVideoInfo({ callback, bvid }) {
    this.ApiManager.runApi({
      apiId: "user.auth.get_cookie",
      callback: cookie => {
        if (cookie === undefined) {
          callback(undefined);
        } else {
          const url = `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`,
            handler = resp => {
              const { data, error, response } = resp;
              if (error) {
                $console.error(error);
                callback(undefined);
              } else {
                const result = resp.data,
                  resultData = result.data,
                  codeMessageList = {
                    "0": "成功",
                    "-400": "请求错误",
                    "-403": "权限不足",
                    "-404": "无视频",
                    "62002": "稿件不可见",
                    "62004": "稿件审核中"
                  };
                if (result.code == 0) {
                  callback(resultData);
                } else {
                  $console.error(
                    result.code + codeMessageList[new String(result.code)]
                  );
                  callback(undefined);
                }
              }
            };
          this.Mod.Http.getAsync({
            url,
            header: { cookie },
            handler
          });
        }
      }
    });
  }
}
class Video extends ModCore {
  constructor(app) {
    super({
      app,
      modId: "video",
      modName: "视频",
      version: "1",
      author: "zhihaofans",
      coreVersion: 12,
      useSqlite: true,
      allowApi: true,
      apiList: [
        {
          apiId: "video.info.get_info",
          func: ({ callback, data }) =>
            new VideoInfo(this).getVideoInfo({
              callback,
              bvid: data.bvid||undefined
            })
        }
      ]
    });
    this.Http = new Next.Http(5);
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
