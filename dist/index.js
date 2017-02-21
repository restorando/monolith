'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lynx = require('lynx');

var _lynx2 = _interopRequireDefault(_lynx);

var _helpers = require('./helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var noop = function noop() {
  return undefined;
};

exports.default = function (_ref) {
  var host = _ref.host;
  var port = _ref.port;
  var queueHeader = _ref.queueHeader;

  var client = new _lynx2.default(host, port);

  var middleware = function middleware() {
    var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var _ref2$send = _ref2.send;
    var send = _ref2$send === undefined ? noop : _ref2$send;
    return function (req, res, next) {
      var startTime = new Date().getTime();

      var sendData = function sendData() {
        return send({
          client: client,
          queueDuration: (0, _helpers.getQueueDuration)(req, queueHeader),
          requestDuration: (0, _helpers.getRequestDuration)(startTime),
          status: (0, _helpers.getStatusType)(res.statusCode.toString()),
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

      next();
    };
  };

  return {
    client: client,
    middleware: middleware
  };
};