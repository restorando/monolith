import Lynx from 'lynx'
import microtime from 'microtime'
import { getQueueDuration, getRequestDuration, getStatusType } from './helpers'

const noop = () => undefined

/**
 * Convert a time in seconds to milliseconds
 * @param {Number} seconds A time in seconds
 * @return {Number} The same time, but in milliseconds
 */

const toMilliseconds = seconds => seconds * 1000

export default ({ host, port, queueHeader }) => {
  const client = new Lynx(host, port)

  const middleware = ({ send = noop } = {}) => (req, res, next) => {
    const startTime = microtime.nowDouble()

    const sendData = () => send({
      client,
      queueDuration: toMilliseconds(getQueueDuration(req, queueHeader, startTime)),
      requestDuration: toMilliseconds(getRequestDuration(startTime)),
      status: getStatusType(res.statusCode.toString()),
      req,
      res
    })

    const cleanup = () => {
      res.removeListener('finish', sendData)
      res.removeListener('error', cleanup)
      res.removeListener('close', cleanup)
    }

    res.once('finish', sendData)
    res.once('error', cleanup)
    res.once('close', cleanup)

    next()
  }

  return {
    client,
    middleware
  }
}
