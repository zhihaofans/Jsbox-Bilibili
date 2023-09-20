const { FavoriteItem, PublishItemData } = require("../model/history.model");
const HistoryService = require("../service/history.service");
const { ListView } = require("../util/View");
const AppService = require("../service/app.service");
const PostDetailView = require("./post.detail.view");
const { hasString } = require("../util/String");
class VideoList {
  constructor() {
    this.ListView = new ListView();
  }
  showFavoriteList(favTitle, favoriteList) {
    const itemList = favoriteList.map(favItem => {
        //      $console.info({
        //        thisVideo
        //      });
        return {
          labelTitle: {
            text: favItem.title
          },
          labelAuthor: {
            text: `@${favItem.uname}`
          },
          imageCover: {
            src: favItem.image
          }
        };
      }),
      didSelect = (section, row) => {
        const favItem = favoriteList[row];
        $console.info({
          favItem
        });
        $app.openURL(favItem.link);
      };
    $console.info(itemList);
    const later2watchNavMenu = [
      {
        title: "菜单",
        symbol: "command", // SF symbols are supported
        handler: sender => {
          $ui.alert("Tapped!");
        },
        menu: {
          title: "长按菜单",
          items: [
            {
              title: "移除看完视频",
              handler: sender => {}
            }
          ]
        } // Pull-Down menu
      }
    ];
    $ui.push({
      props: {
        title: favTitle
        //        navButtons: isHistory !== true ? later2watchNavMenu : undefined
      },
      views: [
        {
          type: "matrix",
          props: {
            id: "postList",
            columns: 1,
            itemHeight: 80, //每行高度
            square: false,
            spacing: 2, //间隔
            template: require("./components/post.item.template"),
            data: itemList,
            header: {
              type: "label",
              props: {
                height: 20,
                text: `共${favoriteList.length || 0}个收藏`,
                textColor: $color("#AAAAAA"),
                align: $align.center,
                font: $font(12)
              }
            },
            footer: {
              type: "label",
              props: {
                height: 20,
                text: "温馨提示:长按有个菜单",
                textColor: $color("#AAAAAA"),
                align: $align.center,
                font: $font(12)
              }
            }
          },
          layout: $layout.fill,
          events: {
            didSelect: (sender, indexPath, data) =>
              didSelect(indexPath.section, indexPath.row),
            didLongPress: (sender, indexPath, data) => {
              $console.info(indexPath);
              const selectItem = favoriteList[indexPath.row];
              $ui.menu({
                items: ["获取封面", "获取信息"],
                handler: (title, idx) => {
                  switch (idx) {
                    default:
                      $ui.error("?!");
                  }
                }
              });
            }
          }
        }
      ]
    });
  }
  showVideoListNew(title, videoList, isHistory = false) {
    const itemList = videoList.map(thisVideo => {
        //      $console.info({
        //        thisVideo
        //      });
        let authorTitle = "",
          viewProgress = ` (已看${thisVideo.view_percentage}%)`;
        if (thisVideo.progress === 0) {
          viewProgress = " (未看)";
        }
        switch (thisVideo.business) {
          case "pgc":
            authorTitle = thisVideo.show_title + viewProgress;
            break;
          case "archive":
            authorTitle = "@" + thisVideo.author_name + viewProgress;
            break;
          default:
            authorTitle = thisVideo.author_name;
        }
        if (thisVideo.badge) {
          authorTitle += `\n[${thisVideo.badge}]`;
        }
        return {
          labelTitle: {
            text: thisVideo.title
          },
          labelAuthor: {
            text: authorTitle
          },
          imageCover: {
            src: thisVideo.cover_image + "@1q.webp"
          }
        };
      }),
      didSelect = (section, row) => {
        const videoItem = videoList[row];
        $console.info({
          videoItem
        });
        if (isHistory === true) {
          switch (videoItem.business) {
            case "pgc":
              AppService.openBangumi(videoItem.kid);
              break;
            case "article":
              AppService.openArticle(videoItem.kid);
              break;
            case "live":
              $console.info(videoItem);
              $app.openURL(videoItem.uri);
              break;
            default:
              AppService.openVideo(videoItem.bvid);
          }
        } else {
          AppService.openVideo(videoItem.bvid);
        }
      };
    const later2watchNavMenu = [
      {
        title: "菜单",
        symbol: "command", // SF symbols are supported
        handler: sender => {
          $ui.alert("Tapped!");
        },
        menu: {
          title: "长按菜单",
          items: [
            {
              title: "移除看完视频",
              handler: sender => {}
            }
          ]
        } // Pull-Down menu
      }
    ];
    $ui.push({
      props: {
        title,
        navButtons: isHistory !== true ? later2watchNavMenu : undefined
      },
      views: [
        {
          type: "matrix",
          props: {
            id: "postList",
            columns: 1,
            itemHeight: 80, //每行高度
            square: false,
            spacing: 2, //间隔
            template: require("./components/post.item.template"),
            data: itemList,
            header: {
              type: "label",
              props: {
                height: 20,
                text: `共${videoList.length || 0}个稿件`,
                textColor: $color("#AAAAAA"),
                align: $align.center,
                font: $font(12)
              }
            },
            footer: {
              type: "label",
              props: {
                height: 20,
                text: "温馨提示:长按有个菜单",
                textColor: $color("#AAAAAA"),
                align: $align.center,
                font: $font(12)
              }
            }
          },
          layout: $layout.fill,
          events: {
            didSelect: (sender, indexPath, data) =>
              didSelect(indexPath.section, indexPath.row),
            didLongPress: function (sender, indexPath, data) {
              $console.info(indexPath);
              const selectItem = videoList[indexPath.row];
              $ui.menu({
                items: ["获取封面", "获取信息", "一键投币"],
                handler: (title, idx) => {
                  switch (idx) {
                    case 0:
                      $ui.preview({
                        title: "稿件封面图",
                        url: selectItem.cover_image
                      });
                      break;
                    case 1:
                      if (selectItem.business === "archive") {
                        new PostDetailView().showVideoDetail(selectItem.bvid);
                      } else {
                        $ui.warning("开发中");
                      }
                      break;
                    default:
                      $ui.error("?!");
                  }
                }
              });
            }
          }
        }
      ]
    });
  }
}
class HistoryView {
  constructor() {
    this.HistoryService = new HistoryService();
    this.ListView = new ListView();
    this.VideoList = new VideoList();
  }
  addLaterToView(bvid) {
    if (hasString(bvid)) {
      this.HistoryService.addLaterToView(bvid)
        .then(result => {
          $console.info({
            addLaterToView: bvid,
            result
          });

          if (result.code === 0) {
            $ui.success("ok");
          } else {
            $ui.alert({
              title: "失败",
              message: result.message,
              actions: [
                {
                  title: "OK",
                  disabled: false, // Optional
                  handler: () => {}
                },
                {
                  title: "Cancel",
                  handler: () => {}
                }
              ]
            });
          }
        })
        .catch(fail => {
          $console.error(fail);
          $ui.alert({
            title: "添加到稍后再看失败",
            message: fail.message || "未知错误",
            actions: [
              {
                title: "OK",
                disabled: false, // Optional
                handler: () => {}
              },
              {
                title: "Cancel",
                handler: () => {}
              }
            ]
          });
        });
    } else {
      $ui.alert({
        title: "添加到稍后再看失败",
        message: "bvid为空",
        actions: [
          {
            title: "OK",
            disabled: false, // Optional
            handler: () => {}
          },
          {
            title: "Cancel",
            handler: () => {}
          }
        ]
      });
    }
  }
  showLaterToView() {
    $ui.loading(true);
    this.HistoryService.getLaterToViewList().then(
      result => {
        $console.info({
          showLaterToView: result,
          list: result.list
        });
        try {
          const list = result.list,
            historyList = list.map(item => new PublishItemData(item));
          $console.info({
            list,
            historyList
          });
          $ui.loading(false);
          new VideoList().showVideoListNew("稍后再看", historyList);
        } catch (error) {
          $ui.loading(false);
          $console.error(error);
          $ui.error(error.message);
        }
      },
      fail => {
        $console.error(fail);
        $ui.loading(false);
        if (fail === undefined) {
          $ui.error("空白结果");
        } else {
          $ui.alert({
            title: `发生代码错误${fail.code}`,
            message: fail.message || "error",
            actions: [
              {
                title: "OK",
                disabled: false, // Optional
                handler: () => {}
              }
            ]
          });
        }
      }
    );
  }
  showHistory() {
    $ui.loading(true);
    this.HistoryService.getHistoryList().then(
      result => {
        $console.info({
          showHistory: result,
          list: result.list
        });
        try {
          const list = result.list,
            historyList = list.map(item => new PublishItemData(item));
          $console.info({
            list,
            historyList
          });
          $ui.loading(false);
          new VideoList().showVideoListNew("历史观看", historyList, true);
        } catch (error) {
          $ui.loading(false);
          $console.error(error);
          $ui.error(error.message);
        }
      },
      fail => {
        $console.error(fail);
        $ui.loading(false);
        if (fail === undefined) {
          $ui.error("空白结果");
        } else {
          $ui.alert({
            title: `发生代码错误${fail.code}`,
            message: fail.message || "error",
            actions: [
              {
                title: "OK",
                disabled: false, // Optional
                handler: () => {}
              }
            ]
          });
        }
      }
    );
  }
  getFavoriteList() {
    this.HistoryService.getFavoriteList()
      .then(result => {
        $console.info(result);
        if (result.count > 0) {
          const favList = result.list;
          $ui.push({
            props: {
              title: `${result.count}个收藏夹`
            },
            views: [
              {
                type: "list",
                props: {
                  data: favList.map(
                    favItem => `${favItem.title}(${favItem.id})`
                  )
                },
                layout: $layout.fill,
                events: {
                  didSelect: (sender, indexPath, data) => {
                    const favItem = favList[indexPath.row];
                    $console.info({
                      favItem
                    });
                    this.HistoryService.getFavoriteContent(favItem.id)
                      .then(favContentResult => {
                        $console.info(favContentResult);
                        const favContentList = favContentResult.medias,
                          favTitle = favContentResult.info.title;
                        if (
                          favContentResult.info.media_count > 0 &&
                          favContentList.length > 0
                        ) {
                          this.VideoList.showFavoriteList(
                            favTitle,
                            favContentList.map(item => new FavoriteItem(item))
                          );
                        } else {
                          $ui.error("这个收藏夹没有内容");
                        }
                      })
                      .catch(favContentFail => {
                        $console.error(favContentFail);
                      });
                  }
                }
              }
            ]
          });
        } else {
          $ui.error("没有收藏夹");
        }
      })
      .catch(fail => {
        $console.error(fail);
      });
  }
}
module.exports = HistoryView;
