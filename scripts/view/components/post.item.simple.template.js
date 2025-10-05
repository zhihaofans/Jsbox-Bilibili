const colorData = require("../../config/color");
const itemViewList = [
    {
      type: "image",
      props: {
        id: "imageFace",
        cornerRadius:10,
        smoothCorners:true
      },
      layout: (make, view) => {
        //make.centerX.equalTo(view.super);
        make.left.equalTo(5);
        make.top.equalTo(5);
        make.height.width.equalTo(24);
        //make.bottom.equalTo(5)
      }
    },
    {
      type: "label",
      props: {
        id: "labelAuthor",
        align: $align.left,
        font: $font(24),
        lines: 3,
        text: "@",
        textColor: colorData.titleTextColor
      },
      layout: (make, view) => {
        make.left.equalTo($("imageFace").right).offset(10)
        make.right.equalTo(5);
        make.top.equalTo($("imageFace").top).offset(-2)
      }
    },
    {
      type: "label",
      props: {
        id: "labelTitle",
        align: $align.left,
        font: $font(16),
        lines: 3,
        textColor: colorData.titleTextColor
      },
      layout: (make, view) => {
        make.top.equalTo($("labelAuthor").bottom).offset(10)
        make.left.equalTo(5);
        make.right.equalTo(5);
      }
    },
    {
      type: "image",
      props: {
        id: "imageCover"
      },
      layout: (make, view) => {
        //make.centerX.equalTo(view.super);
        make.right.equalTo(5);
        make.left.equalTo(5);
        make.top.equalTo($("labelTitle").bottom);
        make.height.equalTo(220);
        //make.bottom.equalTo(5)
      }
    }
  ],
  viewTemplate = {
    //    layout: (make, view) => {
    //      make.top.equalTo(120);
    //    },
    props: {
      bgcolor: colorData.videoItemBgcolor
    },
    views: itemViewList
  };
module.exports = viewTemplate;
