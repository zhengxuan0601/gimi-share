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

  /**
   * find user history list
   * @param {*} req
   * @param {*} response
   */
  async findHistoryList (req, response) {
    try {
      const userId = req.sessionuser.id
      const { pageNo = 1, pageSize = 20 } = req.query
      const data = await BrowseHistoryModel.find({ userId, pageNo, pageSize })
      JsonResult.success({
        req,
        response,
        data,
        message: '查询成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '查询失败' })
    }
  }

  /**
   * delete browse history
   * @param {*} req
   * @param {*} response
   */
  async deleteHistory (req, response) {
    try {
      const [id, userId] = [req.query.id, req.sessionuser.id]
      const exists = await BrowseHistoryModel.exists({ id, userId })
      if (!exists) {
        return JsonResult.httpStatus(req, response, 401, {
          message: 'Authentication failed!',
          code: '9999'
        })
      }
      await BrowseHistoryModel.delete(id)
      JsonResult.success({
        req,
        response,
        message: '删除成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '删除失败' })
    }
  }
}

module.exports = new BrowseHistoryController()
