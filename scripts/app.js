const { AppKernel, GlobalStorage } = require("AppKernel");
const { LoginView } = require("./view/account.view");
const MainView = require("./view/main.view");
const AccountService = require("./service/account.service"),
  UserService = require("./service/user.service");
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
    const accountService = new AccountService(),
      userService = new UserService();
    const mainView = new MainView();
    if (accountService.isLogin()) {
      //$ui.success("登录成功");
      try {
        userService
          .checkLoginStatus()
          .then(
            result => {
              $console.info("checkLoginStatus.result");
              if(result===undefined){
                $ui.error("未知错误")
              }else if (result === true) {
                $ui.success("已登录");
                $console.info("main");
                mainView.init();
              } else {
                accountService.logout();
                $ui.error("登录已失效,请重新登录");
              }
            },
            fail => {
              $console.error({
                checkLogin: fail
              });
              $ui.error("发生未知错误");
              $console.error({
                cookie: accountService.getCookie()
              });
              //accountService.logout();
            }
          )
          .finally(finallyResult => {
            $console.info({
              _: "finally",
              finallyResult
            });
          });
      } catch (error) {
        $console.error(error);
        $ui.alert({
          title: "发生未知错误",
          message: "请检查代码",
          actions: [
            {
              title: "OK",
              disabled: false, // Optional
              handler: () => {
                $app.close();
              }
            }
          ]
        });
      }
    } else {
      //$ui.error("未登录");
      new LoginView()
        .login()
        .then(loginResult => mainView.init())
        .catch(fail => {
          $console.error(fail);
          $ui.error("登录取消或发生错误");
          if (fail.error === true) {
            $ui.alert({
              title: "发生错误",
              message: fail.message,
              actions: [
                {
                  title: "OK",
                  disabled: false, // Optional
                  handler: () => $app.close()
                }
              ]
            });
          } else {
            $ui.warning(`警告:${fail.message}`);
          }
        });
    }
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
