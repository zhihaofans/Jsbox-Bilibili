const VideoService = require("../service/video.service"),
  { ViewKit, ViewTemplate } = require("../util/View");
class Downloader {
  constructor() {}
  startDownload(videoInfo) {
    if (videoInfo) {
      const { bvid, pages } = videoInfo;
      $ui.push({
        props: {
          title: `下载视频(${pages.length}个分P)`
        },
        views: [
          {
            type: "list",
            props: {
              data: pages.map(part => part.part)
            },
            layout: $layout.fill,
            events: {
              didSelect: (sender, indexPath, data) => {
                const videoPart = pages[indexPath.row];
                VideoService.downloadVideo(bvid, videoPart.cid);
              }
            }
          }
        ]
      });
    } else {
      $ui.error("视频信息空白");
    }
  }
}
class PostDetailView {
  constructor() {
    this.ViewKit = new ViewKit();
    this.Downloader = new Downloader();
  }
  showVideoDetail(bvid) {
    $ui.loading(true);
    VideoService.getVideoInfo(bvid)
      .then(result => {
        $console.info(result);
        $ui.loading(false);
        if (result.code === 0) {
          const videoInfo = result.data;
          $console.info(videoInfo.pages);
          $ui.push({
            props: {
              title: "video"
            },
            views: [
              ViewTemplate.getImage({
                id: "imageCover",
                src: videoInfo.pic + "@1q.webp",
                layout: (make, view) => {
                  make.left.top.right.inset(10);
                  make.width.equalTo(view.width);
                  make.height.equalTo(200);
                },
                tapped: sender => {
                  $console.info(videoInfo.pic);
                }
              }),
              ViewTemplate.getLabel({
                id: "labelUserName",
                text: `@${videoInfo.owner.name}`,
                layout: (make, view) => {
                  make.left.right.inset(10);
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
                text: videoInfo.title,
                lines: 0,
                layout: (make, view) => {
                  make.left.right.inset(10);
                  make.top.greaterThanOrEqualTo($("labelUserName").bottom);
                  //make.width.equalTo(view.width);
                  make.height.equalTo(30);
                },
                tapped: sender => {
                  $console.info(sender.text);
                }
              }),
              ViewTemplate.getButton({
                id: "buttonDownload",

                title: "下载视频",
                layout: (make, view) => {
                  make.top.greaterThanOrEqualTo($("labelVideoTitle").bottom);
                  make.centerX.equalTo(view.super);
                },
                tapped: () => {
                  this.Downloader.startDownload(videoInfo);
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
