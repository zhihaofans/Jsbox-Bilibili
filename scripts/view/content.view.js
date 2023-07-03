const { waterfallImageItem } = require("./components/content.template");
function pushView({
  id,
  title,
  template,
  data,
  columns,
  onClick = index => {}
}) {
  $ui.push({
    props: {
      id,
      title
    },
    views: [
      {
        type: "matrix",
        props: {
          columns: columns || 2,
          itemHeight: 88,
          spacing: 5,
          //加上会崩溃
          //            autoItemSize: true,
          //            estimatedItemSize: $size(120, 0),
          waterfall: true,
          template,
          data,
          header: {
            type: "label",
            props: {
              height: 20,
              text: `${data.length}个内容`,
              textColor: $color("#AAAAAA"),
              align: $align.center,
              font: $font(12)
            }
          },
          footer: {
            type: "label",
            props: {
              height: 20,
              text: `网络不好时可能加载不出来`,
              textColor: $color("#AAAAAA"),
              align: $align.center,
              font: $font(12)
            }
          }
        },
        layout: $layout.fill,
        events: {
          didSelect: (sender, indexPath, data) => {
            onClick(indexPath.row);
          }
        }
      }
    ]
  });
}
function openImage({ id, title, imageList, onClick = index => {} }) {
  const data = imageList.map(img => {
    return {
      image: {
        src: img
      }
    };
  });
  pushView({
    id,
    title,
    template: waterfallImageItem,
    data,
    columns: 3,
    onClick
  });
}

module.exports = {
  openImage
};
