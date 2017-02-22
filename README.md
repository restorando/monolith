# Monolith
Express middleware for your log-to-`statsd` needs.

## Installation

```
npm install --save redo-monolith
```

## Usage

```js
var monolith = require('redo-monolith');
var statsd = monolith({
  host: '127.0.0.1',
  port: 8125,
  queueHeader: 'X-Request-Start'
});
```

### As an `express` middleware

```js
var express = require('express');
var app = express();

function sendFn(params) {
  /**
   *  `params` is an object with the following attributes for logging what you want about the request:
   *  queueDuration: amount of time since the request has been enqueued by `nginx` until the request finishes
   *  requestDuration: amount of time since the request started to be processed by `express` until it finishes
   *  status: a `String` representation of the resulting HTTP status code
   *  req: an `express#Request` object
   *  res: an `express#Response` object
   *  client: a `lynx` instance
   */

  params.client.increment(params.status);
}

app.use(statsd.middleware({ send: sendFn }))
```

### As a standalone statsd client

```js
statsd.client.increment('myMetric');
```