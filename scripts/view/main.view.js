const { ListView, NavView, ViewKit } = require("../util/View");
const VipView = require("./vip.view");
const { showErrorAlertAndExit } = require("../util/JSBox");
const COLOR = require("../config/color");
const { LoginView } = require("./account.view");
const EmoteService = require("../service/emote.service");
const LiveService = require("../service/live.service");
const $ = require("$");
class MainView {
  constructor() {
    this.ListView = new ListView();
    this.ViewKit = new ViewKit();
    this.NavView = new NavView();
    this.MangaView = require("./manga.view");
    this.DynamicView = require("./dynamic.view");
  }
  getEmoteList() {
    try {
      $.startLoading();
      EmoteService.getAllEmoteList()
        .then(result => {
          $console.info(result);
          $ui.push({
            props: {
              title: "listview"
            },
            views: [
              {
                type: "list",
                props: {
                  data: result.packages.map(emoteItem => emoteItem.text)
                },
                layout: $layout.fill,
                events: {
                  didSelect: (sender, indexPath, data) => {
                    const { /*section, */ row } = indexPath;
                    const emoteItem = result.packages[row];
                    $console.info(emoteItem);
                    const emoteList = emoteItem.emote;
                    require("./content.view").openImage({
                      id: "imageEmoteList",
                      title: emoteItem.text,
                      imageList: emoteList.map(item => item.url + "@1q.webp"),
                      onClick: index => {
                        $.startLoading();
                        $quicklook.open({
                          url: emoteList[index].url
                        });
                        $.stopLoading();
                      }
                    });
                  }
                }
              }
            ]
          });
        })
        .catch(fail => {
          $console.error(fail);
        })
        .finally(() => {
          $.stopLoading();
        });
    } catch (error) {
      $console.error(error);
    }
  }
  init() {
    try {
      const title = "哔哩哔哩(已登录)",
        textList = [
          "漫画签到",
          "动态",
          "login data test",
          "emote test",
          "直播签到"
        ],
        didSelect = index => {
          switch (index) {
            case 0:
              this.MangaView.init();
              break;
            case 1:
              this.DynamicView.init();
              break;
            case 2:
              try {
                new LoginView().checkLoginDataStatus();
              } catch (error) {
                $console.error(error);
              }
              break;
            case 3:
              this.getEmoteList();
              break;
            case 4:
              $.startLoading();
              new LiveService()
                .checkIn()
                .then(result => {
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
            didSelect: (sender, indexPath, data) => didSelect(indexPath.row)
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
