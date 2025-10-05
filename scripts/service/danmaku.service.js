const $ = require("$");
class DanmakuService {
  constructor() {}
  parseDanmaku(xmlData) {
    if (!$.hasString(xmlData)) {
      return undefined;
    }
    const xml = $xml.parse({
      string: xmlData, // Or data: data
      mode: "xml" // Or "html", default to xml
    });
    const itemList = xml.rootElement.children({
      "tag": "d"
    });
    return itemList;
  }
  getDanmuku(cid) {
    return new Promise((resolve, reject) => {});
  }
}
module.exports = DanmakuService;
