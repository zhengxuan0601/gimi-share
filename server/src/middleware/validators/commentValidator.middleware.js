const { body, query } = require('express-validator')

exports.submitCommentShema = [
  body('content')
    .custom(content => {
      if (!content) {
        throw new Error('comment content is required')
      }
      return true
    })
]

exports.deleteCommentShema = [
  query('id')
    .custom(id => {
      if (!id) {
        throw new Error('comment id is required')
      }
      return true
    })
]
