class ListView {
  constructor() {
    this.ViewKit = new ViewKit();
  }
  showSimpleText(title, textList, didSelect = index => {}) {
    const view = {
      props: {
        title
      },
      views: [
        {
          type: "list",
          props: {
            autoRowHeight: this.AUTO_ROW_HEIGHT,
            estimatedRowHeight: this.ESTIMATED_ROW_HEIGHT,
            data: textList
          },
          layout: $layout.fill,
          events: {
            didSelect: (sender, indexPath, data) => {
              didSelect(indexPath.row);
            }
          }
        }
      ]
    };
    this.ViewKit.showView(view);
  }
  showTemplateView(title, template, data, selector = result => {}) {
    const view = {
      props: {
        title
      },
      views: [
        {
          type: "list",
          props: {
            autoRowHeight: this.AUTO_ROW_HEIGHT,
            estimatedRowHeight: this.ESTIMATED_ROW_HEIGHT,
            data,
            template
          },
          layout: $layout.fill,
          events: {
            didSelect: (sender, indexPath, data) => {
              //didSelect(indexPath.row);
              $console.info({
                indexPath,
                data
              });
            }
          }
        }
      ]
    };
    this.ViewKit.showView(view);
  }
}
class ImageView {
  constructor() {
    this.ViewKit = new ViewKit();
  }
  showImageAndButton({
    title,
    imageUrl,
    imageData,
    buttonTitle,
    buttonTapped
  }) {
    this.ViewKit.showView({
      props: {
        title
      },
      views: [
        {
          type: "image",
          props: {
            src: imageUrl,
            image: imageData,
            contentMode: $contentMode.scaleAspectFit
          },
          layout: (make, view) => {
            make.top.left.right.equalTo(view.super);
            make.height.equalTo(view.width);
          }
        },
        {
          type: "button",
          props: {
            title: buttonTitle,
            bgcolor: $color("#007AFF"),
            titleColor: $color("white")
          },
          layout: (make, view) => {
            make.centerX.equalTo(view.super);
            make.top.equalTo(view.prev.bottom).offset(20);
            make.size.equalTo($size(100, 40));
          },
          events: {
            tapped: sender => {
              buttonTapped(sender);
            }
          }
        }
      ]
    });
  }
  showImageAndTwoButton({
    title,
    imageUrl,
    imageData,
    buttonOneTitle,
    buttonOneTapped,
    buttonTwoTitle,
    buttonTwoTapped
  }) {
    this.ViewKit.showView({
      props: {
        title
      },
      views: [
        {
          type: "image",
          props: {
            src: imageUrl,
            image: imageData,
            contentMode: $contentMode.scaleAspectFit
          },
          layout: (make, view) => {
            make.top.left.right.equalTo(view.super);
            make.height.equalTo(view.width);
          }
        },
        {
          type: "button",
          props: {
            title: buttonOneTitle,
            bgcolor: $color("#007AFF"),
            titleColor: $color("white")
          },
          layout: (make, view) => {
            make.centerX.equalTo(view.super);
            make.top.equalTo(view.prev.bottom).offset(20);
            make.size.equalTo($size(100, 40));
          },
          events: {
            tapped: sender => {
              buttonOneTapped(sender);
            }
          }
        },
        {
          type: "button",
          props: {
            title: buttonTwoTitle,
            bgcolor: $color("#007AFF"),
            titleColor: $color("white")
          },
          layout: (make, view) => {
            make.centerX.equalTo(view.super);
            make.top.equalTo(view.prev.bottom).offset(20);
            make.size.equalTo($size(100, 40));
          },
          events: {
            tapped: sender => {
              buttonTwoTapped(sender);
            }
          }
        }
      ]
    });
  }
}
class NavView {
  constructor() {
    this.ViewKit = new ViewKit();
  }
  setItemClicked({ view }) {}
  getNavView({
    items = [{ title: "主页", icon: "square.grid.2x2.fill", func: () => {} }]
  }) {
    //$ui.render("main");
    const mIconSymbols = [
      "square.grid.2x2.fill",
      "square.and.arrow.down.fill",
      "person.fill"
    ];
    return {
      type: "matrix",
      props: {
        id: "tab",
        columns: 3,
        itemHeight: 50,
        spacing: 0,
        scrollEnabled: false,
        bgcolor: $color("clear"),
        template: [
          {
            type: "view",
            layout: (make, view) => {
              make.size.equalTo(view.super);
              make.center.equalTo(view.super);
            },
            views: [
              {
                type: "image",
                props: {
                  id: "menu_image",
                  resizable: true,
                  clipsToBounds: false
                },
                layout: (make, view) => {
                  make.centerX.equalTo(view.super);
                  make.size.equalTo($size(25, 25));
                  make.top.inset(6);
                }
              },
              {
                type: "label",
                props: {
                  id: "menu_label",
                  font: $font(10)
                },
                layout: (make, view) => {
                  var preView = view.prev;
                  make.centerX.equalTo(preView);
                  make.bottom.inset(5);
                }
              }
            ]
          }
        ],
        data: [
          {
            menu_image: {
              symbol: mIconSymbols[0],
              tintColor: $color("gray")
            },
            menu_label: {
              text: "应用",
              textColor: $color("gray")
            }
          },
          {
            menu_image: {
              symbol: mIconSymbols[1],
              tintColor: $color("gray")
            },
            menu_label: {
              text: "更新",
              textColor: $color("gray")
            }
          },
          {
            menu_image: {
              symbol: mIconSymbols[2],
              tintColor: $color("gray")
            },
            menu_label: {
              text: "我的",
              textColor: $color("gray")
            }
          }
        ]
      },
      layout: (make, view) => {
        make.bottom.inset(0);
        if ($device.info.screen.width > 500) {
          make.width.equalTo(500);
        } else {
          //make.left.right.inset(0);
        }
        make.centerX.equalTo(view.super);
        make.height.equalTo(50);
      },
      events: {
        didSelect(sender, indexPath, data) {
          $console.info(indexPath.row);
        }
      }
    };
  }
}
class PageView {
  constructor() {}
  genLoadingView(opi) {
    const { id = "loadingPage", text = "正在载入..." } = opi || {
      id: "loadingPage",
      text: "正在载入..."
    };
    return {
      type: "view",
      props: {
        id: id ? id : ""
      },
      layout: function (make, view) {
        make.center.equalTo(view.super);
        make.size.equalTo($size(40, 40));
      },
      views: [
        {
          type: "spinner",
          props: {
            loading: true,
            style: 2,
            bgcolor: $color("clear")
          },
          layout: (make, view) => {
            make.top.inset(0);
            make.centerX.equalTo(view.super);
          }
        },
        {
          type: "label",
          props: {
            text: text,
            align: $align.center,
            font: $font(12),
            textColor: $color("darkGray")
          },
          layout: (make, view) => {
            make.centerX.equalTo(view.super);
            make.bottom.inset(0);
          }
        }
      ]
    };
  }
}
class GridView {
  constructor() {
    this.ViewKit = new ViewKit();
  }
  getGridData({
    itemList,
    title,
    columns,
    callback = (idx, data) => {},
    itemHeight,
    spacing,
    itemColor
  }) {
    const viewData = {
      type: "matrix",
      props: {
        id: "tab",
        columns: columns || 3,
        itemHeight: itemHeight || 90,
        spacing: spacing || 5,
        scrollEnabled: false,
        template: [
          {
            type: "view",
            layout: (make, view) => {
              make.size.equalTo(view.super);
              make.center.equalTo(view.super);
            },
            views: [
              {
                type: "image",
                props: {
                  id: "menu_image",
                  resizable: true,
                  clipsToBounds: false
                },
                layout: (make, view) => {
                  make.centerX.equalTo(view.super);
                  make.size.equalTo($size(50, 50));
                  make.top.inset(6);
                }
              },
              {
                type: "label",
                props: {
                  id: "menu_label",
                  font: $font(10)
                },
                layout: (make, view) => {
                  var preView = view.prev;
                  make.centerX.equalTo(preView);
                  make.bottom.inset(5);
                }
              }
            ]
          }
        ],
        data: itemList.map(item => {
          return {
            menu_image: {
              symbol: item.icon,
              tintColor: itemColor || $color("gray")
            },
            menu_label: {
              text: item.title,
              textColor: itemColor || $color("gray")
            }
          };
        })
      },
      layout: $layout.fill,
      events: {
        didSelect(sender, indexPath, data) {
          callback ? callback(indexPath.row, data) : undefined;
        }
      }
    };
    return viewData;
  }
  showGrid3({ itemList, title, callback = (idx, data) => {} }) {
    const viewData = this.getGridData({
      itemList,
      callback
    });
    this.ViewKit.showView({
      props: {
        title
      },
      views: [viewData]
    });
  }
}
class ViewKit {
  constructor() {}
  showView(viewData) {
    $ui.window === undefined ? $ui.render(viewData) : $ui.push(viewData);
  }
}
const ViewTemplate = {
  getImage: ({ id, props, src, layout, events, tapped }) => {
    return {
      type: "image",
      props: props || {
        id,
        src
      },
      layout,
      events: events || {
        tapped
      }
    };
  },
  getLabel: ({ id, props, text, layout, events, tapped, lines }) => {
    return {
      type: "label",
      props: props || {
        id,
        text,
        align: $align.center,
        lines: lines || 1
      },
      layout,
      events: events || {
        tapped
      }
    };
  }
};
module.exports = {
  GridView,
  ImageView,
  ListView,
  NavView,
  PageView,
  ViewKit,
  ViewTemplate
};
