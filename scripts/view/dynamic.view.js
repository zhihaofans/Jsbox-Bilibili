const { getDynamicList } = require("../service/dynamic.service");
const { DynamicItemData } = require("../model/dynamic.model");
const AppService = require("../service/app.service");
const BiliService = require("../service/bili.service");
const PostDetailView = require("./post.detail.view");
const HistoryView = require("./history.view");
const { openDynamic } = require("../service/app.service");
const $ = require("$");
class DynamicView{
  constructor(){
    
  }
  showDoubleList(){}
}
function showDynamicList(title, dynamicListData) {
  const itemList = dynamicListData.map(dynamicItem => {
      const typeStrList = {
          8: "视频",
          4308: "直播",
          2: "图片",
          1: "转发",
          4: "文字",
          0: "文章",
          512: "番剧",
          64: "专栏",
          256: "音频",
          2048: "活动",
          4300: "收藏类动态"
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
      if (dynamicItem.dynamic_type === 8 && dynamicItem.bvid !== undefined) {
        BiliService.openVideo(dynamicItem.bvid);
      } else {
        switch (dynamicItem.dynamic_type) {
          case 512:
          case 11:
          case 64:
            AppService.openWeb(dynamicItem.url);
            break;
          default:
            $ui.alert({
              title: dynamicItem.uname,
              message: dynamicItem.text,
              actions: [
                {
                  title: "打开动态",
                  disabled: false, // Optional
                  handler: () => {
                    AppService.openWeb(
                      `https://m.bilibili.com/opus/${dynamicItem.dynamic_id_str}`
                    );
                  }
                },
                {
                  title: "Bye",
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
              items: [
                "获取封面",
                "获取信息",
                "添加到稍后再看(视频)",
                "动态id",
                "打开动态"
              ],
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
                  case 3:
                    $input.text({
                      type: $kbType.text,
                      placeholder: "",
                      text: selectItem.dynamic_id,
                      handler: text => {
                        $.copy(text);
                      }
                    });
                    break;
                  case 4:
                    const url = `https://m.bilibili.com/opus/${selectItem.dynamic_id_str}`;
                    $console.info(url);
                    AppService.openWeb(url);
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
