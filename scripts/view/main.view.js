const { ListView } = require("../util/View");
const HistoryView = require("./history.view");
class MainView {
  constructor() {
    this.ListView = new ListView();
    this.HistoryView = new HistoryView();
  }
  init() {
    const title = "哔哩哔哩(已登录)",
      textList = ["观看历史"],
      didSelect = index => {
        switch (index) {
          case 0:
            this.HistoryView.showHistory();
            break;
          default:
        }
      };
    this.ListView.showSimpleText(title, textList, didSelect);
  }
}
module.exports = MainView;
