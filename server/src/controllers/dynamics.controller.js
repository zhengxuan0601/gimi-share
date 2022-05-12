const DynamicsModel = require('@/models/dynamics.model')
const JsonResult = require('@/utils/httpResponse.unit')
const { getSessionuserId } = require('@/utils/common.util')

class DynamicsController {
  async findDynamicList (req, response) {
    try {
      const { userId, pageNo = 1, pageSize = 10 } = req.query
      const sessionId = await getSessionuserId(req)
      const data = await DynamicsModel.find(userId, pageNo, pageSize, sessionId)
      JsonResult.success({
        req,
        response,
        data,
        message: '查询动态成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '查询动态失败' })
    }
  }
}

module.exports = new DynamicsController()
