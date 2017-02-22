/**
 * Gets a keyword describing an HTTP status code
 *
 * @param {String} statusCode HTTP status code
 * @return {String} `'success'` if starts with `'1'` or `'2'`, `'unmodified'` if equals `'304'`,
 * `'failure'` if starts with `'4'`, `'error'` if starts with `'5'`, `'invalid_status'` otherwise
 */

export const getStatusType = statusCode => {
  if (statusCode[0] === '1' || statusCode[0] === '2') {
    return 'success'
  } else if (statusCode === '304') {
    return 'unmodified'
  } else if (statusCode[0] === '3') {
    return 'redirect'
  } else if (statusCode[0] === '4') {
    return 'failure'
  } else if (statusCode[0] === '5') {
    return 'error'
  } else {
    return 'invalid_status'
  }
}

/**
 * Gets the time in ms since the request started
 *
 * @return {Number} Time in ms since the request started
 */

export const getRequestDuration = startTime => new Date().getTime() - startTime

/**
 * Gets the time in ms since the request has been enqueued in the web server
 *
 * @return {Number} The time in ms since the request has been enqueued
 */

export const getQueueDuration = (req, queueHeader) => req.header(queueHeader)
  ? new Date().getTime() - req.header(queueHeader)
  : null
