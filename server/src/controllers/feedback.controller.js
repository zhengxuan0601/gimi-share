const FeedbackModel = require('@/models/feedback.model')
const JsonResult = require('@/utils/httpResponse.unit')

class FeedbackController {
  /**
   * user submit feedback
   * @param {*} req
   * @param {*} response
   */
  async createFeedback (req, response) {
    try {
      const { content } = req.body
      const userId = req.sessionuser.id
      await FeedbackModel.add({ userId, content })
      JsonResult.success({
        req,
        response,
        message: '提交反馈成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '提交反馈失败' })
    }
  }

  /**
   * find feedback list by page
   * @param {*} req
   * @param {*} response
   */
  async findList (req, response) {
    try {
      const { pageNo = 1, pageSize = 20 } = req.query
      const data = await FeedbackModel.find({ pageNo, pageSize })
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
   * user delete feedback
   * @param {*} req
   * @param {*} response
   * @returns
   */
  async deleteFeedback (req, response) {
    try {
      const userId = req.sessionuser.id
      const id = req.query.id
      const exists = await FeedbackModel.exists({ userId, id })
      if (!exists) {
        return JsonResult.httpStatus(req, response, 403, {
          message: 'No permission to edit article',
          code: '9999'
        })
      }
      await FeedbackModel.delete(id)
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

module.exports = new FeedbackController()
