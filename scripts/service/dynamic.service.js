const Http = require("./http.service");
const AccountService = require("./account.service");
const cookie = AccountService.getCookie(),
  uid = AccountService.getUid();
const { DynamicItemData } = require("../model/dynamic.model");
function getDynamicList() {
  return new Promise((resolve, reject) => {
    const url = `https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/dynamic_new?uid=${uid}&type_list=268435455&from=weball&platform=web`;
    try {
      $console.info("trystart");
      Http.getThen({
        url,
        header: {
          cookie
        }
      })
        .then(data => {
          resolve(data.data);
        })
        .catch(fail => reject(fail));
      $console.info("try");
    } catch (error) {
      $console.error(error);
      reject(error);
    }
  });
}

function getDynamic() {
  return new Promise((resolve, reject) => {
    const url =
      "https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/w_dyn_uplist";
    try {
      $console.info("trystart");
      Http.getThen({
        url,
        header: {
          cookie
        }
      })
        .then(data => {
          resolve(data.data);
        })
        .catch(fail => reject(fail));
      $console.info("try");
    } catch (error) {
      $console.error(error);
      reject(error);
    }
  });
}
module.exports = {
  getDynamic,
  getDynamicList
};
