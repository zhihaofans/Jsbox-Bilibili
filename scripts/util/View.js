class ListView {
  constructor() {}
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
    $ui.window === undefined ? $ui.render(view) : $ui.push(view);
    $console.info("showSimpleText");
  }
}
module.exports = {
  ListView
};
