const { ListViewItemLoading } = require("Next");
const LiveService = require("../service/live.service");
const VipService = require("../service/vip.service");
const $ = require("$");
class CheckinView {
  constructor() {
    this.VipService = new VipService();
    this.CHECKIN_LIST = [
      {
        title: "每日签到",
        items: [
          {
            text: "漫画签到",
            func: listItemLoading => {
              require("./manga.view")
                .init()
                .then(result => {});
            }
          },
          {
            text: "直播签到",
            func: listItemLoading => {
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
            }
          }
        ]
      },
      {
        title: "大会员每月签到",
        items: [
          {
            text: "大积分签到",
            func: listItemLoading => {
              $ui.loading(true);
              this.VipService.Task.bigPointCheckIn()
                .then(result => {
                  $ui.loading(false);
                  $console.info(result);
                  result.code === 0
                    ? $ui.success("签到成功")
                    : $ui.error("签到失败");
                })
                .catch(fail => {
                  $ui.loading(false);
                  $console.error(fail);
                  $ui.error("error");
                });
            }
          },{
            text: "大会员权益",
            func: listItemLoading => {
            this.showVipPrivilege()
            }
          }
        ]
      }
    ];
  }
  init() {
    $ui.push({
      props: {
        title: "签到"
      },
      views: [
        {
          type: "list",
          props: {
            data: this.CHECKIN_LIST.map(it => {
              return {
                title: it.title,
                rows: it.items.map(it => it.text)
              };
            })
          },
          layout: $layout.fill,
          events: {
            didSelect: (sender, indexPath, data) => {
              const { section, row } = indexPath,
                listItemLoading = new ListViewItemLoading(sender);
              try {
                this.CHECKIN_LIST[section].items[row].func(sender);
              } catch (error) {
                $console.error(error);
              } finally {
              }
            }
          }
        }
      ]
    });
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
      });
  }
}
module.exports = CheckinView;
