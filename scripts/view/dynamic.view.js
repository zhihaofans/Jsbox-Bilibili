const {
  DynamicService,
  getDynamicList
} = require("../service/dynamic.service");
const {
  NewDynamicItemData,
  DynamicItemData,
  TYPE_STR_LIST
} = require("../model/dynamic.model");
const AppService = require("../service/app.service");
const BiliService = require("../service/bili.service");
const PostDetailView = require("./post.detail.view");
const HistoryView = require("./history.view");
const { openDynamic } = require("../service/app.service");
const $ = require("$");
class DynamicDetailView {
  constructor() {
    this.DynamicService = new DynamicService();
    this.SUPPORT_TYPE = [2, 4];
  }
  showImageDynamic(dynamicItem) {
    const ContentView = require("./content.view");
    ContentView.openImage({
      id: "dynamic_" + dynamicItem.id_str,
      title: "@" + dynamicItem.author_name,
      imageList: dynamicItem.images,
      onClick: index => {
        const img = dynamicItem.images[index];
        $ui.preview({
          title: "动态图",
          url: img
        });
      }
    });
  }
}
class DynamicView {
  constructor() {
    this.TITLE = "动态";
    this.TYPE_STR_LIST = TYPE_STR_LIST;
    //     {
    //      8: "视频",
    //      4308: "直播",
    //      2: "图片",
    //      1: "转发",
    //      4: "文字",
    //      0: "文章",
    //      512: "番剧",
    //      64: "专栏",
    //      256: "音频",
    //      2048: "活动",
    //      4300: "收藏类动态"
    //    };
    this.DynamicService = new DynamicService();
    this.DynamicDetailView = new DynamicDetailView();
    this.OFFSET_ID = "0";
    this.hasMore = true;
    this.dynamicList = [];
  }
  init() {
    $ui.loading(true);
    this.DynamicService.getDynamicList()
      .then(result => {
        $ui.loading(false);
        $console.info(result);
        if (result.code === 0) {
          this.dynamicList = result.data.items.map(item => {
            try {
              const _result = new NewDynamicItemData(item);
              return _result;
            } catch (error) {
              $console.error("===发生错误");
              $console.error(error);
              $console.error(item);
              $console.error("错误结束===");
              return undefined;
            }
          });

          $console.info(this.dynamicList);
          this.OFFSET_ID = result.data.offset;
          this.hasMore = result.data.has_more;
          this.showDoubleList(this.dynamicList);
        } else {
          $ui.error(result.message);
        }
      })
      .catch(fail => {
        $ui.loading(false);
        $console.error(fail);
        this.hasMore = false;
      });
  }
  reloadDynamicList() {
    $ui.get("dynamicList").data = this.dynamicListToItemList();
    $console.info(this.hasMore);
    $console.info($ui.get("dynamicList"));
    //$ui.get("dynamicList").footer.text=`共${this.dynamicList.length || 0}个动态`
  }
  dynamicListToItemList() {
    return this.dynamicList.map(dynamicItem => {
      $console.info(dynamicItem);
      const typeStr = dynamicItem.dynamic_type_str;
      return {
        labelTitle: {
          text: dynamicItem.text || "开发中"
        },
        labelAuthor: {
          text: "@" + dynamicItem.author_name + "\n" + `[${typeStr}]`
        },
        imageCover: {
          src: dynamicItem.cover + "@1q.webp"
        }
      };
    });
  }
  showDoubleList(dynamicListData) {
    const didSelect = (section, row) => {
      const dynamicItem = this.dynamicList[row];
      $console.info({
        dynamicItem
      });
      switch (dynamicItem.type) {
        case "DYNAMIC_TYPE_DRAW":
          this.DynamicDetailView.showImageDynamic(dynamicItem);
          break;
        case "DYNAMIC_TYPE_AV":
          new PostDetailView().showVideoDetail(dynamicItem.bvid);
          break;
        default:
      }
    };
    $ui.push({
      props: {
        title: this.TITLE
      },
      views: [
        {
          type: "matrix",
          props: {
            id: "dynamicList",
            columns: 2,
            itemHeight: 200, //每行高度
            square: false,
            spacing: 2, //间隔
            template: require("./components/post.item.simple.template"),
            data: this.dynamicListToItemList(),
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
                text: "上拉看旧动态",
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
            didReachBottom: sender => {
              $console.info("didReachBottom");
              //$.stopLoading();
              this.loadNewDynamic(sender);
            }
          }
        }
      ]
    });
  }
  loadNewDynamic(sender) {
    $console.info({
      hasMore: this.hasMore,
      offset_id: this.OFFSET_ID
    });
    if (this.hasMore) {
      this.DynamicService.getDynamicList(this.OFFSET_ID)
        .then(result => {
          $console.info(result);
          if (result.code === 0) {
            if (result.data.offset === this.OFFSET_ID) {
              $.stopLoading();
              $ui.error("没有旧动态了!");
            } else {
              this.OFFSET_ID = result.data.offset;
              this.hasMore = result.data.has_more;
              sender.endFetchingMore();

              const newDynamicList = result.data.items.map(item => {
                try {
                  const _result = new NewDynamicItemData(item);
                  return _result;
                } catch (error) {
                  $console.error("===发生错误");
                  $console.error(error);
                  $console.error(item);
                  $console.error("错误结束===");
                  return undefined;
                }
              });
              this.dynamicList = this.dynamicList.concat(newDynamicList);
              this.reloadDynamicList();
            }
          } else {
            $ui.error(result.message);
          }
        })
        .catch(fail => {
          $ui.loading(false);
          $console.error(fail);
          this.hasMore = false;
        });
    } else {
      $.stopLoading();
      $ui.error("没有旧动态了");
    }
  }
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
              id: "header",
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
              id: "footer",
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

function initNew() {
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
        //showDynamicList("动态", dynamicList);
        const dynamicView = new DynamicView();
        dynamicView.showDoubleList(dynamicList);
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
  DynamicView,
  initNew,
  init
};
