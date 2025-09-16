const $ = require("$");
function getEmoteList() {
  const EmoteService = require("../service/emote.service");
  try {
    $.startLoading();
    EmoteService.getAllEmoteList()
      .then(result => {
        $console.info(result);
        $ui.push({
          props: {
            title: "listview"
          },
          views: [
            {
              type: "list",
              props: {
                data: result.packages.map(emoteItem => emoteItem.text)
              },
              layout: $layout.fill,
              events: {
                didSelect: (sender, indexPath, data) => {
                  const { /*section, */ row } = indexPath;
                  const emoteItem = result.packages[row];
                  $console.info(emoteItem);
                  const emoteList = emoteItem.emote;
                  require("./content.view").openImage({
                    id: "imageEmoteList",
                    title: emoteItem.text,
                    imageList: emoteList.map(item => item.url + "@1q.webp"),
                    onClick: index => {
                      $.startLoading();
                      $quicklook.open({
                        url: emoteList[index].url
                      });
                      $.stopLoading();
                    }
                  });
                }
              }
            }
          ]
        });
      })
      .catch(fail => {
        $console.error(fail);
      })
      .finally(() => {
        $.stopLoading();
      });
  } catch (error) {
    $console.error(error);
  }
}
function init() {
  const list = {
    "Login test": () => {
      try {
        const { LoginView } = require("./account.view");
        new LoginView().checkLoginDataStatus();
      } catch (error) {
        $console.error(error);
      }
    },
    "Emoji test": () => getEmoteList(),
    "直播中心": () => {
      const LiveService = require("../service/live.service");
      new LiveService()
        .getUserInfo()
        .then(result => {
          $console.info(result);
        })
        .catch(error => {
          $console.error(error);
        })
        .finally(() => {
          $.stopLoading();
        });
    },
    "订阅": () => {
      const SubscribeView = require("./subscribe.view");
      new SubscribeView().init();
    },
    "旧个人页面": () => {
      require("./aboutme.view").initOld();
    },
    "双列动态": () => {
      const { DynamicView } = require("./dynamic.view");
      new DynamicView().init();
    },
    "DynamicService": () => {
      const { DynamicService } = require("../service/dynamic.service");
      new DynamicService().getDynamicList().then(result => {
        $console.info(result);
      });
    },
    "漫画": () => {
      const MangaView = require("./manga.view");
      new MangaView().init();
    }
  };
  $ui.push({
    props: {
      title: "TEST"
    },
    views: [
      {
        type: "list",
        props: {
          data: Object.keys(list)
        },
        layout: $layout.fill,
        events: {
          didSelect: (sender, indexPath, data) => {
            const { section, row } = indexPath;
            try {
              list[data]();
            } catch (error) {
              $console.error(error);
            } finally {
            }
          }
        }
      }
    ]
  });
}

module.exports = {
  init
};
