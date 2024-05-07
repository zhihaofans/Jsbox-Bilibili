const $ = require("$");
class SubscribeView {
  constructor() {
    this.VipService = require("../service/vip.service");
    this.ChargeService = require("../service/charge.service");
    this.LiveService = require("../service/live.service");
  }
  editListItem(groupId, idx, text) {
    const data = $ui.get("subscribeList").views[0].data;
    $console.info(data);
    data[groupId].rows[idx] = text.toString();
    $console.info(data);
    $ui.get("subscribeList").views[0].data = data;
  }
  editListGroupItem(groupIdx, groupRowData, groupTitle) {
    const data = $ui.get("subscribeList").views[0].data;
    $console.info(data);
    data[groupIdx].rows = groupRowData;
    if ($.hasString(groupTitle)) {
      data[groupIdx].title = groupTitle;
    }
    $console.info(data);
    $ui.get("subscribeList").views[0].data = data;
  }
  initSecondData() {
    new this.VipService().VipCenter.getInfo()
      .then(result => {
        if (result.code === 0) {
          const vipData = result.data.user.vip,
            expTime = $.timestampToTimeStr(vipData.vip_due_date);
          $console.info(vipData);
          this.editListGroupItem(0, [vipData.label.text, expTime + "到期"]);
        } else {
          this.editListItem(0, 0, "err:" + result.message);
        }
      })
      .catch(error => {
        $console.error(error);
        this.editListGroupItem(0, ["加载失败", error.message]);
      });
    new this.ChargeService()
      .getMyChargeList()
      .then(result => {
        $console.info(result);
        if (result.code === 0) {
          const chargeList = result.data.list.map(it => {
            const itemName = it.item[0].name;
            return `[@${it.user_name}] ${itemName}`;
          });
          this.editListGroupItem(
            1,
            chargeList,
            "充电订阅" + result.data.total_num + "个"
          );
        } else {
          this.editListItem(1, 0, "err:" + result.message);
        }
      })
      .catch(error => {
        $console.error(error);
        this.editListGroupItem(0, ["加载失败", error.message]);
      });
    new this.LiveService()
      .getBuyedGuardList()
      .then(result => {
        $console.info(result);
        if (result.code === 0) {
          const activeList = result.data.active_list.map(it => {
            const itemName = it.guards[0].hint_msg;
            let text = `[@${it.uname}] ${itemName}`;
            if (it.guards[0].auto_renew === 1) {
              text += "(￼自动续费￼)";
            }
            return text;
          });
          this.editListGroupItem(
            2,
            activeList,
            "大航海" + activeList.length + "个"
          );
        } else {
          this.editListItem(1, 0, "err:" + result.message);
        }
      })
      .catch(error => {
        $console.error(error);
        this.editListGroupItem(0, ["加载失败", error.message]);
      });
  }
  initView() {
    $ui.push({
      props: {
        title: "付费订阅",
        id: "subscribeList"
      },
      views: [
        {
          type: "list",
          props: {
            data: [
              {
                title: "大会员",
                rows: ["未订阅🚫", "已到期"]
              },
              {
                title: "充电订阅",
                rows: ["1-0", "1-1", "1-2"]
              },
              {
                title: "大航海",
                rows: ["1-0", "1-1", "1-2"]
              }
            ]
          },
          layout: $layout.fill,
          events: {
            ready: () => {
              this.initSecondData();
            },
            didSelect: (sender, indexPath, data) => {
              const { section, row } = indexPath;
            }
          }
        }
      ]
    });
  }
  init() {
    this.initView();
  }
}
module.exports = SubscribeView;
