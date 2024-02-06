class DynamicItemData {
  constructor({ card, desc }) {
    this.card = JSON.parse(card);
    $console.warn(this.card);
    $console.info(desc);
    // Dynamic info
    this.dynamic_id = desc.dynamic_id;
    this.dynamic_id_str = desc.dynamic_id_str;
    this.dynamic_type = desc.type; //8:视频,4308:直播,2:图文动态,1:转发,4:文字动态,0:文章,512:番剧,64:视频笔记
    switch (this.dynamic_type) {
      case 64:
        // 视频笔记
        this.text = this.card.title;
        this.image_list = this.card.image_urls || [];
        if (this.card.banner_url) {
          this.image_list.push(this.card.banner_url);
        }
        if (this.image_list.length === 0) {
          this.image_list.push(this.card.author.face);
        }
        this.image = this.image_list[0];
        this.article_id = this.card.id;
        this.url = `bilibili://article/${this.article_id}`;
        break;
      case 512:
        //番剧
        this.text = this.card.apiSeasonInfo.title;
        this.uname = this.card.new_desc || this.card.index || "未知番剧";
        this.image = this.card.cover;
        this.image_list = [this.image, this.card.apiSeasonInfo.cover];
        this.url = this.card.url;
        this.is_finish = this.card.apiSeasonInfo.is_finish;
        break;
      case 0:
        this.text = this.card.title;
        this.image = this.card.banner_url;
        this.image_list = this.card.image_urls;
        break;
      case 4:
        this.text = this.card.item.content;
        this.image = this.card.user.face;
        break;
      case 1:
        this.text = this.card.item.content;
        this.origin = JSON.parse(this.card.origin);
        $console.info(this.origin);
        if (this.origin.item?.pictures && this.origin.item.pictures_count > 0) {
          this.image = this.origin.item.pictures[0].img_src;
          this.image_list = this.origin.item.pictures;
        } else {
          this.image = this.origin.pic;
        }
        break;
      case 2:
        this.text = this.card.item.description;
        if (this.card.item.pictures_count > 0) {
          this.image = this.card.item.pictures[0].img_src;
          this.image_list = this.card.item.pictures;
        } else {
          this.image = this.card.user.face;
        }
        break;
      case 4308:
        // 直播
        this.text = this.card.live_play_info.title;
        this.image = this.card.live_play_info.cover;
        this.is_live = this.card.live_play_info.live_status === 1;
        this.url = this.card.live_play_info.link;
        break;
      default:
        this.text = this.card?.title || "开发中";
        this.image = this.card?.pic;
    }

    // User info
    if (this.dynamic_type !== 512) {
      // 番剧没有user_profile
      this.uid = desc?.user_profile.info.uid;
      this.uname = desc.user_profile.info.uname;
    }

    //Video info
    this.bvid = desc.bvid;
  }
}
module.exports = {
  DynamicItemData
};
