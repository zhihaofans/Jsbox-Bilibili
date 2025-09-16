const LiveService = require("../service/live.service");
const { ViewTemplate } = require("../util/View");
const HistoryViewObj = require("./history.view");
const HistoryView = new HistoryViewObj();
const { showErrorAlertAndExit } = require("../util/JSBox");
const Get = require("Get");
const $ = require("$");
class AboutmeView {
  constructor() {}
  setTabMoneyItemValue(idx, value) {
    $ui
      .get("tabMoney")
      .cell($indexPath(0, idx))
      .get("labelNumber").text = value;
  }
  initSecondData() {
    require("../service/user.service")
      .getNavData()
      .then(result => {
        $ui.loading(false);
        $console.info(result);
        if (result.code === 0) {
          const bCoin =
            Number(result.data.wallet.bcoin_balance).toFixed(2) || "加载失败";
          this.setTabMoneyItemValue(0, bCoin);
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
  initView(resultData) {
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
            text: "..."
          },
          labelTitle: {
            text: "B币"
          }
        },
        {
          labelNumber: {
            text: Number(resultData.billCoin).toFixed(2) || "无"
          },
          labelTitle: {
            text: "硬币"
          }
        },
        {
          labelNumber: {
            text: Number(resultData.gold / 100) || "?"
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
          make.top.greaterThanOrEqualTo(Get("labelUname").bottom);
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
              case 2:
                $app.openURL(
                  "https://link.bilibili.com/p/live-h5-recharge/index.html"
                );
                break;
              default:
                $ui
                  .get("tabMoney")
                  .cell($indexPath(0, 0))
                  .get("labelNumber").text = "999";
            }
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
      historyTabMenu = [
        {
          text: "收藏",
          icon: "star.fill",
          func: () => HistoryView.getFavoriteList()
        },
        {
          text: "稍后再看",
          icon: "eye.fill",
          func: () => HistoryView.showLaterToView()
        },
        {
          text: "历史",
          icon: "gobackward",
          func: () => HistoryView.showHistory()
        },
        {
          text: "动态",
          icon: "list.dash",
          func: () => {
            const { DynamicView } = require("./dynamic.view");
            new DynamicView().init();
          }
        },
        {
          text: "订阅",
          icon: "yensign.circle.fill",
          func: () => {
            const SubscribeView = require("./subscribe.view");
            new SubscribeView().init();
          }
        },
        {
          text: "签到",
          icon: "pencil",
          func: () => {
            const CheckinView = require("./checkin.view");
            new CheckinView().init();
          }
        }
      ],
      historyTabData = historyTabMenu.map(it => {
        return {
          imageIcon: {
            symbol: it.icon
          },
          labelTitle: {
            text: it.text
          }
        };
      }),
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
          make.top.greaterThanOrEqualTo(Get("tabMoney").bottom);
          if ($device.info.screen.width > 500) {
            make.width.equalTo(500);
          } else {
            make.left.right.equalTo(0);
          }
          make.centerX.equalTo(view.super);
          make.height.equalTo(180);
        },
        events: {
          didSelect(sender, indexPath, data) {
            $console.info(indexPath, data);
            historyTabMenu[indexPath.row].func();
          },
          ready: () => {
            $console.info("red");
            this.initSecondData();
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
                src: resultData.face,
                id: "imageUserCover",
                layout: (make, view) => {
                  make.centerX.equalTo(view.super);
                  make.size.equalTo($size(100, 100));
                  make.top.equalTo(5);
                },
                tapped: (sender, indexPath, data) => {
                  $quicklook.open({
                    url: resultData.face,
                    handler: function () {
                      // Handle dismiss action, optional
                    }
                  });
                }
              }),
              ViewTemplate.getLabel({
                id: "labelUname",
                text: resultData.uname,
                layout: (make, view) => {
                  make.centerX.equalTo(view.super);
                  make.top.equalTo(Get("imageUserCover").bottom);
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
  init() {
    $ui.loading(true);
    new LiveService()
      .getUserInfo()
      .then(result => {
        $ui.loading(false);
        $console.info(result);
        if (result.code === 0) {
          this.initView(result.data);
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
}
function showAboutmeView(resultData) {
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
          text: "..."
        },
        labelTitle: {
          text: "B币"
        }
      },
      {
        labelNumber: {
          text: Number(resultData.billCoin).toFixed(2) || "无"
        },
        labelTitle: {
          text: "硬币"
        }
      },
      {
        labelNumber: {
          text: Number(resultData.gold / 100) || "?"
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
        make.top.greaterThanOrEqualTo(Get("labelUname").bottom);
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
            case 2:
              $app.openURL(
                "https://link.bilibili.com/p/live-h5-recharge/index.html"
              );
              break;
            default:
              $ui
                .get("tabMoney")
                .cell($indexPath(0, 0))
                .get("labelNumber").text = "999";
          }
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
        make.top.greaterThanOrEqualTo(Get("tabMoney").bottom);
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
              src: resultData.face,
              id: "imageUserCover",
              layout: (make, view) => {
                make.centerX.equalTo(view.super);
                make.size.equalTo($size(100, 100));
                make.top.equalTo(5);
              },
              tapped: (sender, indexPath, data) => {
                $quicklook.open({
                  url: resultData.face,
                  handler: function () {
                    // Handle dismiss action, optional
                  }
                });
              }
            }),
            ViewTemplate.getLabel({
              id: "labelUname",
              text: resultData.uname,
              layout: (make, view) => {
                make.centerX.equalTo(view.super);
                make.top.equalTo(Get("imageUserCover").bottom);
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

function initOld() {
  $ui.loading(true);
  new LiveService()
    .getUserInfo()
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
function init() {
  new AboutmeView().init();
}
module.exports = {
  init,
  initOld,
  AboutmeView
};
