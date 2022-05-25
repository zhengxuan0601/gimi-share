const UserModel = require('@/models/user.model')
const JsonResult = require('@/utils/httpResponse.unit')

class StatisticsController {
  /**
   * find user rank by article counts
   * @param {*} req
   * @param {*} response
   */
  async userRankByArticleCount (req, response) {
    try {
      const { pageNo = 1, pageSize = 10 } = req.query
      const data = await UserModel.findUserArticleRank(pageNo, pageSize)
      JsonResult.success({
        req,
        data,
        response,
        message: '查询成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '查询失败' })
    }
  }
}

module.exports = new StatisticsController()
