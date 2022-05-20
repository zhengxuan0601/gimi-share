/**
 * @typedef SubmitFeedback
 * @property {string} content.required -提交的反馈信息
 */
const express = require('express')
const router = express.Router()
const auth = require('@/middleware/auth.middleware')
const feedbackController = require('@/controllers/feedback.controller')
const handlerValidate = require('@/middleware/handlerValidate.middleware')
const { createFeedbackSchema } = require('@/middleware/validators/feedbackValidator.middleware')

/**
 * 查询反馈分页信息
 * @route GET /feedbacks
 * @group 反馈管理
 * @param {number} pageNo.query.required
 * @param {number} pageSize.query.required
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 */
router.get('/', feedbackController.findList)

/**
 * 用户提交反馈信息
 * @route POST /feedbacks/create
 * @group 反馈管理
 * @param {SubmitFeedback.model} submitFeedback.body.required
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.post('/create', auth(), createFeedbackSchema, handlerValidate(feedbackController.createFeedback))

/**
 * 用户删除反馈信息
 * @route GET /feedbacks/delete
 * @group 反馈管理
 * @param {string} id.query.required
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.get('/delete', auth(), feedbackController.deleteFeedback)

/**
 * 用户提交反馈信息态度
 * @route GET /feedbacks/attitude/increase
 * @group 反馈管理
 * @param {string} feedbackId.query.required
 * @param {string} itemType.query.required
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 */
router.get('/attitude/increase', auth(), feedbackController.increaseAttitude)

/**
 * 用户取消反馈信息态度
 * @route GET /feedbacks/attitude/cancel
 * @group 反馈管理
 * @param {string} feedbackId.query.required
 * @param {string} itemType.query.required
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 */
router.get('/attitude/cancel', auth(), feedbackController.cancelAttitude)

module.exports = router
