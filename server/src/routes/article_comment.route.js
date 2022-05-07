/**
 * @typedef SubmitComment
 * @property {string} articleId.required -文章id
 * @property {string} replyId -回复评论所属id
 * @property {string} replyComment -回复评论内容
 * @property {string} content.required -评论内容
 */

const express = require('express')
const router = express.Router()
const auth = require('@/middleware/auth.middleware')
const articleCommentController = require('@/controllers/article_comment.controller')
const handlerValidate = require('@/middleware/handlerValidate.middleware')
const { submitCommentShema, deleteCommentShema } = require('@/middleware/validators/commentValidator.middleware')

/**
 * 评论列表查询
 * @route GET /article/comments
 * @group 文章评论管理
 * @param {string} articleId.query.required
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 */
router.get('/', articleCommentController.getCommentList)

/**
 * 用户提交评论
 * @route POST /article/comments/submit
 * @group 文章评论管理
 * @param {SubmitComment.model} submitComment.body.required
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.post('/submit', auth(), submitCommentShema, handlerValidate(articleCommentController.createComment))

/**
 * 删除文章评论
 * @route GET /article/comments/delete
 * @group 文章评论管理
 * @param {string} id.query.required
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.get('/delete', auth(), deleteCommentShema, handlerValidate(articleCommentController.deleteComment))

module.exports = router
