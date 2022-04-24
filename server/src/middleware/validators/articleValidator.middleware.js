const { body } = require('express-validator')

exports.updateArticleShema = [
  body('id')
    .custom(id => {
      if (!id) {
        throw new Error('article_id is required')
      }
      return true
    })
]
