const VipService = require("../service/vip.service"),
  { GridView, PageView } = require("../util/View");
const { showErrorAlertAndExit } = require("../util/JSBox");
class VipPage {
  constructor(vipService, vipCenterInfo) {
    this.VipService = vipService;
    this.VipCenterInfo = vipCenterInfo;
  }
  init() {
    try {
      const itemList = [
        {
          title: "领取权益",
          icon: "gift.fill"
        },
        {
          title: "大积分签到",
          icon: "checkmark.rectangle"
        }
      ];
      new GridView().showGrid3({
        title: "大会员",
        itemList,
        callback: (idx, data) => {
          switch (idx) {
            case 0:
              this.showVipPrivilege();
              break;
            case 1:
              this.showVipPoint();
              break;
            default:
              $ui.warning("开发中");
          }
        }
      });
    } catch (error) {
      $console.error(error);
      showErrorAlertAndExit(error.message);
    }
  }
  showVipPrivilege() {
    $ui.loading(true);
    const itemStr = [
      "",
      "B币券",
      "会员购优惠券",
      "漫画福利券",
      "会员购包邮券",
      "漫画商城优惠券",
      "课堂优惠券",
      "课堂优惠券"
    ];
    this.VipService.VipPrivilege.getPrivilegeStatus()
      .then(result => {
        if (result.code === 0) {
          const itemList = result.data.list;
          $ui.loading(false);
          $ui.push({
            props: {
              title: "大会员权益"
            },
            views: [
              {
                type: "list",
                props: {
                  data: itemList.map(item => {
                    const title = itemStr[item.type] || "未知",
                      status = item.state === 0 ? "未兑换" : "已兑换";
                    return title + `[${status}]`;
                  })
                },
                layout: $layout.fill,
                events: {
                  didSelect: (sender, { row }, data) => {
                    $ui.loading(true);
                    const thisItem = itemList[row];
                    this.VipService.VipPrivilege.receivePrivilege(thisItem.type)
                      .then(result => {
                        $ui.loading(false);
                        if (result.code === 0) {
                          $ui.success("ok");
                        } else {
                          $ui.alert({
                            title: "失败",
                            message: result.message,
                            actions: [
                              {
                                title: "OK",
                                disabled: false, // Optional
                                handler: () => {}
                              }
                            ]
                          });
                        }
                      })
                      .catch(fail => {
                        $ui.loading(false);
                        $console.error(fail);
                      });
                  }
                }
              }
            ]
          });
        } else {
          $ui.alert({
            title: "获取大会员权益失败",
            message: result.message,
            actions: [
              {
                title: "OK",
                disabled: false, // Optional
                handler: () => {}
              }
            ]
          });
        }
      })
      .catch(error => {
        $ui.loading(false);
        $console.error(error);
        showErrorAlertAndExit(error.message);
      });
  }
  showVipPoint() {
    $ui.loading(true);
    this.VipService.Task.bigPointCheckIn()
      .then(result => {
        $ui.loading(false);
        $console.info(result);
      })
      .catch(fail => {
        $ui.loading(false);
        $console.error(fail);
      });
  }
}
class VipView {
  constructor() {
    this.VipService = new VipService();
  }
  checkVip() {
    return new Promise((resolve, reject) => {
      this.VipService.isVip()
        .then(isVip => {
          if (isVip) {
            $ui.pop();
            this.VipService.getVipCenterInfo()
              .then(data => {
                new VipPage(this.VipService, data).init();
              })
              .catch(error => {
                $console.info(error);
                $ui.alert({
                  title: "发生错误",
                  message: error.message,
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
              });
          } else {
            $ui.alert({
              title: "❌",
              message: "不是大会员呢",
              actions: [
                {
                  title: "OK",
                  disabled: false, // Optional
                  handler: () => {
                    $ui.pop();
                  }
                }
              ]
            });
          }
        })
        .catch(error => {
          $console.error(error);
        });
    });
  }
  init() {
    $ui.push({
      props: {
        title: "大会员",
        id: "vipLoadingPage"
      },
      views: [
        {
          type: "view",
          layout: $layout.fill,
          views: [
            new PageView().genLoadingView({
              text: "让我猜猜你是不是大会员"
            })
          ],
          events: {
            ready: sender => {
              this.checkVip();
            }
          }
        }
      ]
    });
  }
}
module.exports = VipView;
