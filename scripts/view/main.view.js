const { ListView, NavView, ViewKit } = require("../util/View");
const HistoryView = require("./history.view");
class MainView {
  constructor() {
    this.ListView = new ListView();
    this.ViewKit = new ViewKit();
    this.HistoryView = new HistoryView();
    this.NavView = new NavView();
  }
  init() {
    try {
      const title = "哔哩哔哩(已登录)",
        textList = ["观看历史", "稍后再看"],
        didSelect = index => {
          switch (index) {
            case 0:
              this.HistoryView.showHistory();
              break;
            case 1:
              this.HistoryView.showLaterToView();
              break;
            default:
          }
        };
      const mIconSymbols = [
        "square.grid.2x2.fill",
        "square.and.arrow.down.fill",
        "person.fill"
      ];
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
            bgcolor: $color("clear"),
            template: [
              {
                type: "view",
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
            data: [
              {
                menu_image: {
                  symbol: mIconSymbols[0],
                  tintColor: $color("gray")
                },
                menu_label: {
                  text: "应用",
                  textColor: $color("gray")
                }
              },
              {
                menu_image: {
                  symbol: mIconSymbols[1],
                  tintColor: $color("gray")
                },
                menu_label: {
                  text: "更新",
                  textColor: $color("gray")
                }
              },
              {
                menu_image: {
                  symbol: mIconSymbols[2],
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
              $console.info(indexPath.row);
            }
          }
        }
      ];
      $console.info({
        ViewData
      });
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
    }
  }
}
module.exports = MainView;
