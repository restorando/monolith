'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Gets a keyword describing an HTTP status code
 *
 * @param {String} statusCode HTTP status code
 * @return {String} `'success'` if starts with `'1'` or `'2'`, `'unmodified'` if equals `'304'`,
 * `'failure'` if starts with `'4'`, `'error'` if starts with `'5'`, `'invalid_status'` otherwise
 */

var getStatusType = exports.getStatusType = function getStatusType(statusCode) {
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

var getRequestDuration = exports.getRequestDuration = function getRequestDuration(startTime) {
  return new Date().getTime() - startTime;
};

/**
 * Gets the time in ms since the request has been enqueued in the web server
 *
 * @return {Number} The time in ms since the request has been enqueued
 */

var getQueueDuration = exports.getQueueDuration = function getQueueDuration(req, queueHeader) {
  return req.header(queueHeader) ? new Date().getTime() - req.header(queueHeader) : null;
};