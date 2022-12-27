const { ModCore } = require("CoreJS"),
  $ = require("$"),
  Next = require("Next");
class HistoryView {
  constructor(mod) {
    this.Mod = mod;
  }
  getViewList() {
    return {
      title: "历史/稍后",
      rows: [
        {
          title: "稍后再看",
          func: () => {
            this.Mod.App.ModLoader.runModApi({
              modId: "history",
              apiId: "history.get_later_to_watch",
              callback: result => {
                $console.info({
                  result
                });
                const title = `稍后再看共${result.length}个视频`;
                new VideoView(this.Mod).pushVideoInfoList(title, result);
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
  showVideoInfo(bvid) {}
}
class UiView {
  constructor(mod) {
    this.Mod = mod;
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
              this.Mod.App.ModLoader.runModApi({
                modId: "vip",
                apiId: "privilege.get_status",
                callback: result => {
                  $console.info({
                    result
                  });

                  if (result.code == 0) {
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
                                  privilege.state == 1
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
                                this.Mod.App.ModLoader.runModApi({
                                  modId: "vip",
                                  apiId: "privilege.receive_privilege",
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
      coreVersion: 11,
      //useSqlite: true,
      allowWidget: true
      //allowApi: true
    });
  }
  run() {
    new UiView(this).init();
  }
  runB() {
    try {
      const modLoader = this.App.ModLoader;
      modLoader.runModApi({
        modId: "vip",
        apiId: "info.is_vip",
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
