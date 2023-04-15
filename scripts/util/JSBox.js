const showErrorAlertAndExit = message => {
  $ui.alert({
    title: "发生错误",
    message: message || "未知错误",
    actions: [
      {
        title: "退出",
        disabled: false, // Optional
        handler: () => $app.close()
      }
    ]
  });
};
module.exports = {
  showErrorAlertAndExit
};
