const { body } = require('express-validator')
const UserModel = require('@/models/user.model')

exports.registeruserSchema = [
  body('username')
    .exists()
    .withMessage('username is required')
    .isLength({ min: 5 })
    .withMessage('username must be at least 5 charts')
    .isLength({ max: 16 })
    .withMessage('username must be at longest 16 charts')
    .custom(async username => {
      const exist = await UserModel.findOne({ username }, false)
      if (exist) {
        throw new Error('该用户名已经注册')
      }
      return true
    }),
  body('password')
    .exists()
    .custom(password => {
      if (!password) {
        throw new Error('password is required')
      }
      return true
    }),
  body('code')
    .custom(code => {
      if (!code) {
        throw new Error('code is required')
      }
      return true
    })
]
