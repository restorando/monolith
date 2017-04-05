import Lynx from 'lynx'
import microtime from 'microtime'
import { getQueueDuration, getRequestDuration, getStatusType } from './helpers'

const noop = () => undefined

export default ({ host, port, queueHeader }) => {
  const client = new Lynx(host, port)

  const middleware = ({ send = noop } = {}) => (req, res, next) => {
    const startTime = microtime.nowDouble()

    const sendData = () => send({
      client,
      queueDuration: getQueueDuration(req, queueHeader, startTime),
      requestDuration: getRequestDuration(startTime),
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
