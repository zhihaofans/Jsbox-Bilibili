const waterfallImageItem = {
  props: {},
  views: [
    {
      type: "image",
      id: "image",
      props: {
        src:
          "https://images.apple.com/v/ios/what-is/b/images/performance_large.jpg"
      },
      layout: function (make, view) {
        make.center.equalTo(view.super);
        make.size.equalTo($size(100, 100));
      }
    }
  ]
};
module.exports = {
  waterfallImageItem
};
