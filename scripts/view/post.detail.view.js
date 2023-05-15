const { VideoInfoService } = require("../service/video.service"),
  { ViewKit, ViewTemplate } = require("../util/View");
class PostDetailView {
  constructor() {
    this.VideoInfoService = new VideoInfoService();
    this.ViewKit = new ViewKit();
  }
  showVideoDetail(bvid) {
    $ui.loading(true);
    this.VideoInfoService.getVideoInfo(bvid)
      .then(result => {
        $console.info(result);
        $ui.loading(false);
        if (result.code === 0) {
          const videoInfo = result.data;
          $ui.push({
            props: {
              title: "video"
            },
            views: [
              ViewTemplate.getImage({
                id: "imageCover",
                src: videoInfo.pic,
                layout: (make, view) => {
                  make.left.top.right.inset(10);
                  make.width.equalTo(view.width);
                  make.height.equalTo(200);
                },
                tapped: sender => {
                  $console.info(sender.src);
                }
              }),
              ViewTemplate.getLabel({
                id: "labelUserName",
                text: videoInfo.owner.name,
                layout: (make, view) => {
                  make.left.inset(0);
                  make.top.greaterThanOrEqualTo(220);
                  //make.width.equalTo(view.width);
                  make.height.equalTo(30);
                },
                tapped: sender => {
                  $console.info(sender.text);
                }
              }),
              ViewTemplate.getLabel({
                id: "labelVideoTitle",
                text: `@${videoInfo.title}`,
                layout: (make, view) => {
                  make.left.inset(0);
                  make.top.greaterThanOrEqualTo($("labelUserName").bottom);
                  //make.width.equalTo(view.width);
                  make.height.equalTo(30);
                },
                tapped: sender => {
                  $console.info(sender.text);
                }
              })
            ]
          });
        } else {
          $ui.alert({
            title: bvid,
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
      .catch(error => {
        $console.error(error);
        $ui.alert({
          title: `${bvid} Error`,
          message: error.message,
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
      })
      .finally(() => {
        $ui.loading(false);
      });
  }
}
module.exports = PostDetailView;
