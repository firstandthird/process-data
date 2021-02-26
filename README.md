# process-data

process-data is a helper function for the indispensable [p-props](https://github.com/sindresorhus/p-props#readme)
library. process-data allows you to pass a string representing a function call to p-props,
instead of being limited to only passing the function call itself.  
This is extremely useful because you frequently have methods that exist in another context
that are not in your current scope where you are calling p-props.  

## Installation

npm install process-data


## Usage
```javascript
const processData = require('process-data');
const fetch = require('fetch');

// a promise-containing object, this is just like what you would normally pass to p-props
// except now you can also pass a function call as a string:
const obj = {
  zombo: fetch('http://zombo.com'),
  widget: 'specialFetch("http://widgetfactory.com")'
}

// you provide a 'context' to process-data, where it can look for the functions you told it to run that might not exist in the current scope:
const context = {
  async specialFetch(address) {
    const { body } = await fetchSomethingElse(address);
    return body;
  }
}

// pass the object and context to processData and it'll
// evaluate everything (including Promises) and return the results:
const res = await processData(object, context);
console.log(res);
/*
{
  zombo: '<!doctype...',
  widget: '<!doctype...'
}
*/

```

## Additional Parameters

__obj__ (required)

An object of fields to be evaluated, any Promises will be resolved and returned.

__context__ (required when passing a function call in string form)

An object containing the context in which strings will be evaluated.

__debug__ (default is false)

Set to true to print out debug info

__log__

If you want to pass your own logging method (eg when you're using processData on a remote server) you can.  Otherwise by default processData will log debug info to console.log
