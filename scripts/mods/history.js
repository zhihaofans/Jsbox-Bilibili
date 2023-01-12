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
    this.ApiManager = mod.ApiManager;
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
              if (result.code === 0) {
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
                  callback([]);
                }
              } else {
                if (result.code === -101) {
                  this.ApiManager.runApi({
                    "apiId": "user.auth.logout"
                  });
                }
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
  removeLaterToWatch({ viewed, aid, callback }) {
    this.UserData.getCookie(cookie => {
      if (cookie === undefined) {
        callback(undefined);
      } else {
        const url = "http://api.bilibili.com/x/v2/history/toview/del",
          csrf = cookie.bili_jct,
          resp = this.Http.post({
            url,
            body: {
              csrf,
              viewed,
              aid
            },
            header: {
              cookie
            },
            callback: result => {
              $.info(result);
              const codeStrList = {
                  "0": "成功",
                  "-101": "账号未登录",
                  "-111": "csrf校验失败",
                  "-400": "请求错误"
                },
                { code, message } = result;
              $.info({
                code,
                message,
                codeStr: codeStrList[code.toString()]
              });
              callback(code !== undefined && code === 0);
            }
          });
      }
    });
  }
  removeAllViewed(callback) {
    this.removeLaterToWatch({
      callback,
      viewed: true
    });
  }
  removeVideo({ aid, callback }) {
    this.removeLaterToWatch({
      callback,
      aid
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
        },
        {
          apiId: "history.later_to_watch.remove_all_viewed",
          func: ({ callback }) =>
            new LaterToWatchCore(this).removeAllViewed(callback)
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
