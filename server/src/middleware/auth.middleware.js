const trash = require('@/utils/ini.unit')
const jwt = require('jsonwebtoken')
const JsonResult = require('@/utils/httpResponse.unit')
const UserModel = require('@/models/user.model')

const auth = () => {
  return async (req, response, next) => {
    try {
      const headers = req.headers
      if (!headers.accesstoken) {
        return JsonResult.httpStatus(req, response, 401, {
          message: 'Authentication failed!',
          code: '9999'
        })
      }
      const decodedToken = jwt.verify(headers.accesstoken, trash.jsonSecretkey)
      const user = await UserModel.findOne({ id: decodedToken.id }, true)
      if (!user) {
        return JsonResult.httpStatus(req, response, 401, {
          message: 'Authentication failed!',
          code: '9999'
        })
      }
      req.sessionuser = user
      next()
    } catch (error) {
      return JsonResult.httpStatus(req, response, 401, {
        message: 'Authentication failed!',
        code: '9999'
      })
    }
  }
}

module.exports = auth
