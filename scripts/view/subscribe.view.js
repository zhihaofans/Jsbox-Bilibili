class SubscribeView {
  constructor() {
    this.VipService = require("../service/vip.service");
  }
  editListItem(groupId, idx, text) {
    const data = $ui.get("subscribeList").views[0].data;
    $console.info(data);
    data[groupId].rows[idx] = text;
    $console.info(data);
    $ui.get("subscribeList").views[0].data = data;

    $ui.get("subscribeList").relayout();
  }
  initSecondData() {
    new this.VipService().VipCenter.getInfo()
      .then(result => {
        if (result.code === 0) {
          const vipData = result.data.user.vip;
          $console.info(vipData);
          this.editListItem(0, 0, vipData.label.text);
        } else {
          this.editListItem(0, 0, "err:" + result.message);
        }
      })
      .catch(error => {
        reject(error);
      });
  }
  initView() {
    $ui.push({
      props: {
        title: "listview",
        id: "subscribeList"
      },
      views: [
        {
          type: "list",
          props: {
            data: [
              {
                title: "大会员",
                rows: ["未订阅🚫"]
              },
              {
                title: "Section 1",
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
