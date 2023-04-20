const { PublishItemData } = require("../model/history.model");
const HistoryService = require("../service/history.service");
const { ListView } = require("../util/View");
const AppService = require("../service/app.service");
const PostDetailView = require("./post.detail.view");
class VideoList {
  constructor() {
    this.ListView = new ListView();
  }
  showVideoListNew(title, videoList, isHistory = false) {
    const itemList = videoList.map(thisVideo => {
        //      $console.info({
        //        thisVideo
        //      });
        let authorTitle = "";
        switch (thisVideo.business) {
          case "pgc":
            authorTitle = thisVideo.show_title;
            break;
          default:
            authorTitle = "@" + thisVideo.author_name;
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
            src: thisVideo.cover_image
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
            default:
              AppService.openVideo(videoItem.bvid);
          }
        } else {
          AppService.openVideo(videoItem.bvid);
        }
      };
    $ui.push({
      props: {
        title
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
                items: ["获取封面", "获取信息"],
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
}
module.exports = HistoryView;
