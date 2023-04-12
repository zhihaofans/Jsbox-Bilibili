const { PublishItemData } = require("../model/history.model");
const HistoryService = require("../service/history.service");
const { ListView } = require("../util/View");
const AppService = require("../service/app.service");
class VideoList {
  constructor() {
    this.ListView = new ListView();
  }
  showVideoList(title, videoList, isHistory = false) {
    const itemList = videoList.map(thisVideo => {
        //      $console.info({
        //        thisVideo
        //      });
        let itemTitle = `${thisVideo.author_mid}@${thisVideo.author_name}`,
          rows = [];
        switch (thisVideo.business) {
          case "pgc":
            itemTitle = thisVideo.badge;
            rows = [`《${thisVideo.title}》`, thisVideo.show_title];
            break;
          case "article":
            rows = [`article.${thisVideo.kid}[专栏文章]`, thisVideo.title];

            break;
          default:
            rows = [`${thisVideo.bvid}`, thisVideo.title];
        }
        return {
          title: itemTitle,
          rows
        };
      }),
      didSelect = (section, row) => {
        const videoItem = videoList[section];
        $console.info(videoItem);
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
      },
      actions = [
        {
          title: "继续看",
          color: $color("red"), // default to gray
          handler: (sender, indexPath) => {
            const { section } = indexPath,
              thisItem = videoList[section];
            $console.info({
              thisItem
            });
            if (isHistory) {
              $ui.error("历史记录不支持");
            } else {
              $app.openURL(thisItem.uri);
              $ui.success("ok");
            }
          }
        }
      ];
    $ui.push({
      props: {
        title
      },
      views: [
        {
          type: "list",
          props: {
            data: itemList,
            autoRowHeight: true,
            actions
          },
          layout: $layout.fill,
          events: {
            didSelect: (sender, indexPath, data) =>
              didSelect(indexPath.section, indexPath.row)
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
        let itemTitle = `${thisVideo.author_mid}@${thisVideo.author_name}`,
          rows = [];
        switch (thisVideo.business) {
          case "pgc":
            itemTitle = thisVideo.badge;
            rows = [`《${thisVideo.title}》`, thisVideo.show_title];
            break;
          case "article":
            rows = [`article.${thisVideo.kid}[专栏文章]`, thisVideo.title];

            break;
          default:
            rows = [`${thisVideo.bvid}`, thisVideo.title];
        }
        return {
          labelTitle: {
            text: thisVideo.title
          },
          labelAuthor: {
            text: "@" + thisVideo.author_name
          },
          imageCover: {
            src: thisVideo.cover_image
          }
        };
      }),
      didSelect = (section, row) => {
        const videoItem = videoList[section];
        $console.info(videoItem);
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
                items: ["获取封面"],
                handler: (title, idx) => {
                  switch (idx) {
                    case 0:
                      $ui.preview({
                        title: "稿件封面图",
                        url: selectItem.cover_image
                      });
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
          new VideoList().showVideoList("历史观看", historyList, true);
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
