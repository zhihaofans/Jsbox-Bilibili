const colorData = require("../../config/color");
const viewTemplate = {
  //    layout: (make, view) => {
  //      make.top.equalTo(120);
  //    },
  props: {
    bgcolor: colorData.videoItemBgcolor
  },
  views: [
    {
      type: "image",
      props: {
        id: "imageCover"
      },
      layout: (make, view) => {
        make.left.equalTo(5);
        make.top.equalTo(0);
        make.size.equalTo($size(185, 112));
      }
    },
    {
      type: "label",
      props: {
        id: "labelTitle",
        align: $align.left,
        font: $font(16),
        lines: 2,
        textColor: colorData.titleTextColor
      },
      layout: (make, view) => {
        make.top.equalTo($("imageCover").bottom);
        make.left.equalTo(0);
        make.right.equalTo(0);
      }
    },
    {
      type: "label",
      props: {
        id: "labelAuthor",
        align: $align.left,
        font: $font(10),
        lines: 3,
        text: "@",
        textColor: colorData.titleTextColor
      },
      layout: (make, view) => {
        make.left.equalTo(0);
        make.right.equalTo(0);
        make.top.equalTo($("labelTitle").bottom);
      }
    }
  ]
};
module.exports = viewTemplate;
