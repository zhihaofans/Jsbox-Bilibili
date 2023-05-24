const MangaService = require("../service/manga.service");
function startCheckin() {
  $ui.loading(true);
  MangaService.checkin()
    .then(result => {
      $ui.loading(false);
      $console.info(result);
      if (result.code === 0) {
        $ui.success("签到成功");
      } else {
        $ui.alert({
          title: `签到失败${result.code}`,
          message: result.msg || "未知错误",
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
      $console.error(fail);
      $ui.loading(false);
      $ui.alert({
        title: "签到失败",
        message: fail.message || "未知错误",
        actions: [
          {
            title: "OK",
            disabled: false, // Optional
            handler: () => {}
          }
        ]
      });
    })
    .finally(() => {
      $console.info("MangaService.checkin:finally");
    });
}
function init() {
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
            startCheckin();
          } catch (error) {
            $console.error(error);
            $ui.loading(false);
          } finally {
            $console.info("startCheckin", "finilly");
          }
        }
      },
      {
        title: "取消",
        handler: () => {}
      }
    ]
  });
}
module.exports = {
  init
};
