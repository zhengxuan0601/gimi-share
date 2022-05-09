/**
 * @typedef CreateShare
 * @property {string} content.required -友圈分享内容
 */
const express = require('express')
const router = express.Router()
const upload = require('@/middleware/multer.middleware')
const auth = require('@/middleware/auth.middleware')
const handlerValidate = require('@/middleware/handlerValidate.middleware')
const shareCircleController = require('@/controllers/share_circle.controller')
const { publishShareSchema } = require('@/middleware/validators/shareCircleValidator.middleware')

/**
 * 友圈分享分页列表
 * @route GET /shares
 * @group 友圈分享管理
 * @param {string} pageNo.query.required
 * @param {string} pageSize.query.required
 * @param {string} userId.query
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 */
router.get('/', shareCircleController.findShareList)

/**
 * 发布友圈
 * @route POST /shares/createshare
 * @group 友圈分享管理
 * @param {CreateShare.model} CreateShare.body.required
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.post('/createshare', auth(), upload.array('file', 3), publishShareSchema, handlerValidate(shareCircleController.publishShare))

module.exports = router
