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
 * 查询友圈详细信息
 * @route GET /shares/info
 * @group 友圈分享管理
 * @param {string} circleId.query.required
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 */
router.get('/info', shareCircleController.findShareCircleInfo)

/**
 * 查询用点赞的友圈列表
 * @route GET /shares/agreecircles
 * @group 友圈分享管理
 * @param {string} userId.query.required
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 */
router.get('/agreecircles', shareCircleController.userAgreeCircle)

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

/**
 * 删除友圈
 * @route GET /shares/delete
 * @group 友圈分享管理
 * @param {string} id.query.required
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.get('/delete', auth(), shareCircleController.deleteShareCircle)

/**
 * 用户点赞友圈
 * @route GET /shares/agree
 * @group 友圈分享管理
 * @param {string} id.query.required
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.get('/agree', auth(), shareCircleController.agreeSharecircle)

/**
 * 用户取消点赞友圈
 * @route GET /shares/unagree
 * @group 友圈分享管理
 * @param {string} id.query.required
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.get('/unagree', auth(), shareCircleController.unagreeSharecircle)

module.exports = router
