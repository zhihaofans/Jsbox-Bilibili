const { getDynamicList } = require("../service/dynamic.service");
const { DynamicItemData } = require("../model/dynamic.model");
const AppService = require("../service/app.service");
const PostDetailView = require("./post.detail.view");
const HistoryView = require("./history.view");
const { openDynamic } = require("../service/app.service");
function showDynamicList(title, dynamicListData) {
  const itemList = dynamicListData.map(dynamicItem => {
      const typeStrList = {
          8: "视频",
          4308: "直播",
          2: "图文",
          1: "转发",
          4: "文字",
          0: "文章",
          512: "番剧",
          64: "视频笔记"
        },
        typeStr = typeStrList[dynamicItem.dynamic_type] || "未知";

      return {
        labelTitle: {
          text: dynamicItem.text || "开发中"
        },
        labelAuthor: {
          text: "@" + dynamicItem.uname + "\n" + `[${typeStr}]`
        },
        imageCover: {
          src: dynamicItem.image + "@1q.webp"
        }
      };
    }),
    didSelect = (section, row) => {
      const dynamicItem = dynamicListData[row];
      $console.info({
        dynamicItem
      });
      if (dynamicItem.bvid) {
        AppService.openVideo(dynamicItem.bvid);
      } else {
        switch (dynamicItem.dynamic_type) {
          case 512:
          case 11:
          case 64:
            $app.openURL(dynamicItem.url);
            break;
          default:
            $ui.alert({
              title: dynamicItem.uname,
              message: dynamicItem.text,
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
    };
  $ui.push({
    props: {
      title
    },
    views: [
      {
        type: "matrix",
        props: {
          id: "dynamicList",
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
              text: `共${dynamicListData.length || 0}个动态`,
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
            const selectItem = dynamicListData[indexPath.row];
            $ui.menu({
              items: ["获取封面", "获取信息", "添加到稍后再看"],
              handler: (title, idx) => {
                switch (idx) {
                  case 0:
                    $console.info(selectItem.image_list);
                    if (
                      selectItem.image_list &&
                      selectItem.image_list.length > 0
                    ) {
                      $console.info("OK");
                      $quicklook.open({
                        list: selectItem.image_list.map(img => img.img_src)
                      });
                    } else {
                      $ui.preview({
                        title: "动态封面图",
                        url: selectItem.image
                      });
                    }
                    break;
                  case 1:
                    if (selectItem.bvid) {
                      new PostDetailView().showVideoDetail(selectItem.bvid);
                    } else {
                      $ui.warning("开发中");
                    }
                    break;
                  case 2:
                    if (selectItem.dynamic_type === 8) {
                      new HistoryView().addLaterToView(selectItem.bvid);
                    } else {
                      $ui.error("仅支持视频");
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
function init() {
  $ui.loading(true);
  getDynamicList()
    .then(result => {
      $ui.loading(false);
      $console.info(result);
      if (result.code === 0) {
        const dynamicList = result.data.cards.map(item => {
          try {
            const _result = new DynamicItemData(item);
            return _result;
          } catch (error) {
            $console.error("===发生错误");
            $console.error(error);
            $console.error(item);
            $console.error("错误结束===");
            return undefined;
          }
        });

        $console.info(dynamicList);
        showDynamicList("动态", dynamicList);
      } else {
        $ui.error(result.message);
      }
    })
    .catch(fail => {
      $ui.loading(false);
      $console.error(fail);
    });
}
module.exports = {
  init
};
