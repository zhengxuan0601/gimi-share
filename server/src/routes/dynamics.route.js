const express = require('express')
const router = express.Router()
const dynamicsController = require('@/controllers/dynamics.controller')

/**
 * 查询用户动态列表
 * @route GET /dynamics
 * @group 用户动态管理
 * @param {nunmber} pageNo.query.required
 * @param {nunmber} pageSize.query.required
 * @param {string} userId.query.required
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 */
router.get('/', dynamicsController.findDynamicList)

module.exports = router
