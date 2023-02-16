const { AppKernel, GlobalStorage } = require("AppKernel");
const { LoginView } = require("./view/account.view");
class App extends AppKernel {
  constructor() {
    super({
      appId: "jsbox.zhihaofans.bilibili",
      appName: "哔哩哔哩",
      author: "zhihaofans"
    });
    this.Global = new GlobalStorage(this.AppInfo.id);
  }
  init() {
    new LoginView().checkLogin();
  }
}
function init() {
  try {
    new App().init();
  } catch (error) {
    $console.error(error);
  } finally {
    $console.info("init finish");
  }
}
module.exports = {
  init
};
