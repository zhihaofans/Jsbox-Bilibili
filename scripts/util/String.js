class StringUtil {
  constructor() {}
  hasString(string) {
    return typeof string === "string" && string.length > 0;
  }
  isString(string) {
    return typeof string === "string";
  }
}

const stringUtil = new StringUtil();
module.exports = {
  hasString: stringUtil.hasString,
  isString: stringUtil.isString
};
