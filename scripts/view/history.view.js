const { PublishItemData } = require("../model/history.model");
const HistoryService = require("../service/history.service");
const { ListView } = require("../util/View");
class VideoList {
  constructor() {
    this.ListView = new ListView();
  }
  showVideoList(title, videoList) {
    const textList = videoList.map(thisVideo => {
        return {
          title: `${thisVideo.author_mid}@${thisVideo.author_name}`,
          rows: [`${thisVideo.bvid}`, thisVideo.title]
        };
      }),
      didSelect = index => {
        const videoItem = videoList[index];
        $console.info(videoItem);
      };
    this.ListView.showSimpleText(title, textList, didSelect);
  }
}
class HistoryView {
  constructor() {
    this.HistoryService = new HistoryService();
    this.ListView = new ListView();
  }
  showHistory() {
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
          new VideoList().showVideoList("历史观看", historyList);
        } catch (error) {
          $console.error(error);
          $ui.error(error.message);
        } finally {
        }
      },
      fail => {
        $console.error({
          fail
        });
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
