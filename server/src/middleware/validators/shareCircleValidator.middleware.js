const { body } = require('express-validator')

exports.publishShareSchema = [
  body('content')
    .custom(content => {
      if (!content) {
        throw new Error('share_content is required')
      }
      return true
    })
]
