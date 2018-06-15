const helpers = {
  speak(string) {
    return console.info(`*  ${string}`);
  },
  warn(string) {
    return console.warn(`*  ${string}`);
  },
  error(err, feature) {
    return console.warn(`*  Error with - ${feature} - ${err}`);
  }
};

module.exports = helpers;
