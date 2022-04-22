const log = require('@/utils/logo.unit')

const JsonResult = {
  success: ({ req, response, message = 'success', data = null }) => {
    response.send({
      code: '0',
      data,
      message
    })
    const SUCCESSLOG = {
      path: req.originalUrl,
      parmas: {
        ...req.query,
        ...req.body
      },
      method: req.method,
      message
    }
    log.logger.info(JSON.stringify(SUCCESSLOG))
  },

  fail: ({ req, response, error, message }) => {
    response.send({
      code: '-1',
      data: null,
      message: message
    })
    const ERRLOG = {
      path: req.originalUrl,
      parmas: {
        ...req.query,
        ...req.body
      },
      method: req.method,
      message
    }
    log.logger.error(error || JSON.stringify(ERRLOG))
  },

  httpStatus: (req, response, status, object) => {
    response.status(status).send(object)
    const ERRLOG = {
      path: req.originalUrl,
      parmas: {
        ...req.query,
        ...req.body
      },
      method: req.method,
      status,
      message: object
    }
    log.logger.error(JSON.stringify(ERRLOG))
  }
}

module.exports = JsonResult
