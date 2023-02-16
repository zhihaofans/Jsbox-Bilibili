try {
  const app = require("./scripts/app");
  app.init();
} catch (error) {
  $console.error(error);
}
