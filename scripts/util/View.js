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
class ViewKit {
  constructor() {}
  showView(viewData) {
    $ui.window === undefined ? $ui.render(viewData) : $ui.push(viewData);
  }
}
module.exports = { ImageView, ListView };
