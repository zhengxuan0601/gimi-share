const UserModel = require('@/models/user.model')
const ArticleModel = require('@/models/article.model')
const JsonResult = require('@/utils/httpResponse.unit')
const { getSessionuserId } = require('@/utils/common.util')

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

  /**
   * vague search article and user
   * @param {*} req
   * @param {*} response
   */
  async vagueSearchUser (req, response) {
    try {
      const sessionId = await getSessionuserId(req)
      const { pageNo = 1, pageSize = 20, value, type } = req.body
      const Model = type === '1' ? ArticleModel : UserModel
      const data = await Model.vagueFind({ pageNo, pageSize, value }, sessionId)
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
