const { ListView, NavView, ViewKit } = require("../util/View");
const VipView = require("./vip.view");
const { showErrorAlertAndExit } = require("../util/JSBox");
const COLOR = require("../config/color");
const LiveService = require("../service/live.service");
const $ = require("$");
const { ListViewItemLoading } = require("Next");
class MainView {
  constructor() {
    this.ListView = new ListView();
    this.ViewKit = new ViewKit();
    this.NavView = new NavView();
    this.MangaView = require("./manga.view");
  }
  init() {
    try {
      const title = "哔哩哔哩(已登录)",
        textList = ["漫画签到", "动态已移至我的页面", "直播签到", "设置", "test"],
        didSelect = (indexPath, sender) => {
          const index = indexPath.row,
            listItemLoading = new ListViewItemLoading(sender);
          switch (index) {
            case 0:
              listItemLoading.startLoading(indexPath);
              this.MangaView.init().then(result => {
                listItemLoading.stopLoading(indexPath);
              });
              break;
            case 1:
              //this.DynamicView.init();
              break;
            case 2:
              $.startLoading();
              listItemLoading.startLoading(indexPath);
              new LiveService()
                .checkIn()
                .then(result => {
                  listItemLoading.stopLoading(indexPath);
                  $.stopLoading();
                  $console.info(result);
                  $ui.alert({
                    title: "直播签到" + result.code,
                    message: result.message,
                    actions: [
                      {
                        title: "OK",
                        disabled: false, // Optional
                        handler: () => {}
                      }
                    ]
                  });
                })
                .catch(fail => {
                  $.stopLoading();
                  $console.error(fail);
                  $ui.error("直播签到失败");
                });
              break;
            case 3:
              $prefs.open();
              break;
            case 4:
              require("./test.view").init();
              break;
            default:
              $ui.error("?");
          }
        };
      const navList = [
          {
            title: "主页",
            icon: "house.fill",
            selected: true,
            func: () => {}
          },
          {
            title: "大会员",
            icon: "person.icloud",
            func: () => {
              new VipView().init();
            }
          },
          {
            title: "我的",
            icon: "person.fill",
            func: () => {
              require("./aboutme.view").init();
            }
          }
        ],
        navData = navList.map(item => {
          return {
            menu_image: {
              symbol: item.icon,
              tintColor: item.selected
                ? COLOR.navSelectedIconColor
                : COLOR.navIconColor
            },
            menu_label: {
              text: item.title,
              textColor: item.selected
                ? COLOR.navSelectedTextColor
                : COLOR.navTextColor
            }
          };
        });
      const ViewData = [
        {
          type: "list",
          props: {
            data: textList
          },
          layout: $layout.fill,
          events: {
            didSelect: (sender, indexPath, data) => didSelect(indexPath, sender)
          }
        },
        {
          type: "matrix",
          props: {
            id: "tab",
            columns: 3,
            itemHeight: 50,
            spacing: 0,
            scrollEnabled: false,
            //bgcolor: $color("clear"),
            template: [
              {
                type: "view",
                props: {
                  id: "view_item"
                },
                layout: function (make, view) {
                  make.size.equalTo(view.super);
                  make.center.equalTo(view.super);
                },
                views: [
                  {
                    type: "image",
                    props: {
                      id: "menu_image",
                      resizable: true,
                      clipsToBounds: false
                    },
                    layout: function (make, view) {
                      make.centerX.equalTo(view.super);
                      make.size.equalTo($size(25, 25));
                      make.top.inset(6);
                    }
                  },
                  {
                    type: "label",
                    props: {
                      id: "menu_label",
                      font: $font(10)
                    },
                    layout: function (make, view) {
                      var preView = view.prev;
                      make.centerX.equalTo(preView);
                      make.bottom.inset(5);
                    }
                  }
                ]
              }
            ],
            data: navData || [
              {
                menu_image: {
                  symbol: "square.grid.2x2.fill",
                  tintColor: $color("gray")
                },
                menu_label: {
                  text: "应用",
                  textColor: $color("gray")
                }
              },
              {
                menu_image: {
                  symbol: "person.icloud",
                  tintColor: $color("gray")
                },
                menu_label: {
                  text: "大会员",
                  textColor: $color("gray")
                }
              },
              {
                menu_image: {
                  symbol: "person.fill",
                  tintColor: $color("gray")
                },
                menu_label: {
                  text: "我的",
                  textColor: $color("gray")
                }
              }
            ]
          },
          layout: function (make, view) {
            make.bottom.inset(0);
            if ($device.info.screen.width > 500) {
              make.width.equalTo(500);
            } else {
              make.left.right.equalTo(0);
            }
            make.centerX.equalTo(view.super);
            make.height.equalTo(50);
          },
          events: {
            didSelect(sender, indexPath, data) {
              const navItem = navList[indexPath.row];
              if (
                navItem.func !== undefined &&
                typeof navItem.func === "function"
              ) {
                try {
                  navItem.func();
                } catch (error) {
                  $console.error(error);
                  showErrorAlertAndExit(error.message);
                }
              } else {
                $console.info(indexPath.row);
              }
            }
          }
        }
      ];
      this.ViewKit.showView({
        props: {
          title
        },
        views: [
          {
            type: "view",
            layout: $layout.fillSafeArea,
            views: ViewData
          }
        ]
      });
    } catch (error) {
      $console.error(error);
      showErrorAlertAndExit(error.message);
    }
  }
}
module.exports = MainView;
