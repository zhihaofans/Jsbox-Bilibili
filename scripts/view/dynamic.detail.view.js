const { DynamicService } = require("../service/dynamic.service");
class DynamicDetailView {
  constructor() {
    this.DynamicService = new DynamicService();
    this.SUPPORT_TYPE = [2, 4];
  }
  showImageDynamic(dynamicItem) {
    const ContentView = require("./content.view");
    ContentView.openImage({
      id: "dynamic_" + dynamicItem.id_str,
      title: "@" + dynamicItem.author_name,
      imageList: dynamicItem.images,
      onClick: index => {
        const img = dynamicItem.images[index];
        $ui.preview({
          title: "动态图",
          url: img
        });
      }
    });
  }
}
module.exports = DynamicDetailView;
