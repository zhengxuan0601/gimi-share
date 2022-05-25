const express = require('express')
const router = express.Router()
const statisticsController = require('@/controllers/statistics.controller')

/**
 * 根据用户发表文章数量查询用户排行榜
 * @route GET /statistics/userrank
 * @group 数据统计管理
 * @param {number} pageNo.query.required
 * @param {number} pageSize.query.required
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 */
router.get('/userrank', statisticsController.userRankByArticleCount)

module.exports = router
