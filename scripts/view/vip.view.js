const AccountService = require("../service/account.service"),
  UserService = require("../service/user.service"),
  { PageView } = require("../util/View");
class VipView {
  constructor() {
    this.UserService = new UserService();
  }
  checkVip() {
    return new Promise((resolve, reject) => {});
  }
  init() {
    $ui.push({
      props: {
        title: "大会员",
        id: "vipLoadingPage"
      },
      views: [
        new PageView().genLoadingView({
          text: "让我猜猜你是不是大会员"
        })
      ]
    });
    setTimeout(() => {
      $ui.pop();
    }, 3000);
  }
}
module.exports = VipView;
