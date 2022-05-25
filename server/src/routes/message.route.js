/**
 * @typedef MessageList
 * @property {number} pageNo.required -文章标题
 * @property {number} pageSize.required -文章内容
 * @property {string} itemType.required -文章分类
 */

const express = require('express')
const router = express.Router()
const auth = require('@/middleware/auth.middleware')
const messageController = require('@/controllers/message.controller')

/**
 * 查询用户消息列表
 * @route POST /messages
 * @group 消息管理
 * @param {MessageList.model} messageList.body.required
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.post('/', auth(), messageController.findMessageList)

/**
 * 查询用户未读消息数量
 * @route GET /messages/count
 * @group 消息管理
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.get('/count', auth(), messageController.findNoReadTotal)

module.exports = router
