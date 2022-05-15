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
 * 生成浏览记录
 * @route POST /history/generate
 * @group 浏览记录管理
 * @param {GenerateHistory.model} generateHistory.body.required
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.post('/generate', auth(), browseHistoryController.generateHistory)

module.exports = router
