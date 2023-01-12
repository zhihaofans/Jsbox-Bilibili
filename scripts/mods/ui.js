const { ModCore } = require("CoreJS"),
  $ = require("$"),
  Next = require("Next");
class HistoryView {
  constructor(mod) {
    this.Mod = mod;
    this.ApiManager = mod.ApiManager;
    this.VideoView = new VideoView(this.Mod);
  }
  getViewList() {
    return {
      title: "历史/稍后",
      rows: [
        {
          title: "稍后再看",
          func: () => {
            this.ApiManager.runApi({
              apiId: "history.get_later_to_watch",
              callback: result => {
                if (result === undefined) {
                  $ui.error("登录失效或账号异常");
                } else {
                  const title = `稍后再看共${result.length}个视频`;
                  this.VideoView.pushVideoInfoList(title, result);
                }
                $console.info({
                  result
                });
              }
            });
          }
        },
        {
          title: "移除所有已看的稍后再看",
          func: () => {
            this.ApiManager.runApi({
              apiId: "history.later_to_watch.remove_all_viewed",
              callback: result => {
                if (result === undefined) {
                  $ui.error("移除失败，未登录！");
                } else if (result === true) {
                  $ui.success("移除成功");
                } else {
                  $ui.error("移除失败");
                }
              }
            });
          }
        }
      ]
    };
  }
}
class VideoView {
  constructor(mod) {
    this.Mod = mod;
    this.ApiManager = mod.ApiManager;
  }
  pushVideoInfoList(title, videoList) {
    $ui.push({
      props: {
        title
      },
      views: [
        {
          type: "list",
          props: {
            autoRowHeight: true,
            estimatedRowHeight: 44,
            data: videoList.map(thisVideo => {
              return {
                title: `${thisVideo.author_mid}@${thisVideo.author_name}`,
                rows: [
                  `av${thisVideo.avid} | ${thisVideo.bvid}`,
                  thisVideo.title
                ]
              };
            })
          },
          layout: $layout.fill,
          events: {
            didSelect: (sender, indexPath, data) => {
              const selectVideo = videoList[indexPath.section];
              $ui.menu({
                items: ["查看视频信息", "通过哔哩哔哩APP打开"],
                handler: (title, idx) => {
                  switch (idx) {
                    case 0:
                      try {
                        this.showVideoInfo(selectVideo.bvid);
                      } catch (error) {
                        $console.error(error);
                        $ui.error("Error");
                      }
                      break;
                    case 1:
                      $app.openURL(selectVideo.short_link);

                      break;
                    default:
                  }
                }
              });
            }
          }
        }
      ]
    });
  }
  showVideoInfo(bvid) {
    if (bvid != undefined && bvid.length > 0) {
      $ui.loading(true);
      this.ApiManager.runApi({
        apiId: "video.info.get_info",
        data: {
          bvid
        },
        callback: videoInfo => {
          if (videoInfo !== undefined) {
            $.info(videoInfo);
            const videoInfoList = [
              {
                title: "视频id",
                items: [
                  {
                    title: videoInfo.bvid,
                    func: () => {}
                  },
                  {
                    title: "av" + videoInfo.aid,
                    func: undefined
                  }
                ]
              },
              {
                title: "标题",
                items: [
                  {
                    title: videoInfo.title,
                    func: () => {
                      $share.sheet([videoInfo.title]);
                    }
                  }
                ]
              },
              {
                title: "作者",
                items: [
                  {
                    title: videoInfo.owner.mid,
                    func: () => {
                      this.ApiManager.runApi({
                        apiId: "bilibili.app.user.space",
                        data: {
                          uid: videoInfo.owner.mid
                        }
                      });
                    }
                  },
                  {
                    title: "@" + videoInfo.owner.name,
                    func: () => {
                      $share.sheet([videoInfo.owner.name]);
                    }
                  },
                  {
                    title: "查看头像",
                    func: () => {
                      $ui.preview({
                        url: videoInfo.owner.face
                      });
                    }
                  }
                ]
              },
              {
                title: "视频封面",
                items: [
                  {
                    title: videoInfo.pic,
                    func: () => {
                      $ui.menu({
                        items: ["预览", "下载"],
                        handler: (title, idx) => {
                          switch (idx) {
                            case 0:
                              $ui.preview({
                                url: videoInfo.pic
                              });
                              break;
                            case 1:
                              try {
                                $console.warn("try downloading");
                                this.Mod.App.ModLoader.runModApi({
                                  modId: "downloader",
                                  apiId: "start_downloading",
                                  data: { url: videoInfo.pic }
                                });
                                $console.warn("finished try");
                              } catch (error) {
                                $console.error(error);
                                $ui.error("下载失败");
                              }
                              break;
                            default:
                          }
                        }
                      });
                    }
                  }
                ]
              }
            ];
            $ui.loading(false);
            $ui.push({
              props: {
                title: bvid
              },
              views: [
                {
                  type: "list",
                  props: {
                    autoRowHeight: true,
                    estimatedRowHeight: 10,
                    data: videoInfoList.map(listItem => {
                      return {
                        title: listItem.title.toString(),
                        rows: listItem.items.map(item => item.title.toString())
                      };
                    })
                  },
                  layout: $layout.fill,
                  events: {
                    didSelect: (sender, indexPath, data) => {
                      const section = indexPath.section,
                        row = indexPath.row,
                        selectedItem = videoInfoList[section].items[row];
                      if ($.isFunction(selectedItem.func))
                        try {
                          selectedItem.func(sender, data);
                        } catch (error) {
                          $console.error(error);
                        }
                    }
                  }
                }
              ]
            });
          } else {
            $ui.loading(false);
            $ui.error("空白请求结果,请检查视频id与设备网络");
          }
        }
      });
    } else {
      $ui.loading(false);
      $ui.error("请输入视频id");
    }
  }
}
class UiView {
  constructor(mod) {
    this.Mod = mod;
    this.ApiManager = mod.ApiManager;
    this.ListView = new Next.ListView();
  }
  init() {
    const viewList = [
      {
        title: "视频",
        rows: [
          {
            title: "热门视频",
            func: async () => {
              $ui.loading(true);
              try {
                const popularList = await this.Popular.getPopularVideoList();
                this.ModModule.Info.pushVideoInfoList(
                  "前20个热门视频",
                  popularList.list
                );
              } catch (error) {
                $console.error(error);
              } finally {
                $ui.loading(false);
              }
            }
          },
          {
            title: "排行榜视频",
            func: () => {
              $safari.open({
                url: "https://m.bilibili.com/ranking",
                entersReader: true,
                height: 360,
                handler: test => {
                  $console.info({
                    test
                  });
                }
              });
            }
          }
        ]
      },
      {
        title: "大会员",
        rows: [
          {
            title: "大会员权益",
            func: () => {
              $ui.loading(true);
              this.ApiManager.runApi({
                apiId: "vip.privilege.get_status",
                callback: result => {
                  $ui.loading(false);
                  $console.info({
                    result
                  });
                  if (result.code === 0) {
                    const privilegeList = result.data.list,
                      privilegeStr = {
                        1: "B币",
                        2: "会员购优惠券",
                        3: "漫画福利券",
                        4: "会员购包邮券",
                        5: "漫画商城优惠券"
                      };
                    $ui.push({
                      props: {
                        title: "listview"
                      },
                      views: [
                        {
                          type: "list",
                          props: {
                            data: privilegeList.map(privilege => {
                              const privilegeStatus =
                                  privilege.state === 1
                                    ? "(已领取)"
                                    : "(未领取)",
                                privilegeTitle =
                                  privilegeStr[privilege.type] || "未知";
                              return privilegeTitle + privilegeStatus;
                            })
                          },
                          layout: $layout.fill,
                          events: {
                            didSelect: (sender, indexPath, data) => {
                              const thisPrivilege =
                                privilegeList[indexPath.row];
                              if (thisPrivilege.state == 1) {
                                $ui.alert({
                                  title: "领取失败",
                                  message:
                                    privilegeStr[thisPrivilege.type] + "已领取",
                                  actions: [
                                    {
                                      title: "OK",
                                      disabled: false, // Optional
                                      handler: () => {}
                                    }
                                  ]
                                });
                              } else {
                                this.ApiManager.runApi({
                                  apiId: "vip.privilege.receive_privilege",
                                  data: {
                                    typeId: thisPrivilege.type
                                  },
                                  callback: result => {}
                                });
                              }
                            }
                          }
                        }
                      ]
                    });
                  } else {
                    $ui.alert({
                      title: `请求失败(${result.code})`,
                      message: result.message,
                      actions: [
                        {
                          title: "OK",
                          disabled: false,
                          handler: () => {}
                        }
                      ]
                    });
                  }
                }
              });
            }
          }
        ]
      },
      new HistoryView(this.Mod).getViewList()
    ];
    this.ListView.renderSimpleList(this.Mod.MOD_INFO.NAMR, viewList, () => {
      $console.info({
        "UiView.init": "defaultFunc"
      });
    });
  }
}
class Ui extends ModCore {
  constructor(app) {
    super({
      app,
      modId: "ui",
      modName: "用户界面",
      version: "1",
      author: "zhihaofans",
      coreVersion: 12,
      //useSqlite: true,
      allowWidget: true
      //allowApi: true
    });
  }
  run() {
    $.info(this.ApiManager.API_LIST);
    this.ApiManager.runApi({
      apiId: "user.auth.is_login",
      callback: isLogin => {
        if (isLogin) {
          new UiView(this).init();
        } else {
          $ui.error("未登录");
          this.ApiManager.runApi({
            apiId: "user.auth.login",
            callback: result => {}
          });
        }
      }
    });
  }
  runB() {
    try {
      this.ApiManager.runApi({
        apiId: "vip.info.is_vip",
        callback: isVip => {
          if (isVip) {
            $ui.success("尊贵的大会员你好");
          } else if (isVip == undefined) {
            $ui.error("未登录");
          } else {
            $ui.error("你不是大会员");
          }
        }
      });
    } catch (error) {
      $console.error(error);
    }
  }
}
module.exports = Ui;
