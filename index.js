const str2fn = require('str2fn');
const pprops = require('p-props');

module.exports = (obj, context, debug, log) => {
  if (debug) {
    log(['debug', 'process-data'], { message: 'process-data-called in debug mode' });
  }
  const allData = {};
  const regex = new RegExp(/^[a-zA-Z.0-9]+\(.*\)$/);

  const getVal = async (val, ctx) => {
    if (debug) {
      log(['debug', 'process-data'], { messaage: `Calling ${val}` });
    }

    const ret = await str2fn(val, ctx);
    if (debug) {
      log(['debug', 'process-data'], { message: `Data Returned for:  ${val}`, data: ret });
    }

    return ret;
  };

  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === 'string' && value.match(regex)) {
      allData[key] = getVal(value, context);
      return;
    }
    allData[key] = value;
  });
  return pprops(allData);
};
