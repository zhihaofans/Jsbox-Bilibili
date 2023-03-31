class ListView {
  constructor() {
    this.ViewKit = new ViewKit();
  }
  showSimpleText(title, textList, didSelect = index => {}) {
    const view = {
      props: {
        title
      },
      views: [
        {
          type: "list",
          props: {
            autoRowHeight: this.AUTO_ROW_HEIGHT,
            estimatedRowHeight: this.ESTIMATED_ROW_HEIGHT,
            data: textList
          },
          layout: $layout.fill,
          events: {
            didSelect: (sender, indexPath, data) => {
              didSelect(indexPath.row);
            }
          }
        }
      ]
    };
    this.ViewKit.showView(view);
    $console.info("showSimpleText");
  }
}
class ViewKit {
  constructor() {}
  showView(viewData) {
    $ui.window === undefined ? $ui.render(viewData) : $ui.push(viewData);
  }
}
module.exports = {
  ListView
};
