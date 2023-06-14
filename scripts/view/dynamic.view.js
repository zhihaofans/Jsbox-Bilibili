const { getDynamicList } = require("../service/dynamic.service");
const { DynamicItemData } = require("../model/dynamic.model");
const AppService = require("../service/app.service");
const PostDetailView = require("./post.detail.view");
const { openDynamic } = require("../service/app.service");
function showDynamicList(title, dynamicListData) {
  const itemList = dynamicListData.map(dynamicItem => {
      //      $console.info({
      //        thisVideo
      //      });
      return {
        labelTitle: {
          text: dynamicItem.text || "开发中"
        },
        labelAuthor: {
          text: "@" + dynamicItem.uname
        },
        imageCover: {
          src: dynamicItem.image
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
              items: ["获取封面", "获取信息"],
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
        const dynamicList = result.data.cards.map(
          item => new DynamicItemData(item)
        );

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
