'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lynx = require('lynx');

var _lynx2 = _interopRequireDefault(_lynx);

var _helpers = require('./helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var host = _ref.host;
  var port = _ref.port;
  var send = _ref.send;
  var queueHeader = _ref.queueHeader;

  var client = new _lynx2.default(host, port);

  var middleware = function middleware(req, res, next) {
    var startTime = new Date().getTime();

    var sendData = function sendData() {
      return send({
        client: client,
        queueDuration: (0, _helpers.getQueueDuration)(req, queueHeader),
        requestDuration: (0, _helpers.getRequestDuration)(startTime),
        status: (0, _helpers.getStatusType)(req.status),
        req: req,
        res: res
      });
    };

    var cleanup = function cleanup() {
      res.removeListener('finish', sendData);
      res.removeListener('error', cleanup);
      res.removeListener('close', cleanup);
    };

    res.once('finish', sendData);
    res.once('error', cleanup);
    res.once('close', cleanup);
  };

  return {
    client: client,
    middleware: middleware
  };
};