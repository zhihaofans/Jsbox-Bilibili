class HttpUtil {
  constructor() {}
  addParamsToUrl(params) {
    //const params = {aaa: "aaa"};
    const keys = Object.keys(params);
    if (keys.length === 0) {
      return "";
    }
    let paramsStr = "?";
    keys.map(key => {
      if (paramsStr != "?") {
        paramsStr += "&";
      }
      paramsStr += key + "=" + $text.URLEncode(params[key]);
    });
    return paramsStr;
  }
  concatUrlParams(url, params) {
    let newUrl = url;
    if (params != undefined && Object.keys(params).length > 0) {
      if (url.includes("?")) {
        newUrl = url.substring(0, url.indexOf("?"));
      }
      newUrl += this.addParamsToUrl(params);
    }
    return newUrl;
  }
  getCookieObject(cookie) {
    if (cookie) {
      const cookieResult = {};
      cookie.split(";").map(cookieItem => {
        const itemSplit = cookieItem.trim().split("="),
          itemKey = itemSplit[0],
          itemValve = itemSplit[1];
        cookieResult[itemKey] = itemValve;
      });
      return cookieResult;
    } else {
      return undefined;
    }
  }
}
class HttpService {
  constructor() {
    this.TIMEOUT = 5;
  }
  setTimeout(number) {
    this.TIMEOUT = number || 5;
  }
  async get({ url, header, params }) {
    const newUrl = this.concatUrlParams(url, params);
    return await $http.get({
      url: newUrl,
      timeout: this.TIMEOUT,
      header: header
    });
  }
  async post({ url, header, body, params }) {
    return await $http.post({
      url: this.concatUrlParams(url, params),
      header,
      timeout: this.TIMEOUT,
      body
    });
  }
  getAsync({
    url,
    params,
    header,
    handler = resp => {
      const data = resp.data;
    }
  }) {
    $http.get({
      url: this.concatUrlParams(url, params),
      params,
      header,
      timeout: this.TIMEOUT,
      handler
    });
  }
  postAsync({
    url,
    params,
    body,
    header,
    handler = resp => {
      const data = resp.data;
    }
  }) {
    $http.post({
      url: this.concatUrlParams(url, params),
      header,
      body,
      timeout: this.TIMEOUT,
      handler
    });
  }
  getCallback({ url, params, header, callback }) {
    $http.get({
      url: this.concatUrlParams(url, params),
      params,
      header,
      timeout: this.TIMEOUT,
      handler: resp => {
        callback(resp.data);
      }
    });
  }
  postCallback({ url, params, body, header, callback }) {
    $http.post({
      url: this.concatUrlParams(url, params),
      header,
      body,
      timeout: this.TIMEOUT,
      handler: resp => {
        callback(resp.data);
      }
    });
  }
  getThen({ url, params, header }) {
    return $http.get({
      url: this.concatUrlParams(url, params),
      header
    });
  }
  addParamsToUrl(params) {
    //const params = {aaa: "aaa"};
    const keys = Object.keys(params);
    if (keys.length === 0) {
      return "";
    }
    let paramsStr = "?";
    keys.map(key => {
      if (paramsStr != "?") {
        paramsStr += "&";
      }
      paramsStr += key + "=" + $text.URLEncode(params[key]);
    });
    return paramsStr;
  }
  concatUrlParams(url, params) {
    let newUrl = url;
    if (params != undefined && Object.keys(params).length > 0) {
      if (url.includes("?")) {
        newUrl = url.substring(0, url.indexOf("?"));
      }
      newUrl += this.addParamsToUrl(params);
    }
    return newUrl;
  }
  getCookieObject(cookie) {
    if (cookie) {
      const cookieResult = {};
      cookie.split(";").map(cookieItem => {
        const itemSplit = cookieItem.trim().split("="),
          itemKey = itemSplit[0],
          itemValve = itemSplit[1];
        cookieResult[itemKey] = itemValve;
      });
      return cookieResult;
    } else {
      return undefined;
    }
  }
  getParamsFromUrl(URL) {
    return JSON.parse(
      '{"' +
        decodeURI(URL.split("?")[1])
          .replace(/"/g, '\\"')
          .replace(/&/g, '","')
          .replace(/=/g, '":"') +
        '"}'
    );
  }
}
module.exports = {
  HttpService,
  HttpUtil
};