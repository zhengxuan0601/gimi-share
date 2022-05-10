/**
 * @typedef SubmitComment
 * @property {string} circleId.required -友圈id
 * @property {string} replyId -回复评论所属id
 * @property {string} replyComment -回复评论内容
 * @property {string} content.required -评论内容
 */

const express = require('express')
const router = express.Router()
const auth = require('@/middleware/auth.middleware')
const handlerValidate = require('@/middleware/handlerValidate.middleware')
const shareCircleCommentController = require('@/controllers/sharecircle_comment.controller')
const { submitCommentShema } = require('@/middleware/validators/commentValidator.middleware')

/**
 * 查询近5条评论列表
 * @route GET /sharecircle/comments/simplecomments
 * @group 友圈评论管理
 * @param {string} circleId.query.required
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 */
router.get('/simplecomments', shareCircleCommentController.findSimpleComments)

/**
 * 用户提交评论
 * @route POST /sharecircle/comments/create
 * @group 友圈评论管理
 * @param {SubmitComment.model} submitComment.body.required
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.post('/create', auth(), submitCommentShema, handlerValidate(shareCircleCommentController.createCircleComment))

module.exports = router
