const { AppKernel, GlobalStorage } = require("AppKernel");
const { LoginView } = require("./view/account.view");
const MainView = require("./view/main.view");
const AccountService = require("./service/account.service"),
  UserService = require("./service/user.service");
const { isIpad, showErrorAlertAndExit } = require("./util/JSBox");
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
    $ui.loading("正在初始化...");
    const mainView = new MainView();
    if (AccountService.isLogin()) {
      try {
        UserService.checkLoginStatus()
          .then(
            result => {
              $ui.loading(false);
              $console.info("checkLoginStatus.result");
              if (result === undefined) {
                $ui.error("未知错误");
              } else if (result === true) {
                //$ui.success("已登录");
                $console.info("main");
                mainView.init();
              } else {
                $ui.alert({
                  title: "登录已失效,是否重新登录？",
                  message: "也可能是网络问题导致获取数据失败",
                  actions: [
                    {
                      title: "退出登录",
                      disabled: false, // Optional
                      handler: () => {
                        $ui.alert({
                          title: "真的要退出登录吗？",
                          message: "",
                          actions: [
                            {
                              title: "点错了",
                              disabled: false, // Optional
                              handler: () => $app.close()
                            },
                            {
                              title: "确定退出",
                              handler: () => AccountService.logout()
                            }
                          ]
                        });
                      }
                    },
                    {
                      title: "不理",
                      handler: () => mainView.init()
                    },
                    {
                      title: "离开",
                      handler: () => $app.close()
                    }
                  ]
                });
              }
            },
            fail => {
              $ui.loading(false);
              $console.error({
                checkLogin: fail
              });
              $ui.error("发生未知错误");
              $console.error({
                cookie: AccountService.getCookie()
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
        $ui.loading(false);
        $console.error(error);
        showErrorAlertAndExit("请检查代码");
      }
    } else {
      //$ui.error("未登录");
      $ui.loading(false);
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
    if (isIpad()) {
      $ui.alert({
        title: "警告",
        message: "您正在iPad设备上运行，可能出现错误",
        actions: [
          {
            title: "继续",
            handler: () => new App().init()
          },
          {
            title: "退出",
            handler: () => $app.close()
          }
        ]
      });
    } else {
      new App().init();
    }
  } catch (error) {
    $console.error(error);
    $ui.alert({
      title: "‼️",
      message: error.message,
      actions: [
        {
          title: "Bye~",
          disabled: false, // Optional
          handler: () => {
            $app.close();
          }
        }
      ]
    });
  } finally {
    $console.info("init finish");
  }
}
module.exports = {
  init
};
