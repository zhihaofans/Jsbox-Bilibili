const MangaService = require("../service/manga.service");
function startCheckin() {
  return new Promise((resolve, reject) => {
    $ui.loading(true);
    MangaService.checkin()
      .then(result => {
        $ui.loading(false);
        $console.info(result);
        if (result.code === 0) {
          $ui.success("签到成功");
          resolve(true);
        } else {
          $ui.alert({
            title: `签到失败${result.code}`,
            message: result.msg || "未知错误",
            actions: [
              {
                title: "OK",
                disabled: false, // Optional
                handler: () => {
                  resolve(false);
                }
              }
            ]
          });
        }
      })
      .catch(fail => {
        $console.error(fail);
        $ui.loading(false);
        $ui.alert({
          title: "签到失败",
          message: fail.message || "未知错误",
          actions: [
            {
              title: "OK",
              disabled: false, // Optional
              handler: () => {
                resolve(false);
              }
            }
          ]
        });
      })
      .finally(() => {
        $console.info("MangaService.checkin:finally");
      });
  });
}
function init() {
  return new Promise((resolve, reject) => {
    $ui.alert({
      title: "签到？",
      message: "",
      actions: [
        {
          title: "开始签到",
          disabled: false, // Optional
          handler: () => {
            try {
              $console.info("startCheckin", "start");
              startCheckin().then(result => {
                resolve(result);
              });
            } catch (error) {
              $console.error(error);
              $ui.loading(false);
              resolve(false);
            } finally {
              $console.info("startCheckin", "finilly");
            }
          }
        },
        {
          title: "取消",
          handler: () => {
            resolve(false);
          }
        }
      ]
    });
  });
}
module.exports = {
  init
};
