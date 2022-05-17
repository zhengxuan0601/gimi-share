/**
 * @typedef GenerateHistory
 * @property {string} uid.required -文章所属用户id
 * @property {string} articleId.required -文章id
 */
const express = require('express')
const router = express.Router()
const auth = require('@/middleware/auth.middleware')
const browseHistoryController = require('@/controllers/browse_history.controller')

/**
 * 查询用户浏览记录列表
 * @route GET /history
 * @group 浏览记录管理
 * @param {number} pageNo.query.required
 * @param {number} pageSize.query.required
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.get('/', auth(), browseHistoryController.findHistoryList)

/**
 * 生成浏览记录
 * @route POST /history/generate
 * @group 浏览记录管理
 * @param {GenerateHistory.model} generateHistory.body.required
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.post('/generate', auth(), browseHistoryController.generateHistory)

/**
 * 删除浏览记录
 * @route GET /history/delete
 * @group 浏览记录管理
 * @param {string} id.query.required
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.get('/delete', auth(), browseHistoryController.deleteHistory)

module.exports = router
