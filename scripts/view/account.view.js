const AccountService = require("../service/account.service");
const UserService = require("../service/user.service");
const { ImageView, ListView } = require("../util/View");
const { showDoubleInputAlert } = require("../util/Alert");
const AppService = require("../service/app.service");
class LoginView {
  constructor(app) {
    this.AccountService = new AccountService();
    this.UserService = new UserService();
    this.ListView = new ListView();
    this.ImageView = new ImageView();
  }
  checkLogin() {
    try {
      if (this.AccountService.isLogin() === true) {
      }
    } catch (error) {
      $console.error(error);
      $ui.error("发生程序错误");
    } finally {
      $console.info("checkLogin.finish");
    }
  }
  inputKey() {
    return new Promise((resolve, reject) => {
      $input.text({
        type: $kbType.text,
        placeholder: "",
        text: "",
        handler: text => {}
      });
      reject({
        error: false,
        message: "取消输入登录key"
      });
    });
  }
  login() {
    return new Promise((resolve, reject) => {
      const listItem = ["扫码登录", "test input"],
        didSelect = index => {
          switch (index) {
            case 0:
              try {
                this.scanQrcode2Login();
              } catch (error) {
                $console.error(error);
              } finally {
              }
              break;
            case 1:
              showDoubleInputAlert({
                title: "输入",
                message: "第一个:Cookie，第二个:Csrf",
                inputItem: [
                  {
                    text: this.AccountService.getCookie(),
                    placeholder: "cookie"
                  },
                  {
                    text: this.AccountService.getCsrf(),
                    placeholder: "csrf"
                  }
                ]
              })
                .then(result => {
                  const [cookie, csrf] = result;
                  $console.info({
                    cookie,
                    csrf
                  });
                })
                .catch(fail => {
                  $console.error(fail);
                  $ui.error("alert catch");
                });
              break;
            default:
              reject({
                error: false,
                message: "取消登录"
              });
          }
        };
      this.ListView.showSimpleText("登录Bilibili", listItem, didSelect);
    });
  }
  scanQrcode2Login() {
    $ui.loading(true);
    return new Promise((resolve, reject) => {
      $console.info("scanQrcode2Login.start");
      this.AccountService.getQrcodeKey()
        .then(result => {
          $console.info({
            result
          });
          const { qrcode_key, url } = result,
            qrcodeData = $qrcode.encode(url);
          $ui.loading(false);
          if (qrcode_key && url) {
            try {
              const title = "扫码登录",
                buttonOneTitle = "我登录了",
                buttonOneTapped = sender => {
                  sender.bgcolor = $color("#007AFF");
                  this.checkQrcodeLoginStatus(sender, qrcode_key);
                },
                buttonTwoTitle = "App登录",
                buttonTwoTapped = sender => {
                  AppService.openWebBrowser(url);
                };
              this.ImageView.showImageAndTwoButton({
                title,
                imageData: qrcodeData,
                buttonOneTitle,
                buttonOneTapped,
                buttonTwoTitle,
                buttonTwoTapped
              });
            } catch (error) {
              $console.error(error);
            }
          } else {
            $ui.error("获取登录密钥失败");
          }
        })
        .catch(error => {
          $console.error(error);
          $ui.loading(false);
          $ui.error("登录失败");
        });
    }).finally(a => {
      $console.info("scanQrcode2Login.fini");
    });
  }
  checkQrcodeLoginStatus(sender, qrcode_key) {
    if (sender && qrcode_key) {
      sender.enabled = false;
      sender.title = "Checking...";
      this.AccountService.loginByQrcode(qrcode_key)
        .then(result => {
          const { code, message, refresh_token, url, timestamp } = result;

          $console.info({
            result
          });
          if (code === 0) {
            sender.title = "登录成功";
            sender.bgcolor = $color("green");
          } else {
            sender.enabled = true;
            sender.title = "还没登录呢";
            sender.bgcolor = $color("red");
            $ui.error(message);
          }
        })
        .catch(fail => {
          sender.enabled = true;
          sender.title = "我登录了";
          $ui.error("error");
          $ui.alert({
            title: "错误",
            message: fail.message,
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
      $ui.error("检测失败，发生代码错误");
    }
  }
}
module.exports = {
  LoginView
};
