const { body } = require('express-validator')

exports.createFeedbackSchema = [
  body('content')
    .exists()
    .withMessage('content is required')
    .isLength({ min: 20 })
    .withMessage('feedback content must be at least 20 charts')
]
