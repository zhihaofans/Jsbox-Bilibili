class PublishItemData {
  constructor(videoData) {
    this.author_face = videoData.owner?.face || videoData.author_face;
    this.author_mid = videoData.owner?.mid || videoData.author_mid;
    this.author_name = videoData.owner?.name || videoData.author_name;
    this.avid = videoData.aid || videoData.history?.avid;
    this.badge = videoData.badge;
    this.business = videoData.history?.business; //历史类型：archive：稿件，pgc：剧集（番剧 / 影视），live：直播，article-list：文集，article：文章
    this.bvid = videoData.bvid || videoData.history?.bvid;
    this.copyright = videoData.copyright; //1：原创 2：转载
    this.cover_image = videoData.pic; //视频封面
    this.desc = videoData.desc; //简介
    this.kid = videoData.kid;
    this.parts_count = videoData.videos; //稿件分P总数
    this.publish_location = videoData.pub_location; //发布定位
    this.publish_time = videoData.pubdate; //发布时间
    this.short_link = videoData.short_link_v2 || videoData.short_link;
    this.staff = videoData.staff; //合作成员列表
    this.show_title = videoData.show_title;
    this.tid = videoData.tid; //分区id
    this.title = videoData.title;
    this.tname = videoData.tname; //子分区名称
    this.upload_time = videoData.ctime; //投稿时间戳
    this.uri = videoData.uri;
  }
}
module.exports = {
  PublishItemData
};
