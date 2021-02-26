const str2fn = require('str2fn');
const pprops = require('p-props');

const register = (server, options) => {
  const processData = (obj, context, debug, log) => {
    context = Object.assign(server.methods, context);
    if (debug) {
      log({ message: 'process-data-called in debug mode' });
    }
    const allData = {};
    const regex = new RegExp(/^[a-zA-Z.0-9]+\(.*\)$/);

    const getVal = async (val, ctx) => {
      if (debug) {
        log({ messaage: `Calling ${val}` });
      }
      const ret = await str2fn(val, ctx);
      if (debug) {
        log({ message: `Data Returned for:  ${val}`, data: ret });
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
  server.decorate('server', 'processData', processData);
};


exports.plugin = {
  register,
  once: true,
  pkg: require('./package.json')
};
