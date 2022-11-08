const { AppKernel, ModLoader } = require("CoreJS"),
  $ = require("$"),
  modList = ["ui.js", "user.js", "vip.js"];
class App extends AppKernel {
  constructor({ appId, modDir, l10nPath }) {
    super({ appId, modDir, l10nPath });
    this.ModLoader = new ModLoader({
      app: this,
      appMode: true,
      modDir,
      modList
    });
  }
  init() {
    try {
      this.ModLoader.setAppModeIndexMod("ui");
      this.ModLoader.autoRunMod();
    } catch (error) {
      $console.error(error);
    } finally {
      $.info(`启动耗时${new Date().getTime() - this.START_TIME}ms`);
    }
  }
}
function run() {
  try {
    const app = new App({
      appId: "jsbox.bilibili",
      modDir: "/scripts/mods/",
      l10nPath: "/strings/l10n.js"
    });
    app.init();
  } catch (error) {
    $console.error(error);
    $ui.alert({
      title: "app.js throw",
      message: error.name + "\n" + error.message,
      actions: [
        {
          title: "OK",
          disabled: false, // Optional
          handler: () => {}
        }
      ]
    });
  }
}
module.exports = {
  run
};
