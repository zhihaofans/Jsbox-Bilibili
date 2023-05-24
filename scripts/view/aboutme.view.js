const UserService = require("../service/user.service");
const { ViewTemplate } = require("../util/View");

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
          text: navData.money || "无"
        },
        labelTitle: {
          text: "硬币"
        }
      },
      {
        labelNumber: {
          text: navData.wallet.bcoin_balance || "无"
        },
        labelTitle: {
          text: "B币"
        }
      },
      {
        labelNumber: {
          text: "0"
        },
        labelTitle: {
          text: "其他"
        }
      }
    ],
    moneyView = {
      type: "matrix",
      props: {
        id: "tab",
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
              events: {
                didSelect: (sender, indexPath, data) => {
                  $quicklook.open({
                    url: navData.face,
                    handler: function () {
                      // Handle dismiss action, optional
                    }
                  });
                }
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
            moneyView
          ]
        }
      ]
    };
  $ui.push(viewData);
}

function init() {
  UserService.getNavData()
    .then(result => {
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
      $console.info(fail);
    });
}
module.exports = {
  init
};
