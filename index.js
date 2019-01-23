const str2fn = require('str2fn');
const pprops = require('p-props');

const register = (server, pluginOptions) => {
  server.decorate('server', 'processData', (obj, request) => {
    const debug = (request.query && request.query.debug === 1);
    if (debug) {
      console.log('DEBUG MODE');
    }
    const allData = {};
    const regex = new RegExp(/^[a-zA-Z.0-9]+\(.*\)$/);

    const getVal = async (val, methods, context) => {
      if (debug) {
        server.log(['debug', 'processData'], { message: `Calling ${val}` });
        console.log(`Calling ${val}`);
      }

      const ret = await str2fn(val, server.methods, context);
      if (debug) {
        server.log(['debug', 'processData'], { message: `Data Returned for ${val}`, data: ret });
        console.log(`Return ${val}`, ret);
      }

      return ret;
    };

    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === 'string' && value.match(regex)) {
        allData[key] = getVal(value, server.methods, { request, obj });
        return;
      }
      allData[key] = value;
    });
    return pprops(allData);
  });
};

exports.plugin = {
  register,
  name: 'hapi-process-data',
  once: true,
  pkg: require('./package.json')
};
