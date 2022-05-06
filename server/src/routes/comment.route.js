/**
 * @typedef SubmitComment
 * @property {string} articleId -文章id
 * @property {string} replyId -回复评论所属id
 * @property {string} replyComment -回复评论内容
 * @property {string} content.required -评论内容
 */

const express = require('express')
const router = express.Router()
const auth = require('@/middleware/auth.middleware')
const commentController = require('@/controllers/comment.controller')
const handlerValidate = require('@/middleware/handlerValidate.middleware')
const { submitCommentShema, deleteCommentShema } = require('@/middleware/validators/commentValidator.middleware')

/**
 * 评论列表查询
 * @route GET /comments
 * @group 评论管理
 * @param {string} articleId.query
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 */
router.get('/', commentController.getCommentList)

/**
 * 用户提交评论
 * @route POST /comments/submit
 * @group 评论管理
 * @param {SubmitComment.model} submitComment.body.required
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.post('/submit', auth(), submitCommentShema, handlerValidate(commentController.createComment))

/**
 * 评论列表查询
 * @route GET /comments/delete
 * @group 评论管理
 * @param {string} id.query.required
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.get('/delete', auth(), deleteCommentShema, handlerValidate(commentController.deleteComment))

/**
 * 用户点赞评论
 * @route GET /comments/agreecomment
 * @group 评论管理
 * @param {string} commentId.query.required
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.get('/agreecomment', auth(), handlerValidate(commentController.agreeComment))

/**
 * 用户取消点赞评论
 * @route GET /comments/unagreecomment
 * @group 评论管理
 * @param {string} commentId.query.required
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.get('/unagreecomment', auth(), handlerValidate(commentController.unagreeComment))

module.exports = router
