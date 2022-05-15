const JsonResult = require('@/utils/httpResponse.unit')
const BrowseHistoryModel = require('@/models/browse_history.model')

class BrowseHistoryController {
  /**
   * generate browse history
   * @param {*} req
   * @param {*} response
   */
  async generateHistory (req, response) {
    try {
      const userId = req.sessionuser.id
      const exists = await BrowseHistoryModel.exists({ userId, articleId: req.body.articleId })
      if (exists) {
        await BrowseHistoryModel.update({ ...req.body, userId })
      } else {
        await BrowseHistoryModel.add({ ...req.body, userId })
      }
      JsonResult.success({
        req,
        response,
        message: '生成记录成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '生成记录失败' })
    }
  }
}

module.exports = new BrowseHistoryController()
