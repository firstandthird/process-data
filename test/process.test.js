const tap = require('tap');
const processData = require('../index.js');

const sleep = function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};

tap.test('can instantiate and object', async t => {
  const context = {
    doSomething(arg) {
      return `Something to do with ${arg}`
    },
    async waitOn(arg) {
      await sleep(200);
      return `Sleeping and then getting ${arg}`;
    }
  }
  const getMore = async() => {
    await sleep(300);
    return 'more';
  }
  const obj = {
    key: 'doSomething("string")',
    key2: getMore(),
    key3: 'less',
    key4: 'waitOn("charlie")'
  };

  const res = await processData(obj, context);
  t.match(res, {
    key: 'Something to do with string',
    key2: 'more',
    key3: 'less',
    key4: 'Sleeping and then getting charlie'
  });
  t.end();
});

tap.test('can log debug info', async t => {
  const context = {
    doSomething(arg) {
      return `Something to do with ${arg}`
    },
    async waitOn(arg) {
      await sleep(200);
      return `Sleeping and then getting ${arg}`;
    }
  }
  const getMore = async() => {
    await sleep(300);
    return 'more';
  }
  const obj = {
    key: 'doSomething("string")',
    key2: getMore(),
    key3: 'less',
    key4: 'waitOn("charlie")'
  };

  const logs = [];
  await processData(obj, context, true, (input) => logs.push(input));
  t.match(logs, [
    { message: 'process-data-called in debug mode' },
    { messaage: 'Calling doSomething("string")' },
    { messaage: 'Calling waitOn("charlie")' },
    {
      message: 'Data Returned for:  doSomething("string")',
      data: 'Something to do with string'
    },
    {
      message: 'Data Returned for:  waitOn("charlie")',
      data: 'Sleeping and then getting charlie'
    }
  ]);
  t.end();
});
