function hasString(string) {
  return typeof string === "string" && string.length > 0;
}
function isString(string) {
  return typeof string === "string";
}
module.exports = {
  hasString,
  isString
};
