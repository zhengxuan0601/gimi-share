const log4js = require('log4js')
const path = require('path')

log4js.addLayout('json', function (config) {
  return function (logEvent) {
    return JSON.stringify(logEvent) + config.separator
  }
})

log4js.configure({
  appenders: {
    console: {
      type: 'console'
    },
    out: {
      type: 'file',
      filename: path.join(__dirname, '../../../serverlog/gimilog.log'),
      maxLogSize: 1024 * 1024 * 500
    }
  },
  categories: {
    default: {
      appenders: ['console', 'out'],
      level: 'info'
    }
  }
})
const logger = log4js.getLogger('gimi-logs')
exports.logger = logger
