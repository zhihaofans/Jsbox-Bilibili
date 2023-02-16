const AccountService = require("../service/account.service");
const UserService = require("../service/user.service");
class LoginView {
  constructor(app) {
    this.AccountService = new AccountService();
    this.UserService = new UserService();
  }
  checkLogin() {
    try {
      if (this.AccountService.isLogin() === true) {
        this.UserService.checkLoginStatus().then(
          result => {
            if (result === true) {
              //$ui.success("已登录");
              const mainView = require("./main.view");
              $console.info("main");
              new mainView().init();
            } else {
              $ui.error("登录已失效,请重新登录");
            }
          },
          fail => {
            $console.error({
              checkLogin: fail
            });
            $ui.error("发生未知错误");
            $console.error({
              cookie: this.AccountService.getCookie()
            });
            this.AccountService.logout();
          }
        );
      } else {
        $ui.alert({
          title: "Hello World",
          message: "未登录",
          actions: [
            {
              title: "二维码登录",
              disabled: true, // Optional
              handler: () => this.AccountService.loginByQrcode().then()
            },
            {
              title: "输入cookie",
              handler: () =>
                this.AccountService.importCookie().then(
                  result => {
                    if (result) {
                      this.UserService.checkLoginStatus().then(
                        result => {
                          if (result === true) {
                            $ui.success("登录成功");
                          } else {
                            $ui.error("登录失效");
                          }
                        },
                        fail => {
                          $ui.error("导入错误");
                        }
                      );
                    } else {
                      $ui.error("导入失败");
                    }
                  },
                  fail => {
                    if (fail !== false) {
                      $ui.error("未知错误");
                    } else {
                      $ui.error("取消输入");
                    }
                  }
                )
            },
            {
              title: "退出",
              handler: () => {
                //              $app.close();
                $ui.error("取消登录");
              }
            }
          ]
        });
      }
    } catch (error) {
      $console.error(error);
      $ui.error("发生程序错误");
    } finally {
      $console.info("checkLogin.finish");
    }
  }
}
module.exports = {
  LoginView
};
