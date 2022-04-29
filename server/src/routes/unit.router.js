const express = require('express')
const router = express.Router()
const unitController = require('@/controllers/unit.controller')

/**
 * 获取验证码
 * @route GET /unit/verificatecode
 * @group 通用工具
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 */
router.get('/verificatecode', unitController.getCaptcha)

/**
 * 获取AES加密key和iv值
 * @route GET /unit/getpublickey
 * @group 通用工具
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 */
router.get('/getpublickey', unitController.getPublicKey)

module.exports = router
