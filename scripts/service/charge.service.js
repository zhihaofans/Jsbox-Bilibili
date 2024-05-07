const Http = require("./http.service");
const AccountService = require("./account.service");
const cookie = AccountService.getCookie(),
  uid = AccountService.getUid();
class ChargeService{
  constructor(){
    
  }
  getMyChargeList(){
    const url="https://api.live.bilibili.com/xlive/revenue/v1/guard/getChargeRecord?page=1&type=1"
      return new Promise((resolve, reject) => {
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
}
module.exports=ChargeService