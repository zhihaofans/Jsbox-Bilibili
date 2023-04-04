const getParameters = URL => {
  try {
    return JSON.parse(
      '{"' +
        decodeURI(URL.split("?")[1])
          .replace(/"/g, '\\"')
          .replace(/&/g, '","')
          .replace(/=/g, '":"') +
        '"}'
    );
  } catch (error) {
    $console.error(error);
    return undefined;
  }
};
module.exports = {
  getParameters
};
