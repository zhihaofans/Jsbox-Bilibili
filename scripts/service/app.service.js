function openWeb(url) {
  const mode = $prefs.get("web.open.mode");
  switch (mode) {
    case 1:
      $app.openURL(url);
      break;
    case 0:
      $safari.open({
        url,
        entersReader: true,
        height: 360,
        handler: function () {}
      });
      break;
    case 2:
      require("./bili.service").openWebBrowser(url);
      break;
    default:
  }
}
module.exports = {
  openWeb
};
