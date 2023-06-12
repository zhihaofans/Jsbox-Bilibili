class DynamicItemData {
  constructor({ card, desc }) {
    this.card = JSON.parse(card);
    //$console.info(this.card);
    // Dynamic info
    this.dynamic_id = desc.dynamic_id;
    this.dynamic_type = desc.type; //8:视频,4308:直播,2:图文动态,1:转发,4:文字动态
    switch (this.dynamic_type) {
      case 4:
        this.text = this.card.item.content;
        this.image = this.card.user.face;

        break;
      case 1:
        this.text = this.card.item.content;
        this.origin = JSON.parse(this.card.origin);
        $console.info(this.origin);

        if (this.origin.item.pictures_count > 0) {
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
        this.text = this.card.live_play_info.title;
        this.image = this.card.live_play_info.cover;
        break;
      default:
        this.text = this.card?.title || "开发中";
        this.image = this.card?.pic;
    }

    // User info
    this.uid = desc.user_profile.info.uid;
    this.uname = desc.user_profile.info.uname;

    //Video info
    this.bvid = desc.bvid;
  }
}
module.exports = {
  DynamicItemData
};
