const { VideoInfoService } = require("../service/video.service"),
  { ViewKit } = require("../util/View");
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
        if (result.code === 0) {
          const videoInfo = result.data;
          $ui.push({
            props: {
              title: "video"
            },
            views: [
              {
                type: "image",
                props: {
                  id: "imageCover",
                  src: videoInfo.pic
                },
                layout: (make, view) => {
                  make.left.top.equalTo(0);
                  make.width.equalTo(view.width);
                  $console.info(view.width);
                  //make.height.equalTo(view.width/16*9);
                }
              }
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
