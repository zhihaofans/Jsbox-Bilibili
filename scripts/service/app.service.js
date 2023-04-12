// Web
const openWebBrowser = url => {
  if (url) {
    $app.openURL(`bilibili://browser/?url=${$text.URLEncode(url)}`);
  } else {
    throw new Error("空白url");
  }
};

// Video
const openVideo = bvid => {
  if (bvid) {
    $app.openURL(`bilibili://video/${bvid}`);
  } else {
    throw new Error("空白bvid");
  }
};

// Bangumi
const openBangumi = kid => {
  if (kid) {
    $app.openURL(`bilibili://bangumi/season/${kid}`);
  } else {
    throw new Error("空白kid");
  }
};
// Article
const openArticle = kid => {
  if (kid) {
    $app.openURL(`bilibili://article/${kid}`);
  } else {
    throw new Error("空白kid");
  }
};
module.exports = { openArticle, openBangumi, openVideo, openWebBrowser };
