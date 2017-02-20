'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.middleware = undefined;

var _expressStatsd = require('express-statsd');

var _expressStatsd2 = _interopRequireDefault(_expressStatsd);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Initializes `express-statsd` middleware with host and port from the config file. This must be placed as
 * the first middleware in order to collect information from the entire request lifecycle.
 */

var middleware = exports.middleware = function middleware(_ref) {
  var appName = _ref.appName;
  var host = _ref.host;
  var port = _ref.port;
  var queueHeader = _ref.queueHeader;
  return (0, _expressStatsd2.default)({
    host: host,
    port: port,
    sendStats: function sendStats(req, res, client, startTime, options) {
      /**
       * Gets a keyword describing an HTTP status code
       *
       * @param {String} statusCode HTTP status code
       * @return {String} `'success'` if starts with `'1'` or `'2'`, `'unmodified'` if equals `'304'`,
       * `'failure'` if starts with `'4'`, `'error'` if starts with `'5'`, `'invalid_status'` otherwise
       */

      var getStatusType = function getStatusType(statusCode) {
        if (statusCode[0] === '1' || statusCode[0] === '2') {
          return 'success';
        } else if (statusCode === '304') {
          return 'unmodified';
        } else if (statusCode[0] === '3') {
          return 'redirect';
        } else if (statusCode[0] === '4') {
          return 'failure';
        } else if (statusCode[0] === '5') {
          return 'error';
        } else {
          return 'invalid_status';
        }
      };

      /**
       * Gets the time in ms since the request started
       *
       * @return {Number} Time in ms since the request started
       */

      var getRequestDuration = function getRequestDuration() {
        return new Date().getTime() - startTime;
      };

      /**
       * Gets the time in ms since the request has been enqueued in the web server
       *
       * @return {Number} The time in ms since the request has been enqueued
       */

      var getQueueDuration = function getQueueDuration() {
        return req.header(queueHeader) ? new Date().getTime() - req.header(queueHeader) : null;
      };

      /* Get and normalize the request method (e.g., `'get'`, `'post'`, `'put'`) */
      var method = req.method ? req.method.toLowerCase() : 'unknown_method';
      /* Transform the URL (e.g., for `/foo/bar` => `.foo.bar`) */
      var path = req.baseUrl ? req.baseUrl.replace(new RegExp('/', 'g'), '.') : '';
      /* Build the metric name (e.g., `redo-graphql.request.post.graphql`) */
      var metricName = appName + '.request.' + method + path;

      /* Report counters */

      /* Report the increment of this status code (e.g., `redo-graphql.request.post.graphql.status-200:1|c`) */
      client.increment(metricName + '.status-' + res.statusCode);
      /* Report the increment of this status result (e.g., `redo-graphql.request.post.graphql.success:1|c`) */
      client.increment(metricName + '.' + getStatusType(res.statusCode.toString()));

      /* Report timers */

      /* Report the time of the request duration (e.g., `redo-graphql.request.post.graphql:4|ms`) */
      client.timing(metricName, getRequestDuration());

      /* Report the time the request has been in queue (e.g., `redo-graphql.request.post.graphql.queue:5|ms`) */
      var queueDuration = getQueueDuration();
      if (queueDuration) {
        client.timing(metricName + '.queue', queueDuration);
      }
    }
  });
};