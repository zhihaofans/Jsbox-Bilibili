const TYPE_STR_LIST = {
  0: "文章",
  2: "图片",
  1: "转发",
  4: "文字",
  8: "视频",
  64: "专栏",
  256: "音频",
  512: "番剧",
  2048: "活动",
  4300: "收藏类动态",
  4308: "直播"
};
const TYPE_STR_LIST_NEW = {
  "DYNAMIC_TYPE_NONE": "无效动态",
  "DYNAMIC_TYPE_FORWARD": "动态转发",
  "DYNAMIC_TYPE_AV": "投稿视频",
  "DYNAMIC_TYPE_PGC": "剧集（番剧、电影、纪录片）",
  "DYNAMIC_TYPE_COURSES": "",
  "DYNAMIC_TYPE_WORD": "纯文字动态",
  "DYNAMIC_TYPE_DRAW": "带图动态",
  "DYNAMIC_TYPE_ARTICLE": "投稿专栏",
  "DYNAMIC_TYPE_MUSIC": "音乐",
  "DYNAMIC_TYPE_COMMON_SQUARE": "装扮、剧集点评、普通分享",
  //"DYNAMIC_TYPE_COMMON_VERTICAL": "",
  "DYNAMIC_TYPE_LIVE": "直播间分享",
  "DYNAMIC_TYPE_MEDIALIST": "收藏夹",
  "DYNAMIC_TYPE_COURSES_SEASON": "课程",
  //"DYNAMIC_TYPE_COURSES_BATCH": "",
  //"DYNAMIC_TYPE_AD": "",
  //"DYNAMIC_TYPE_APPLET": "",
  //"DYNAMIC_TYPE_SUBSCRIPTION": "",
  "DYNAMIC_TYPE_LIVE_RCMD": "直播开播",
  //"DYNAMIC_TYPE_BANNER": "",
  "DYNAMIC_TYPE_UGC_SEASON": "合集更新",
  //"DYNAMIC_TYPE_SUBSCRIPTION_NEW": ""
};
class DynamicItemData {
  constructor({ card, desc }) {
    this.card = JSON.parse(card);
    $console.warn(this.card);
    $console.info(desc);
    // Dynamic info
    this.dynamic_id = desc.dynamic_id;
    this.dynamic_id_str = desc.dynamic_id_str;
    this.dynamic_type = desc.type; //8:视频,4308:直播,2:图文动态,1:转发,4:文字动态,0:文章,512:番剧,64:视频笔记
    this.dynamic_type_str = TYPE_STR_LIST[this.dynamic_type] || "未知类型";
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
class NewDynamicItemData {
  constructor(item) {
    this.modules = item.modules;
    this.id_str = item.id_str;
    this.type = item.type;
    this.type_str = TYPE_STR_LIST_NEW[item.type]||item.type
    this.visible = item.visible;
    this.author_id = item.modules.module_author.mid;

    this.author_face = item.modules.module_author.face;
    this.cover = this.author_face;
    switch (item.type) {
      //转发动态
      case "DYNAMIC_TYPE_DRAW":
        this.text = this.modules.module_dynamic.desc.text;
        this.images = this.modules.module_dynamic.major.draw.items.map(
          it => it.src
        );
        this.cover = this.images[0];
        break;
      case "DYNAMIC_TYPE_FORWARD":
        this.origin_dynamic = item?.orig;
        this.text = this.modules.module_dynamic.desc.text;
        if (this.origin_dynamic != undefined) {
          this.origin_dynamic_data = new NewDynamicItemData(
            this.origin_dynamic
          );
          this.type_str+="\n"+this.origin_dynamic_data.type_str
          this.cover = this.origin_dynamic_data.cover || this.cover;
        }

        break;
      case "DYNAMIC_TYPE_LIVE_RCMD":
        this.content =
          JSON.parse(this.modules.module_dynamic.major.live_rcmd.content) || {};
        $console.warn(this.content);
        this.text = "[直播]" + this.content.live_play_info.title;
        break;
      case "DYNAMIC_TYPE_AV":
        this.text = this.modules.module_dynamic.major.archive.title;
        this.cover = this.modules.module_dynamic.major.archive.cover;
        this.url = this.modules.module_dynamic.major.archive.jump_url;
        this.bvid = this.modules.module_dynamic.major.archive.bvid;
        break;
      case "DYNAMIC_TYPE_PGC_UNION":
        this.text = this.modules.module_dynamic.major.pgc.title;
        break;
      case "DYNAMIC_TYPE_WORD":
        this.text = this.modules.module_dynamic.desc.text;
        break;
      case "DYNAMIC_TYPE_ARTICLE":
        this.text = this.modules.module_dynamic.major.article.title;
        this.url = this.modules.module_dynamic.major.article.jump_url;
        this.images = this.modules.module_dynamic.major.article.covers;
        break;
    }
    //this.cover =this.modules.module_dynamic?.additional?.common?.cover ||
    //this.text=this.modules.module_dynamic?.desc.text
    $console.warn(this.type_str);
    this.author_name = item.modules.module_author.name + "\n" + this.type_str;
  }
}
module.exports = {
  DynamicItemData,
  NewDynamicItemData
};
