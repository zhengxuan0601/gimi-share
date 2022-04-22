const JsonResult = require('@/utils/httpResponse.unit')
const { validationResult } = require('express-validator')

const awaitHandlerFactory = middleware => {
  return (req, response, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const message = errors.array()[0].msg
      return JsonResult.fail({ req, response, message: message })
    }
    middleware(req, response, next)
  }
}

module.exports = awaitHandlerFactory
