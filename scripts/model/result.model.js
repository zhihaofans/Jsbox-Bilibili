const httpCodeMsg = {
  "-101": "账号未登录",
  "-111": "csrf 校验失败",
  "-400": "请求错误",
  "69800": "网络繁忙 请稍后再试",
  "69801": "你已领取过该权益",
  "0": "成功"
};
function getCodeMsg(code) {
  return httpCodeMsg[code.toString()];
}
module.exports = {
  getCodeMsg
};
