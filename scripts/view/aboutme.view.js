const UserService = require("../service/user.service");
const { ViewTemplate } = require("../util/View");
const HistoryViewObj = require("./history.view");
const HistoryView = new HistoryViewObj();
const { showErrorAlertAndExit } = require("../util/JSBox");
function showAboutmeView(navData) {
  const moneyTemplate = [
      {
        type: "label",
        props: {
          id: "labelNumber",
          font: $font(20),
          align: $align.center
        },
        layout: $layout.fill
      },
      {
        type: "label",
        props: {
          id: "labelTitle",
          font: $font(16),
          align: $align.center
        },
        layout: function (make, view) {
          make.bottom.inset(0);
          make.centerX.equalTo(view.super);
        }
      }
    ],
    moneyData = [
      {
        labelNumber: {
          text: Number(navData.money).toFixed(2) || "0"
        },
        labelTitle: {
          text: "硬币"
        }
      },
      {
        labelNumber: {
          text: Number(navData.wallet.bcoin_balance).toFixed(2) || "无"
        },
        labelTitle: {
          text: "B币"
        }
      },
      {
        labelNumber: {
          text: "?"
        },
        labelTitle: {
          text: "电池"
        }
      }
    ],
    moneyView = {
      type: "matrix",
      props: {
        id: "tabMoney",
        columns: 3,
        itemHeight: 80,
        spacing: 0,
        scrollEnabled: false,
        //bgcolor: $color("clear"),
        template: [
          {
            type: "view",
            props: {
              id: "view_item",
              border: {
                color: $color("gray"),
                width: 10
              }
            },
            layout: (make, view) => {
              //make.size.equalTo(view.super);
              make.center.equalTo(view.super);
              make.height.equalTo(80);
            },
            views: moneyTemplate
          }
        ],
        data: moneyData
      },
      layout: (make, view) => {
        //make.bottom.inset(0);
        make.top.greaterThanOrEqualTo($("labelUname").bottom);
        if ($device.info.screen.width > 500) {
          make.width.equalTo(500);
        } else {
          make.left.right.equalTo(0);
        }
        make.centerX.equalTo(view.super);
        make.height.equalTo(90);
      },
      events: {
        didSelect(sender, indexPath, data) {
          $console.info(indexPath, data);
        }
      }
    },
    historyTabTemplate = [
      {
        type: "image",
        props: {
          id: "imageIcon"
        },
        layout: function (make, view) {
          //make.edges.equalTo(view.super)
          make.center.equalTo(view.super);
          //make.size.equalTo($size(30, 30));
        }
      },
      {
        type: "label",
        props: {
          id: "labelTitle",
          font: $font(16),
          align: $align.center
        },
        layout: function (make, view) {
          make.bottom.inset(0);
          make.centerX.equalTo(view.super);
        }
      }
    ],
    historyTabData = [
      {
        imageIcon: {
          symbol: "star.fill"
        },
        labelTitle: {
          text: "收藏"
        }
      },
      {
        imageIcon: {
          symbol: "eye.fill"
        },
        labelTitle: {
          text: "稍后再看"
        }
      },
      {
        imageIcon: {
          symbol: "gobackward"
        },
        labelTitle: {
          text: "历史"
        }
      }
    ],
    historyTabView = {
      type: "matrix",
      props: {
        id: "tabHistory",
        columns: 3,
        itemHeight: 80,
        spacing: 0,
        scrollEnabled: false,
        //bgcolor: $color("clear"),
        template: [
          {
            type: "view",
            props: {
              id: "view_item",
              border: {
                color: $color("gray"),
                width: 20
              }
            },
            layout: (make, view) => {
              //make.size.equalTo(view.super);
              make.center.equalTo(view.super);
              make.height.equalTo(80);
            },
            views: historyTabTemplate
          }
        ],
        data: historyTabData
      },
      layout: (make, view) => {
        //make.bottom.inset(0);
        make.top.greaterThanOrEqualTo($("tabMoney").bottom);
        if ($device.info.screen.width > 500) {
          make.width.equalTo(500);
        } else {
          make.left.right.equalTo(0);
        }
        make.centerX.equalTo(view.super);
        make.height.equalTo(90);
      },
      events: {
        didSelect(sender, indexPath, data) {
          $console.info(indexPath, data);
          switch (indexPath.row) {
            case 0:
              HistoryView.getFavoriteList();
              break;
            case 1:
              HistoryView.showLaterToView();
              break;
            case 2:
              HistoryView.showHistory();
              break;
            default:
          }
        }
      }
    },
    viewData = {
      props: {
        title: "我"
      },
      views: [
        {
          type: "scroll",
          layout: $layout.fill,
          views: [
            ViewTemplate.getImage({
              src: navData.face,
              id: "imageUserCover",
              layout: (make, view) => {
                make.centerX.equalTo(view.super);
                make.size.equalTo($size(100, 100));
                make.top.equalTo(5);
              },
              tapped: (sender, indexPath, data) => {
                $quicklook.open({
                  url: navData.face,
                  handler: function () {
                    // Handle dismiss action, optional
                  }
                });
              }
            }),
            ViewTemplate.getLabel({
              id: "labelUname",
              text: navData.uname,
              layout: (make, view) => {
                make.centerX.equalTo(view.super);
                make.top.equalTo($("imageUserCover").bottom);
              }
            }),
            moneyView,
            historyTabView
          ]
        }
      ]
    };
  $ui.push(viewData);
}

function init() {
  $ui.loading(true);
  UserService.getNavData()
    .then(result => {
      $ui.loading(false);
      $console.info(result);
      if (result.code === 0) {
        showAboutmeView(result.data);
      } else {
        $ui.alert({
          title: "发生错误",
          message: result.message || "可能是网络错误",
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
      $ui.loading(false);
      $console.info(fail);
      showErrorAlertAndExit(fail.message);
    });
}
module.exports = {
  init
};
