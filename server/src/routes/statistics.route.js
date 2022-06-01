/**
 * @typedef SearchModel
 * @property {number} pageNo.required
 * @property {number} pageSize.required
 * @property {string} type.required -查询类型 1 - 文章， 2 - 用户
 * @property {string} value.required
 */

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

/**
 * 模糊搜索文章和用户
 * @route POST /statistics/search
 * @group 数据统计管理
 * @param {SearchModel.model} searchModel.body.required
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 */
router.post('/search', statisticsController.vagueSearchUser)

module.exports = router
