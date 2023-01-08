const { ModCore } = require("CoreJS"),
  $ = require("$"),
  { Storage } = require("Next"),
  Http = require("../utils/http");
class PublishItemData {
  constructor(videoData) {
    this.author_face = videoData.owner.face;
    this.author_mid = videoData.owner.mid;
    this.author_name = videoData.owner.name;
    this.avid = videoData.aid;
    this.bvid = videoData.bvid;
    this.copyright = videoData.copyright; //1：原创 2：转载
    this.cover_image = videoData.pic; //视频封面
    this.desc = videoData.desc; //简介
    this.parts_count = videoData.videos; //稿件分P总数
    this.publish_location = videoData.pub_location; //发布定位
    this.publish_time = videoData.pubdate; //发布时间
    this.short_link = videoData.short_link_v2 || videoData.short_link;
    this.staff = videoData.staff; //合作成员列表
    this.tid = videoData.tid; //分区id
    this.title = videoData.title;
    this.tname = videoData.tname; //子分区名称
    this.upload_time = videoData.ctime; //投稿时间戳
  }
}
class UserData {
  constructor(ApiManager) {
    this.ApiManager = ApiManager;
  }
  getCookie(callback) {
    this.ApiManager.runApi({
      apiId: "user.auth.get_cookie",
      callback: cookie => {
        callback(cookie);
      }
    });
  }
}
class LaterToWatchCore {
  constructor(mod) {
    this.Mod = mod;
    this.ApiManager=mod.ApiManager
    this.UserData = new UserData(mod.App.ModLoader.ApiManager);
    this.Http = new Http(5);
    this.Http.setDebug(true);
  }
  getLaterToWatch(callback) {
    this.UserData.getCookie(cookie => {
      if (cookie === undefined) {
        callback(undefined);
      } else {
        const url = "https://api.bilibili.com/x/v2/history/toview",
          resp = this.Http.get({
            url,
            header: {
              cookie
            },
            callback: result => {
              $.info(result);
              if (result.code == 0) {
                const data = result.data,
                  listCount = data.count;

                if (listCount > 0) {
                  try {
                    const later2watchList = data.list.map(
                      item => new PublishItemData(item)
                    );
                    callback(later2watchList);
                  } catch (error) {
                    $.error(error);
                    callback(undefined);
                  }
                } else {
                  callback(undefined);
                }
              } else {
                $.error({
                  result
                });
                callback(undefined);
              }
            }
          });
      }
    });
  }
}
class History extends ModCore {
  constructor(app) {
    super({
      app,
      modId: "history",
      modName: "历史记录",
      version: "1",
      author: "zhihaofans",
      coreVersion: 12,
      //useSqlite: true,
      allowWidget: true,
      allowApi: true,
      apiList: [
        {
          apiId: "history.get_later_to_watch",
          func: ({ callback }) =>
            new LaterToWatchCore(this).getLaterToWatch(callback)
        }
      ]
    });
  }
  run() {
    try {
    } catch (error) {
      $.error(error);
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
    $.info({
      apiId,
      data,
      callback
    });
    switch (apiId) {
      case "history.get_later_to_watch":
        this.Later2Watch.getLaterToWatch(callback);
        break;
      default:
        callback(undefined);
    }
  }
}
module.exports = History;
