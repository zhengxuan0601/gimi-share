const JsonResult = require('@/utils/httpResponse.unit')
const FeedbackModel = require('@/models/feedback.model')
const FeedbackAttitudeModel = require('@/models/feedback_attitude.model')
const { getSessionuserId } = require('@/utils/common.util')
const filedMap = {
  1: 'likeCount',
  2: 'dislikeCount',
  3: 'giftCount',
  4: 'heartCount',
  5: 'rocketCount',
  6: 'viewCount'
}

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
      const sessionId = await getSessionuserId(req)
      const data = await FeedbackModel.find({ pageNo, pageSize }, sessionId)
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

  /**
   * user submit feedback attitude
   * @param {*} req
   * @param {*} response
   * @returns
   */
  async increaseAttitude (req, response) {
    try {
      const userId = req.sessionuser.id
      const { feedbackId, itemType } = req.query
      const existsFeedback = await FeedbackModel.exists({ id: feedbackId })
      if (!existsFeedback) {
        return JsonResult.fail({ req, response, message: '反馈信息不存在' })
      }
      const existsAttitude = await FeedbackAttitudeModel.exists({ userId, feedbackId, itemType })
      if (existsAttitude) {
        return JsonResult.fail({ req, response, message: '已经发表过意见' })
      }
      await FeedbackAttitudeModel.add({ userId, feedbackId, itemType })
      FeedbackModel.autoIncre(feedbackId, filedMap[itemType])
      JsonResult.success({
        req,
        response,
        message: '操作成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '操作失败' })
    }
  }

  /**
   * user cancel feedback attitude
   * @param {*} req
   * @param {*} response
   * @returns
   */
  async cancelAttitude (req, response) {
    try {
      const userId = req.sessionuser.id
      const { feedbackId, itemType } = req.query
      const existsFeedback = await FeedbackModel.exists({ id: feedbackId })
      if (!existsFeedback) {
        return JsonResult.fail({ req, response, message: '反馈信息不存在' })
      }
      const existsAttitude = await FeedbackAttitudeModel.exists({ userId, feedbackId, itemType })
      if (!existsAttitude) {
        return JsonResult.fail({ req, response, message: '还未发表意见' })
      }
      await FeedbackAttitudeModel.delete({ userId, feedbackId, itemType })
      FeedbackModel.autoDec(feedbackId, filedMap[itemType])
      JsonResult.success({
        req,
        response,
        message: '操作成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '操作失败' })
    }
  }
}

module.exports = new FeedbackController()
