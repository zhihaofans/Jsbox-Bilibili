// Web
const openWebBrowser = url => {
  $app.openURL(`bilibili://browser/?url=${$text.URLEncode(url)}`);
};
// Video
const openVideo = bvid => {
  $app.openURL(`bilibili://video/${bvid}`);
};
module.exports = { openVideo, openWebBrowser };
