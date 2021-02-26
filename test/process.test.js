const tap = require('tap');
const Hapi = require('hapi');
const plugin = require('../index.js');

const sleep = function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};

tap.test('can instantiate and object', async t => {
  const server = new Hapi.Server({ port: 8080 });
  await server.register({ plugin });

  server.method('doSomething', (arg) => `Something to do with ${arg}`);
  server.method('waitOn', async (arg) => {
    await sleep(200);
    return `Sleeping and then getting ${arg}`;
  });
  await server.start();
  const obj = {
    key: 'doSomething("string")',
    key2: 'more',
    key3: 'less',
    key4: 'waitOn("charlie")'
  };

  try {
    const res = await server.processData(obj, { query: { debug: 1 } });
    console.log(res); // eslint-disable no-console;
  } catch (e) {
    console.log(e);
  }
  await server.stop();

  t.end();
});
