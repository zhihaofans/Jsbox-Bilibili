const $$ = require("$");
const VideoService = require("../service/video.service"),
  { ViewKit, ViewTemplate } = require("../util/View"),
  { AUDIO_QUALITY_STR, VIDEO_QUALITY_STR } = require("../model/video.model");
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
                $$.startLoading();
                VideoService.downloadVideo(bvid, videoPart.cid)
                  .then(result => {
                    $console.info(result);
                    $$.stopLoading();
                    const { data } = result;
                    if (result.code === 0 && data.result === "suee") {
                      const videoDash = data.dash;

                      $ui.push({
                        props: {
                          title: "音视频分开下载"
                        },
                        views: [
                          {
                            type: "list",
                            props: {
                              data: [
                                {
                                  title: "视频",
                                  rows: videoDash.video.map(
                                    v =>
                                      `${VIDEO_QUALITY_STR[v.id.toString()]}/${
                                        v.width
                                      }x${v.height}(${v.frameRate}fps)/${
                                        v.codecs
                                      }`
                                  )
                                },
                                {
                                  title: "音频",
                                  rows: videoDash.audio.map(
                                    a =>
                                      `${AUDIO_QUALITY_STR[a.id.toString()]}(${
                                        a.id
                                      })`
                                  )
                                }
                              ]
                            },
                            layout: $layout.fill,
                            events: {
                              didSelect: (sender, indexPath, data) => {
                                const { section, row } = indexPath;
                                switch (section) {
                                  case 0:
                                    $input.text({
                                      type: $kbType.text,
                                      placeholder: "",
                                      text: videoDash.video[row].baseUrl,
                                      handler: text => {}
                                    });
                                    break;
                                  case 1:
                                    $input.text({
                                      type: $kbType.text,
                                      placeholder: "",
                                      text: videoDash.audio[row].baseUrl,
                                      handler: text => {}
                                    });
                                    break;
                                  default:
                                }
                              }
                            }
                          }
                        ]
                      });
                    } else {
                      $ui.alert({
                        title: "失败",
                        message: result.message || data.message || "未知错误",
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
                    $$.stopLoading();
                    $ui.error("加载失败");
                    $console.error(fail);
                  });
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
