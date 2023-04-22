const UserService = require("../service/user.service");
function showAboutmeView() {}

function init() {
  UserService.getNavData()
    .then(result => {
      $console.info(result);
    })
    .catch(fail => {
      $console.info(fail);
    });
}
module.exports = {
  init
};
